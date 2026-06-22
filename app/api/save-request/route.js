import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// GET - جلب الطلبات
export async function GET() {
  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}

// POST - إنشاء طلب جديد
export async function POST(req) { // تم تصحيح: إضافة كلمة async
  try {
    const body = await req.json();

    const { data, error } = await supabase
      .from('requests')
      .insert([
        {
          full_name: body.full_name,
          phone: body.phone,
          level: body.level,
          subject: body.subject,
          current_region: body.current_region,
          current_directorate: body.current_directorate,
          current_school: body.current_school,
          desired_region: body.desired_region,
          desired_directorate: body.desired_directorate,
          desired_school: body.desired_school,
          user_email: body.email
        }
      ])
      .select();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, data: data[0] });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// DELETE - حذف طلب
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const { error } = await supabase
      .from('requests')
      .delete()
      .eq('id', id);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
