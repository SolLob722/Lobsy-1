#!/usr/bin/env python3
import json
import os
import subprocess
import time
import re

OUTPUT_DIR = os.path.abspath("web20230304112228")

with open("/tmp/cdx_lobsy.json", "r") as f:
    cdx_data = json.load(f)

# Build a lookup of all available 200 snapshots in CDX
# key: original url (lowercase, without :80) -> list of (timestamp, length)
cdx_lookup = {}
for row in cdx_data[1:]:
    urlkey, ts, orig, mime, status, digest, length = row
    if status == '200':
        norm = orig.replace(':80', '').strip().rstrip('/')
        if norm not in cdx_lookup:
            cdx_lookup[norm] = []
        cdx_lookup[norm].append((ts, mime, length))

print(f"CDX lookup has {len(cdx_lookup)} URLs with 200 responses")

with open(os.path.join(OUTPUT_DIR, "manifest.json"), "r") as f:
    manifest = json.load(f)

def clean_html(html, is_subpage=False):
    html = re.sub(r'<script[^>]*src=[\"\x27][^\"\x27]*web-static\.archive\.org[^\"\x27]*[\"\x27][^>]*></script>', '', html, flags=re.IGNORECASE)
    html = re.sub(r'<script[^>]*src=[\"\x27][^\"\x27]*wombat\.js[^\"\x27]*[\"\x27][^>]*></script>', '', html, flags=re.IGNORECASE)
    html = re.sub(r'<script[^>]*src=[\"\x27][^\"\x27]*bundle-playback\.js[^\"\x27]*[\"\x27][^>]*></script>', '', html, flags=re.IGNORECASE)
    html = re.sub(r'<script[^>]*src=[\"\x27][^\"\x27]*ruffle\.js[^\"\x27]*[\"\x27][^>]*></script>', '', html, flags=re.IGNORECASE)
    html = re.sub(r'<script[^>]*>.*?__wm\.init.*?</script>', '', html, flags=re.DOTALL | re.IGNORECASE)
    html = re.sub(r'<link[^>]*href=[\"\x27][^\"\x27]*banner-styles\.css[^\"\x27]*[\"\x27][^>]*>', '', html, flags=re.IGNORECASE)
    html = re.sub(r'<link[^>]*href=[\"\x27][^\"\x27]*iconochive\.css[^\"\x27]*[\"\x27][^>]*>', '', html, flags=re.IGNORECASE)
    html = re.sub(r'<!--\s*BEGIN WAYBACK TOOLBAR INSERT\s*-->.*?<!--\s*END WAYBACK TOOLBAR INSERT\s*-->', '', html, flags=re.DOTALL | re.IGNORECASE)
    html = re.sub(r'<!--\s*End Wayback Rewrite JS Include\s*-->', '', html, flags=re.IGNORECASE)
    html = re.sub(r'<div id=\"wm-ipp-base\"[^>]*>.*?</div>\s*</div>\s*</div>', '', html, flags=re.DOTALL | re.IGNORECASE)

    prefix = "../" if is_subpage else "./"
    html = re.sub(r'(?:https?:)?//web\.archive\.org/web/\d+(?:im_|cs_|js_|if_|id_)?/https?://(?:www\.)?lobsy\.co\.za/', prefix, html)
    html = re.sub(r'https?://(?:www\.)?lobsy\.co\.za/', prefix, html)
    html = html.replace(prefix + 'https://webmail.konsoleh.co.za/login', 'https://webmail.konsoleh.co.za/login')
    return html

failed_keys = [k for k, v in manifest.items() if not v]
print(f"Retrying {len(failed_keys)} failed items...")

for key in failed_keys:
    is_page = not key.startswith("wp-content")
    if is_page:
        norm_orig = f"http://www.lobsy.co.za/{key}"
        dest_dir = os.path.join(OUTPUT_DIR, key)
        os.makedirs(dest_dir, exist_ok=True)
        dest_file = os.path.join(dest_dir, "index.html")
    else:
        norm_orig = f"http://www.lobsy.co.za/{key}"
        dest_file = os.path.join(OUTPUT_DIR, key)
        os.makedirs(os.path.dirname(dest_file), exist_ok=True)

    # find in cdx
    snapshots = cdx_lookup.get(norm_orig, [])
    if not snapshots:
        # try without trailing slash or with
        alt = norm_orig.rstrip('/') if norm_orig.endswith('/') else norm_orig + '/'
        snapshots = cdx_lookup.get(alt, [])

    if not snapshots:
        print(f"No 200 snapshot in CDX for {key}")
        continue

    # Try snapshots from newest to oldest
    success = False
    for ts, mime, length in reversed(snapshots):
        # Build URL
        modifier = "im_" if "image" in mime or key.endswith(('.png', '.jpg', '.gif')) else ("cs_" if "css" in mime or key.endswith('.css') else "id_")
        wb_url = f"https://web.archive.org/web/{ts}{modifier}/{norm_orig}"
        print(f"Trying {key} @ ts {ts} ...")
        cmd = [
            "curl", "-sL",
            "-A", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "--connect-timeout", "15",
            "--max-time", "30",
            wb_url,
            "-o", dest_file + ".tmp"
        ]
        res = subprocess.run(cmd)
        if res.returncode == 0 and os.path.exists(dest_file + ".tmp") and os.path.getsize(dest_file + ".tmp") > 100:
            if is_page:
                with open(dest_file + ".tmp", "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                cleaned = clean_html(content, is_subpage=True)
                with open(dest_file, "w", encoding="utf-8") as f:
                    f.write(cleaned)
                if os.path.exists(dest_file + ".tmp"):
                    os.remove(dest_file + ".tmp")
            else:
                os.rename(dest_file + ".tmp", dest_file)
            print(f"  --> SUCCESS: Saved {key} ({os.path.getsize(dest_file)} bytes)")
            manifest[key] = True
            success = True
            time.sleep(2.0)
            break
        else:
            if os.path.exists(dest_file + ".tmp"):
                os.remove(dest_file + ".tmp")
            time.sleep(1.5)

with open(os.path.join(OUTPUT_DIR, "manifest.json"), "w") as f:
    json.dump(manifest, f, indent=2)

print("=== Finished retry ===")
