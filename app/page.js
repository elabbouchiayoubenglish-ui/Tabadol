'use client';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
      setLoading(false);
    };
    getSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("خطأ: " + error.message);
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: 'io.ionic.starter://callback' } });
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>جاري التحميل...</div>;

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9', padding: '20px', fontFamily: 'Arial' }}>
        <div style={{ width: '100%', maxWidth: '400px', padding: '30px', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', backgroundColor: '#fff', textAlign: 'center' }}>
          <img src="/logo.png" alt="Logo" style={{ width: '100px', margin: '0 auto 20px auto', display: 'block' }} />
          <h2 style={{ color: '#333', marginTop: '0' }}>مرحباً بك في تبادل</h2>
          <form onSubmit={handleLogin}>
            <div style={{ position: 'relative', marginBottom: '15px' }}>
              <img src="/email_final.png" alt="Email" style={{ position: 'absolute', right: '15px', top: '15px', width: '25px', height: '25px' }} />
              <input type="email" placeholder="البريد الإلكتروني" onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '15px 50px', borderRadius: '15px', border: '1px solid #ddd', boxSizing: 'border-box' }} required />
            </div>
            <div style={{ position: 'relative', marginBottom: '10px' }}>
              <img src="/lock_final.png" alt="Lock" style={{ position: 'absolute', right: '15px', top: '15px', width: '25px', height: '25px' }} />
              <input type={showPassword ? "text" : "password"} placeholder="كلمة المرور" onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '15px 50px', borderRadius: '15px', border: '1px solid #ddd', boxSizing: 'border-box' }} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', left: '15px', top: '15px', background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}><Eye size={20} /></button>
            </div>

            {/* إضافة خيار تذكرني مع رابط نسيت كلمة المرور */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', fontSize: '13px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)} 
                /> 
                تذكرني
              </label>
              <Link href="/forgot-password" style={{ color: '#FF8C00' }}>نسيت كلمة المرور؟</Link>
            </div>
            <button type="submit" style={{ width: '100%', padding: '15px', background: '#FF8C00', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold' }}>دخول ➔</button>
          </form>
          {/* زر Google */}
          <button onClick={handleGoogleLogin} style={{ width: '100%', marginTop: '15px', padding: '10px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <img src="/Google__G__logo.svg___.png" alt="Google" style={{ width: '24px', height: '24px', marginLeft: '10px' }} />
            الدخول باستخدام Google
          </button>
          <div style={{ marginTop: '20px', fontSize: '14px' }}>ليس لديك حساب؟ <Link href="/register" style={{ color: '#FF8C00', fontWeight: 'bold' }}>إنشاء حساب جديد</Link></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'Arial' }}>
      <img src="/logo.png" alt="Logo" style={{ width: '100px', margin: '0 auto 10px auto', display: 'block' }} />
      <h2 style={{ fontSize: '18px' }}>وزارة التربية الوطنية والتعليم الأولي والرياضة</h2>
      <h3 style={{ fontSize: '16px' }}>تطبيق تبادل - منصة تدبير طلبات الانتقال</h3>
      <div style={{ marginTop: '20px' }}>
        <Link href="/create-request"><button style={{ width: '90%', padding: '15px', marginBottom: '10px', background: '#FF8C00', color: 'white', border: 'none', borderRadius: '8px' }}>إنشاء طلب تبادل جديد</button></Link>
        <Link href="/browse"><button style={{ width: '90%', padding: '15px', background: '#FF8C00', color: 'white', border: 'none', borderRadius: '8px' }}>تصفح الطلبات الحالية</button></Link>
      </div>
      <div style={{ textAlign: 'right', backgroundColor: '#fff3cd', padding: '15px', borderRadius: '8px', marginTop: '20px', border: '1px solid #ffeeba', color: '#856404' }}>
        ⚠️ <strong>تنبيه:</strong> هذا التطبيق مشروع مستقل غير رسمي، يهدف لتسهيل تبادل الأساتذة، ولا يمثل أي جهة حكومية أو وزارة التربية الوطنية.
      </div>
      {/* قسم المعلومات بالتنسيق الصحيح */}
      <div style={{ textAlign: 'right', backgroundColor: '#f0f0f0', padding: '15px', borderRadius: '8px', marginTop: '10px', border: '1px solid #ddd', direction: 'rtl' }}>
        <p style={{ margin: '5px 0' }}><strong>👤 معلومات المطوّر:</strong></p>
        <p style={{ margin: '5px 0' }}>الأستاذ: أيوب العبوشي</p>
        <p style={{ margin: '5px 0' }}>الجهة: العيون الساقية الحمراء | المديرية: السمارة</p>
        <p style={{ margin: '5px 0', textAlign: 'right' }}>البريد: elabbouchiayoubenglish@gmail.com</p>
      </div>
      <div style={{ textAlign: 'right', backgroundColor: '#e3f2fd', padding: '15px', borderRadius: '8px', marginTop: '10px', border: '1px solid #bbdefb', color: '#0c5460', direction: 'rtl' }}>
        <p style={{ margin: '5px 0' }}><strong>🎯 هدف التطبيق:</strong></p>
        <p style={{ margin: '5px 0' }}>تسهيل عملية تبادل الأساتذة بين الجهات والمديريات بشكل منظم، سريع، وشفاف، وتحسين التواصل المباشر بين الراغبين في الانتقال.</p>
      </div>
      <button onClick={() => supabase.auth.signOut()} style={{ marginTop: '30px', color: 'red', border: 'none', background: 'none', cursor: 'pointer', textDecoration: 'underline' }}>تسجيل الخروج</button>
    </div>
  );
}