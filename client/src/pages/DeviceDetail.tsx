import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Bookmark,
  Share2,
  ChevronLeft,
  Zap,
  Radio,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Code,
  Copy,
  Check,
  Eye,
  GitBranch,
} from 'lucide-react';
import { deviceService } from '../services/deviceService';
import { userService } from '../services/userService';
import { Device, Category } from '../types';
import { DeviceSymbol } from '../components/device/DeviceSymbol';
import { PinoutTable } from '../components/device/PinoutTable';
import { SpecificationTable } from '../components/device/SpecificationTable';
import { WorkingPrincipleFlow } from '../components/device/WorkingPrincipleFlow';
import { ConnectionDiagramView } from '../components/device/ConnectionDiagramView';
import { DeviceCard } from '../components/device/DeviceCard';
import { useAuth } from '../context/AuthContext';

export const DeviceDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [device, setDevice] = useState<Device | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedSnippetIndex, setCopiedSnippetIndex] = useState<number | null>(null);
  const [shareSuccess, setShareSuccess] = useState(false);
  const { isAuthenticated, refreshUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDevice = async () => {
      if (!slug) return;
      setIsLoading(true);
      try {
        const data = await deviceService.getDeviceBySlug(slug);
        setDevice(data);

        // Dynamic SEO document title (Section 29)
        document.title = `${data.name} — Working, Pin Configuration, Applications & IoT Projects`;

        // If authenticated, record in recently viewed
        if (isAuthenticated) {
          userService.recordRecentlyViewed(data._id).catch(() => {});
          const bookmarks = await userService.getBookmarks();
          setIsBookmarked(bookmarks.some((b) => b._id === data._id));
        }
      } catch (err) {
        console.error('Failed to load device details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDevice();
  }, [slug, isAuthenticated]);

  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!device) return;

    const newStatus = !isBookmarked;
    setIsBookmarked(newStatus);

    try {
      if (newStatus) {
        await userService.addBookmark(device._id);
      } else {
        await userService.removeBookmark(device._id);
      }
      await refreshUser();
    } catch {
      setIsBookmarked(!newStatus);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: device?.name,
          text: device?.shortDescription,
          url: window.location.href,
        });
        return;
      } catch (e) {
        // Fallback to clipboard
      }
    }
    navigator.clipboard.writeText(window.location.href);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2000);
  };

  const copyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippetIndex(idx);
    setTimeout(() => setCopiedSnippetIndex(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
        <p className="text-sm text-slate-500">Loading technical device specifications...</p>
      </div>
    );
  }

  if (!device) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <h2 className="text-xl font-bold mb-2">Device Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">The requested IoT device reference could not be found.</p>
        <Link to="/devices" className="text-brand-600 font-semibold hover:underline">
          Return to Devices Catalog
        </Link>
      </div>
    );
  }

  const category = typeof device.category === 'object' && device.category !== null ? (device.category as Category) : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Back button */}
      <div>
        <Link
          to="/devices"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Hardware Catalog</span>
        </Link>
      </div>

      {/* 1. DEVICE HEADER */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
          <div className="flex items-start gap-4">
            <DeviceSymbol symbolCode={device.symbol} size="lg" />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {category && (
                  <Link
                    to={`/categories/${category.slug}`}
                    className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    {category.name}
                  </Link>
                )}
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {device.difficultyLevel} Level
                </span>
                {device.manufacturer && (
                  <>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-xs text-slate-500 font-mono">
                      Mfr: {device.manufacturer}
                    </span>
                  </>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
                {device.name}
              </h1>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <button
              onClick={handleBookmarkToggle}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all shadow-sm ${
                isBookmarked
                  ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400'
                  : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-all shadow-sm"
            >
              {shareSuccess ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              <span>{shareSuccess ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Short description */}
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
          {device.shortDescription}
        </p>
      </div>

      {/* 2. QUICK INFORMATION CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Communication
          </span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {device.communicationProtocols?.join(', ') || 'Direct Digital/Analog'}
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Typical Voltage
          </span>
          <span className="font-semibold text-amber-600 dark:text-amber-400">
            {device.voltage || '3.3V – 5V DC'}
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Current Draw
          </span>
          <span className="font-semibold text-cyan-600 dark:text-cyan-400">
            {device.current || 'Varies with load'}
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Operating Range
          </span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            {device.operatingRange || '-40°C to +85°C'}
          </span>
        </div>
      </div>

      {/* 3. WHAT IS IT? */}
      <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span>What is it?</span>
        </h2>
        <div className="prose prose-slate dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>{device.detailedDescription}</p>
        </div>
      </section>

      {/* 4. HOW DOES IT WORK? (Working Principle + Signal Flow) */}
      <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          How Does It Work?
        </h2>
        <WorkingPrincipleFlow
          principleText={device.workingPrinciple}
          steps={device.workingPrincipleFlow}
        />
      </section>

      {/* 5. PIN CONFIGURATION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Pin Configuration & Header Layout
          </h2>
          <span className="text-xs font-mono text-slate-500">
            {device.pinConfiguration?.length || 0} Pins Defined
          </span>
        </div>
        <PinoutTable pins={device.pinConfiguration} />
      </section>

      {/* 6. HOW TO USE & STEP-BY-STEP INSTRUCTIONS */}
      {device.howToUse && device.howToUse.length > 0 && (
        <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            How to Use (Step-by-Step)
          </h2>
          <ol className="space-y-4">
            {device.howToUse.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3.5">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs font-mono mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* 7. CONNECTION DIAGRAM & WIRING */}
      {device.connectionDiagram && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Connection Diagram & Breadboard Wiring
          </h2>
          <ConnectionDiagramView diagram={device.connectionDiagram} />
        </section>
      )}

      {/* 8. SPECIFICATIONS TABLE */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Technical Specifications
          </h2>
          {device.datasheetUrl && (
            <a
              href={device.datasheetUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              <span>Official Datasheet</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
        <SpecificationTable specifications={device.specifications} />
      </section>

      {/* 9. ADVANTAGES & LIMITATIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Advantages */}
        <div className="p-6 rounded-3xl border border-emerald-200/80 dark:border-emerald-950/80 bg-emerald-50/40 dark:bg-emerald-950/20">
          <h3 className="text-base font-bold text-emerald-800 dark:text-emerald-300 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>Key Advantages</span>
          </h3>
          <ul className="space-y-2.5">
            {device.advantages?.map((adv, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <span className="text-emerald-500 font-bold">•</span>
                <span>{adv}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Limitations */}
        <div className="p-6 rounded-3xl border border-rose-200/80 dark:border-rose-950/80 bg-rose-50/40 dark:bg-rose-950/20">
          <h3 className="text-base font-bold text-rose-800 dark:text-rose-300 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <span>Limitations & Considerations</span>
          </h3>
          <ul className="space-y-2.5">
            {device.limitations?.map((lim, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <span className="text-rose-500 font-bold">•</span>
                <span>{lim}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 10. REAL-WORLD APPLICATIONS */}
      {device.applications && device.applications.length > 0 && (
        <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            Real-World IoT Applications
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {device.applications.map((app, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/60"
              >
                <div className="w-7 h-7 rounded-lg bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
                  {app}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 11. EXAMPLE PROJECTS */}
      {device.exampleProjects && device.exampleProjects.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Example Projects & Firmware Code
          </h2>
          <div className="space-y-6">
            {device.exampleProjects.map((proj, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800 mr-2 font-mono">
                      {proj.difficulty}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white inline">
                      {proj.title}
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {proj.description}
                </p>

                {/* Components Needed */}
                {proj.componentsNeeded && proj.componentsNeeded.length > 0 && (
                  <div className="pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Required Components:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {proj.componentsNeeded.map((comp, cIdx) => (
                        <span
                          key={cIdx}
                          className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono"
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Code Snippet */}
                {proj.codeSnippet && (
                  <div className="mt-4 pt-2">
                    <div className="flex items-center justify-between px-4 py-2 rounded-t-xl bg-slate-850 text-slate-300 text-xs font-mono border-t border-x border-slate-700">
                      <span className="flex items-center gap-1.5">
                        <Code className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Firmware Sketch (.ino / .cpp)</span>
                      </span>
                      <button
                        onClick={() => copyCode(proj.codeSnippet!, idx)}
                        className="flex items-center gap-1 hover:text-white transition-colors"
                      >
                        {copiedSnippetIndex === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-4 rounded-b-xl bg-slate-950 text-slate-100 text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
                      <code>{proj.codeSnippet}</code>
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 12. RELATED DEVICES */}
      {device.relatedDevices && device.relatedDevices.length > 0 && (
        <section className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Related IoT Hardware
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {device.relatedDevices.map((relDevice) => (
              <DeviceCard key={relDevice._id} device={relDevice} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
