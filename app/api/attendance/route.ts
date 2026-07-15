import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const employeeId = searchParams.get('employeeId');

  try {
    if (employeeId) {
      const attendances = await prisma.attendance.findMany({
        where: { employeeId },
        orderBy: { date: 'desc' }
      });
      return NextResponse.json(attendances);
    } else {
      const attendances = await prisma.attendance.findMany({
        orderBy: { date: 'desc' }
      });
      return NextResponse.json(attendances);
    }
  } catch (error) {
    console.error('Failed to fetch attendance:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.employeeId || !data.date || !data.status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const attendance = await prisma.attendance.create({
      data: {
        employeeId: data.employeeId,
        date: new Date(data.date),
        checkIn: data.checkIn ? new Date(data.checkIn) : null,
        checkInLocation: data.checkInLocation || null,
        checkOut: data.checkOut ? new Date(data.checkOut) : null,
        checkOutLocation: data.checkOutLocation || null,
        status: data.status,
        lateMinutes: data.lateMinutes || 0
      }
    });

    return NextResponse.json(attendance, { status: 201 });
  } catch (error) {
    console.error('Failed to create attendance:', error);
    return NextResponse.json({ error: 'Failed to create attendance' }, { status: 500 });
  }
}
