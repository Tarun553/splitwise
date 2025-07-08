// api route for household
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { name } = await req.json();
        
        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        const household = await prisma.household.create({
            data: {
                name,
            }
        });

        return NextResponse.json(household);
    } catch (error) {
        console.error('Error creating household:', error);
        return NextResponse.json({ error: "Failed to create household" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const households = await prisma.household.findMany();
        return NextResponse.json(households);
    } catch (error) {
        console.error('Error fetching households:', error);
        return NextResponse.json({ error: "Failed to fetch households" }, { status: 500 });
    }
}

// Close Prisma client connection when server shuts down
export async function DELETE() {
    await prisma.$disconnect();
    return NextResponse.json({ message: "Disconnected" });
}