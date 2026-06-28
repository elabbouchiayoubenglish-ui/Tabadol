import { createClient } from '@supabase/supabase-js';

// استبدل هذه القيم ببيانات مشروعك من لوحة تحكم Supabase (Settings -> API)
const supabase = createClient('Https://gfofxaerynsrqmviyvje.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdmb2Z4YWVyeW5zcnFtdml5dmplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4OTM4NDQsImV4cCI6MjA5NzQ2OTg0NH0.oBB4vUqOA-f0iXhz9tN_dzKKurbNZvpD_CIoZpnCSxs');

export default function LoginButton() {

  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // هذا الرابط يخبر Supabase أين يعود بعد تسجيل الدخول
          redirectTo: 'com.ayoub.tabadol://callback' 
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error("خطأ في تسجيل الدخول:", error.message);
    }
  };

  return (
    <button onClick={handleLogin}>
      تسجيل الدخول بجوجل
    </button>
  );
}