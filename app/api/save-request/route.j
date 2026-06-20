import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data.json');

// قراءة البيانات
function readData() {
  try {
    if (!fs.existsSync(filePath)) return [];
    const fileData = fs.readFileSync(filePath, 'utf-8');
    return fileData ? JSON.parse(fileData) : [];
  } catch (e) {
    return [];
  }
}

// حفظ البيانات
function writeData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// GET → جلب الطلبات
export async function GET() {
  const data = readData();
  return Response.json(data);
}

// POST → إضافة طلب جديد
export async function POST(req) {
  const body = await req.json();

  const data = readData();

  const newRequest = {
    ...body,
    id: Date.now()
  };

  data.push(newRequest);

  writeData(data);

  return Response.json({ success: true, data: newRequest });
}
