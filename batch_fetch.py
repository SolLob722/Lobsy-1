#!/usr/bin/env python3
import os
import subprocess
import time
import json
import re

OUTPUT_DIR = os.path.abspath("web20230304112228")
os.makedirs(OUTPUT_DIR, exist_ok=True)

ITEMS = [
    # Subpages
    ("page", "about", "https://web.archive.org/web/20220529060524id_/http://www.lobsy.co.za/about/"),
    ("page", "company-documents", "https://web.archive.org/web/20220706154404id_/http://www.lobsy.co.za/company-documents/"),
    ("page", "company-portfolio", "https://web.archive.org/web/20211017191441id_/http://www.lobsy.co.za/company-portfolio/"),
    ("page", "lobsy-havc", "https://web.archive.org/web/20220529052217id_/http://www.lobsy.co.za/lobsy-havc/"),
    ("page", "lobsy-portfolio", "https://web.archive.org/web/20220706165624id_/http://www.lobsy.co.za/lobsy-portfolio/"),
    ("page", "lobsy-projects", "https://web.archive.org/web/20220706152104id_/http://www.lobsy.co.za/lobsy-projects/"),
    ("page", "lobsy-projects-pty-ltd", "https://web.archive.org/web/20220706164036id_/http://www.lobsy.co.za/lobsy-projects-pty-ltd/"),
    ("page", "lobsy-tehnologies", "https://web.archive.org/web/20220529053507id_/http://www.lobsy.co.za/lobsy-tehnologies/"),
    ("page", "loby-investments", "https://web.archive.org/web/20220706164825id_/http://www.lobsy.co.za/loby-investments/"),
    ("page", "main-branch-gauteng", "https://web.archive.org/web/20220706164935id_/http://www.lobsy.co.za/main-branch-gauteng/"),
    ("page", "mozambique-branch", "https://web.archive.org/web/20220706153256id_/http://www.lobsy.co.za/mozambique-branch/"),
    ("page", "mpumalanga", "https://web.archive.org/web/20220706161637id_/http://www.lobsy.co.za/mpumalanga/"),
    ("page", "swaziland-branch", "https://web.archive.org/web/20220706151933id_/http://www.lobsy.co.za/swaziland-branch/"),
    ("page", "eskom", "https://web.archive.org/web/20211017191401id_/http://www.lobsy.co.za/eskom/"),
    ("page", "potchefsroom-mall", "https://web.archive.org/web/20211017175331id_/http://www.lobsy.co.za/potchefsroom-mall/"),
    ("page", "unisa", "https://web.archive.org/web/20211017184151id_/http://www.lobsy.co.za/unisa/"),
    ("page", "witbank-highveld-mall", "https://web.archive.org/web/20211017185118id_/http://www.lobsy.co.za/witbank-highveld-mall/"),

    # Assets & Images
    ("asset", "wp-content/uploads/2016/03/logo-1.png", "https://web.archive.org/web/20171024001235im_/http://www.lobsy.co.za/wp-content/uploads/2016/03/logo-1.png"),
    ("asset", "wp-content/uploads/2014/11/co_holdings.png", "https://web.archive.org/web/20171023232855im_/http://www.lobsy.co.za/wp-content/uploads/2014/11/co_holdings.png"),
    ("asset", "wp-content/uploads/2014/11/co_hvac.png", "https://web.archive.org/web/20171024000453im_/http://www.lobsy.co.za/wp-content/uploads/2014/11/co_hvac.png"),
    ("asset", "wp-content/uploads/2014/11/co_invest.png", "https://web.archive.org/web/20171023232558im_/http://www.lobsy.co.za/wp-content/uploads/2014/11/co_invest.png"),
    ("asset", "wp-content/uploads/2014/11/co_projects.png", "https://web.archive.org/web/20171024000431im_/http://www.lobsy.co.za/wp-content/uploads/2014/11/co_projects.png"),
    ("asset", "wp-content/uploads/2014/11/co_tech.png", "https://web.archive.org/web/20171024000725im_/http://www.lobsy.co.za/wp-content/uploads/2014/11/co_tech.png"),
    ("asset", "wp-content/uploads/2014/11/co_blank.png", "https://web.archive.org/web/20171023232938im_/http://www.lobsy.co.za/wp-content/uploads/2014/11/co_blank.png"),
    ("asset", "wp-content/uploads/2014/11/btm_clients01.png", "https://web.archive.org/web/20171024000739im_/http://www.lobsy.co.za/wp-content/uploads/2014/11/btm_clients01.png"),
    ("asset", "wp-content/uploads/2014/11/btm_clients02.png", "https://web.archive.org/web/20171023233203im_/http://www.lobsy.co.za/wp-content/uploads/2014/11/btm_clients02.png"),
    ("asset", "wp-content/uploads/2014/11/btm_clients03.png", "https://web.archive.org/web/20171023234355im_/http://www.lobsy.co.za/wp-content/uploads/2014/11/btm_clients03.png"),
    ("asset", "wp-content/uploads/2014/11/btm_clients04-1.png", "https://web.archive.org/web/20171024000642im_/http://www.lobsy.co.za/wp-content/uploads/2014/11/btm_clients04-1.png"),
    ("asset", "wp-content/uploads/2016/07/s01.jpg", "https://web.archive.org/web/20171023232726im_/http://www.lobsy.co.za/wp-content/uploads/2016/07/s01.jpg"),
    ("asset", "wp-content/uploads/2016/07/s02.jpg", "https://web.archive.org/web/20171024000312im_/http://www.lobsy.co.za/wp-content/uploads/2016/07/s02.jpg"),
    ("asset", "wp-content/uploads/2016/07/s03.jpg", "https://web.archive.org/web/20171023235532im_/http://www.lobsy.co.za/wp-content/uploads/2016/07/s03.jpg"),
    ("asset", "wp-content/uploads/2016/07/s04.jpg", "https://web.archive.org/web/20171023235755im_/http://www.lobsy.co.za/wp-content/uploads/2016/07/s04.jpg"),
    ("asset", "wp-content/uploads/2016/07/slider_05.jpg", "https://web.archive.org/web/20171024000235im_/http://www.lobsy.co.za/wp-content/uploads/2016/07/slider_05.jpg"),
    ("asset", "wp-content/uploads/2016/06/page_title_bg.png", "https://web.archive.org/web/20171023232846im_/http://www.lobsy.co.za/wp-content/uploads/2016/06/page_title_bg.png"),
    ("asset", "wp-content/uploads/2016/06/header.png", "https://web.archive.org/web/20171023235727im_/http://www.lobsy.co.za/wp-content/uploads/2016/06/header.png"),
    ("asset", "wp-content/uploads/2014/04/citypower1.png", "https://web.archive.org/web/20160605141455im_/http://www.lobsy.co.za/wp-content/uploads/2014/04/citypower1.png"),
    ("asset", "wp-content/uploads/2014/04/nedbank1.png", "https://web.archive.org/web/20160605141801im_/http://www.lobsy.co.za/wp-content/uploads/2014/04/nedbank1.png"),
    ("asset", "wp-content/uploads/2014/04/safa11.png", "https://web.archive.org/web/20160605141639im_/http://www.lobsy.co.za/wp-content/uploads/2014/04/safa11.png"),
    ("asset", "wp-content/uploads/2014/04/transnet1.png", "https://web.archive.org/web/20160605081622im_/http://www.lobsy.co.za/wp-content/uploads/2014/04/transnet1.png"),
    ("asset", "wp-content/uploads/2014/04/tshwane.png", "https://web.archive.org/web/20160605141935im_/http://www.lobsy.co.za/wp-content/uploads/2014/04/tshwane.png"),
    ("asset", "wp-content/uploads/2014/04/unisa1.png", "https://web.archive.org/web/20160605084914im_/http://www.lobsy.co.za/wp-content/uploads/2014/04/unisa1.png"),
    ("asset", "wp-content/uploads/2012/05/eskom02-295x220.jpg", "https://web.archive.org/web/20160605143459im_/http://www.lobsy.co.za/wp-content/uploads/2012/05/eskom02-295x220.jpg"),
    ("asset", "wp-content/uploads/2012/05/highveld01-295x220.jpg", "https://web.archive.org/web/20160605082022im_/http://www.lobsy.co.za/wp-content/uploads/2012/05/highveld01-295x220.jpg"),
    ("asset", "wp-content/uploads/2012/05/Image107-295x220.jpg", "https://web.archive.org/web/20160605141703im_/http://www.lobsy.co.za/wp-content/uploads/2012/05/Image107-295x220.jpg"),
    ("asset", "wp-content/uploads/2012/05/soc01-295x220.jpg", "https://web.archive.org/web/20160605083201im_/http://www.lobsy.co.za/wp-content/uploads/2012/05/soc01-295x220.jpg"),
    # CSS
    ("asset", "wp-content/themes/Avada/style.css", "https://web.archive.org/web/20171023232022cs_/http://www.lobsy.co.za/wp-content/themes/Avada/style.css?ver=4.0.3"),
    ("asset", "wp-content/themes/Avada/shortcodes.css", "https://web.archive.org/web/20171023234221cs_/http://www.lobsy.co.za/wp-content/themes/Avada/shortcodes.css?ver=4.0.3"),
    ("asset", "wp-content/themes/Avada/ilightbox.css", "https://web.archive.org/web/20220920050254cs_/http://www.lobsy.co.za/wp-content/themes/Avada/ilightbox.css?ver=4.0.3"),
]

def clean_html(html, is_subpage=False):
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

    prefix = "../" if is_subpage else "./"
    html = re.sub(r'(?:https?:)?//web\.archive\.org/web/\d+(?:im_|cs_|js_|if_|id_)?/https?://(?:www\.)?lobsy\.co\.za/', prefix, html)
    html = re.sub(r'https?://(?:www\.)?lobsy\.co\.za/', prefix, html)

    html = html.replace(prefix + 'https://webmail.konsoleh.co.za/login', 'https://webmail.konsoleh.co.za/login')
    html = html.replace('//web.archive.org/web/', 'https://web.archive.org/web/')
    return html

def fetch_item(item_type, key, url):
    if item_type == "page":
        target_dir = os.path.join(OUTPUT_DIR, key)
        os.makedirs(target_dir, exist_ok=True)
        dest = os.path.join(target_dir, "index.html")
    else:
        dest = os.path.join(OUTPUT_DIR, key)
        os.makedirs(os.path.dirname(dest), exist_ok=True)

    if os.path.exists(dest) and os.path.getsize(dest) > 100:
        print(f"[OK EXISTS] {key} ({os.path.getsize(dest)}b)")
        return True

    # Use curl with retry
    cmd = [
        "curl", "-sL",
        "-A", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "--connect-timeout", "15",
        "--max-time", "30",
        "--retry", "3",
        "--retry-delay", "2",
        url,
        "-o", dest + ".tmp"
    ]
    res = subprocess.run(cmd)
    if res.returncode == 0 and os.path.exists(dest + ".tmp") and os.path.getsize(dest + ".tmp") > 100:
        if item_type == "page":
            try:
                with open(dest + ".tmp", "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                cleaned = clean_html(content, is_subpage=True)
                with open(dest, "w", encoding="utf-8") as f:
                    f.write(cleaned)
            except Exception as e:
                os.rename(dest + ".tmp", dest)
            if os.path.exists(dest + ".tmp"):
                os.remove(dest + ".tmp")
        else:
            os.rename(dest + ".tmp", dest)
        print(f"[FETCHED] {key} ({os.path.getsize(dest)}b)")
        return True
    else:
        print(f"[FAILED] {key} from {url}")
        if os.path.exists(dest + ".tmp"):
            os.remove(dest + ".tmp")
        return False

def main():
    print("=== Batch fetching all website pages and assets ===")
    results = {}
    for item_type, key, url in ITEMS:
        success = fetch_item(item_type, key, url)
        results[key] = success
        time.sleep(1.0) # Polite pause to avoid archive.org rate limits

    with open(os.path.join(OUTPUT_DIR, "manifest.json"), "w") as f:
        json.dump(results, f, indent=2)
    print("=== Done! Saved manifest.json ===")

if __name__ == "__main__":
    main()
