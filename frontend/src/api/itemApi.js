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
  }
};
