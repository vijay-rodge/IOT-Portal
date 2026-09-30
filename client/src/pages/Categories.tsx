import React, { useState, useEffect } from 'react';
import { categoryService } from '../services/categoryService';
import { Category } from '../types';
import { CategoryCard } from '../components/category/CategoryCard';
import { Search, Layers } from 'lucide-react';

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCats();
  }, []);

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-1">
            <Layers className="w-4 h-4" /> Hardware Taxonomy
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            IoT Categories Directory
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Explore {categories.length} database-driven hardware categories across sensors, computing boards, protocols, and industrial gateways.
          </p>
        </div>

        {/* Category search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter categories..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-56 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat) => (
            <CategoryCard key={cat._id} category={cat} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 p-8 border border-dashed rounded-2xl border-slate-300 dark:border-slate-800">
          <p className="text-sm text-slate-500">No categories found matching "{search}".</p>
        </div>
      )}
    </div>
  );
};
