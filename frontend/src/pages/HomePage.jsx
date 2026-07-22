import React, { useState, useEffect } from 'react';
import { itemApi } from '../api/itemApi';
import ItemCard from '../components/ItemCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import { Sparkles, PackageSearch } from 'lucide-react';

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    status: '',
    location: ''
  });

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const queryFilters = {
        ...filters,
        search: searchTerm
      };
      const response = await itemApi.getAllItems(queryFilters);
      if (response && response.data) {
        setItems(response.data);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error("Error fetching items:", err);
      setError("Failed to connect to backend server. Make sure Spring Boot backend is running.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchItems();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, filters]);

  const resetFilters = () => {
    setSearchTerm('');
    setFilters({
      type: '',
      category: '',
      status: '',
      location: ''
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Prominent Banner showcasing Logo & Tagline */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-400/30">
            <Sparkles className="w-3.5 h-3.5" /> Community Lost & Found Platform
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Connecting Owners & Finders Instantly
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Report lost belongings, search community posts, and connect directly with finders to reunite items.
          </p>
        </div>

        {/* Large Brand Showcase Logo */}
        <div className="relative z-10 shrink-0 w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-white p-3 shadow-2xl border-2 border-sky-400/30 flex items-center justify-center hover:scale-105 transition-transform">
          <img src="/logo.png" alt="FindIt Brand Logo" className="w-full h-full object-contain" />
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="space-y-4">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <FilterBar filters={filters} setFilters={setFilters} resetFilters={resetFilters} />
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">
          Community Feed ({items.length})
        </h3>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-16 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-slate-500">Loading community posts...</p>
        </div>
      )}

      {/* Error Message Banner */}
      {error && !loading && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center text-rose-700 space-y-2">
          <p className="font-semibold">{error}</p>
          <button
            onClick={fetchItems}
            className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && items.length === 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
            <PackageSearch className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900">No items found</h4>
            <p className="text-sm text-slate-500 mt-1">
              Try adjusting your search keyword or clearing active filters.
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Items Feed Grid */}
      {!loading && !error && items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}

    </div>
  );
}
