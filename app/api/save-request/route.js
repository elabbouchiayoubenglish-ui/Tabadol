import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// GET - جلب الطلبات
export async function GET() {
  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json(data)
}

// POST - إنشاء طلب جديد
export async function POST(req) {
  try {
    const body = await req.json()

    const { data, error } = await supabase
      .from('requests')
      .insert([
        {
          full_name: body.name,
          phone: body.phone,
          level: body.cycle,
          subject: body.subject,

          current_region: body.region,
          current_directorate: body.directorate,
          current_school: body.curSchool,

          desired_region: body.targetRegion,
          desired_directorate: body.targetDirectorate,
          desired_school: body.targetSchool,
          
          // إضافة البريد الإلكتروني للمستخدم هنا
          user_email: body.email, 

          created_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({
      success: true,
      data: data[0]
    })

  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    )
  }
}
