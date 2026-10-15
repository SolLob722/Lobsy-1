import React, { useState, useEffect } from 'react';
import {
  Globe,
  Monitor,
  Tablet,
  Smartphone,
  ExternalLink,
  RotateCcw,
  Copy,
  Check,
  ShieldAlert,
  Sparkles,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { ArchiveEdition, RestoredPage } from '../types';
import { ARCHIVE_EDITIONS, getPagesForEdition } from '../data/lobsyData';

interface RestoredBrowserProps {
  edition: ArchiveEdition;
  onSwitchEdition: (edition: ArchiveEdition) => void;
  initialPath?: string;
  onSelectFile?: (path: string) => void;
}

export const RestoredBrowser: React.FC<RestoredBrowserProps> = ({
  edition,
  onSwitchEdition,
  initialPath,
}) => {
  const editionConfig = ARCHIVE_EDITIONS[edition];
  const pages = getPagesForEdition(edition);

  const defaultPath = `/${editionConfig.folder}/index.html`;
  const [currentPath, setCurrentPath] = useState<string>(initialPath || defaultPath);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    // When edition changes, if currentPath is in other folder, update to current folder
    const targetFolder = editionConfig.folder;
    if (!currentPath.includes(targetFolder)) {
      setCurrentPath(`/${targetFolder}/index.html`);
    }
  }, [edition]);

  const currentPage = pages.find((p) => p.path === currentPath) || {
    title: 'Restored Page',
    path: currentPath,
    category: 'core',
    description: '',
    timestamp: editionConfig.dateStr,
  };

  const handleCopyLink = () => {
    const fullUrl = window.location.origin + currentPath;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = () => {
    setIframeKey((prev) => prev + 1);
  };

  const getContainerWidth = () => {
    switch (deviceMode) {
      case 'mobile':
        return 'max-w-[420px] shadow-2xl rounded-2xl border-4 border-slate-700 my-4';
      case 'tablet':
        return 'max-w-[820px] shadow-2xl rounded-xl border-2 border-slate-600 my-4';
      default:
        return 'w-full h-full';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100">
      {/* Browser Controls Header */}
      <div className="border-b border-slate-800 bg-slate-950 p-3 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Edition Switcher Pill & Title */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800">
              <button
                onClick={() => onSwitchEdition('lobsy2')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
                  edition === 'lobsy2'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>Lobsy 2</span>
                <span className="text-[10px] bg-blue-700/60 px-1 py-0.2 rounded text-blue-100">2022/08/17</span>
              </button>
              <button
                onClick={() => onSwitchEdition('lobsy1')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
                  edition === 'lobsy1'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>Lobsy 1</span>
                <span className="text-[10px] bg-slate-800 px-1 py-0.2 rounded text-slate-300">2023/03/04</span>
              </button>
            </div>

            <span className="text-slate-600 text-xs hidden sm:inline">|</span>
            <div className="text-xs text-slate-300 font-medium truncate max-w-[240px]">
              {currentPage.title}
            </div>
          </div>

          {/* Viewport switchers */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-1.5 rounded text-xs flex items-center gap-1.5 transition ${
                deviceMode === 'desktop'
                  ? 'bg-blue-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title="Desktop View (Full Width)"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Desktop</span>
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`p-1.5 rounded text-xs flex items-center gap-1.5 transition ${
                deviceMode === 'tablet'
                  ? 'bg-blue-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Tablet</span>
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-1.5 rounded text-xs flex items-center gap-1.5 transition ${
                deviceMode === 'mobile'
                  ? 'bg-blue-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title="Mobile View (390px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Mobile</span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-800 text-xs flex items-center gap-1 transition"
              title="Reload Frame"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleCopyLink}
              className="px-2.5 py-1.5 rounded-lg border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-xs flex items-center gap-1.5 transition"
              title="Copy Page Link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
            </button>
            <a
              href={currentPath}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-sm transition"
              title="Open standalone page without frame"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Tab</span>
            </a>
          </div>
        </div>

        {/* Browser simulated Address Bar & Quick Selector */}
        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
          <Globe className="w-4 h-4 text-slate-500 shrink-0" />
          <div className="text-xs font-mono text-slate-400 select-all truncate flex-1">
            <span className="text-slate-500">http://www.lobsy.co.za</span>
            <span className="text-blue-400">
              {currentPath.replace(`/${editionConfig.folder}`, '') || '/'}
            </span>
            <span className="text-slate-600 text-[10px] ml-2">
              (local: <code className="text-slate-400">{currentPath}</code>)
            </span>
          </div>

          {/* Direct Dropdown Page Selector */}
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-xs text-slate-500 hidden sm:inline">Page:</span>
            <select
              value={currentPath}
              onChange={(e) => setCurrentPath(e.target.value)}
              className="bg-slate-800 text-slate-200 text-xs rounded border border-slate-700 px-2 py-1 focus:outline-none focus:border-blue-500"
            >
              <optgroup label="Main Site">
                <option value={`/${editionConfig.folder}/index.html`}>Home (Fully Restored)</option>
                <option value={`/${editionConfig.folder}/about/index.html`}>About Us (Lobsy Group)</option>
                <option value={`/${editionConfig.folder}/company-documents/index.html`}>Company Documents</option>
              </optgroup>
              <optgroup label="Divisions">
                <option value={`/${editionConfig.folder}/lobsy-havc/index.html`}>Lobsy HVAC</option>
                <option value={`/${editionConfig.folder}/lobsy-tehnologies/index.html`}>Lobsy Technologies (ICT)</option>
                <option value={`/${editionConfig.folder}/loby-investments/index.html`}>Lobsy Investments</option>
                <option value={`/${editionConfig.folder}/lobsy-projects/index.html`}>Lobsy Projects</option>
                <option value={`/${editionConfig.folder}/lobsy-projects-pty-ltd/index.html`}>Lobsy Projects (Manufacturing)</option>
              </optgroup>
              <optgroup label="Portfolio">
                <option value={`/${editionConfig.folder}/lobsy-portfolio/index.html`}>Portfolio Index</option>
                <option value={`/${editionConfig.folder}/eskom/index.html`}>ESKOM Kendal Power Station</option>
                <option value={`/${editionConfig.folder}/unisa/index.html`}>UNISA Chillers</option>
                <option value={`/${editionConfig.folder}/potchefsroom-mall/index.html`}>Potchefstroom Mall</option>
                <option value={`/${editionConfig.folder}/witbank-highveld-mall/index.html`}>Witbank Highveld Mall</option>
              </optgroup>
              <optgroup label="Branch Network">
                <option value={`/${editionConfig.folder}/main-branch-gauteng/index.html`}>Head Office (Gauteng RSA)</option>
                <option value={`/${editionConfig.folder}/mpumalanga/index.html`}>Mpumalanga Branch</option>
                <option value={`/${editionConfig.folder}/swaziland-branch/index.html`}>Swaziland Branch</option>
                <option value={`/${editionConfig.folder}/mozambique-branch/index.html`}>Mozambique Branch</option>
              </optgroup>
              {edition === 'lobsy2' ? (
                <optgroup label="Historical Raw Capture">
                  <option value={`/${editionConfig.folder}/snapshot_20220817032451_verbatim.html`}>Verbatim 2022/08/17 Snapshot</option>
                </optgroup>
              ) : (
                <optgroup label="Historical Crash State">
                  <option value={`/${editionConfig.folder}/snapshot_20230304112228_clean.html`}>Cleaned 2023/03/04 Crash State</option>
                  <option value={`/${editionConfig.folder}/snapshot_20230304112228_verbatim.html`}>Verbatim 2023/03/04 Archive</option>
                </optgroup>
              )}
            </select>
          </div>
        </div>

        {/* Quick Subpages Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          <span className="text-slate-500 text-[11px] font-medium mr-1 uppercase tracking-wider shrink-0">Subpages:</span>
          {pages.slice(0, 9).map((p) => {
            const isActive = currentPath === p.path;
            return (
              <button
                key={p.path}
                onClick={() => setCurrentPath(p.path)}
                className={`px-2.5 py-1 rounded-md shrink-0 transition text-xs flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-blue-600 text-white font-medium shadow-sm'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <span>{p.title.split('(')[0].trim()}</span>
                {p.badge && (
                  <span
                    className={`text-[10px] px-1 py-0.2 rounded ${
                      isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {p.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Edition Context Banner */}
      {edition === 'lobsy2' ? (
        <div className="bg-emerald-950/40 border-b border-emerald-900/40 px-4 py-1.5 text-xs text-emerald-200/90 flex items-center justify-between">
          <span className="flex items-center gap-1.5 truncate">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              <strong>Lobsy 2 Active:</strong> Viewing pristine August 17, 2022 snapshot. All subpages, HVAC portfolio, Avada sliders, and assets mapped into <code className="bg-emerald-950 px-1 py-0.5 rounded text-emerald-300">/web20220817032451/</code>
            </span>
          </span>
          <button
            onClick={() => onSwitchEdition('lobsy1')}
            className="text-xs text-emerald-400 hover:text-emerald-300 underline shrink-0 ml-2"
          >
            Switch to Lobsy 1 (2023)
          </button>
        </div>
      ) : (
        <div className="bg-amber-950/40 border-b border-amber-900/40 px-4 py-1.5 text-xs text-amber-200/90 flex items-center justify-between">
          <span className="flex items-center gap-1.5 truncate">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              <strong>Lobsy 1 Active:</strong> March 4, 2023 archive folder <code className="bg-amber-950 px-1 py-0.5 rounded text-amber-300">/web20230304112228/</code> with recovered working site &amp; crash state comparison.
            </span>
          </span>
          <button
            onClick={() => onSwitchEdition('lobsy2')}
            className="text-xs text-amber-400 hover:text-amber-300 underline shrink-0 ml-2"
          >
            Switch to Lobsy 2 (2022 Healthy)
          </button>
        </div>
      )}

      {/* Embedded Iframe Container */}
      <div className="flex-1 bg-slate-950 flex justify-center items-stretch overflow-hidden relative p-2 md:p-3">
        <div className={`transition-all duration-300 bg-white overflow-hidden flex flex-col ${getContainerWidth()}`}>
          <iframe
            key={iframeKey}
            src={currentPath}
            title={currentPage.title}
            className="w-full h-full border-0 bg-white"
            sandbox="allow-same-origin allow-scripts allow-forms"
          />
        </div>
      </div>
    </div>
  );
};
