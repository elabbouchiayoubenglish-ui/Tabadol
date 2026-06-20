import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ padding: '20px', textAlign: 'center', direction: 'rtl' }}>
      <h1>تطبيق تبادل</h1>
      <p>منصتك الاحترافية للتبادل الذكي</p>

      <div style={{ marginTop: '30px' }}>
        <button
          style={{
            display: 'block',
            width: '100%',
            padding: '15px',
            marginBottom: '10px'
          }}
        >
          إنشاء طلب تبادل جديد
        </button>

        <Link
          href="/browse"
          style={{
            display: 'block',
            width: '100%',
            padding: '15px',
            background: '#0070f3',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '5px'
          }}
        >
          تصفح الطلبات الحالية
        </Link>
      </div>
    </div>
  );
}
