import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { expenseId } = await req.json();

        // Validate required fields
        if (!expenseId) {
            return NextResponse.json(
                { error: "expenseId is required" },
                { status: 400 }
            );
        }

        // Check if expense exists
        const expense = await prisma.expense.findUnique({
            where: { id: expenseId }
        });
        if (!expense) {
            return NextResponse.json(
                { error: "Expense not found" },
                { status: 404 }
            );
        }

        // Delete expense and related splits
        await prisma.expense.delete({
            where: { id: expenseId }
        });

        return NextResponse.json({ message: "Expense deleted successfully" });
    } catch (error) {
        console.error('Error deleting expense:', error);
        return NextResponse.json(
            { error: "Failed to delete expense" },
            { status: 500 }
        );
    }
}
