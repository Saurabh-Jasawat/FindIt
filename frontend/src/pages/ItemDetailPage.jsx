import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { itemApi } from '../api/itemApi';
import ItemStatusBadge from '../components/ItemStatusBadge';
import { MapPin, Calendar, Tag, Phone, User, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        setLoading(true);
        const response = await itemApi.getItemById(id);
        if (response && response.data) {
          setItem(response.data);
        }
      } catch (err) {
        console.error("Error fetching item detail:", err);
        setError("Item post not found or server error.");
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [id]);

  const fallbackImage = item?.type === 'LOST'
    ? 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80'
    : 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80';

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-medium text-slate-500">Loading post details...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-6 rounded-2xl">
          <p className="font-semibold">{error || "Item not found"}</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
        >
          Return to Feed
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Feed</span>
      </button>

      {/* Main Card Detail Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        
        {/* Large Image Header */}
        <div className="relative h-72 sm:h-96 w-full bg-slate-900 overflow-hidden">
          <img
            src={item.imageUrl || fallbackImage}
            alt={item.title}
            className="w-full h-full object-cover opacity-95"
            onError={(e) => { e.target.src = fallbackImage; }}
          />
          <div className="absolute top-4 left-4">
            <ItemStatusBadge type={item.type} status={item.status} />
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 sm:p-10 space-y-8">
          
          <div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-3">
              <span className="inline-flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-lg font-semibold text-slate-700">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                {item.category}
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-lg font-semibold text-slate-700">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Reported Date: {item.date}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {item.title}
            </h1>

            <div className="flex items-center gap-2 mt-2 text-sm font-medium text-slate-600">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Location: <strong>{item.location}</strong></span>
            </div>
          </div>

          {/* Full Description */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Description
            </h3>
            <p className="text-slate-800 leading-relaxed text-sm sm:text-base whitespace-pre-line">
              {item.description}
            </p>
          </div>

          {/* Poster Contact Details Box */}
          <div className="bg-sky-50 border border-sky-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sky-900 font-bold text-lg">
                <User className="w-5 h-5 text-sky-600" />
                <span>Contact Poster: {item.contactName}</span>
              </div>
              <p className="text-xs text-sky-700 font-medium">
                Connect directly with the poster to verify ownership and arrange item return.
              </p>
            </div>

            <a
              href={`tel:${item.contactPhone}`}
              className="w-full sm:w-auto px-6 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Call {item.contactPhone}</span>
            </a>
          </div>

        </div>

      </div>

    </div>
  );
}
