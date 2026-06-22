'use client';
import { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword 
} from "firebase/auth";

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

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px', color: '#555' }}>جاري التحقق...</div>;

  if (!user) {
    return (
      <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', borderRadius: '15px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h1 style={{ color: '#333' }}>أهلاً بك في تبادل</h1>
        <p style={{ color: '#777', marginBottom: '20px' }}>سجل الدخول للبدء</p>
        
        <form onSubmit={handleEmailLogin}>
          <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '12px', margin: '8px 0', borderRadius: '8px', border: '1px solid #ccc' }} />
          <input type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', margin: '8px 0', borderRadius: '8px', border: '1px solid #ccc' }} />
          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '10px' }}>دخول بالبريد</button>
        </form>

        <div style={{ margin: '20px 0', color: '#999' }}>أو</div>
        
        <button onClick={handleGoogleLogin} style={{ width: '100%', padding: '12px', backgroundColor: '#4285F4', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          تسجيل الدخول بـ Google
        </button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>
      <h1>مرحباً أستاذ {user.displayName || user.email}</h1>
      <button onClick={() => auth.signOut()} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>تسجيل الخروج</button>
    </div>
  );
}
