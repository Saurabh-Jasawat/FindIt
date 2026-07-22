import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { itemApi } from '../api/itemApi';
import ItemStatusBadge from '../components/ItemStatusBadge';
import { Edit3, Trash2, CheckCircle, PlusCircle, Bookmark } from 'lucide-react';

export default function MyPostsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await itemApi.getAllItems();
      if (response && response.data) {
        setItems(response.data);
      }
    } catch (err) {
      setError("Failed to load your posts from backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  // Toggle status between ACTIVE and RETURNED
  const handleToggleStatus = async (item) => {
    const newStatus = item.status === 'RETURNED' ? 'ACTIVE' : 'RETURNED';
    try {
      await itemApi.updateStatus(item.id, newStatus);
      fetchMyPosts(); // Refresh list
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  // Delete post
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      try {
        await itemApi.deleteItem(id);
        fetchMyPosts(); // Refresh list
      } catch (err) {
        alert("Failed to delete post.");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-sky-600 font-bold text-sm mb-1">
            <Bookmark className="w-4 h-4" />
            <span>My Post Management</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Manage Reported Items
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Edit details, remove posts, or mark items as 🟢 Returned once reunited with the owner.
          </p>
        </div>

        <Link
          to="/report"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow transition-colors w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Report New Item</span>
        </Link>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-16 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-slate-500">Loading your posts...</p>
        </div>
      )}

      {/* Error Banner */}
      {error && !loading && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-center font-semibold text-sm">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && items.length === 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <p className="text-slate-500 font-medium">You haven't reported any items yet.</p>
          <Link
            to="/report"
            className="inline-block px-5 py-2.5 bg-sky-600 text-white font-bold text-xs rounded-xl"
          >
            Create Your First Post
          </Link>
        </div>
      )}

      {/* Posts List */}
      {!loading && !error && items.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-300 transition-all"
            >
              {/* Post Details */}
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2">
                  <ItemStatusBadge type={item.type} status={item.status} />
                  <span className="text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                    {item.category}
                  </span>
                  <span className="text-xs text-slate-400">• {item.date}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-1">
                  {item.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                {/* Mark as Returned Toggle */}
                <button
                  onClick={() => handleToggleStatus(item)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    item.status === 'RETURNED'
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>
                    {item.status === 'RETURNED' ? 'Mark Active' : 'Mark as Returned'}
                  </span>
                </button>

                {/* Edit Button */}
                <Link
                  to={`/edit/${item.id}`}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  title="Edit Post"
                >
                  <Edit3 className="w-4 h-4" />
                </Link>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                  title="Delete Post"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
