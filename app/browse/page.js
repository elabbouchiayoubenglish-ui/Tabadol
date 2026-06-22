'use client';
import { useEffect, useState } from 'react';
import { auth } from '../firebase'; 
export default function BrowseRequests() {
  const [requests, setRequests] = useState([]);
  const [user, setUser] = useState(null);
  const [filters, setFilters] = useState({ region: '', directorate: '', cycle: '', subject: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [statusMap, setStatusMap] = useState({});

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/save-request');
      const data = await res.json();
      const safeData = Array.isArray(data) ? data : [];
      const sorted = safeData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setRequests(sorted);
      const savedStatus = {};
      sorted.forEach((req) => { if (req.status) savedStatus[req.id] = req.status; });
      setStatusMap(savedStatus);
    } catch (err) { console.log("FETCH ERROR:", err); }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // دالة تحديث الحالة (المفقودة)
  const updateStatus = async (id, status) => {
    setStatusMap((prev) => ({ ...prev, [id]: status }));
    await fetch('/api/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    });
  };

  const deleteRequest = async (id) => {
    if (!confirm('هل تريد حذف هذا الطلب؟')) return;
    await fetch('/api/delete-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    setRequests((prev) => prev.filter((req) => req.id !== id));
  };

  const unique = (key) => [...new Set(requests.map(r => r[key]).filter(Boolean))];

  const filtered = requests.filter((req) => (
    (!filters.region || req.current_region === filters.region) &&
    (!filters.directorate || req.current_directorate === filters.directorate) &&
    (!filters.cycle || req.level === filters.cycle) &&
    (!filters.subject || req.subject === filters.subject)
  ));

  return (
    <div className="p-6 max-w-6xl mx-auto" dir="rtl">
      <h1 className="text-2xl font-bold text-center mb-6">تصفح طلبات التبادل</h1>
      
      <div className="flex justify-end mb-4">
        <button onClick={() => setShowFilters(!showFilters)} className="w-12 h-12 bg-orange-500 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-orange-600 transition">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
        </button>
      </div>

      {showFilters && (
        <div className="mb-6 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm grid md:grid-cols-4 gap-3">
          <select className="p-2 border rounded-lg" onChange={(e) => setFilters({...filters, region: e.target.value})}><option value="">كل الجهات</option>{unique('current_region').map((v) => <option key={v}>{v}</option>)}</select>
          <select className="p-2 border rounded-lg" onChange={(e) => setFilters({...filters, directorate: e.target.value})}><option value="">كل المديريات</option>{unique('current_directorate').map((v) => <option key={v}>{v}</option>)}</select>
          <select className="p-2 border rounded-lg" onChange={(e) => setFilters({...filters, cycle: e.target.value})}><option value="">كل الأسلاك</option>{unique('level').map((v) => <option key={v}>{v}</option>)}</select>
          <select className="p-2 border rounded-lg" onChange={(e) => setFilters({...filters, subject: e.target.value})}><option value="">كل المواد</option>{unique('subject').map((v) => <option key={v}>{v}</option>)}</select>
        </div>
      )}

      <div className="grid gap-4">
        {filtered.map((req) => (
          <div key={req.id} className="p-5 border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition">
            <h2 className="font-bold text-lg">{req.full_name}</h2>
            <p className="text-sm">📞 {req.phone} | 📚 {req.subject}</p>
            <p className="text-sm">📍 {req.current_region} - {req.desired_region}</p>
            
            <div className="flex flex-wrap gap-2 mt-4">
              <a href={`https://wa.me/${req.phone}`} target="_blank" className="bg-green-500 text-white px-3 py-1 rounded text-sm">واتساب</a>
              <button onClick={() => updateStatus(req.id, 'مقبول')} className="bg-green-600 text-white px-3 py-1 rounded text-sm">قبول</button>
              <button onClick={() => updateStatus(req.id, 'مرفوض')} className="bg-red-600 text-white px-3 py-1 rounded text-sm">رفض</button>
              
              {user && (user.email === req.user_email || user.email === 'elabbouchiayoubenglish@gmail.com') && (
                <button onClick={() => deleteRequest(req.id)} className="bg-gray-800 text-white px-3 py-1 rounded text-sm">
                  {user.email === 'elabbouchiayoubenglish@gmail.com' ? 'حذف (إداري)' : 'حذف طلبي'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
