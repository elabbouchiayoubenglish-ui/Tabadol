'use client';
import { useState } from 'react';
import { auth } from '../firebas
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("تم إنشاء الحساب بنجاح!");
      router.push('/');
    } catch (error) {
      alert("خطأ: " + error.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9', padding: '20px', fontFamily: 'Arial' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '30px', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', backgroundColor: '#fff', textAlign: 'center' }}>
        <h2 style={{ color: '#333' }}>إنشاء حساب جديد</h2>
        <form onSubmit={handleRegister}>
          <input type="email" placeholder="البريد الإلكتروني" onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '15px', marginBottom: '15px', borderRadius: '15px', border: '1px solid #ddd', boxSizing: 'border-box' }} required />
          <input type="password" placeholder="كلمة المرور" onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '15px', marginBottom: '20px', borderRadius: '15px', border: '1px solid #ddd', boxSizing: 'border-box' }} required />
          <button type="submit" style={{ width: '100%', padding: '15px', background: '#FF8C00', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold' }}>تسجيل الحساب</button>
        </form>
        <p style={{ marginTop: '15px' }}>لديك حساب بالفعل؟ <Link href="/" style={{ color: '#FF8C00' }}>سجل دخولك</Link></p>
      </div>
    </div>
  );
}
