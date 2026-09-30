import React from 'react';
import { Link } from 'react-router-dom';
import {
  Radio,
  Zap,
  Cpu,
  CircuitBoard,
  Wifi,
  Network,
  Home,
  Factory,
  Activity,
  Sprout,
  Car,
  Watch,
  MapPin,
  BatteryCharging,
  Server,
  HardDrive,
  ShieldCheck,
  CloudRain,
  ArrowRight,
} from 'lucide-react';
import { Category } from '../../types';

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const getCategoryIcon = (iconName?: string) => {
    const props = { className: 'w-6 h-6 text-brand-600 dark:text-brand-400' };
    switch (iconName) {
      case 'Radio':
        return <Radio {...props} />;
      case 'Zap':
        return <Zap {...props} />;
      case 'Cpu':
        return <Cpu {...props} />;
      case 'CircuitBoard':
        return <CircuitBoard {...props} />;
      case 'Wifi':
        return <Wifi {...props} />;
      case 'Network':
        return <Network {...props} />;
      case 'Home':
        return <Home {...props} />;
      case 'Factory':
        return <Factory {...props} />;
      case 'Activity':
        return <Activity {...props} />;
      case 'Sprout':
        return <Sprout {...props} />;
      case 'Car':
        return <Car {...props} />;
      case 'Watch':
        return <Watch {...props} />;
      case 'MapPin':
        return <MapPin {...props} />;
      case 'BatteryCharging':
        return <BatteryCharging {...props} />;
      case 'Server':
        return <Server {...props} />;
      case 'HardDrive':
        return <HardDrive {...props} />;
      case 'ShieldCheck':
        return <ShieldCheck {...props} />;
      case 'CloudRain':
        return <CloudRain {...props} />;
      default:
        return <Cpu {...props} />;
    }
  };

  return (
    <Link
      to={`/categories/${category.slug}`}
      className="group relative flex flex-col p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-brand-500/60 dark:hover:border-brand-500/60 hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300"
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/80 border border-brand-100 dark:border-brand-900/60 flex items-center justify-center group-hover:scale-110 transition-transform">
          {getCategoryIcon(category.icon)}
        </div>

        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono">
          {category.deviceCount || 0} {category.deviceCount === 1 ? 'Device' : 'Devices'}
        </span>
      </div>

      <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-2">
        {category.name}
      </h3>

      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4 flex-1">
        {category.description}
      </p>

      <div className="flex items-center text-xs font-semibold text-brand-600 dark:text-brand-400 group-hover:translate-x-1 transition-transform">
        <span>Browse Category</span>
        <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
      </div>
    </Link>
  );
};
