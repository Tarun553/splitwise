import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Household ID is required" },
        { status: 400 }
      );
    }

    const household = await prisma.household.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: true
          }
        },
        expenses: {
          include: {
            paidBy: true,
            splits: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!household) {
      return NextResponse.json(
        { error: "Household not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(household);
  } catch (error) {
    console.error('Error fetching household:', error);
    return NextResponse.json(
      { error: "Failed to fetch household", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
