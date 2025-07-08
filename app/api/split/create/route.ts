import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { expenseId, userId, amount } = await req.json();

        // Validate required fields
        if (!expenseId || !userId || amount === undefined) {
            return NextResponse.json(
                { error: "expenseId, userId, and amount are required" },
                { status: 400 }
            );
        }

        // Validate amount
        if (typeof amount !== 'number' || amount <= 0) {
            return NextResponse.json(
                { error: "Amount must be a positive number" },
                { status: 400 }
            );
        }

        // Check if expense exists
        const expense = await prisma.expense.findUnique({
            where: { id: expenseId },
            include: {
                household: true
            }
        });
        if (!expense) {
            return NextResponse.json(
                { error: "Expense not found" },
                { status: 404 }
            );
        }

        // Check if user exists and is a member of the household
        const user = await prisma.householdMember.findFirst({
            where: {
                userId,
                householdId: expense.householdId
            }
        });
        if (!user) {
            return NextResponse.json(
                { error: "User is not a member of this household" },
                { status: 403 }
            );
        }

        // Check if total splits exceed expense amount
        const existingSplits = await prisma.split.findMany({
            where: { expenseId },
            select: { amount: true }
        });
        const totalExistingAmount = existingSplits.reduce((sum, split) => sum + split.amount, 0);
        if (totalExistingAmount + amount > expense.amount) {
            return NextResponse.json(
                { error: "Total splits cannot exceed expense amount" },
                { status: 400 }
            );
        }

        // Create split
        const split = await prisma.split.create({
            data: {
                expenseId,
                userId,
                amount,
                isPaid: false
            }
        });

        return NextResponse.json(split);
    } catch (error) {
        console.error('Error creating split:', error);
        return NextResponse.json(
            { error: "Failed to create split" },
            { status: 500 }
        );
    }
}
    