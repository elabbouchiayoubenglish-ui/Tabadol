'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';

export default function CreateRequest() {
  const router = useRouter();
  const [schoolsData, setSchoolsData] = useState({});
  const [selectedCycle, setSelectedCycle] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedDirectorate, setSelectedDirectorate] = useState('');
  const [targetRegion, setTargetRegion] = useState('');
  const [targetDirectorate, setTargetDirectorate] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    cycle: '',
    subject: '',
    curSchool: '',
    targetSchool: ''
  });

  useEffect(() => {
    fetch('/schools_data.json')
      .then((res) => res.json())
      .then((data) => setSchoolsData(data))
      .catch((err) => console.log(err));
  }, []);

  const cycleMap = { 'الابتدائي': 'primary', 'الثانوي الإعدادي': 'middle', 'الثانوي التأهيلي': 'high' };
  const raw = schoolsData?.[selectedRegion]?.[selectedDirectorate];
  const institutions = raw?.[cycleMap[selectedCycle]] || [];
  const targetRaw = schoolsData?.[targetRegion]?.[targetDirectorate];
  const targetInstitutions = targetRaw?.[cycleMap[selectedCycle]] || [];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // تصحيح: جلب بيانات المستخدم الصحيحة من Supabase
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("يجب تسجيل الدخول أولاً لإنشاء طلب");
      return;
    }

    const dataToSend = {
      full_name: formData.name,
      phone: formData.phone,
      level: formData.cycle,
      subject: formData.subject,
      current_region: selectedRegion,
      current_directorate: selectedDirectorate,
      current_school: formData.curSchool,
      desired_region: targetRegion,
      desired_directorate: targetDirectorate,
      desired_school: formData.targetSchool,
      email: user.email 
    };

    const response = await fetch('/api/save-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend)
    });

    if (response.ok) {
        alert('تم حفظ الطلب بنجاح');
        router.push('/browse');
    } else {
        alert('حدث خطأ أثناء حفظ الطلب، يرجى المحاولة لاحقاً');
    }
  };

  const subjectsByCycle = {
    'الابتدائي': ['مزدوج'],
    'الثانوي الإعدادي': ['اللغة العربية', 'اللغة الفرنسية', 'اللغة الإنجليزية', 'اللغة الإسبانية', 'الرياضيات', 'الفيزياء والكيمياء', 'علوم الحياة والأرض', 'الاجتماعيات', 'التربية الإسلامية', 'المعلوميات', 'التربية البدنية', 'التربية التشكيلية', 'التربية الموسيقية'],
    'الثانوي التأهيلي': ['اللغة العربية', 'اللغة الفرنسية', 'اللغة الإنجليزية', 'اللغة الإسبانية', 'الرياضيات', 'الفيزياء والكيمياء', 'علوم الحياة والأرض', 'الفلسفة', 'التاريخ والجغرافيا', 'التربية الإسلامية', 'المعلوميات', 'الاقتصاد والتدبير', 'التكنولوجيا', 'علوم المهندس', 'التربية البدنية']
  };

  return (
    <div className="p-6 max-w-3xl mx-auto" dir="rtl">
      <h1 className="text-2xl font-bold mb-6 text-center">إنشاء طلب تبادل</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full p-3 border rounded-xl" placeholder="الاسم الكامل" onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
        <input className="w-full p-3 border rounded-xl" placeholder="رقم الهاتف" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
        <select className="w-full p-3 border rounded-xl" onChange={(e) => { setSelectedCycle(e.target.value); setFormData({ ...formData, cycle: e.target.value }); }} required>
          <option value="">اختر السلك</option>
          <option>الابتدائي</option>
          <option>الثانوي الإعدادي</option>
          <option>الثانوي التأهيلي</option>
        </select>
        <select className="w-full p-3 border rounded-xl" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required>
          <option value="">اختر المادة</option>
          {(subjectsByCycle[selectedCycle] || []).map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="w-full p-3 border rounded-xl" value={selectedRegion} onChange={(e) => { setSelectedRegion(e.target.value); setSelectedDirectorate(''); }} required>
          <option value="">الجهة الحالية</option>
          {Object.keys(schoolsData || {}).map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <select className="w-full p-3 border rounded-xl" value={selectedDirectorate} onChange={(e) => setSelectedDirectorate(e.target.value)} disabled={!selectedRegion} required>
          <option value="">المديرية الحالية</option>
          {Object.keys(schoolsData?.[selectedRegion] || {}).map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select className="w-full p-3 border rounded-xl" disabled={!selectedDirectorate} onChange={(e) => setFormData({ ...formData, curSchool: e.target.value })} required>
          <option value="">المؤسسة الحالية</option>
          {institutions.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="w-full p-3 border rounded-xl" value={targetRegion} onChange={(e) => { setTargetRegion(e.target.value); setTargetDirectorate(''); }} required>
          <option value="">الجهة المطلوبة</option>
          {Object.keys(schoolsData || {}).map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <select className="w-full p-3 border rounded-xl" value={targetDirectorate} onChange={(e) => setTargetDirectorate(e.target.value)} disabled={!targetRegion} required>
          <option value="">المديرية المطلوبة</option>
          {Object.keys(schoolsData?.[targetRegion] || {}).map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select className="w-full p-3 border rounded-xl" disabled={!targetDirectorate} onChange={(e) => setFormData({ ...formData, targetSchool: e.target.value })} required>
          <option value="">المؤسسة المطلوبة</option>
          {targetInstitutions.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button type="submit" className="w-full bg-orange-600 text-white p-3 rounded-xl font-bold">حفظ الطلب</button>
      </form>
    </div>
  );
}