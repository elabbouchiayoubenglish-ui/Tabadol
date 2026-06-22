'use client';
import { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { 
  onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword 
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

  const handleLogin = async (e) => {
    e.preventDefault();
    try { await signInWithEmailAndPassword(auth, email, password); }
    catch (error) { alert("خطأ: " + error.message); }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try { await signInWithPopup(auth, provider); }
    catch (error) { alert("خطأ: " + error.message); }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>جاري التحميل...</div>;

  // واجهة تسجيل الدخول
  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9', padding: '20px', fontFamily: 'Arial' }}>
        <div style={{ width: '100%', maxWidth: '400px', padding: '30px', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', backgroundColor: '#fff', textAlign: 'center' }}>
          <h2 style={{ color: '#333' }}>مرحباً بك في تبادل</h2>
          <p style={{ color: '#777', marginBottom: '20px' }}>سجل الدخول للوصول إلى حسابك ومتابعة تبادلك</p>
          
          <form onSubmit={handleLogin}>
            <div style={{ position: 'relative', marginBottom: '15px' }}>
              <span style={{ position: 'absolute', right: '15px', top: '15px' }}>📧</span>
              <input type="email" placeholder="البريد الإلكتروني" onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '15px 40px', borderRadius: '15px', border: '1px solid #ddd' }} />
            </div>
            <div style={{ position: 'relative', marginBottom: '10px' }}>
              <span style={{ position: 'absolute', right: '15px', top: '15px' }}>🔒</span>
              <input type="password" placeholder="كلمة المرور" onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '15px 40px', borderRadius: '15px', border: '1px solid #ddd' }} />
            </div>
            <div style={{ textAlign: 'right', marginBottom: '20px', fontSize: '14px' }}>
              <label><input type="checkbox" /> تذكرني</label>
              <span style={{ marginRight: '10px', color: '#FF8C00' }}>نسيت كلمة المرور؟</span>
            </div>
            <button type="submit" style={{ width: '100%', padding: '15px', background: '#FF8C00', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold' }}>دخول ➔</button>
          </form>
          
          <div style={{ margin: '20px 0', color: '#999' }}>أو</div>
          
          <button onClick={handleGoogleLogin} style={{ width: '100%', padding: '10px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <img src="/Google__G__logo.svg" alt="Google" style={{ width: '24px', marginRight: '10px' }} />
            الدخول باستخدام Google
          </button>
          <p style={{ marginTop: '20px' }}>ليس لديك حساب؟ <span style={{ color: '#FF8C00' }}>إنشاء حساب جديد</span></p>
        </div>
      </div>
    );
  }

  // الواجهة الرئيسية
  return (
    <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'Arial' }}>
      <img src="/logo.png" alt="Logo" style={{ width: '100px', margin: '0 auto 10px auto', display: 'block' }} />
      <h2 style={{ fontSize: '18px' }}>وزارة التربية الوطنية والتعليم الأولي والرياضة</h2>
      <h3 style={{ fontSize: '16px' }}>تطبيق تبادل - منصة تدبير طلبات الانتقال</h3>
      
      <div style={{ marginTop: '20px' }}>
        <Link href="/create-request"><button style={{ width: '90%', padding: '15px', marginBottom: '10px', background: '#FF8C00', color: 'white', border: 'none', borderRadius: '8px' }}>إنشاء طلب تبادل جديد</button></Link>
        <Link href="/browse"><button style={{ width: '90%', padding: '15px', background: '#FF8C00', color: 'white', border: 'none', borderRadius: '8px' }}>تصفح الطلبات الحالية</button></Link>
      </div>

      <div style={{ textAlign: 'right', backgroundColor: '#fff3cd', padding: '15px', borderRadius: '8px', marginTop: '20px' }}>
        ⚠️ تنبيه: هذا التطبيق مشروع مستقل غير رسمي يهدف لتسهيل تبادل الأساتذة، ولا يمثل وزارة التربية الوطنية.
      </div>

      <div style={{ textAlign: 'right', backgroundColor: '#f0f0f0', padding: '15px', borderRadius: '8px', marginTop: '10px' }}>
        <p><strong>معلومات المصمم:</strong><br/>
        الأستاذ: أيوب العبوشي<br/>
        الجهة: العيون الساقية الحمراء<br/>
        المديرية: السمارة<br/>
        البريد الإلكتروني: elabbouchiayoubenglish@gmail.com</p>
        <p><strong>هدف التطبيق:</strong> يهدف هذا التطبيق إلى تسهيل عملية تبادل الأساتذة بين الجهات والمديريات بشكل منظم وشفاف.</p>
      </div>

      <button onClick={() => auth.signOut()} style={{ marginTop: '20px', color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>تسجيل الخروج</button>
    </div>
  );
}
