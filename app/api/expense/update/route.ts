import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { expenseId, description, amount } = await req.json();

        // Validate required fields
        if (!expenseId) {
            return NextResponse.json(
                { error: "expenseId is required" },
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

        // Check if expense exists
        const expense = await prisma.expense.findUnique({
            where: { id: expenseId },
            include: {
                splits: true
            }
        });
        if (!expense) {
            return NextResponse.json(
                { error: "Expense not found" },
                { status: 404 }
            );
        }

        // If amount is being updated, check if total splits exceed new amount
        if (amount !== undefined) {
            const totalSplitAmount = expense.splits.reduce((sum, split) => sum + split.amount, 0);
            if (totalSplitAmount > amount) {
                return NextResponse.json(
                    { error: "Total splits cannot exceed new expense amount" },
                    { status: 400 }
                );
            }
        }

        // Update expense
        const updatedExpense = await prisma.expense.update({
            where: { id: expenseId },
            data: {
                description: description || expense.description,
                amount: amount || expense.amount,
            },
            include: {
                paidBy: true,
                splits: {
                    include: {
                        user: true
                    }
                }
            }
        });

        return NextResponse.json(updatedExpense);
    } catch (error) {
        console.error('Error updating expense:', error);
        return NextResponse.json(
            { error: "Failed to update expense" },
            { status: 500 }
        );
    }
}
