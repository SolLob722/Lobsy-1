import os
import re
import json
import time
import urllib.request
import urllib.error

OUTPUT_ROOT = os.path.abspath('web20230304112228')
os.makedirs(OUTPUT_ROOT, exist_ok=True)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': '*/*',
}

PAGES = [
    ("about", "20220529060524", "http://www.lobsy.co.za/about/"),
    ("company-documents", "20220706154404", "http://www.lobsy.co.za/company-documents/"),
    ("company-portfolio", "20211017191441", "http://www.lobsy.co.za/company-portfolio/"),
    ("lobsy-havc", "20220529052217", "http://www.lobsy.co.za/lobsy-havc/"),
    ("lobsy-portfolio", "20220706165624", "http://www.lobsy.co.za/lobsy-portfolio/"),
    ("lobsy-projects", "20220706152104", "http://www.lobsy.co.za/lobsy-projects/"),
    ("lobsy-projects-pty-ltd", "20220706164036", "http://www.lobsy.co.za/lobsy-projects-pty-ltd/"),
    ("lobsy-tehnologies", "20220529053507", "http://www.lobsy.co.za/lobsy-tehnologies/"),
    ("loby-investments", "20220706164825", "http://www.lobsy.co.za/loby-investments/"),
    ("main-branch-gauteng", "20220706164935", "http://www.lobsy.co.za/main-branch-gauteng/"),
    ("mozambique-branch", "20220706153256", "http://www.lobsy.co.za/mozambique-branch/"),
    ("mpumalanga", "20220706161637", "http://www.lobsy.co.za/mpumalanga/"),
    ("swaziland-branch", "20220706151933", "http://www.lobsy.co.za/swaziland-branch/"),
    ("eskom", "20211017191401", "http://www.lobsy.co.za/eskom/"),
    ("potchefsroom-mall", "20211017175331", "http://www.lobsy.co.za/potchefsroom-mall/"),
    ("unisa", "20211017184151", "http://www.lobsy.co.za/unisa/"),
    ("witbank-highveld-mall", "20211017185118", "http://www.lobsy.co.za/witbank-highveld-mall/"),
]

ASSETS = [
    # Uploads / logos / banners
    ("wp-content/uploads/2016/03/logo-1.png", "20171024001235", "http://www.lobsy.co.za/wp-content/uploads/2016/03/logo-1.png"),
    ("wp-content/uploads/2014/11/co_holdings.png", "20171023232855", "http://www.lobsy.co.za/wp-content/uploads/2014/11/co_holdings.png"),
    ("wp-content/uploads/2014/11/co_hvac.png", "20171024000453", "http://www.lobsy.co.za/wp-content/uploads/2014/11/co_hvac.png"),
    ("wp-content/uploads/2014/11/co_invest.png", "20171023232558", "http://www.lobsy.co.za/wp-content/uploads/2014/11/co_invest.png"),
    ("wp-content/uploads/2014/11/co_projects.png", "20171024000431", "http://www.lobsy.co.za/wp-content/uploads/2014/11/co_projects.png"),
    ("wp-content/uploads/2014/11/co_tech.png", "20171024000725", "http://www.lobsy.co.za/wp-content/uploads/2014/11/co_tech.png"),
    ("wp-content/uploads/2014/11/co_blank.png", "20171023232938", "http://www.lobsy.co.za/wp-content/uploads/2014/11/co_blank.png"),
    ("wp-content/uploads/2014/11/btm_clients01.png", "20171024000739", "http://www.lobsy.co.za/wp-content/uploads/2014/11/btm_clients01.png"),
    ("wp-content/uploads/2014/11/btm_clients02.png", "20171023233203", "http://www.lobsy.co.za/wp-content/uploads/2014/11/btm_clients02.png"),
    ("wp-content/uploads/2014/11/btm_clients03.png", "20171023234355", "http://www.lobsy.co.za/wp-content/uploads/2014/11/btm_clients03.png"),
    ("wp-content/uploads/2014/11/btm_clients04-1.png", "20171024000642", "http://www.lobsy.co.za/wp-content/uploads/2014/11/btm_clients04-1.png"),
    ("wp-content/uploads/2016/07/s01.jpg", "20171023232726", "http://www.lobsy.co.za/wp-content/uploads/2016/07/s01.jpg"),
    ("wp-content/uploads/2016/07/s02.jpg", "20171024000312", "http://www.lobsy.co.za/wp-content/uploads/2016/07/s02.jpg"),
    ("wp-content/uploads/2016/07/s03.jpg", "20171023235532", "http://www.lobsy.co.za/wp-content/uploads/2016/07/s03.jpg"),
    ("wp-content/uploads/2016/07/s04.jpg", "20171023235755", "http://www.lobsy.co.za/wp-content/uploads/2016/07/s04.jpg"),
    ("wp-content/uploads/2016/07/slider_05.jpg", "20171024000235", "http://www.lobsy.co.za/wp-content/uploads/2016/07/slider_05.jpg"),
    ("wp-content/uploads/2016/06/page_title_bg.png", "20171023232846", "http://www.lobsy.co.za/wp-content/uploads/2016/06/page_title_bg.png"),
    ("wp-content/uploads/2016/06/header.png", "20171023235727", "http://www.lobsy.co.za/wp-content/uploads/2016/06/header.png"),
    ("wp-content/uploads/2014/04/citypower1.png", "20160605141455", "http://www.lobsy.co.za/wp-content/uploads/2014/04/citypower1.png"),
    ("wp-content/uploads/2014/04/nedbank1.png", "20160605141801", "http://www.lobsy.co.za/wp-content/uploads/2014/04/nedbank1.png"),
    ("wp-content/uploads/2014/04/safa11.png", "20160605141639", "http://www.lobsy.co.za/wp-content/uploads/2014/04/safa11.png"),
    ("wp-content/uploads/2014/04/transnet1.png", "20160605081622", "http://www.lobsy.co.za/wp-content/uploads/2014/04/transnet1.png"),
    ("wp-content/uploads/2014/04/tshwane.png", "20160605141935", "http://www.lobsy.co.za/wp-content/uploads/2014/04/tshwane.png"),
    ("wp-content/uploads/2014/04/unisa1.png", "20160605084914", "http://www.lobsy.co.za/wp-content/uploads/2014/04/unisa1.png"),
    ("wp-content/uploads/2012/05/eskom02-295x220.jpg", "20160605143459", "http://www.lobsy.co.za/wp-content/uploads/2012/05/eskom02-295x220.jpg"),
    ("wp-content/uploads/2012/05/highveld01-295x220.jpg", "20160605082022", "http://www.lobsy.co.za/wp-content/uploads/2012/05/highveld01-295x220.jpg"),
    ("wp-content/uploads/2012/05/Image107-295x220.jpg", "20160605141703", "http://www.lobsy.co.za/wp-content/uploads/2012/05/Image107-295x220.jpg"),
    ("wp-content/uploads/2012/05/soc01-295x220.jpg", "20160605083201", "http://www.lobsy.co.za/wp-content/uploads/2012/05/soc01-295x220.jpg"),
    # CSS
    ("wp-content/themes/Avada/style.css", "20171023232022", "http://www.lobsy.co.za/wp-content/themes/Avada/style.css?ver=4.0.3"),
    ("wp-content/themes/Avada/shortcodes.css", "20171023234221", "http://www.lobsy.co.za/wp-content/themes/Avada/shortcodes.css?ver=4.0.3"),
    ("wp-content/themes/Avada/ilightbox.css", "20220920050254", "http://www.lobsy.co.za/wp-content/themes/Avada/ilightbox.css?ver=4.0.3"),
]

def clean_html(html, relative_depth=0):
    # Strip Wayback scripts and toolbars
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

    # Prefix prefix for relative links depending on depth
    prefix = "../" * relative_depth if relative_depth > 0 else "./"

    # Replace absolute wayback & lobsy urls with clean relative paths
    html = re.sub(r'(?:https?:)?//web\.archive\.org/web/\d+(?:im_|cs_|js_|if_|id_)?/https?://(?:www\.)?lobsy\.co\.za/', prefix, html)
    html = re.sub(r'https?://(?:www\.)?lobsy\.co\.za/', prefix, html)

    # Clean up empty or broken double slashes
    html = html.replace('//web.archive.org/web/', 'https://web.archive.org/web/')
    html = html.replace(prefix + 'https://webmail.konsoleh.co.za/login', 'https://webmail.konsoleh.co.za/login')

    return html

def download_file(url, target_path, is_binary=False):
    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    if os.path.exists(target_path) and os.path.getsize(target_path) > 100:
        print(f"Already exists: {target_path} ({os.path.getsize(target_path)} bytes)")
        return True

    for attempt in range(4):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=25) as resp:
                data = resp.read()
                if not is_binary:
                    try:
                        text = data.decode('utf-8')
                    except UnicodeDecodeError:
                        text = data.decode('latin-1', errors='ignore')
                    with open(target_path, 'w', encoding='utf-8') as f:
                        f.write(text)
                else:
                    with open(target_path, 'wb') as f:
                        f.write(data)
                print(f"Saved: {target_path} ({len(data)} bytes)")
                time.sleep(1.2) # Polite delay
                return True
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait = (2 ** attempt) + 3
                print(f"Rate limited (429), waiting {wait}s on {url}...")
                time.sleep(wait)
            elif e.code == 404:
                print(f"404 Not Found: {url}")
                return False
            else:
                print(f"HTTP {e.code} on {url}, retrying...")
                time.sleep(2)
        except Exception as e:
            print(f"Error {e} on {url}, retrying...")
            time.sleep(2)
    return False

def main():
    print("=== Starting Lobsy Archive Retrieval ===")

    # 1. Download assets (images, css)
    print("\n--- 1. Downloading Assets ---")
    asset_results = {}
    for rel_path, ts, orig_url in ASSETS:
        target = os.path.join(OUTPUT_ROOT, rel_path)
        wb_url = f"https://web.archive.org/web/{ts}im_/{orig_url}" if ('image' in rel_path or rel_path.endswith(('.png', '.jpg', '.gif'))) else f"https://web.archive.org/web/{ts}cs_/{orig_url}"
        print(f"Fetching asset: {rel_path} ...")
        success = download_file(wb_url, target, is_binary=rel_path.endswith(('.png', '.jpg', '.gif', '.ico')))
        asset_results[rel_path] = success

    # 2. Download subpages
    print("\n--- 2. Downloading Subpages ---")
    page_results = {}
    for slug, ts, orig_url in PAGES:
        target_dir = os.path.join(OUTPUT_ROOT, slug)
        os.makedirs(target_dir, exist_ok=True)
        target_file = os.path.join(target_dir, 'index.html')
        wb_url = f"https://web.archive.org/web/{ts}/{orig_url}"
        print(f"Fetching subpage: /{slug}/ ...")
        tmp_target = target_file + ".tmp"
        if download_file(wb_url, tmp_target, is_binary=False):
            with open(tmp_target, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            os.remove(tmp_target)
            cleaned = clean_html(content, relative_depth=1)
            with open(target_file, 'w', encoding='utf-8') as f:
                f.write(cleaned)
            page_results[slug] = True
            print(f"  Cleaned and saved /{slug}/index.html")
        else:
            page_results[slug] = False

    # Summary
    manifest = {
        "restoration_date": "2026-10-15",
        "target_snapshot": "20230304112228",
        "output_directory": "web20230304112228",
        "source_archive": "https://web.archive.org/web/20230304112228/http://www.lobsy.co.za/",
        "pages_downloaded": page_results,
        "assets_downloaded": asset_results,
    }
    with open(os.path.join(OUTPUT_ROOT, 'manifest.json'), 'w') as f:
        json.dump(manifest, f, indent=2)

    print("\n=== Download and restoration completed! ===")
    print(f"Manifest written to {os.path.join(OUTPUT_ROOT, 'manifest.json')}")

if __name__ == '__main__':
    main()
