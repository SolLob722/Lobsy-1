import React from 'react';
import {
  Building2,
  Flame,
  Cpu,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Award,
} from 'lucide-react';
import { DIVISIONS, BRANCHES, CLIENT_LOGOS, PORTFOLIO_HIGHLIGHTS } from '../data/lobsyData';

interface DivisionsShowcaseProps {
  onOpenPage: (path: string) => void;
}

export const DivisionsShowcase: React.FC<DivisionsShowcaseProps> = ({ onOpenPage }) => {
  const getDivisionIcon = (id: string) => {
    switch (id) {
      case 'hvac':
        return <Flame className="w-5 h-5 text-amber-400" />;
      case 'technologies':
        return <Cpu className="w-5 h-5 text-cyan-400" />;
      case 'projects':
        return <Briefcase className="w-5 h-5 text-emerald-400" />;
      default:
        return <Building2 className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-900 text-slate-100 p-4 md:p-8 space-y-10">
      {/* Hero Header */}
      <div className="max-w-5xl mx-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-slate-800 p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800 text-blue-400 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Black Owned • Established 2002 • South Africa</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              LOBSY GROUP <span className="text-blue-400 font-light text-xl">Corporate Structure</span>
            </h1>
            <p className="text-sm text-slate-300 italic font-serif">
              “It is the consistence of our aim”
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Lobsy is a South African black-owned enterprise with a dynamic history of innovation, consistence, and growth. Since 2002, Lobsy has served government institutions, universities, state-owned enterprises, and private corporations with proven mechanical, electrical, ICT, and cold chain manufacturing services.
            </p>
          </div>

          <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 shrink-0 text-center space-y-2">
            <img
              src="/web20230304112228/wp-content/uploads/2016/03/logo-1.png"
              alt="Lobsy Group Logo"
              className="h-14 mx-auto object-contain"
            />
            <span className="block text-[11px] text-slate-400 font-medium">Original Verified Emblem</span>
            <button
              onClick={() => onOpenPage('/web20230304112228/about/index.html')}
              className="w-full mt-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition"
            >
              <span>View About Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Corporate Divisions Grid */}
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">Operating Subsidiaries &amp; Divisions</h2>
          </div>
          <span className="text-xs text-slate-400">Restored from Archive</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {DIVISIONS.map((div) => (
            <div
              key={div.id}
              className="bg-slate-950/80 rounded-xl border border-slate-800 p-5 flex flex-col justify-between hover:border-slate-700 transition shadow-lg group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      {getDivisionIcon(div.id)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition">
                        {div.name}
                      </h3>
                      <p className="text-[11px] text-blue-400/90 font-medium">{div.tagline}</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{div.description}</p>

                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                    Core Capabilities:
                  </span>
                  <div className="grid grid-cols-1 gap-1">
                    {div.specialties.map((spec, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">web20230304112228</span>
                <button
                  onClick={() => onOpenPage(div.pageUrl)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-blue-600 hover:text-white text-slate-200 border border-slate-800 text-xs font-medium flex items-center gap-1.5 transition"
                >
                  <span>Open Restored Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notable Client Portfolio */}
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Major Track Record &amp; Institutional Clients</h2>
          </div>
          <span className="text-xs text-slate-400">Verified Contracts</span>
        </div>

        {/* Client Logos Ribbon */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-3">
            Clients Served (Recovered from Archive Assets):
          </span>
          <div className="flex flex-wrap items-center justify-around gap-6">
            {CLIENT_LOGOS.map((c, i) => (
              <div key={i} className="flex flex-col items-center gap-1 group">
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800/80 h-14 w-24 flex items-center justify-center">
                  <img
                    src={c.path}
                    alt={c.name}
                    className="max-h-10 max-w-full object-contain grayscale group-hover:grayscale-0 transition"
                  />
                </div>
                <span className="text-[10px] text-slate-400 group-hover:text-slate-200">{c.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PORTFOLIO_HIGHLIGHTS.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300">
                    {item.client}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{item.year}</span>
                  </div>
                </div>
                <h4 className="text-sm font-semibold text-white">{item.project}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{item.scope}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => onOpenPage(item.url)}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <span>View Project Case Study</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regional Branch Offices */}
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Branch Network &amp; Regional Offices</h2>
          </div>
          <span className="text-xs text-slate-400">4 Territories</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BRANCHES.map((b, i) => (
            <div
              key={i}
              className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-900">
                    {b.country}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white">{b.name}</h4>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-snug">{b.address}</span>
                  </div>
                  {b.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono text-[11px]">{b.phone}</span>
                    </div>
                  )}
                  {b.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-[11px]">{b.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => onOpenPage(b.url)}
                className="w-full mt-2 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-800 flex items-center justify-center gap-1.5 transition"
              >
                <span>Branch Contact Page</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
