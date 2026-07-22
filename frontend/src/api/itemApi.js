import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/items';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 3000, // 3s timeout before fallback to sample community feed
});

// Sample Community Feed Items for instant visual demonstration
const SAMPLE_ITEMS = [
  {
    id: 1,
    type: 'LOST',
    title: 'Black Leather Wallet with Student ID',
    description: 'Lost near the Central Library 2nd floor reading area around 2 PM. Contains college ID card, driving license, and some cash. If found, please contact immediately!',
    category: 'WALLET',
    location: 'Central Library 2nd Floor',
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
    date: '2026-07-21',
    status: 'ACTIVE',
    contactName: 'Rahul Sharma',
    contactPhone: '9876543210',
    createdAt: '2026-07-21T10:30:00'
  },
  {
    id: 2,
    type: 'FOUND',
    title: 'Boat Airdopes 141 Wireless Earbuds (Black)',
    description: 'Found a pair of black Boat wireless earbuds in a charging case on a table near CSE Block Cafeteria. Case has a small dragon sticker.',
    category: 'ELECTRONICS',
    location: 'CSE Block Cafeteria',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    date: '2026-07-20',
    status: 'ACTIVE',
    contactName: 'Priya Verma',
    contactPhone: '9123456789',
    createdAt: '2026-07-20T14:15:00'
  },
  {
    id: 3,
    type: 'FOUND',
    title: 'Casio Scientific Calculator FX-991EX',
    description: 'Found after Mathematics lecture in Lab 304. Name tag on back is scratched. Claim by verifying details.',
    category: 'ELECTRONICS',
    location: 'Academic Block Lab 304',
    imageUrl: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=600&q=80',
    date: '2026-07-19',
    status: 'RETURNED',
    contactName: 'Aman Gupta',
    contactPhone: '9988776655',
    createdAt: '2026-07-19T11:00:00'
  },
  {
    id: 4,
    type: 'LOST',
    title: 'College ID Card - Computer Science Dept',
    description: 'Lost my college ID card somewhere between the main gate and Parking Area B. Roll number starts with 21CS.',
    category: 'ID_CARD',
    location: 'Main Gate to Parking Area B',
    imageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80',
    date: '2026-07-21',
    status: 'ACTIVE',
    contactName: 'Sneha Patel',
    contactPhone: '9765432109',
    createdAt: '2026-07-21T09:00:00'
  }
];

let localItemsStore = [...SAMPLE_ITEMS];

export const itemApi = {
  getAllItems: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.type) params.append('type', filters.type);
      if (filters.category) params.append('category', filters.category);
      if (filters.location) params.append('location', filters.location);
      if (filters.status) params.append('status', filters.status);

      const response = await api.get(`?${params.toString()}`);
      if (response.data && response.data.data) {
        return response.data;
      }
    } catch (err) {
      console.warn("Backend API offline/connecting. Using active demo community feed data.");
    }

    // Client-side filtering on demo store if backend is initializing
    let filtered = [...localItemsStore];

    if (filters.type) {
      filtered = filtered.filter(i => i.type === filters.type);
    }
    if (filters.category) {
      filtered = filtered.filter(i => i.category === filters.category);
    }
    if (filters.status) {
      filtered = filtered.filter(i => i.status === filters.status);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(i => 
        i.title.toLowerCase().includes(q) || 
        i.description.toLowerCase().includes(q) || 
        i.location.toLowerCase().includes(q)
      );
    }

    return {
      success: true,
      message: "Items retrieved successfully (Demo Mode)",
      data: filtered,
      timestamp: new Date().toISOString()
    };
  },

  getItemById: async (id) => {
    try {
      const response = await api.get(`/${id}`);
      if (response.data && response.data.data) {
        return response.data;
      }
    } catch (err) {
      console.warn("Backend API offline. Fetching from demo store.");
    }

    const item = localItemsStore.find(i => String(i.id) === String(id));
    if (item) {
      return { success: true, message: "Item details", data: item };
    }
    throw new Error("Item not found");
  },

  createItem: async (itemData) => {
    try {
      const response = await api.post('', itemData);
      if (response.data && response.data.data) {
        return response.data;
      }
    } catch (err) {
      console.warn("Backend API offline. Adding to demo store.");
    }

    const newItem = {
      id: Date.now(),
      ...itemData,
      status: itemData.status || 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    localItemsStore.unshift(newItem);
    return { success: true, message: "Item report created", data: newItem };
  },

  updateItem: async (id, itemData) => {
    try {
      const response = await api.put(`/${id}`, itemData);
      if (response.data && response.data.data) {
        return response.data;
      }
    } catch (err) {
      console.warn("Backend API offline. Updating demo store.");
    }

    const index = localItemsStore.findIndex(i => String(i.id) === String(id));
    if (index !== -1) {
      localItemsStore[index] = { ...localItemsStore[index], ...itemData, updatedAt: new Date().toISOString() };
      return { success: true, message: "Item updated", data: localItemsStore[index] };
    }
    throw new Error("Item not found");
  },

  updateStatus: async (id, status) => {
    try {
      const response = await api.patch(`/${id}/status?status=${status}`);
      if (response.data && response.data.data) {
        return response.data;
      }
    } catch (err) {
      console.warn("Backend API offline. Updating status in demo store.");
    }

    const index = localItemsStore.findIndex(i => String(i.id) === String(id));
    if (index !== -1) {
      localItemsStore[index].status = status;
      localItemsStore[index].updatedAt = new Date().toISOString();
      return { success: true, message: "Item status updated", data: localItemsStore[index] };
    }
    throw new Error("Item not found");
  },

  deleteItem: async (id) => {
    try {
      await api.delete(`/${id}`);
      return;
    } catch (err) {
      console.warn("Backend API offline. Deleting from demo store.");
    }

    localItemsStore = localItemsStore.filter(i => String(i.id) !== String(id));
    return;
  },

  // POST /api/ai/generate-description
  generateDescription: async (title, category, location) => {
    try {
      const response = await axios.post('http://localhost:8080/api/ai/generate-description', {
        title,
        category,
        location
      });
      if (response.data && response.data.data) {
        return response.data;
      }
    } catch (err) {
      console.warn("Backend AI API offline. Serving simulated client-side AI response.");
    }
    
    // Smart offline mock description generator
    const capitalizedTitle = title.charAt(0).toUpperCase() + title.slice(1);
    const mockDesc = `A ${title.toLowerCase()} was reported lost or found near ${location}. It belongs to the category ${category.toLowerCase()}. If you have any information or believe this belongs to you, please get in touch with the reporter.`;
    return {
      success: true,
      message: "Description generated successfully (Demo Mode)",
      data: {
        description: mockDesc
      }
    };
  },

  // POST /api/ai/suggest-category
  suggestCategory: async (title) => {
    try {
      const response = await axios.post('http://localhost:8080/api/ai/suggest-category', { title });
      if (response.data && response.data.data) {
        return response.data;
      }
    } catch (err) {
      console.warn("Backend AI API offline. Serving simulated category matching.");
    }

    // Smart offline heuristic category matcher
    const normalizedTitle = title.toLowerCase();
    let suggested = "OTHER";
    
    if (/\b(phone|samsung|iphone|oneplus|pixel|mobile|nokia|motorola|realme)\b/.test(normalizedTitle)) {
      suggested = "MOBILE";
    } else if (/\b(wallet|purse|cardholder|billfold)\b/.test(normalizedTitle)) {
      suggested = "WALLET";
    } else if (/\b(key|keychain|keys)\b/.test(normalizedTitle)) {
      suggested = "KEYS";
    } else if (/\b(book|document|paper|certificate|marksheet|degree|diary)\b/.test(normalizedTitle)) {
      suggested = "DOCUMENT";
    } else if (/\b(id|card|licence|license|aadhaar|pan|voter|metro)\b/.test(normalizedTitle)) {
      suggested = "ID_CARD";
    } else if (/\b(bag|backpack|suitcase|luggage|sack)\b/.test(normalizedTitle)) {
      suggested = "BAG";
    } else if (/\b(laptop|earbuds|pods|charger|watch|headphone|earphone|tablet|ipad|kindle|macbook)\b/.test(normalizedTitle)) {
      suggested = "ELECTRONICS";
    }

    return {
      success: true,
      message: "Category suggested successfully (Demo Mode)",
      data: { suggestedCategory: suggested }
    };
  },

  // POST /api/ai/validate
  validateContent: async (title, description) => {
    try {
      const response = await axios.post('http://localhost:8080/api/ai/validate', { title, description });
      if (response.data && response.data.data) {
        return response.data;
      }
    } catch (err) {
      console.warn("Backend AI API offline. Serving simulated content validation.");
    }

    // Smart offline validation checks
    const normTitle = title.toLowerCase();
    const normDesc = description.toLowerCase();
    
    if (/\b(helicopter|spaceship|submarine|dinosaur|rocket|aircraft)\b/.test(normTitle)) {
      return {
        success: true,
        data: {
          status: "WARNING",
          warnings: ["This report appears unrealistic. Please review before submitting."]
        }
      };
    }

    if (description.length < 15 || normDesc === "lost phone" || normDesc === "found keys") {
      return {
        success: true,
        data: {
          status: "WARNING",
          warnings: ["Description is too vague. Please add identifying details (brand, color, markings)."]
        }
      };
    }

    if (/\b(asdf|qwer|zxcv|dfgh)\b/.test(normDesc)) {
      return {
        success: true,
        data: {
          status: "WARNING",
          warnings: ["Description is too vague."]
        }
      };
    }

    return {
      success: true,
      data: {
        status: "VALID",
        warnings: []
      }
    };
  }
};
