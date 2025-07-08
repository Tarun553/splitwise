import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { splitId, amount } = await req.json();

        // Validate required fields
        if (!splitId) {
            return NextResponse.json(
                { error: "splitId is required" },
                { status: 400 }
            );
        }

        // Validate amount
        if (amount !== undefined && (typeof amount !== 'number' || amount <= 0)) {
            return NextResponse.json(
                { error: "Amount must be a positive number" },
                { status: 400 }
            );
        }

        // Check if split exists
        const split = await prisma.split.findUnique({
            where: { id: splitId },
            include: {
                expense: {
                    include: {
                        splits: true
                    }
                }
            }
        });
        if (!split) {
            return NextResponse.json(
                { error: "Split not found" },
                { status: 404 }
            );
        }

        // If amount is being updated, check if total splits exceed expense amount
        if (amount !== undefined) {
            const totalSplitAmount = split.expense.splits.reduce((sum, s) => sum + s.amount, 0);
            if (totalSplitAmount - split.amount + amount > split.expense.amount) {
                return NextResponse.json(
                    { error: "Total splits cannot exceed expense amount" },
                    { status: 400 }
                );
            }
        }

        // Update split
        const updatedSplit = await prisma.split.update({
            where: { id: splitId },
            data: {
                amount: amount || split.amount,
            },
            include: {
                user: true,
                expense: true
            }
        });

        return NextResponse.json(updatedSplit);
    } catch (error) {
        console.error('Error updating split:', error);
        return NextResponse.json(
            { error: "Failed to update split" },
            { status: 500 }
        );
    }
}
