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
            where: { id: splitId },
            include: {
                expense: {
                    include: {
                        household: true
                    }
                },
                user: true
            }
        });

        if (!split) {
            return NextResponse.json(
                { error: "Split not found" },
                { status: 404 }
            );
        }

        // Check if split is already paid
        if (split.isPaid) {
            return NextResponse.json(
                { error: "Split is already marked as paid" },
                { status: 400 }
            );
        }

        // Update split as paid
        const updatedSplit = await prisma.split.update({
            where: { id: splitId },
            data: { isPaid: true }
        });

        return NextResponse.json(updatedSplit);
    } catch (error) {
        console.error('Error marking split as paid:', error);
        return NextResponse.json(
            { error: "Failed to mark split as paid" },
            { status: 500 }
        );
    }
}
