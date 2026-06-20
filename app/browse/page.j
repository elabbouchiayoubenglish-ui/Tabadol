'use client';

import { useEffect, useState } from 'react';

export default function BrowseRequests() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState('');
  const [cycleFilter, setCycleFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');

  useEffect(() => {
    fetch('/api/save-request')
      .then((res) => res.json())
      .then((data) => setRequests(data || []))
      .catch((err) => console.log(err));
  }, []);

  // فلترة + بحث
  const filtered = requests.filter((req) => {
    const matchSearch =
      req.name?.includes(search) ||
      req.subject?.includes(search) ||
      req.curSchool?.includes(search);

    const matchCycle =
      cycleFilter === '' || req.cycle === cycleFilter;

    const matchRegion =
      regionFilter === '' || req.region === regionFilter;

    return matchSearch && matchCycle && matchRegion;
  });

  // ترتيب الأحدث
  const sortedRequests = [...filtered].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="p-6 max-w-6xl mx-auto" dir="rtl">

      <h1 className="text-2xl font-bold mb-6 text-center">
        تصفح طلبات التبادل
      </h1>

      {/* أدوات البحث */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">

        <input
          className="w-full p-3 border rounded-xl"
          placeholder="بحث بالاسم أو المادة أو المؤسسة"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="w-full p-3 border rounded-xl"
          value={cycleFilter}
          onChange={(e) => setCycleFilter(e.target.value)}
        >
          <option value="">كل الأسلاك</option>
          <option value="الابتدائي">الابتدائي</option>
          <option value="الثانوي الإعدادي">الإعدادي</option>
          <option value="الثانوي التأهيلي">التأهيلي</option>
        </select>

        <input
          className="w-full p-3 border rounded-xl"
          placeholder="فلترة بالجهة"
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
        />

      </div>

      {/* النتائج */}
      <div className="grid gap-4">

        {sortedRequests.length === 0 ? (
          <p className="text-center text-gray-500">
            لا توجد طلبات
          </p>
        ) : (
          sortedRequests.map((req, index) => (
            <div
              key={index}
              className="border rounded-xl p-5 shadow-sm bg-white"
            >

              {/* الرأس */}
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">
                  {req.name}
                </h2>

                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {req.cycle}
                </span>
              </div>

              <p className="text-sm text-gray-600 mt-1">
                📞 {req.phone}
              </p>

              <p className="mt-1">
                📚 <b>المادة:</b> {req.subject}
              </p>

              {/* زر واتساب */}
              <a
                href={`https://wa.me/${req.phone}`}
                target="_blank"
                className="inline-block mt-2 bg-green-500 text-white px-3 py-1 rounded text-sm"
              >
                💬 تواصل واتساب
              </a>

              {/* تفاصيل */}
              <details className="mt-4">
                <summary className="cursor-pointer text-blue-600">
                  عرض التفاصيل
                </summary>

                <div className="mt-2 text-sm">

                  <hr className="my-2" />

                  <p><b>📍 الجهة الحالية:</b> {req.region}</p>
                  <p><b>🏢 المديرية:</b> {req.directorate}</p>
                  <p><b>🏫 المؤسسة:</b> {req.curSchool}</p>

                  <hr className="my-2" />

                  <p><b>🎯 الجهة المطلوبة:</b> {req.targetRegion}</p>
                  <p><b>🏢 المديرية:</b> {req.targetDirectorate}</p>
                  <p><b>🏫 المؤسسة:</b> {req.targetSchool}</p>

                  <hr className="my-2" />

                  <p className="text-xs text-gray-500">
                    📅 {new Date(req.createdAt).toLocaleString()}
                  </p>

                </div>
              </details>

            </div>
          ))
        )}

      </div>
    </div>
  );
}
