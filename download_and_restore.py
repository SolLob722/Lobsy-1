import os
import re
import json
import time
import urllib.request
import urllib.error
from urllib.parse import urlparse

OUTPUT_DIR = os.path.abspath('web20230304112228')
os.makedirs(OUTPUT_DIR, exist_ok=True)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.9',
}

def fetch_with_retry(url, is_binary=False, max_retries=5):
    for attempt in range(max_retries):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=25) as resp:
                content = resp.read()
                if not is_binary:
                    try:
                        return content.decode('utf-8')
                    except UnicodeDecodeError:
                        return content.decode('latin-1', errors='ignore')
                return content
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait_time = (2 ** attempt) + 3
                print(f"  [429 Rate limited] Waiting {wait_time}s on {url}...")
                time.sleep(wait_time)
            elif e.code in (404, 301, 302):
                print(f"  [HTTP {e.code}] {url}")
                return None
            else:
                print(f"  [HTTP {e.code}] {url}, retrying...")
                time.sleep(2)
        except Exception as e:
            print(f"  [Error {e}] {url}, retrying...")
            time.sleep(2)
    return None

def clean_html(html):
    # Remove wayback scripts & styles
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

    # Rewrite wayback URLs to relative /web20230304112228/ or root paths
    html = re.sub(r'(?:https?:)?//web\.archive\.org/web/\d+(?:im_|cs_|js_|if_|id_)?/https?://(?:www\.)?lobsy\.co\.za/', '/web20230304112228/', html)
    html = re.sub(r'https?://(?:www\.)?lobsy\.co\.za/', '/web20230304112228/', html)

    # Fix webmail link
    html = html.replace('/web20230304112228/https://webmail.konsoleh.co.za/login', 'https://webmail.konsoleh.co.za/login')
    html = html.replace('https://web.archive.org/web/20230304112228/https://webmail.konsoleh.co.za/login', 'https://webmail.konsoleh.co.za/login')

    return html

# 1. First, preserve the verbatim 20230304112228 snapshot that the user specifically referenced
with open('/tmp/wayback_home.html', 'r', encoding='utf-8', errors='ignore') as f:
    raw_2023 = f.read()

with open(os.path.join(OUTPUT_DIR, 'snapshot_20230304112228_verbatim.html'), 'w', encoding='utf-8') as f:
    f.write(raw_2023)

with open(os.path.join(OUTPUT_DIR, 'snapshot_20230304112228_clean.html'), 'w', encoding='utf-8') as f:
    f.write(clean_html(raw_2023))

print("Saved verbatim and cleaned 20230304112228 snapshots.")

# 2. Save working home page
with open('/tmp/wayback_working_home.html', 'r', encoding='utf-8', errors='ignore') as f:
    raw_working = f.read()

cleaned_working_home = clean_html(raw_working)
with open(os.path.join(OUTPUT_DIR, 'index.html'), 'w', encoding='utf-8') as f:
    f.write(cleaned_working_home)

print("Saved restored working index.html.")
