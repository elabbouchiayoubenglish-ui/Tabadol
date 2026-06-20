import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'requests.json');
    const data = fs.readFileSync(filePath, 'utf8');
    const requests = JSON.parse(data || '[]');

    return NextResponse.json(requests);
  } catch (err) {
    return NextResponse.json([]);
  }
}
