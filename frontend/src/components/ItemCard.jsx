import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag, ChevronRight } from 'lucide-react';
import ItemStatusBadge from './ItemStatusBadge';

export default function ItemCard({ item }) {
  const fallbackImage = item.type === 'LOST'
    ? 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=400&q=80'
    : 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=80';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full">
      {/* Image Thumbnail */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
        <img
          src={item.imageUrl || fallbackImage}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = fallbackImage; }}
        />
        <div className="absolute top-3 left-3">
          <ItemStatusBadge type={item.type} status={item.status} />
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-0.5 rounded-md font-medium text-slate-700">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              {item.category}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {item.date}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 line-clamp-1 mb-1">
            {item.title}
          </h3>

          <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Card Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 truncate max-w-[60%]">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>

          <Link
            to={`/item/${item.id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-800 transition-colors"
          >
            <span>View Details</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
