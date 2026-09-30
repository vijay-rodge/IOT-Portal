import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  Cpu,
  Layers,
  Sparkles,
  BookOpen,
  Shield,
  Zap,
  Radio,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Device, Category } from '../types';
import { deviceService } from '../services/deviceService';
import { categoryService } from '../services/categoryService';
import { DeviceCard } from '../components/device/DeviceCard';
import { CategoryCard } from '../components/category/CategoryCard';

export const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredDevices, setFeaturedDevices] = useState<Device[]>([]);
  const [popularCategories, setPopularCategories] = useState<Category[]>([]);
  const [recentDevices, setRecentDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [featured, cats, recent] = await Promise.all([
          deviceService.getFeaturedDevices(),
          categoryService.getAllCategories(),
          deviceService.getDevices({ limit: 4, sort: 'newest' }),
        ]);

        setFeaturedDevices(featured);
        // Pick top 6 categories with most devices or highest priority
        setPopularCategories(cats.slice(0, 6));
        setRecentDevices(recent.devices);
      } catch (error) {
        console.error('Failed to load home page content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const learningPaths = [
    {
      title: 'Precision Agriculture with IoT',
      description: 'Master capacitive soil probes, solar energy harvesters, automated drip relays, and LoRa long-range telemetry nodes.',
      icon: 'Sprout',
      filter: '/devices?application=Agriculture',
      tag: '5 Devices',
    },
    {
      title: 'Smart Home & Automated Environmental Control',
      description: 'Learn dual-core ESP32 microcontrollers, optocoupled relays, BME280 climate sensors, and MQTT cloud publishing.',
      icon: 'Home',
      filter: '/devices?application=Home',
      tag: '8 Devices',
    },
    {
      title: 'Robotics, Steppers & Motion Tracking',
      description: 'Understand 6-DoF MPU-6050 IMUs, geared unipolar stepper motors, PWM servo control, and ultrasonic Time-of-Flight navigation.',
      icon: 'Zap',
      filter: '/devices?category=actuators',
      tag: '6 Devices',
    },
    {
      title: 'Industrial Fieldbus & Edge Gateways',
      description: 'Bridge legacy Modbus RTU RS-485 serial loops to Ethernet SCADA, secure MQTT brokers, and single-board Linux computers.',
      icon: 'Factory',
      filter: '/devices?category=iot-gateways',
      tag: '4 Devices',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-brand-50/40 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
        {/* Subtle grid background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Educational & Technical Reference</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
            Explore the World of{' '}
            <span className="bg-gradient-to-r from-brand-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
              IoT Hardware
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
            Learn how IoT devices work, where they are used, and how to build with them. Comprehensive pinouts, working principles, connection diagrams, and verified electrical specifications.
          </p>

          {/* Search Bar Form */}
          <form
            onSubmit={handleHeroSearch}
            className="max-w-2xl mx-auto mb-8 relative flex items-center shadow-lg shadow-brand-500/10 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
          >
            <Search className="w-5 h-5 absolute left-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search IoT devices, sensors, microcontrollers (e.g. ESP32, DHT22, I2C, LoRa)..."
              className="w-full pl-12 pr-32 py-4 text-sm sm:text-base text-slate-900 dark:text-white bg-transparent focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-md shadow-brand-600/20"
            >
              Search
            </button>
          </form>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/devices"
              className="px-6 py-3 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-semibold text-sm hover:opacity-90 transition-all flex items-center gap-2 shadow-md"
            >
              <span>Explore All Devices</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/categories"
              className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              Browse 18 Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
              Popular Categories
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Browse devices classified by hardware taxonomy and operational role.
            </p>
          </div>
          <Link
            to="/categories"
            className="text-xs sm:text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1.5"
          >
            <span>View All 18 Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularCategories.map((cat) => (
            <CategoryCard key={cat._id} category={cat} />
          ))}
        </div>
      </section>

      {/* Featured Devices */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-1">
              <Zap className="w-4 h-4" /> Curated Reference
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Featured IoT Hardware
            </h2>
          </div>
          <Link
            to="/devices"
            className="text-xs sm:text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1.5"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDevices.map((device) => (
              <DeviceCard key={device._id} device={device} />
            ))}
          </div>
        )}
      </section>

      {/* Learning Paths */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mb-10 relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-800 mb-3 inline-block">
              Structured Curriculum
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-white">
              Hands-on Learning Paths
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Explore step-by-step component collections structured around real-world domain engineering challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {learningPaths.map((path, idx) => (
              <Link
                key={idx}
                to={path.filter}
                className="group p-6 rounded-2xl border border-slate-800 bg-slate-850/80 hover:bg-slate-800/90 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                      {path.tag}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="font-bold text-lg text-white group-hover:text-cyan-300 transition-colors mb-2">
                    {path.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {path.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Use IoT Knowledge Portal */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
            Why Use IoT Knowledge Portal?
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Engineered specifically for engineering students, hardware developers, and IoT architects who need verified, practical hardware specs without marketing fluff.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
              Verified Technical Standards
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every pinout, voltage rail, and operating limit is cross-checked against official silicon datasheets. Version variances are clearly noted.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
              Signal & Physical Flow Diagrams
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Understand the complete transducer physics from physical stimulus through internal ADCs to host microcontroller communication.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
              Ready-to-Use Code Snippets
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Each device includes beginner to advanced example projects with copyable C++/Python firmware snippets and full wiring steps.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
