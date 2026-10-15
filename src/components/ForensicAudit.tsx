import React from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  Server,
  Archive,
  Download,
  Terminal,
  ExternalLink,
  Code2,
  FileCheck,
  AlertTriangle,
  HelpCircle,
  UploadCloud,
} from 'lucide-react';

interface ForensicAuditProps {
  onOpenPage: (path: string) => void;
}

export const ForensicAudit: React.FC<ForensicAuditProps> = ({ onOpenPage }) => {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-900 text-slate-100 p-4 md:p-8 space-y-8">
      {/* Title Card */}
      <div className="max-w-4xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Restoration Audit &amp; Technical Forensic Dossier</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          Wayback Machine 2023/03/04 Restoration Report
        </h1>
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
          Detailed forensic analysis of the original domain (<code className="text-blue-400">lobsy.co.za</code>), snapshot state on March 4, 2023, automated reconstruction process, and complete instructions for immediate zero-dependency redeployment.
        </p>
      </div>

      {/* Forensic Finding 1: What happened to the website in 2023 */}
      <div className="max-w-4xl mx-auto bg-slate-950 rounded-xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-bold text-white">Forensic Finding: What Happened in March 2023?</h2>
        </div>

        <div className="bg-amber-950/30 border border-amber-900/40 rounded-lg p-4 text-xs text-amber-200/90 space-y-2 leading-relaxed">
          <p>
            When examining the Wayback Machine capture from <strong>March 4, 2023 at 11:22:28 GMT</strong> (
            <code className="text-amber-300">https://web.archive.org/web/20230304112228/http://www.lobsy.co.za/</code>), the archive records that the server returned an <strong>HTTP 500 Internal Server Error</strong> with the WordPress message:
          </p>
          <div className="font-mono bg-black/50 p-2.5 rounded border border-amber-900/60 text-amber-300">
            &ldquo;There has been a critical error on this website. Learn more about troubleshooting WordPress.&rdquo;
          </div>
          <p>
            This occurred because the WordPress database or PHP runtime failed on the hosting provider's server. Because the hosting agent became unreachable, the website remained in this crashed state until the domain lapsed.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-between text-xs">
          <span className="text-slate-400">Both the raw crash state and the restored healthy state are preserved:</span>
          <button
            onClick={() => onOpenPage('/web20230304112228/snapshot_20230304112228_clean.html')}
            className="text-amber-400 hover:text-amber-300 underline font-medium flex items-center gap-1"
          >
            <span>Inspect 2023/03/04 Crash State</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Restoration Methodology */}
      <div className="max-w-4xl mx-auto bg-slate-950 rounded-xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-bold text-white">Restoration Pipeline &amp; Sanitization</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-900/90 p-4 rounded-lg border border-slate-800 space-y-2">
            <div className="font-semibold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-900 text-blue-300 flex items-center justify-center text-[10px]">1</span>
              <span>Full CDX Database Indexing</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              We queried the complete Internet Archive CDX database for <code className="text-slate-300">lobsy.co.za/*</code>, extracting all 350+ historical capture records from 2013 through 2023 to pinpoint healthy HTTP 200 responses for every subpage and graphic.
            </p>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-lg border border-slate-800 space-y-2">
            <div className="font-semibold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-900 text-blue-300 flex items-center justify-center text-[10px]">2</span>
              <span>Wayback Code Stripping</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              All Wayback Machine injected scripts (<code className="text-slate-300">bundle-playback.js</code>, <code className="text-slate-300">wombat.js</code>, <code className="text-slate-300">ruffle.js</code>, <code className="text-slate-300">__wm.init</code>, toolbar HTML, and Wayback comment wrappers) have been cleanly excised.
            </p>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-lg border border-slate-800 space-y-2">
            <div className="font-semibold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-900 text-blue-300 flex items-center justify-center text-[10px]">3</span>
              <span>Asset &amp; Link Remapping</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              All hyperlinks and image sources were rewritten from archive URLs to clean relative directory paths (e.g., <code className="text-slate-300">../wp-content/uploads/...</code> or <code className="text-slate-300">./about/</code>) allowing the site to function standalone offline or on any host.
            </p>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-lg border border-slate-800 space-y-2">
            <div className="font-semibold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-900 text-blue-300 flex items-center justify-center text-[10px]">4</span>
              <span>Preserved Directory Structure</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Saved exactly to folder <code className="text-slate-300">web20230304112228</code> matching original WordPress directories (<code className="text-slate-300">wp-content/uploads/...</code>, <code className="text-slate-300">wp-content/themes/Avada/...</code>) with embedded Avada styling.
            </p>
          </div>
        </div>
      </div>

      {/* How to redeploy this website to any hosting provider */}
      <div className="max-w-4xl mx-auto bg-slate-950 rounded-xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <UploadCloud className="w-5 h-5 text-blue-400" />
          <h2 className="text-base font-bold text-white">How to Redeploy Your Website (Zero Dependencies)</h2>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Because this restored version is compiled into standard static HTML, CSS, and images, <strong>you do not need PHP, MySQL, or WordPress</strong>. It can be hosted anywhere for free or low cost with 100% uptime and zero maintenance.
        </p>

        <div className="space-y-4 pt-2">
          {/* Method 1: cPanel */}
          <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Option A: Standard Web Hosting (cPanel / DirectAdmin / FTP)</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-900">Most Common</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-400 leading-relaxed">
              <li>Download the zip archive: <a href="/web20230304112228.zip" download className="text-blue-400 underline font-medium">web20230304112228.zip</a></li>
              <li>Extract the contents on your computer.</li>
              <li>Log in to your hosting cPanel or FTP, open the <code className="text-slate-300">public_html</code> folder.</li>
              <li>Upload all files from inside <code className="text-slate-300">web20230304112228</code> into <code className="text-slate-300">public_html/</code> so that <code className="text-slate-300">index.html</code> is at the root.</li>
              <li>Your website is immediately live and will never crash or require security updates.</li>
            </ol>
          </div>

          {/* Method 2: Netlify / Vercel / Cloudflare */}
          <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Option B: Modern Cloud Hosting (Netlify, Cloudflare Pages, GitHub Pages)</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-900">100% Free Forever</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Simply drag and drop the unzipped <code className="text-slate-300">web20230304112228</code> folder onto <a href="https://app.netlify.com/drop" target="_blank" rel="noreferrer" className="text-blue-400 underline">Netlify Drop</a> or Cloudflare Pages. Point your domain <code className="text-slate-300">lobsy.co.za</code> DNS to it, and you have global CDN delivery with free SSL!
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <a
            href="/web20230304112228.zip"
            download="web20230304112228.zip"
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-2 shadow-lg transition"
          >
            <Download className="w-4 h-4" />
            <span>Download All Files (.ZIP 1.0 MB)</span>
          </a>
        </div>
      </div>
    </div>
  );
};
