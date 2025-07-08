import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { splitId } = await req.json();

        // Validate required fields
        if (!splitId) {
            return NextResponse.json(
                { error: "splitId is required" },
                { status: 400 }
            );
        }

        // Check if split exists
        const split = await prisma.split.findUnique({
            where: { id: splitId }
        });
        if (!split) {
            return NextResponse.json(
                { error: "Split not found" },
                { status: 404 }
            );
        }

        // Delete split
        await prisma.split.delete({
            where: { id: splitId }
        });

        return NextResponse.json({ message: "Split deleted successfully" });
    } catch (error) {
        console.error('Error deleting split:', error);
        return NextResponse.json(
            { error: "Failed to delete split" },
            { status: 500 }
        );
    }
}
