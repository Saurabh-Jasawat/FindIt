import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ReportItemPage from './pages/ReportItemPage';
import ItemDetailPage from './pages/ItemDetailPage';
import MyPostsPage from './pages/MyPostsPage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/report" element={<ReportItemPage />} />
            <Route path="/item/:id" element={<ItemDetailPage />} />
            <Route path="/my-posts" element={<MyPostsPage />} />
            <Route path="/edit/:id" element={<ReportItemPage />} />
          </Routes>
        </main>
        
        {/* Simple Clean Footer */}
        <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4">
            <p className="font-medium text-slate-700">FindIt – From Lost to Found</p>
            <p className="mt-1">Built with Java Spring Boot, MySQL & React. Community Lost & Found Platform.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}
