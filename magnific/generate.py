"""
Magnific(Mystic) 이미지 생성 스크립트 - GitHub Actions 에서 실행됩니다.

- magnific/prompts.json 의 작업 중, 출력 폴더에 아직 없는 이미지만 새로 만듭니다.
- 결과는 웹용 JPG(가로 최대 width px)로 저장하고, 원본 URL 은 manifest.json 에 남깁니다.
- API 키는 환경변수 MAGNIFIC_API_KEY (저장소 Secrets) 에서만 읽습니다. 코드에 키를 넣지 마세요.

사용: python magnific/generate.py magnific/prompts.json <출력폴더>
"""
import io
import json
import os
import sys
import time
import urllib.error
import urllib.request

from PIL import Image

API = "https://api.magnific.com/v1/ai/mystic"
KEY = os.environ.get("MAGNIFIC_API_KEY", "").strip()


def call(method, url, body=None):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method, headers={
        "x-magnific-api-key": KEY,
        "Content-Type": "application/json",
        "Accept": "application/json",
    })
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"HTTP {e.code}: {e.read().decode(errors='replace')[:500]}")


def save_jpg(src_url, path, width):
    with urllib.request.urlopen(src_url, timeout=120) as r:
        im = Image.open(io.BytesIO(r.read())).convert("RGB")
    if im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    im.save(path, "JPEG", quality=84, optimize=True, progressive=True)
    return im.size


def main():
    if not KEY:
        print("MAGNIFIC_API_KEY 가 아직 없습니다. 저장소 Settings > Secrets and variables > Actions 에 등록한 뒤 다시 실행하세요.")
        return
    jobs_file, out_dir = sys.argv[1], sys.argv[2]
    os.makedirs(out_dir, exist_ok=True)
    cfg = json.load(open(jobs_file, encoding="utf-8"))
    defaults, jobs = cfg.get("defaults", {}), cfg["jobs"]
    man_path = os.path.join(out_dir, "manifest.json")
    manifest = json.load(open(man_path, encoding="utf-8")) if os.path.exists(man_path) else {}

    # 1) 아직 없는 이미지만 요청
    pending = {}
    for job in jobs:
        out = os.path.join(out_dir, job["id"] + ".jpg")
        if os.path.exists(out) and not job.get("regenerate"):
            print(f"[skip] {job['id']} (이미 있음)")
            continue
        style = defaults.get(job.get("style", ""), {})
        body = {
            "prompt": (job["prompt"] + " " + style.get("suffix", "")).strip(),
            "model": job.get("model", style.get("model", "realism")),
            "aspect_ratio": job.get("aspect_ratio", "square_1_1"),
            "resolution": job.get("resolution", "1k"),
            "filter_nsfw": True,
        }
        colors = job.get("colors", style.get("colors"))
        if colors:
            body["styling"] = {"colors": colors}
        try:
            res = call("POST", API, body)
            tid = res["data"]["task_id"]
            pending[tid] = (job, out)
            print(f"[sent] {job['id']} -> {tid}")
        except Exception as e:
            print(f"[fail] {job['id']} 요청 실패: {e}")
        time.sleep(1.5)

    # 2) 완료될 때까지 확인 (최대 8분)
    deadline = time.time() + 480
    done, failed = 0, 0
    while pending and time.time() < deadline:
        time.sleep(6)
        for tid in list(pending):
            job, out = pending[tid]
            try:
                d = call("GET", f"{API}/{tid}")["data"]
            except Exception as e:
                print(f"[wait] {job['id']} 상태 확인 오류: {e}")
                continue
            st = d.get("status")
            if st == "COMPLETED" and d.get("generated"):
                size = save_jpg(d["generated"][0], out, job.get("width", 1200))
                manifest[job["id"]] = {"task_id": tid, "source": d["generated"][0], "size": size, "prompt": job["prompt"]}
                print(f"[done] {job['id']} {size}")
                del pending[tid]; done += 1
            elif st == "FAILED":
                print(f"[fail] {job['id']} 생성 실패: {json.dumps(d, ensure_ascii=False)[:300]}")
                del pending[tid]; failed += 1
    for tid, (job, _) in pending.items():
        print(f"[timeout] {job['id']} ({tid})"); failed += 1

    json.dump(manifest, open(man_path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print(f"완료 {done}건, 실패 {failed}건")


if __name__ == "__main__":
    main()
