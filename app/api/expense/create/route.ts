import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { description, amount, paidById, householdId } = await req.json();

        // Validate required fields
        if (!description || !amount || !paidById || !householdId) {
            return NextResponse.json(
                { error: "Description, amount, paidById, and householdId are required" },
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

        // Check if household exists
        const household = await prisma.household.findUnique({
            where: { id: householdId }
        });
        if (!household) {
            return NextResponse.json(
                { error: "Household not found" },
                { status: 404 }
            );
        }

        // Check if user exists and is a member of the household
        const user = await prisma.householdMember.findFirst({
            where: {
                userId: paidById,
                householdId
            }
        });
        if (!user) {
            return NextResponse.json(
                { error: "User is not a member of this household" },
                { status: 403 }
            );
        }

        // Create expense
        const expense = await prisma.expense.create({
            data: {
                description,
                amount,
                paidById,
                householdId,
                // Create initial split for the payer
                splits: {
                    create: {
                        userId: paidById,
                        amount: amount,
                        isPaid: true
                    }
                }
            },
            include: {
                splits: true
            }
        });

        return NextResponse.json(expense);
    } catch (error) {
        console.error('Error creating expense:', error);
        return NextResponse.json(
            { error: "Failed to create expense" },
            { status: 500 }
        );
    }
}
