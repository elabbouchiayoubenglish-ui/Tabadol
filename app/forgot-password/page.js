'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    // الرابط الذي سيتم توجيه المستخدم إليه بعد الضغط على الإيميل
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://tabadolgit.vercel.app/update-password',
    });
    
    if (error) {
      alert("خطأ: " + error.message);
    } else {
      setMessage("تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني!");
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9', padding: '20px', fontFamily: 'Arial' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '30px', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', backgroundColor: '#fff', textAlign: 'center' }}>
        <img src="/logo.png" alt="Logo" style={{ width: '100px', margin: '0 auto 20px auto', display: 'block' }} />
        <h2 style={{ color: '#333', marginBottom: '20px' }}>استعادة كلمة المرور</h2>
        
        <form onSubmit={handleReset}>
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <img src="/email_final.png" alt="Email" style={{ position: 'absolute', right: '15px', top: '15px', width: '25px', height: '25px' }} />
            <input 
              type="email" 
              placeholder="أدخل بريدك الإلكتروني" 
              onChange={(e) => setEmail(e.target.value)} 
              style={{ width: '100%', padding: '15px 50px', borderRadius: '15px', border: '1px solid #ddd', boxSizing: 'border-box' }} 
              required 
            />
          </div>
          <button type="submit" style={{ width: '100%', padding: '15px', background: '#FF8C00', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
            إرسال رابط الاستعادة
          </button>
        </form>

        <div style={{ marginTop: '20px' }}>
          <Link href="/" style={{ color: '#888', fontSize: '14px' }}>العودة لتسجيل الدخول</Link>
        </div>
        
        {message && <p style={{ marginTop: '20px', color: '#FF8C00' }}>{message}</p>}
      </div>
    </div>
  );
}