import { useEffect, useState } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from "firebase/auth";
import LoginButton from './LoginButton';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  const isDeveloper = user?.email === "elabbouchiayoubenglish@gmail.com";

  if (!user) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>مرحباً بك في Tabadol</h1>
        <p>يرجى تسجيل الدخول للوصول إلى المنصة</p>
        <LoginButton />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>مرحباً {user.displayName}</h1>

      {isDeveloper && (
        <div style={{ backgroundColor: '#ffcccc', padding: '10px', marginBottom: '20px', border: '1px solid red' }}>
          أهلاً بك يا أستاذ أيوب، أنت الآن في وضع المطور.
        </div>
      )}

      <p>يمكنك الآن تصفح الطلبات وإنشاء طلب جديد بكل سهولة.</p>
    </div>
  );
}
