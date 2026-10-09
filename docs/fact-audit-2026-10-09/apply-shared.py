#!/usr/bin/env python3
"""감사 원장의 '## 공용 파일 수정 목록'을 공용 파일에 적용한다.
'### ... `path` ...' 제목 아래 코드 블록마다 old:/new: 쌍(한 줄 또는 여러 줄).
old가 파일에 정확히 한 번 나올 때만 바꾼다. --dry 로 미리 본다."""
import re, sys, pathlib
dry = "--dry" in sys.argv
mirror = "--mirror" in sys.argv
regs = sorted(pathlib.Path("src/content/registrations").glob("*.ts"))
mirrored = 0
ledger = pathlib.Path(sys.argv[1]).read_text()
# --section "후속 공용 파일 수정 목록 (A1)" 처럼 절 제목을 고를 수 있다(기본: 공용 파일 수정 목록).
section = next((a.split("=", 1)[1] for a in sys.argv if a.startswith("--section=")), "공용 파일 수정 목록")
m = re.search(r'^## ' + re.escape(section) + r'[^\n]*\n(.*?)(?=^## |\Z)', ledger, re.S | re.M)
if not m: sys.exit("no shared section")
sec = m.group(1); ok = skip = 0; cur = None
tokens = re.split(r'(```[a-z]*\n.*?```)', sec, flags=re.S)
pending = None; label = None
for t in tokens:
    if not t.startswith("```"):
        tail = [l.strip() for l in t.strip().splitlines()]
        label = tail[-1] if tail and tail[-1] in ("old:", "new:") else None
        paths = re.findall(r'`?(src/[\w./-]+\.tsx?)`?', t)
        heads = [l for l in t.splitlines() if l.startswith("###")]
        hp = [re.search(r'(src/[\w./-]+\.tsx?)', h) for h in heads]
        hp = [x.group(1) for x in hp if x]
        if hp: cur = hp[-1]
        continue
    body = t.split("\n",1)[1].rsplit("```",1)[0]
    info = t[3:t.index("\n")].strip().lower()
    if info in ("old", "new"): label = info + ":"   # ```old / ```new 형식
    if label == "old:":
        pending = body.rstrip("\n"); continue
    if label == "new:" and pending is not None:
        body = "old: " + pending + "\nnew: " + body
        pending = None
    mm = re.match(r'old:[ ]?(.*?)\n?new:[ ]?(.*)$', body, re.S | re.I)
    if not mm: print("FORMAT?", body[:80]); skip+=1; continue
    o, n = mm.group(1), mm.group(2)
    if o.startswith("\n"): o=o[1:]
    if n.startswith("\n"): n=n[1:]
    n = n.rstrip("\n"); o = o.rstrip("\n")
    if mirror:
        for rp in regs:
            if str(rp) == cur: continue
            rs = rp.read_text()
            if rs.count(o) >= 1:
                if not dry: rp.write_text(rs.replace(o, n))
                mirrored += 1; print("MIRROR", rp.name, o[:50].replace("\n"," "))
    p = pathlib.Path(cur); s = p.read_text(); c = s.count(o)
    if c == 1:
        if not dry: p.write_text(s.replace(o, n))
        ok += 1
    elif c == 0 and n in s: print("ALREADY", cur, o[:60].replace("\n"," ")); ok += 1
    else: print(f"SKIP count={c}", cur, o[:100].replace("\n"," ")); skip += 1
print(f"{'would apply' if dry else 'applied'} {ok}, skipped {skip}, mirrored {mirrored}")
