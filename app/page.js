'use client';
import { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword 
} from "firebase/auth";
import Link from 'next/link';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try { await signInWithPopup(auth, provider); } 
    catch (error) { alert("خطأ: " + error.message); }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try { await signInWithEmailAndPassword(auth, email, password); }
    catch (error) { alert("خطأ: " + error.message); }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>جاري التحميل...</div>;

  // واجهة تسجيل الدخول الاحترافية (التي طلبتها)
  if (!user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f9f9f9', padding: '20px' }}>
        <div style={{ width: '100%', maxWidth: '420px', backgroundColor: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <h1 style={{ color: '#FF8C00', marginBottom: '10px' }}>مرحباً بك في تبادل</h1>
          <form onSubmit={handleEmailLogin}>
            <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '14px', margin: '10px 0', borderRadius: '12px', border: '1.5px solid #eee' }} />
            <input type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '14px', margin: '10px 0', borderRadius: '12px', border: '1.5px solid #eee' }} />
            <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#FF8C00', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>دخول</button>
          </form>
          <button onClick={handleGoogleLogin} style={{ width: '100%', padding: '14px', backgroundColor: '#fff', color: '#333', border: '1.5px solid #ddd', borderRadius: '12px', marginTop: '10px' }}>الدخول بـ Google</button>
        </div>
      </div>
    );
  }

  // هنا تصميمك الأصلي كما كان تماماً
  return (
    <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'Arial' }}>
      <img src="https://upload.wikimedia.org/wikipedia/commons/f/f6/Coat_of_arms_of_Morocco.svg" alt="Logo" style={{ width: '80px', margin: '10px auto' }} />
      <h2 style={{ fontSize: '18px' }}>وزارة التربية الوطنية والتعليم الأولي والرياضة</h2>
      <h3 style={{ fontSize: '16px' }}>تطبيق تبادل - منصة تدبير طلبات الانتقال</h3>

      <div style={{ marginTop: '20px' }}>
        <Link href="/create-request">
          <button style={{ display: 'block', width: '100%', padding: '15px', backgroundColor: '#FF8C00', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', marginBottom: '10px' }}>إنشاء طلب تبادل جديد</button>
        </Link>
        <Link href="/browse">
          <button style={{ display: 'block', width: '100%', padding: '15px', backgroundColor: '#FF8C00', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px' }}>تصفح الطلبات الحالية</button>
        </Link>
      </div>

      <div style={{ backgroundColor: '#fffbe6', padding: '15px', marginTop: '20px', borderRadius: '8px', border: '1px solid #ffe58f', textAlign: 'right' }}>
        <p>⚠️ تنبيه مهم: هذا التطبيق مشروع مستقل غير رسمي يهدف فقط لتسهيل تبادل الأساتذة بين الجهات والمديريات، ولا يمثل وزارة التربية الوطنية.</p>
      </div>
      
      <button onClick={() => auth.signOut()} style={{ marginTop: '20px', color: 'red', border: 'none', background: 'none' }}>تسجيل الخروج</button>
    </div>
  );
}
