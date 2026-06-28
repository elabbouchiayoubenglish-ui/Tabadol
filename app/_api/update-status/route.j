import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data.json');

function readData() {
  try {
    if (!fs.existsSync(filePath)) return [];

    const data = fs.readFileSync(filePath, 'utf-8');

    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function writeData(data) {
  fs.writeFileSync(
    filePath,
    JSON.stringify(data, null, 2)
  );
}

export async function POST(req) {
  try {
    const { id, status } = await req.json();

    const data = readData();

    const updated = data.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          status
        };
      }

      return item;
    });

    writeData(updated);

    return Response.json({
      success: true
    });

  } catch (error) {

    return Response.json(
      { error: 'Update failed' },
      { status: 500 }
    );

  }
}
