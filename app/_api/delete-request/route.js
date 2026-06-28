import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data.json');

// قراءة البيانات
function readData() {
  try {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, 'utf-8');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// كتابة البيانات
function writeData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// DELETE (نحذف طلب حسب id)
export async function POST(req) {
  try {
    const { id } = await req.json();

    const data = readData();

    const updatedData = data.filter((item) => item.id !== id);

    writeData(updatedData);

    return Response.json({
      success: true,
      message: 'Request deleted successfully'
    });

  } catch (error) {
    return Response.json(
      { error: 'Delete failed' },
      { status: 500 }
    );
  }
}
