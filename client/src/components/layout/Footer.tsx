import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Github, ExternalLink, Heart, Layers, Radio, Shield, BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">
                IoT Portal
              </span>
            </Link>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Open educational and reference platform providing comprehensive technical specifications, pinout tables, working principles, and connection schematics for modern IoT hardware.
            </p>
          </div>

          {/* Core Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Explore Hardware
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/categories/sensors" className="hover:text-brand-500 transition-colors">
                  Sensors & Detectors
                </Link>
              </li>
              <li>
                <Link to="/categories/actuators" className="hover:text-brand-500 transition-colors">
                  Motors & Actuators
                </Link>
              </li>
              <li>
                <Link to="/categories/microcontrollers" className="hover:text-brand-500 transition-colors">
                  Microcontrollers (MCU)
                </Link>
              </li>
              <li>
                <Link to="/categories/communication-modules" className="hover:text-brand-500 transition-colors">
                  Communication Modules
                </Link>
              </li>
              <li>
                <Link to="/categories/edge-computing-devices" className="hover:text-brand-500 transition-colors">
                  Edge AI & SBCs
                </Link>
              </li>
            </ul>
          </div>

          {/* Reference & Learning */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Technical Reference
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/devices?protocol=I2C" className="hover:text-brand-500 transition-colors">
                  I2C Bus Devices
                </Link>
              </li>
              <li>
                <Link to="/devices?protocol=SPI" className="hover:text-brand-500 transition-colors">
                  SPI Protocol Modules
                </Link>
              </li>
              <li>
                <Link to="/devices?protocol=LoRa" className="hover:text-brand-500 transition-colors">
                  LoRa Long-Range LPWAN
                </Link>
              </li>
              <li>
                <Link to="/devices?difficulty=Beginner" className="hover:text-brand-500 transition-colors">
                  Beginner Friendly Hardware
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-500 transition-colors">
                  About & Architecture
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Standards */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Standard Compliance
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
              All pinouts and voltages reflect manufacturer-verified specifications. Values with version variance are noted explicitly.
            </p>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <Shield className="w-3 h-3 text-brand-500" /> Open Reference
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <BookOpen className="w-3 h-3 text-cyan-500" /> Educational
              </span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} IoT Knowledge Portal. Engineered for developers, makers, and students.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-slate-700 dark:hover:text-slate-300">
              Terms & Privacy
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-300"
            >
              <Github className="w-3.5 h-3.5" /> Open Source
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
