import Link from 'next/link';

export default function Home() {
  const buttonStyle = {
    display: 'block',
    width: '90%',
    margin: '10px auto',
    padding: '15px',
    backgroundColor: '#FF8C00',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    textAlign: 'center'
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px', fontFamily: 'Arial' }}>

      <img
        src="/logo.png"
        alt="شعار الوزارة"
        style={{
          display: 'block',
          margin: '0 auto 20px auto',
          width: '150px'
        }}
      />

      <h1>تطبيق تبادل</h1>
      <p>منصة تدبير طلبات الانتقال</p>

      <div style={{ marginTop: '30px' }}>
        <Link href="/create-request">
          <button style={buttonStyle}>إنشاء طلب تبادل جديد</button>
        </Link>

        <Link href="/browse">
          <button style={buttonStyle}>تصفح الطلبات الحالية</button>
        </Link>
      </div>

      <div style={{
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeeba',
        borderRadius: '8px',
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        textAlign: 'right'
      }}>
        <h3>⚠️ تنبيه مهم</h3>
        <p>
          هذا التطبيق مشروع مستقل غير رسمي يهدف فقط لتسهيل تبادل الأساتذة بين الجهات،
          ولا يمثل وزارة التربية الوطنية.
        </p>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#f1f1f1',
        borderRadius: '8px',
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        textAlign: 'right'
      }}>
        <h3>👨‍💻 معلومات المصمم</h3>
        <p>الأستاذ: أيوب العبوشي</p>
        <p>الجهة: العيون الساقية الحمراء</p>
        <p>المديرية: السمارة</p>
        <p>
          البريد الإلكتروني:{" "}
          <a href="mailto:elabbouchiayoubenglish@gmail.com">
            elabbouchiayoubenglish@gmail.com
          </a>
        </p>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#e8f4ff',
        borderRadius: '8px',
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        textAlign: 'right',
        marginBottom: '30px'
      }}>
        <h3>🎯 هدف التطبيق</h3>
        <p>
          يهدف هذا التطبيق إلى تسهيل عملية تبادل الأساتذة بين الجهات والمديريات،
          بشكل منظم وسريع وشفاف، وتحسين التواصل بين الأساتذة والإدارة.
        </p>
      </div>

    </div>
  );
}
