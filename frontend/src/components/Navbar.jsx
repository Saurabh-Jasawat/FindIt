import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Bookmark, PlusCircle, Menu, X } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Prominent Brand Logo & Tagline */}
        <Link to="/" className="flex items-center gap-3.5 group">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden shadow-md border border-slate-200/80 bg-white flex items-center justify-center p-1 group-hover:scale-105 transition-all">
            <img src="/logo.png" alt="FindIt Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="font-black text-xl sm:text-2xl text-slate-900 tracking-tight leading-none group-hover:text-sky-600 transition-colors">
              FindIt
            </h1>
            <p className="text-xs font-bold text-slate-500 mt-1">
              From Lost to Found
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-3">
          <Link
            to="/"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
              isActive('/') 
                ? 'bg-sky-50 text-sky-700 shadow-sm' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Compass className="w-4.5 h-4.5" />
            <span>Feed</span>
          </Link>

          <Link
            to="/my-posts"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
              isActive('/my-posts') 
                ? 'bg-sky-50 text-sky-700 shadow-sm' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Bookmark className="w-4.5 h-4.5" />
            <span>My Posts</span>
          </Link>

          <Link
            to="/report"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-extrabold shadow-md hover:bg-sky-700 active:scale-95 transition-all"
          >
            <PlusCircle className="w-4.5 h-4.5" />
            <span>+ Report Item</span>
          </Link>
        </nav>

        {/* Mobile Hamburger Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            to="/report"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-600 text-white text-xs font-bold shadow"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Report</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold ${
              isActive('/') ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span>Community Feed</span>
          </Link>

          <Link
            to="/my-posts"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold ${
              isActive('/my-posts') ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Bookmark className="w-5 h-5" />
            <span>My Posts</span>
          </Link>

          <Link
            to="/report"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-sky-600 text-white shadow"
          >
            <PlusCircle className="w-5 h-5" />
            <span>+ Report Item</span>
          </Link>
        </div>
      )}
    </header>
  );
}
