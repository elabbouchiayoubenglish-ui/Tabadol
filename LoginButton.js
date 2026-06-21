import { auth, googleProvider } from './firebase'; // استيراد الجسر الذي صنعناه
import { signInWithPopup } from "firebase/auth";

export default function LoginButton() {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("تم تسجيل الدخول بنجاح:", result.user);
      alert("أهلاً بك يا " + result.user.displayName);
    } catch (error) {
      console.error("خطأ في تسجيل الدخول:", error);
    }
  };

  return (
    <button onClick={handleLogin}>
      تسجيل الدخول بجوجل
    </button>
  );
}
