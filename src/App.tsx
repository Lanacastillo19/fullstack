import { useState, useEffect } from 'react';
import AuthModal from './AuthModal';

interface Item {
  _id: string;
  name: string;
  category: string;
  status: string;
  description: string;
  createdAt?: string;
}

interface User {
  name?: string;
  email: string;
}

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'claimed' | 'submissions'>('dashboard');
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('General');
  const [description, setDescription] = useState('');

  // Fixed line for Vite env types
  const API_URL = (import.meta as any).env?.VITE_API_URL || 'https://gt-4-fullstack.vercel.app/api';

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/items`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setItems(data);
      }
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();

    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Failed to parse user session:', err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Improved Update Status Function
  const handleStatusChange = async (itemId: string, newStatus: string) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }

    // 1. Immediately update UI state
    setItems((prev) =>
      prev.map((item) => (item._id === itemId ? { ...item, status: newStatus } : item))
    );

    try {
      const token = localStorage.getItem('token');
      // Format capitalized string for backend compatibility (e.g. "claimed" -> "Claimed")
      const formattedStatus = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);

      const res = await fetch(`${API_URL}/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: formattedStatus }),
      });

      if (!res.ok) {
        // Fallback: try lowercase status if server requires lowercase
        await fetch(`${API_URL}/items/${itemId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ status: newStatus }),
        });
      }
    } catch (err) {
      console.error('Failed to update status on server:', err);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setIsAuthOpen(true);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: title,
          category,
          description: `${description} (Location: ${location})`,
          status: 'unclaimed',
        }),
      });

      if (res.ok) {
        setTitle('');
        setLocation('');
        setDescription('');
        fetchItems();
      }
    } catch (err) {
      console.error('Failed to report item:', err);
    }
  };

  // Case-Insensitive Filter for Claimed Items Count
  const claimedCount = items.filter(
    (i) => i.status && i.status.toLowerCase() === 'claimed'
  ).length;

  // Filter Items Based on Active Tab & Search Query
  const displayedItems = items.filter((item) => {
    const matchesSearch =
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'claimed') {
      return item.status && item.status.toLowerCase() === 'claimed';
    }

    return true;
  });

  const getStatusColor = (status: string = '') => {
    switch (status.toLowerCase()) {
      case 'claimed':
        return { bg: '#dcfce7', text: '#15803d' };
      case 'pending':
        return { bg: '#e0f2fe', text: '#0369a1' };
      case 'unclaimed':
      default:
        return { bg: '#fef3c7', text: '#d97706' };
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh', color: '#111827' }}>
      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ fontWeight: 'bold', fontSize: '20px' }}>Lost and Found</div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={() => setActiveTab('dashboard')}
            style={{
              backgroundColor: activeTab === 'dashboard' ? '#2563eb' : 'transparent',
              color: activeTab === 'dashboard' ? '#fff' : '#4b5563',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab('claimed')}
            style={{
              backgroundColor: activeTab === 'claimed' ? '#2563eb' : 'transparent',
              color: activeTab === 'claimed' ? '#fff' : '#4b5563',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Claimed Items ({claimedCount})
          </button>

          <button
            onClick={() => setActiveTab('submissions')}
            style={{
              backgroundColor: activeTab === 'submissions' ? '#2563eb' : 'transparent',
              color: activeTab === 'submissions' ? '#fff' : '#4b5563',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Submissions
          </button>

          {user ? (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginLeft: '8px' }}>
              <span style={{ fontWeight: '500' }}>Hi, {user.name || user.email}</span>
              <button onClick={handleLogout} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#dc2626', fontWeight: '500' }}>
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthOpen(true)}
              style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#374151', fontSize: '15px', fontWeight: '500', marginLeft: '8px' }}
            >
              Login
            </button>
          )}
        </div>

        <button style={{ backgroundColor: '#111827', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>
          Dark Mode
        </button>
      </nav>

      {/* Main Content Area */}
      <main style={{ maxWidth: '1000px', margin: '32px auto', padding: '0 16px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px', textTransform: 'capitalize' }}>
          {activeTab === 'dashboard' ? 'Dashboard' : activeTab === 'claimed' ? 'Claimed Items' : 'Submissions'}
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '16px' }}>Total Items: {displayedItems.length}</p>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '24px', outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box' }}
        />

        {/* Items Grid */}
        {loading ? (
          <p style={{ color: '#9ca3af', marginBottom: '24px' }}>Loading items...</p>
        ) : displayedItems.length === 0 ? (
          <p style={{ color: '#9ca3af', marginBottom: '24px' }}>No items found in this section.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            {displayedItems.map((item) => {
              const statusColor = getStatusColor(item.status);
              return (
                <div key={item._id} style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>{item.name}</h3>

                    {/* Interactive Status Selector */}
                    <select
                      value={(item.status || 'unclaimed').toLowerCase()}
                      onChange={(e) => handleStatusChange(item._id, e.target.value)}
                      style={{
                        fontSize: '12px',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        backgroundColor: statusColor.bg,
                        color: statusColor.text,
                        fontWeight: 'bold',
                        border: 'none',
                        cursor: 'pointer',
                        outline: 'none',
                      }}
                    >
                      <option value="unclaimed">unclaimed</option>
                      <option value="pending">pending</option>
                      <option value="claimed">claimed</option>
                    </select>
                  </div>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 8px 0' }}>Category: {item.category}</p>
                  <p style={{ fontSize: '14px', color: '#374151', margin: 0 }}>{item.description}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Report Form Container */}
        {activeTab !== 'claimed' && (
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Report Lost / Found Item</h2>

            <form onSubmit={handleReportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input
                type="text"
                placeholder="Item Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ padding: '12px', borderRadius: '6px', border: '1px solid #e5e7eb', outline: 'none' }}
                required
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <input
                  type="text"
                  placeholder="Location Found/Lost"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{ padding: '12px', borderRadius: '6px', border: '1px solid #e5e7eb', outline: 'none' }}
                  required
                />

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ padding: '12px', borderRadius: '6px', border: '1px solid #e5e7eb', outline: 'none' }}
                >
                  <option value="General">General</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Personal Items">Personal Items</option>
                  <option value="Clothing">Clothing</option>
                </select>
              </div>

              <textarea
                placeholder="Description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ padding: '12px', borderRadius: '6px', border: '1px solid #e5e7eb', outline: 'none', resize: 'vertical' }}
                required
              />

              <button
                type="submit"
                style={{ backgroundColor: '#2563eb', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', width: 'fit-content' }}
              >
                Report Item
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Auth Modal Component */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(userData: User) => setUser(userData)}
      />
    </div>
  );
}