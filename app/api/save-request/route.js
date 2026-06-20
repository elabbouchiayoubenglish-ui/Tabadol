export async function POST(req) {
  try {
    const body = await req.json()

    const {
      full_name,
      phone,
      level,
      subject,
      current_region,
      current_directorate,
      current_school,
      desired_region,
      desired_directorate,
      desired_school
    } = body

    const { data, error } = await supabase
      .from('requests')
      .insert([{
        full_name,
        phone,
        level,
        subject,
        current_region,
        current_directorate,
        current_school,
        desired_region,
        desired_directorate,
        desired_school
      }])
      .select()

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ success: true, data: data[0] })

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
