'use client';
import { useEffect, useState } from 'react';
import { auth } from './firebase.js';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import Link from 'next/link';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>جاري التحقق...</div>;

  if (!user) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', padding: '20px' }}>
        <h1>مرحباً بك في تطبيق تبادل</h1>
        <p>يرجى تسجيل الدخول للوصول إلى الخدمات</p>
        <button onClick={handleLogin} style={{ padding: '15px 30px', backgroundColor: '#4285F4', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          تسجيل الدخول باستخدام Google
        </button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '20px', fontFamily: 'Arial' }}>
      <h1>مرحباً أستاذ {user.displayName}</h1>
      
      <div style={{ marginTop: '30px' }}>
        <Link href="/create-request">
          <button style={{ display: 'block', width: '90%', margin: '10px auto', padding: '15px', backgroundColor: '#FF8C00', color: 'white', border: 'none', borderRadius: '8px' }}>إنشاء طلب تبادل جديد</button>
        </Link>
        <Link href="/browse">
          <button style={{ display: 'block', width: '90%', margin: '10px auto', padding: '15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px' }}>تصفح الطلبات الحالية</button>
        </Link>
      </div>
      
      <button onClick={() => auth.signOut()} style={{ marginTop: '20px', color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>تسجيل الخروج</button>
    </div>
  );
}
