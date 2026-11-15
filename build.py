#!/usr/bin/env python3
"""把 src/ 里的源码拼成单文件 index.html（无外部请求，可直接部署）。"""
import pathlib, sys, re

ROOT = pathlib.Path(__file__).parent
SRC = ROOT / "src"
OUT = ROOT / "index.html"

html = (SRC / "app.html").read_text(encoding="utf-8")
qr = (SRC / "qrcode.min.js").read_text(encoding="utf-8")
app = (SRC / "app.js").read_text(encoding="utf-8")

for name, blob in (("qrcode.min.js", qr), ("app.js", app)):
    if "</script" in blob.lower():
        sys.exit(f"[!] {name} 含有 </script 字符串，内联会截断 HTML")

html = html.replace("/*@QR@*/", qr).replace("/*@APP@*/", app)
OUT.write_text(html, encoding="utf-8")
kb = len(html.encode()) / 1024
print(f"[ok] {OUT}  {kb:.1f} KB  (gzip 后约 {len(__import__('gzip').compress(html.encode())) / 1024:.1f} KB)")
