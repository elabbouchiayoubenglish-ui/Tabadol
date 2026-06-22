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

  if (loading) return <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '18px' }}>جاري تحميل تبادل...</div>;

  // --- واجهة تسجيل الدخول الاحترافية باللون البرتقالي ---
  if (!user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f9f9f9', padding: '20px' }}>
        <div style={{ width: '100%', maxWidth: '420px', backgroundColor: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <h1 style={{ color: '#FF8C00', marginBottom: '10px' }}>مرحباً بك في تبادل</h1>
          <p style={{ color: '#666', marginBottom: '30px' }}>سجل الدخول للمتابعة</p>
          
          <form onSubmit={handleEmailLogin}>
            <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '14px', margin: '10px 0', borderRadius: '12px', border: '1.5px solid #eee', outline: 'none' }} />
            <input type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '14px', margin: '10px 0', borderRadius: '12px', border: '1.5px solid #eee', outline: 'none' }} />
            <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#FF8C00', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '10px', transition: '0.3s' }}>دخول</button>
          </form>

          <div style={{ margin: '25px 0', color: '#ccc', display: 'flex', alignItems: 'center' }}><hr style={{ flex: 1 }}/> أو <hr style={{ flex: 1 }}/></div>
          
          <button onClick={handleGoogleLogin} style={{ width: '100%', padding: '14px', backgroundColor: '#fff', color: '#333', border: '1.5px solid #ddd', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', transition: '0.3s' }}>
            تسجيل الدخول عبر Google
          </button>
        </div>
      </div>
    );
  }

  // --- واجهة المستخدم الأصلية ---
  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial' }}>
      <h1>مرحباً أستاذ {user.displayName || user.email}</h1>
      <div style={{ marginTop: '30px' }}>
        <Link href="/create-request">
          <button style={{ display: 'block', width: '90%', margin: '10px auto', padding: '15px', backgroundColor: '#FF8C00', color: 'white', border: 'none', borderRadius: '8px' }}>إنشاء طلب جديد</button>
        </Link>
        <Link href="/browse">
          <button style={{ display: 'block', width: '90%', margin: '10px auto', padding: '15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px' }}>تصفح الطلبات</button>
        </Link>
      </div>
      <button onClick={() => auth.signOut()} style={{ marginTop: '20px', color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>تسجيل الخروج</button>
    </div>
  );
}
