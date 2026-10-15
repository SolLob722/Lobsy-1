import React, { useState, useEffect } from 'react';
import {
  Folder,
  FileCode,
  FileText,
  Image as ImageIcon,
  Download,
  Copy,
  Check,
  Search,
  ExternalLink,
  Archive,
  RefreshCw,
  Eye,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { ArchiveFile, ArchiveEdition } from '../types';
import { ARCHIVE_EDITIONS } from '../data/lobsyData';

interface FileExplorerProps {
  currentEdition: ArchiveEdition;
  onSwitchEdition: (edition: ArchiveEdition) => void;
  onOpenInBrowser: (path: string) => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  currentEdition,
  onSwitchEdition,
  onOpenInBrowser,
}) => {
  const editionConfig = ARCHIVE_EDITIONS[currentEdition];
  const [files, setFiles] = useState<ArchiveFile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedFile, setSelectedFile] = useState<ArchiveFile | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [fileDataUrl, setFileDataUrl] = useState<string>('');
  const [contentLoading, setContentLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const fetchMeta = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/archive-meta?folder=${editionConfig.folder}`);
      const data = await res.json();
      if (data.success && data.files) {
        setFiles(data.files);
        if (data.files.length > 0) {
          const defaultFile = data.files.find((f: ArchiveFile) => f.path === 'index.html') || data.files[0];
          setSelectedFile(defaultFile);
        }
      }
    } catch (err) {
      console.error('Error fetching archive metadata:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeta();
  }, [currentEdition]);

  useEffect(() => {
    if (!selectedFile) return;
    setContentLoading(true);
    fetch(`/api/file-content?folder=${editionConfig.folder}&path=${encodeURIComponent(selectedFile.path)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.isText) {
          setFileContent(data.content || '');
          setFileDataUrl('');
        } else {
          setFileDataUrl(data.dataUrl || '');
          setFileContent('');
        }
      })
      .catch((err) => {
        console.error('Failed to load file content:', err);
      })
      .finally(() => {
        setContentLoading(false);
      });
  }, [selectedFile, currentEdition]);

  const filteredFiles = files.filter((f) => {
    const matchesSearch = f.path.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || f.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileIcon = (cat: string) => {
    switch (cat) {
      case 'html':
        return <FileCode className="w-4 h-4 text-orange-400" />;
      case 'css':
        return <FileText className="w-4 h-4 text-blue-400" />;
      case 'image':
        return <ImageIcon className="w-4 h-4 text-emerald-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleCopyCode = () => {
    if (fileContent) {
      navigator.clipboard.writeText(fileContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const htmlCount = files.filter((f) => f.category === 'html').length;
  const imageCount = files.filter((f) => f.category === 'image').length;
  const cssCount = files.filter((f) => f.category === 'css').length;

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 overflow-hidden">
      {/* Top Banner with Folder Switcher & Zip Download */}
      <div className="bg-slate-950 border-b border-slate-800 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Folder className="w-5 h-5 text-blue-400" />
              <h2 className="text-base font-semibold text-white">Directory: /{editionConfig.folder}/</h2>

              {/* Folder Selector Pills */}
              <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 ml-2">
                <button
                  onClick={() => onSwitchEdition('lobsy2')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                    currentEdition === 'lobsy2'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Lobsy 2 (web20220817032451)
                </button>
                <button
                  onClick={() => onSwitchEdition('lobsy1')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                    currentEdition === 'lobsy1'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Lobsy 1 (web20230304112228)
                </button>
              </div>

              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-950 text-blue-400 border border-blue-800">
                {files.length} Files
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {editionConfig.description}
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={editionConfig.zipUrl}
              download={`${editionConfig.folder}.zip`}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition"
            >
              <Archive className="w-4 h-4" />
              <span>Download {editionConfig.name} ZIP ({editionConfig.zipSize})</span>
            </a>
          </div>
        </div>

        {/* Quick summary metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-800/60 text-xs">
          <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
            <span className="text-slate-400 block text-[11px]">HTML Subpages</span>
            <span className="text-white font-semibold text-sm">{htmlCount} Pages</span>
          </div>
          <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Graphics &amp; Logos</span>
            <span className="text-emerald-400 font-semibold text-sm">{imageCount} Assets</span>
          </div>
          <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Stylesheets &amp; Theme</span>
            <span className="text-blue-400 font-semibold text-sm">{cssCount} CSS Files</span>
          </div>
          <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Selected Archive Path</span>
            <span className="text-amber-400 font-semibold font-mono text-xs">/{editionConfig.folder}/</span>
          </div>
        </div>
      </div>

      {/* Main Split Body */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Column: File List */}
        <div className="w-full md:w-80 lg:w-96 border-r border-slate-800 flex flex-col bg-slate-950/60">
          {/* Search and Category Filters */}
          <div className="p-3 border-b border-slate-800 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search files..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900 pl-8 pr-3 py-1.5 rounded-md text-xs border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs scrollbar-none">
              {['all', 'html', 'image', 'css', 'data'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2 py-0.5 rounded text-[11px] capitalize transition ${
                    categoryFilter === cat
                      ? 'bg-blue-600 text-white font-medium'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-400'
                  }`}
                >
                  {cat === 'data' ? 'JSON/Data' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Files List Scrollable */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40 p-2 space-y-1">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                <span>Reading directory tree...</span>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No files found matching filter.
              </div>
            ) : (
              filteredFiles.map((f) => {
                const isSelected = selectedFile?.path === f.path;
                return (
                  <button
                    key={f.path}
                    onClick={() => setSelectedFile(f)}
                    className={`w-full text-left p-2 rounded-lg flex items-center justify-between gap-2 text-xs transition ${
                      isSelected
                        ? 'bg-blue-600/20 border border-blue-500/50 text-white'
                        : 'hover:bg-slate-900/80 text-slate-300 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {getFileIcon(f.category)}
                      <span className="truncate font-mono text-[11px]">{f.path}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0 font-mono">
                      {formatBytes(f.size)}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: File Previewer */}
        <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
          {selectedFile ? (
            <>
              {/* File details bar */}
              <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  {getFileIcon(selectedFile.category)}
                  <span className="font-mono text-xs font-semibold text-white truncate">
                    {editionConfig.folder}/{selectedFile.path}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    {formatBytes(selectedFile.size)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {selectedFile.category === 'html' && (
                    <button
                      onClick={() => onOpenInBrowser(`/${editionConfig.folder}/${selectedFile.path}`)}
                      className="px-2.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1.5 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview in Browser</span>
                    </button>
                  )}
                  {fileContent && (
                    <button
                      onClick={handleCopyCode}
                      className="px-2.5 py-1.5 rounded-md border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 transition"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                  <a
                    href={`/${editionConfig.folder}/${selectedFile.path}`}
                    download={selectedFile.path.split('/').pop()}
                    className="px-2.5 py-1.5 rounded-md border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download File</span>
                  </a>
                </div>
              </div>

              {/* Preview Body */}
              <div className="flex-1 overflow-auto p-4 bg-slate-900">
                {contentLoading ? (
                  <div className="h-full flex items-center justify-center text-slate-500 text-xs gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                    <span>Loading file content...</span>
                  </div>
                ) : selectedFile.category === 'image' || fileDataUrl ? (
                  <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-950/40 rounded-xl border border-slate-800/80">
                    <div className="p-4 bg-slate-900 rounded-lg shadow-xl border border-slate-800 max-w-md max-h-[400px] flex items-center justify-center">
                      <img
                        src={fileDataUrl || `/${editionConfig.folder}/${selectedFile.path}`}
                        alt={selectedFile.path}
                        className="max-h-72 object-contain rounded"
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-xs font-mono text-slate-300">File: {selectedFile.path}</p>
                      <p className="text-xs text-slate-500 mt-1">Size: {formatBytes(selectedFile.size)}</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative font-mono text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800/80 overflow-x-auto leading-relaxed">
                    <pre className="whitespace-pre-wrap">{fileContent || '(Empty file)'}</pre>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs">
              Select a file from the explorer on the left to preview its contents.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
