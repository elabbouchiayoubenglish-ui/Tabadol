'use client';
import { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { Filter, Trash2 } from 'lucide-react';

export default function BrowseRequests() {
  const [requests, setRequests] = useState([]);
  const [user, setUser] = useState(null);
  const [filters, setFilters] = useState({ region: '', directorate: '', cycle: '', subject: '' });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/save-request');
      const data = await res.json();
      const safeData = Array.isArray(data) ? data : [];
      // ترتيب حسب التاريخ الأحدث
      const sorted = safeData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setRequests(sorted);
    } catch (err) { console.log("FETCH ERROR:", err); }
  };

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
    try {
      const res = await fetch(`/api/save-request?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      } else {
        alert('لا تملك صلاحية الحذف');
      }
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = requests.filter((req) => (
    (!filters.region || req.current_region === filters.region) &&
    (!filters.directorate || req.current_directorate === filters.directorate) &&
    (!filters.cycle || req.level === filters.cycle) &&
    (!filters.subject || req.subject === filters.subject)
  ));

  return (
    <div className="p-6 max-w-4xl mx-auto" dir="rtl">
      <h1 className="text-2xl font-bold text-center mb-6">تصفح طلبات التبادل</h1>

      {/* أيقونة الفلترة الجديدة */}
      <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 mb-6 text-blue-600 font-bold hover:text-blue-800 transition">
        <Filter size={20} /> {showFilters ? 'إخفاء الفلترة' : 'تصفية الطلبات'}
      </button>

      {/* منطقة الفلاتر */}
      {showFilters && (
        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
          <input placeholder="الجهة" onChange={(e) => setFilters({...filters, region: e.target.value})} className="p-2 border rounded" />
          <input placeholder="المادة" onChange={(e) => setFilters({...filters, subject: e.target.value})} className="p-2 border rounded" />
        </div>
      )}

      <div className="grid gap-4">
        {filtered.map((req) => (
          <div key={req.id} className="p-6 border border-gray-200 rounded-3xl bg-white shadow-sm hover:shadow-md transition space-y-4 relative">
            
            {/* زر الحذف */}
            {(user?.email === req.user_email || user?.email === 'elabbouchiayoubenglish@gmail.com') && (
              <button onClick={() => handleDelete(req.id)} className="absolute top-4 left-4 text-red-500 hover:text-red-700">
                <Trash2 size={20} />
              </button>
            )}

            {/* القسم 1: الاسم ورقم الهاتف */}
            <div className="border-b pb-2">
              <h2 className="font-bold text-xl text-orange-600">{req.full_name}</h2>
              <p className="text-gray-600">📞 {req.phone}</p>
              <p className="text-xs text-gray-400">تاريخ التسجيل: {req.created_at ? new Date(req.created_at).toLocaleDateString('ar-MA') : ''}</p>
            </div>

            {/* القسم 2: السلك والمادة */}
            <div className="bg-orange-50 p-3 rounded-xl text-sm">
              <p><strong>السلك:</strong> {req.level} | <strong>المادة:</strong> {req.subject}</p>
            </div>

            {/* القسم 3: الجهة الحالية، المديرية، المؤسسة */}
            <div className="text-sm border-r-4 border-blue-500 pr-3">
              <p className="font-bold text-blue-800 mb-1">الوضع الحالي:</p>
              <p>{req.current_region} - {req.current_directorate}</p>
              <p className="text-gray-600">{req.current_school}</p>
            </div>

            {/* القسم 4: الجهة المطلوبة، المديرية، المؤسسة */}
            <div className="text-sm border-r-4 border-green-500 pr-3">
              <p className="font-bold text-green-800 mb-1">الرغبة:</p>
              <p>{req.desired_region} - {req.desired_directorate}</p>
              <p className="text-gray-600">{req.desired_school}</p>
            </div>

            {/* الأزرار */}
            <div className="flex gap-2 pt-2">
              <a href={`https://wa.me/${req.phone}`} target="_blank" className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-bold w-full text-center">تواصل عبر واتساب</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
