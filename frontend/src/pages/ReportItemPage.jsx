import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { itemApi } from '../api/itemApi';
import { PlusCircle, Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';

export default function ReportItemPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // If id exists, we are editing an existing post
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    type: 'LOST',
    title: '',
    description: '',
    category: 'MOBILE',
    location: '',
    imageUrl: '',
    date: new Date().toISOString().split('T')[0],
    contactName: '',
    contactPhone: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // If editing, load post details
  useEffect(() => {
    if (isEditing) {
      const loadPost = async () => {
        try {
          setLoading(true);
          const response = await itemApi.getItemById(id);
          if (response && response.data) {
            setFormData(response.data);
          }
        } catch (err) {
          setError("Failed to load post details for editing.");
        } finally {
          setLoading(false);
        }
      };
      loadPost();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [aiLoading, setAiLoading] = useState(false);
  const [suggestedCategory, setSuggestedCategory] = useState(null);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [validationLoading, setValidationLoading] = useState(false);

  const handleGenerateDescription = async () => {
    if (!formData.title || !formData.category || !formData.location) {
      setError("Please fill in Title, Category, and Location first to generate an AI description.");
      return;
    }
    setAiLoading(true);
    setError(null);
    try {
      const response = await itemApi.generateDescription(formData.title, formData.category, formData.location);
      if (response && response.data && response.data.description) {
        setFormData((prev) => ({ ...prev, description: response.data.description }));
      }
    } catch (err) {
      setError("Unable to generate description. Please enter it manually.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSuggestCategory = async () => {
    if (!formData.title) {
      setError("Please enter a Title first to suggest a category.");
      return;
    }
    setCategoryLoading(true);
    setSuggestedCategory(null);
    setError(null);
    try {
      const response = await itemApi.suggestCategory(formData.title);
      if (response && response.data && response.data.suggestedCategory) {
        setSuggestedCategory(response.data.suggestedCategory);
      }
    } catch (err) {
      console.error("Category suggestion error:", err);
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleValidateContent = async () => {
    if (!formData.title || !formData.description) {
      setError("Please fill in Title and Description first to validate content.");
      return;
    }
    setValidationLoading(true);
    setValidationResult(null);
    setError(null);
    try {
      const response = await itemApi.validateContent(formData.title, formData.description);
      if (response && response.data) {
        setValidationResult(response.data);
      }
    } catch (err) {
      console.error("Validation error:", err);
    } finally {
      setValidationLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate 10-digit phone number
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.contactPhone)) {
      setError("Please enter a valid 10-digit contact phone number.");
      setLoading(false);
      return;
    }

    try {
      if (isEditing) {
        await itemApi.updateItem(id, formData);
      } else {
        await itemApi.createItem(formData);
      }
      navigate('/my-posts');
    } catch (err) {
      console.error("Save error:", err);
      if (err.response && err.response.data && err.response.data.data) {
        const validationErrs = Object.values(err.response.data.data).join(", ");
        setError(`Validation Error: ${validationErrs}`);
      } else {
        setError(err.response?.data?.message || "Failed to save post. Check backend server connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      
      {/* Top Header */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 space-y-8">
        
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            {isEditing ? 'Edit Item Post' : 'Report an Item'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Fill out the details below to publish your report to the community feed.
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium p-4 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Post Type Selector (LOST vs FOUND) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              What are you reporting? *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, type: 'LOST' }))}
                className={`py-3 px-4 rounded-2xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  formData.type === 'LOST'
                    ? 'border-rose-600 bg-rose-50 text-rose-700 shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-rose-600"></span>
                🔴 Lost Item
              </button>

              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, type: 'FOUND' }))}
                className={`py-3 px-4 rounded-2xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  formData.type === 'FOUND'
                    ? 'border-sky-600 bg-sky-50 text-sky-700 shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-sky-600"></span>
                🟢 Found Item
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Item Title *
              </label>
              <button
                type="button"
                onClick={handleSuggestCategory}
                disabled={categoryLoading}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-[11px] font-bold transition-all disabled:opacity-50"
              >
                {categoryLoading ? "Suggesting..." : "✨ Suggest Category (AI)"}
              </button>
            </div>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Black Leather Wallet, Boat Airdopes 141, College ID Card"
              required
              minLength={3}
              maxLength={100}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Category & Location Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="MOBILE">📱 Mobile</option>
                <option value="WALLET">👛 Wallet</option>
                <option value="KEYS">🔑 Keys</option>
                <option value="DOCUMENT">📄 Document</option>
                <option value="ID_CARD">🪪 ID Card</option>
                <option value="BAG">🎒 Bag</option>
                <option value="ELECTRONICS">💻 Electronics</option>
                <option value="OTHER">📦 Other</option>
              </select>
              {suggestedCategory && (
                <div className="mt-2 p-2.5 bg-indigo-50 border border-indigo-150 rounded-xl text-xs font-bold text-indigo-700 flex items-center justify-between">
                  <span>💡 AI Suggestion: {suggestedCategory}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, category: suggestedCategory }));
                      setSuggestedCategory(null);
                    }}
                    className="px-2 py-0.5 bg-indigo-600 text-white rounded text-[10px] uppercase font-bold hover:bg-indigo-700"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Central Library 2nd Floor, CSE Block, Cafeteria"
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Date & Image URL Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Image URL (Optional)
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/item-photo.jpg"
                maxLength={500}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Full Description *
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleValidateContent}
                  disabled={validationLoading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold transition-all disabled:opacity-50"
                >
                  {validationLoading ? "Validating..." : "🛡 Validate (AI)"}
                </button>
                <button
                  type="button"
                  onClick={handleGenerateDescription}
                  disabled={aiLoading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold transition-all disabled:opacity-50"
                >
                  {aiLoading ? (
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></span>
                      Generating...
                    </span>
                  ) : (
                    <span>✨ Generate (AI)</span>
                  )}
                </button>
              </div>
            </div>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide identifiable details (e.g. brand, color, specific marks, contents) to help ownership verification..."
              required
              maxLength={1000}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
            ></textarea>

            {/* Validation Feedback */}
            {validationResult && (
              <div className={`mt-3 p-3.5 rounded-2xl border text-xs font-medium space-y-1.5 ${
                validationResult.status === 'VALID'
                  ? 'bg-emerald-50 border-emerald-250 text-emerald-800'
                  : 'bg-rose-50 border-rose-250 text-rose-850'
              }`}>
                <div className="font-bold flex items-center gap-1.5">
                  {validationResult.status === 'VALID' ? '✅ AI Content Validation Passed' : '⚠️ AI Content Validation warning'}
                </div>
                {validationResult.status === 'VALID' ? (
                  <p>Description looks realistic and descriptive. Ready to publish!</p>
                ) : (
                  <ul className="list-disc list-inside space-y-1">
                    {validationResult.warnings.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                )}
                <p className="text-[10px] opacity-75 font-semibold mt-1">
                  * AI-generated suggestion. Please review before submitting.
                </p>
              </div>
            )}
          </div>

          {/* Contact Person Details */}
          <div className="border-t border-slate-200 pt-6 space-y-4">
            <h4 className="text-sm font-bold text-slate-900">Poster Contact Details</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  10-Digit Phone Number *
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  required
                  pattern="[0-9]{10}"
                  maxLength={10}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-sky-600 hover:bg-sky-700 text-white font-bold text-base rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>{isEditing ? 'Update Post' : 'Submit Report'}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
