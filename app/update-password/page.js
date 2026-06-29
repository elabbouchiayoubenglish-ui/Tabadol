'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Eye, EyeOff } from 'lucide-react';

export default function UpdatePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleUpdate = async () => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      alert("خطأ: " + error.message);
    } else {
      alert("تم تحديث كلمة المرور بنجاح!");
      window.location.href = '/';
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9', padding: '20px', fontFamily: 'Arial' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '30px', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', backgroundColor: '#fff', textAlign: 'center' }}>
        <img src="/logo.png" alt="Logo" style={{ width: '100px', margin: '0 auto 20px auto', display: 'block' }} />
        <h2 style={{ color: '#333', marginBottom: '20px' }}>تعيين كلمة مرور جديدة</h2>
        
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <img src="/lock_final.png" alt="Lock" style={{ position: 'absolute', right: '15px', top: '15px', width: '25px', height: '25px' }} />
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="كلمة المرور الجديدة" 
            onChange={(e) => setNewPassword(e.target.value)} 
            style={{ width: '100%', padding: '15px 50px', borderRadius: '15px', border: '1px solid #ddd', boxSizing: 'border-box' }} 
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', left: '15px', top: '15px', background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button onClick={handleUpdate} style={{ width: '100%', padding: '15px', background: '#FF8C00', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
          تحديث كلمة المرور
        </button>
      </div>
    </div>
  );
}