'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';
import { Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      alert("تم إنشاء الحساب بنجاح!");
      router.push('/');
    } catch (error) {
      alert("خطأ: " + error.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9', padding: '20px', fontFamily: 'Arial' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '30px', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', backgroundColor: '#fff', textAlign: 'center' }}>
        <h2 style={{ color: '#333', marginBottom: '20px' }}>إنشاء حساب جديد</h2>
        <form onSubmit={handleRegister}>
          
          {/* حقل البريد الإلكتروني - الاسم الصحيح */}
          <div style={{ position: 'relative', marginBottom: '15px' }}>
            <img 
              src="/email_final.png" 
              alt="Email" 
              style={{ position: 'absolute', right: '15px', top: '15px', width: '25px', height: '25px', zIndex: 999 }} 
            />
            <input 
              type="email" 
              placeholder="البريد الإلكتروني" 
              onChange={(e) => setEmail(e.target.value)} 
              style={{ width: '100%', padding: '15px', paddingRight: '50px', borderRadius: '15px', border: '1px solid #ddd', boxSizing: 'border-box' }} 
              required 
            />
          </div>

          {/* حقل كلمة المرور - الاسم الصحيح */}
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <img 
              src="/lock_final.png" 
              alt="Lock" 
              style={{ position: 'absolute', right: '15px', top: '15px', width: '25px', height: '25px', zIndex: 999 }} 
            />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="كلمة المرور" 
              onChange={(e) => setPassword(e.target.value)} 
              style={{ width: '100%', padding: '15px', paddingRight: '50px', paddingLeft: '45px', borderRadius: '15px', border: '1px solid #ddd', boxSizing: 'border-box' }} 
              required 
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', left: '15px', top: '15px', background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button type="submit" style={{ width: '100%', padding: '15px', background: '#FF8C00', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' }}>تسجيل الحساب</button>
        </form>
        <p style={{ marginTop: '15px' }}>لديك حساب بالفعل؟ <Link href="/" style={{ color: '#FF8C00' }}>سجل دخولك</Link></p>
      </div>
    </div>
  );
}