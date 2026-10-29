import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function POST(request: Request) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { type, url, date } = await request.json();

    const simulation = await prisma.simulation.create({
      data: {
        type,
        url,
        date,
        userId: user.id
      }
    });

    return NextResponse.json(simulation);
  } catch (error) {
    console.error('Error saving simulation:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const simulations = await prisma.simulation.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        date: 'desc'
      }
    });

    return NextResponse.json(simulations);
  } catch (error) {
    console.error('Error fetching simulations:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 