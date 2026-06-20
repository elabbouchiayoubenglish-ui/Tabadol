'use client';

import { useEffect, useState } from 'react';

export default function BrowseRequests() {

  const [requests, setRequests] = useState([]);

  const [filters, setFilters] = useState({
    region: '',
    directorate: '',
    cycle: '',
    subject: ''
  });

  const [showFilters, setShowFilters] = useState(false);

  const [statusMap, setStatusMap] = useState({});

  // 🔥 تحديث تلقائي كل 5 ثواني
  useEffect(() => {

const fetchData = async () => {
  try {
    const res = await fetch('/api/save-request');
    const data = await res.json();

    console.log("DATA FROM API:", data);

    const safeData = Array.isArray(data) ? data : [];

    const sorted = safeData.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    setRequests(sorted);

    const savedStatus = {};

    sorted.forEach((req) => {
      if (req.status) {
        savedStatus[req.id] = req.status;
      }
    });

    setStatusMap(savedStatus);

  } catch (err) {
    console.log("FETCH ERROR:", err);
  }
};
    fetchData(); // أول تحميل

    const interval = setInterval(fetchData, 5000); // كل 5 ثواني

    return () => clearInterval(interval);

  }, []);

  const unique = (key) =>
    [...new Set(requests.map(r => r[key]).filter(Boolean))];

  const filtered = requests.filter((req) => (
    (!filters.region || req.current_region === filters.region) &&
    (!filters.directorate || req.current_directorate === filters.directorate) &&
    (!filters.cycle || req.level === filters.cycle) &&
    (!filters.subject || req.subject === filters.subject)
  ));

  const deleteRequest = async (id) => {
    const confirmDelete = confirm('هل تريد حذف هذا الطلب؟');
    if (!confirmDelete) return;

    await fetch('/api/delete-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });

    setRequests((prev) => prev.filter((req) => req.id !== id));
  };

  const getStatus = (req) => {
    const status = statusMap[req.id];
    if (status) return status;

    const created = new Date(req.created_at);
    const now = new Date();

    const diffMinutes = (now - created) / (1000 * 60);

    if (diffMinutes < 5) return '⏳ قيد المعالجة';
    return '⏳ في الانتظار';
  };

  const updateStatus = async (id, status) => {

    setStatusMap((prev) => ({
      ...prev,
      [id]: status
    }));

    await fetch('/api/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto" dir="rtl">

      <h1 className="text-2xl font-bold text-center mb-6">
        تصفح طلبات التبادل
      </h1>

      {/* زر الإعدادات */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center"
        >
          ⚙️
        </button>
      </div>

      {/* الفلاتر */}
      {showFilters && (
        <div className="mb-6 p-4 bg-white border rounded-xl shadow grid md:grid-cols-4 gap-3">

          <select onChange={(e) => setFilters({ ...filters, region: e.target.value })}>
            <option value="">كل الجهات</option>
            {unique('current_region').map((v) => <option key={v}>{v}</option>)}
          </select>

          <select onChange={(e) => setFilters({ ...filters, directorate: e.target.value })}>
            <option value="">كل المديريات</option>
            {unique('current_directorate').map((v) => <option key={v}>{v}</option>)}
          </select>

          <select onChange={(e) => setFilters({ ...filters, cycle: e.target.value })}>
            <option value="">كل الأسلاك</option>
            {unique('level').map((v) => <option key={v}>{v}</option>)}
          </select>

          <select onChange={(e) => setFilters({ ...filters, subject: e.target.value })}>
            <option value="">كل المواد</option>
            {unique('subject').map((v) => <option key={v}>{v}</option>)}
          </select>

        </div>
      )}

      {/* الطلبات */}
      <div className="grid gap-4">

        {filtered.map((req) => (
          <div key={req.id} className="p-5 border rounded-xl bg-white shadow-sm">

            <div className="flex justify-between items-center">
              <h2 className="font-bold text-lg">{req.full_name}</h2>

              <span className="text-xs px-2 py-1 bg-gray-200 rounded">
                {req.level}
              </span>
            </div>

            <p>📞 {req.phone}</p>
            <p>📚 {req.subject}</p>

            <hr className="my-2" />

            <p>📍 {req.current_region} - {req.current_directorate}</p>
            <p>🏫 {req.current_school}</p>

            <hr className="my-2" />

            <p>🎯 {req.desired_region} - {req.desired_directorate}</p>
            <p>🏫 {req.desired_school}</p>

            <p className="mt-2 text-sm font-bold">
              الحالة: {getStatus(req)}
            </p>

            <div className="flex gap-2 mt-3">

              <a
                href={`https://wa.me/${req.phone}`}
                target="_blank"
                className="bg-green-500 text-white px-3 py-1 rounded text-sm"
              >
                واتساب
              </a>

              <button
                onClick={() => updateStatus(req.id, 'مقبول')}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm"
              >
                قبول
              </button>

              <button
                onClick={() => updateStatus(req.id, 'مرفوض')}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                رفض
              </button>

              <button
                onClick={() => deleteRequest(req.id)}
                className="bg-gray-800 text-white px-3 py-1 rounded text-sm"
              >
                حذف
              </button>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}
