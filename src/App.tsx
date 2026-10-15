/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Globe,
  FolderTree,
  Building2,
  FileCheck2,
  Download,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Archive,
  ChevronDown,
} from 'lucide-react';
import { ArchiveEdition } from './types';
import { ARCHIVE_EDITIONS } from './data/lobsyData';
import { RestoredBrowser } from './components/RestoredBrowser';
import { FileExplorer } from './components/FileExplorer';
import { DivisionsShowcase } from './components/DivisionsShowcase';
import { ForensicAudit } from './components/ForensicAudit';

type AppTab = 'browser' | 'explorer' | 'showcase' | 'audit';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('browser');
  const [currentEdition, setCurrentEdition] = useState<ArchiveEdition>('lobsy2');
  const [selectedBrowserPath, setSelectedBrowserPath] = useState<string>('/web20220817032451/index.html');
  const [showDownloadDropdown, setShowDownloadDropdown] = useState<boolean>(false);

  const activeConfig = ARCHIVE_EDITIONS[currentEdition];

  const handleSwitchEdition = (edition: ArchiveEdition) => {
    setCurrentEdition(edition);
    const targetFolder = ARCHIVE_EDITIONS[edition].folder;
    setSelectedBrowserPath(`/${targetFolder}/index.html`);
  };

  const handleOpenPageInBrowser = (path: string) => {
    // replace folder in path if needed to match currentEdition
    const targetFolder = activeConfig.folder;
    const adjustedPath = path.replace(/\/web\d+/, `/${targetFolder}`);
    setSelectedBrowserPath(adjustedPath);
    setActiveTab('browser');
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Application Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 z-30">
        <div className="flex items-center gap-3">
          {/* Logo / Emblem */}
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-slate-900 border border-slate-800 p-1 flex items-center justify-center overflow-hidden shadow-inner">
              <img
                src={`/${activeConfig.folder}/wp-content/uploads/2016/03/logo-1.png`}
                alt="Lobsy Emblem"
                className="h-full w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-white tracking-wide">
                  {currentEdition === 'lobsy2' ? 'lobsy 2' : 'lobsy 1'}
                </span>

                {/* Edition Pill Selector */}
                <div className="flex items-center bg-slate-900 p-0.5 rounded-md border border-slate-800">
                  <button
                    onClick={() => handleSwitchEdition('lobsy2')}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                      currentEdition === 'lobsy2'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="Lobsy 2: Preserved from 2022/08/17"
                  >
                    Lobsy 2 (2022)
                  </button>
                  <button
                    onClick={() => handleSwitchEdition('lobsy1')}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                      currentEdition === 'lobsy1'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="Lobsy 1: Preserved from 2023/03/04"
                  >
                    Lobsy 1 (2023)
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 hidden sm:block">
                Archive: <code className="text-blue-400 font-mono text-[10px]">/{activeConfig.folder}/</code> • {activeConfig.dateStr}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('browser')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition ${
              activeTab === 'browser'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Restored Site</span>
          </button>

          <button
            onClick={() => setActiveTab('explorer')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition ${
              activeTab === 'explorer'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>File Explorer</span>
          </button>

          <button
            onClick={() => setActiveTab('showcase')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition ${
              activeTab === 'showcase'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Company</span>
            <span>Divisions</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition ${
              activeTab === 'audit'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Forensic</span>
            <span>Audit &amp; Deploy</span>
          </button>
        </nav>

        {/* Primary Download & Standalone Action */}
        <div className="flex items-center gap-2 relative">
          <a
            href={`/${activeConfig.folder}/index.html`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition"
            title="Open pure static HTML website directly"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Direct Website</span>
          </a>

          {/* Download Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDownloadDropdown(!showDownloadDropdown)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition"
              title="Download Archive ZIP"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download ZIP</span>
              <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-80" />
            </button>

            {showDownloadDropdown && (
              <div
                className="absolute right-0 mt-1.5 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 space-y-1"
                onMouseLeave={() => setShowDownloadDropdown(false)}
              >
                <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Available Archive Bundles
                </div>
                <a
                  href="/web20220817032451.zip"
                  download="web20220817032451.zip"
                  onClick={() => setShowDownloadDropdown(false)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 text-xs text-slate-200 transition"
                >
                  <div className="flex items-center gap-2">
                    <Archive className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="font-medium text-white">Lobsy 2 (2022/08/17)</div>
                      <div className="text-[10px] text-slate-400">web20220817032451.zip</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded">
                    989 KB
                  </span>
                </a>

                <a
                  href="/web20230304112228.zip"
                  download="web20230304112228.zip"
                  onClick={() => setShowDownloadDropdown(false)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 text-xs text-slate-200 transition"
                >
                  <div className="flex items-center gap-2">
                    <Archive className="w-4 h-4 text-blue-400" />
                    <div>
                      <div className="font-medium text-white">Lobsy 1 (2023/03/04)</div>
                      <div className="text-[10px] text-slate-400">web20230304112228.zip</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-blue-400 bg-blue-950 px-1.5 py-0.5 rounded">
                    1.0 MB
                  </span>
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 overflow-hidden relative">
        {activeTab === 'browser' && (
          <RestoredBrowser
            edition={currentEdition}
            onSwitchEdition={handleSwitchEdition}
            initialPath={selectedBrowserPath}
            onSelectFile={(path) => {
              setActiveTab('explorer');
            }}
          />
        )}

        {activeTab === 'explorer' && (
          <FileExplorer
            currentEdition={currentEdition}
            onSwitchEdition={handleSwitchEdition}
            onOpenInBrowser={(path) => {
              setSelectedBrowserPath(path);
              setActiveTab('browser');
            }}
          />
        )}

        {activeTab === 'showcase' && (
          <DivisionsShowcase
            onOpenPage={handleOpenPageInBrowser}
          />
        )}

        {activeTab === 'audit' && (
          <ForensicAudit
            onOpenPage={handleOpenPageInBrowser}
          />
        )}
      </main>

      {/* Footer Info Strip */}
      <footer className="bg-slate-950 border-t border-slate-800/80 px-4 py-2 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-slate-300 font-medium">
              {currentEdition === 'lobsy2' ? 'Lobsy 2 Active: 39 Files' : 'Lobsy 1 Active: 40 Files'}
            </span>
          </span>
          <span className="text-slate-600">•</span>
          <span>Target Folder: <code className="text-blue-400 font-mono">./{activeConfig.folder}/</code></span>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <span>Source: <code className="text-slate-400">{activeConfig.sourceUrl}</code></span>
          <span className="text-slate-600">•</span>
          <span>Zero Server/Database Dependencies</span>
        </div>
      </footer>
    </div>
  );
}
