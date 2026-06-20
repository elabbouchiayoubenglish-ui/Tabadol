'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import schoolsData from '@/public/schools_data.json';

export default function CreateRequest() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    desiredRegions: [],
    desiredDirectorates: [],
    desiredSchools: []
  });

  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedDirectorate, setSelectedDirectorate] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();

  const res = await fetch('/api/save-request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...formData,
      createdAt: new Date().toISOString()
    }),
  });

  if (res.ok) {
    alert('تم حفظ الطلب بنجاح');
    router.push('/browse');
  } else {
    alert('حدث خطأ أثناء الحفظ');
  }
};
  return (
    <div className="p-6" dir="rtl">
      <h1 className="text-2xl font-bold mb-6">إنشاء طلب تبادل</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* ================= الاسم الكامل ================= */}
        <input
          className="w-full p-2 border rounded"
          placeholder="الاسم الكامل"
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          required
        />

        {/* ================= الجهة الحالية ================= */}
        <select
          className="w-full p-2 border rounded"
          value={selectedRegion}
          onChange={(e) => {
            setSelectedRegion(e.target.value);
            setSelectedDirectorate('');

            setFormData({
              ...formData,
              region: e.target.value,
              directorate: '',
              curSchool: ''
            });
          }}
          required
        >
          <option value="">اختر الجهة الحالية</option>

          {Object.keys(schoolsData || {}).map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>

        {/* ================= المديرية الحالية ================= */}
        <select
          className="w-full p-2 border rounded"
          value={selectedDirectorate}
          disabled={!selectedRegion}
          onChange={(e) => {
            setSelectedDirectorate(e.target.value);

            setFormData({
              ...formData,
              directorate: e.target.value,
              curSchool: ''
            });
          }}
          required
        >
          <option value="">اختر المديرية الحالية</option>

          {selectedRegion &&
            Object.keys(schoolsData?.[selectedRegion] || {}).map((dir) => (
              <option key={dir} value={dir}>
                {dir}
              </option>
            ))}
        </select>

        {/* ================= المؤسسة الحالية ================= */}
        <select
          className="w-full p-2 border rounded"
          disabled={!selectedDirectorate}
          onChange={(e) =>
            setFormData({
              ...formData,
              curSchool: e.target.value
            })
          }
          required
        >
          <option value="">اختر المؤسسة الحالية</option>

          {(Array.isArray(
            schoolsData?.[selectedRegion]?.[selectedDirectorate]
          )
            ? schoolsData[selectedRegion][selectedDirectorate]
            : []
          ).map((school) => (
            <option key={school} value={school}>
              {school}
            </option>
          ))}
        </select>

        {/* ================= السلك ================= */}
        <select
          className="w-full p-2 border rounded"
          onChange={(e) =>
            setFormData({ ...formData, cycle: e.target.value })
          }
          required
        >
          <option value="">اختر السلك</option>
          <option value="الابتدائي">الابتدائي</option>
          <option value="الثانوي الإعدادي">الثانوي الإعدادي</option>
          <option value="الثانوي التأهيلي">الثانوي التأهيلي</option>
        </select>

        {/* ================= المادة ================= */}
        <select
          className="w-full p-2 border rounded"
          onChange={(e) =>
            setFormData({ ...formData, subject: e.target.value })
          }
          required
        >
          <option value="">اختر المادة</option>
          <option value="اللغة العربية">اللغة العربية</option>
          <option value="اللغة الفرنسية">اللغة الفرنسية</option>
          <option value="اللغة الإنجليزية">اللغة الإنجليزية</option>
          <option value="اللغة الإسبانية">اللغة الإسبانية</option>
          <option value="التكنولوجيا">التكنولوجيا</option>
          <option value="علوم المهندس">علوم المهندس</option>
        </select>

        {/* ================= الجهات المطلوبة ================= */}
        <div className="border p-3 rounded">
          <h3 className="font-bold mb-2">الجهات المطلوبة</h3>

          {Object.keys(schoolsData || {}).map((region) => (
            <label key={region} className="block">
              <input
                type="checkbox"
                onChange={(e) => {
                  const list = formData.desiredRegions || [];

                  const updated = e.target.checked
                    ? [...list, region]
                    : list.filter((r) => r !== region);

                  setFormData({
                    ...formData,
                    desiredRegions: updated
                  });
                }}
              />
              {" "}{region}
            </label>
          ))}
        </div>

        {/* ================= المديريات المطلوبة ================= */}
        <div className="border p-3 rounded">
          <h3 className="font-bold mb-2">المديريات المطلوبة</h3>

          {Object.keys(schoolsData || {}).map((region) =>
            Object.keys(schoolsData?.[region] || {}).map((dir) => (
              <label key={dir} className="block">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    const list = formData.desiredDirectorates || [];

                    const updated = e.target.checked
                      ? [...list, dir]
                      : list.filter((d) => d !== dir);

                    setFormData({
                      ...formData,
                      desiredDirectorates: updated
                    });
                  }}
                />
                {" "}{dir}
              </label>
            ))
          )}
        </div>

        {/* ================= المؤسسات المطلوبة ================= */}
        <div className="border p-3 rounded">
          <h3 className="font-bold mb-2">المؤسسات المطلوبة</h3>

          {Object.keys(schoolsData || {}).map((region) =>
            Object.keys(schoolsData?.[region] || {}).map((dir) =>
              (schoolsData?.[region]?.[dir] || []).map((school) => (
                <label key={school} className="block">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      const list = formData.desiredSchools || [];

                      const updated = e.target.checked
                        ? [...list, school]
                        : list.filter((s) => s !== school);

                      setFormData({
                        ...formData,
                        desiredSchools: updated
                      });
                    }}
                  />
                  {" "}{school}
                </label>
              ))
            )
          )}
        </div>

        {/* ================= زر الحفظ ================= */}
        <button
          type="submit"
          className="bg-orange-600 text-white p-3 rounded w-full"
        >
          حفظ الطلب
        </button>

      </form>
    </div>
  );
}
