import { useEffect, useState } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from "firebase/auth";
import LoginButton from './LoginButton';
// إضافة مكتبة الإشعارات
import { PushNotifications } from '@capacitor/push-notifications';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // إضافة منطق الإشعارات
    const initPush = async () => {
      // 1. طلب الإذن
      let permStatus = await PushNotifications.checkPermissions();
      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      // 2. إذا تم الموافقة، قم بالتسجيل
      if (permStatus.receive === 'granted') {
        await PushNotifications.register();
      }
    };

    // 3. الاستماع للتوكن (في حال نجاح التسجيل)
    PushNotifications.addListener('registration', (token) => {
      console.log('FCM Token:', token.value);
      // هنا يمكنك لاحقاً إضافة دالة ترسل هذا الـ token إلى Supabase
    });

    initPush();
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