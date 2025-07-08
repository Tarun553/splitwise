import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CreateExpenseRequest {
  description: string;
  amount: number;
  paidById: string;
  householdId: string;
  splitType: 'EQUAL' | 'CUSTOM';
  splits?: Record<string, boolean>;
}

export async function POST(req: Request) {
    try {
        const { description, amount, paidById, householdId, splitType, splits } = await req.json() as CreateExpenseRequest;

        // Validate required fields
        if (!description || !amount || !paidById || !householdId || !splitType) {
            return NextResponse.json(
                { error: "Description, amount, paidById, householdId, and splitType are required" },
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

        // Check if household exists and get members
        const household = await prisma.household.findUnique({
            where: { id: householdId },
            include: { 
                members: {
                    include: { user: true }
                } 
            }
        });
        
        if (!household) {
            return NextResponse.json(
                { error: "Household not found" },
                { status: 404 }
            );
        }

        // Check if user exists and is a member of the household
        const isMember = household.members.some(member => member.userId === paidById);
        if (!isMember) {
            return NextResponse.json(
                { error: "User is not a member of this household" },
                { status: 403 }
            );
        }

        // Create expense with all splits in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // 1. Create the expense
            const expense = await tx.expense.create({
                data: {
                    description,
                    amount,
                    paidById,
                    householdId,
                }
            });

            // 2. Create splits based on split type
            if (splitType === 'EQUAL') {
                const memberCount = household.members.length;
                const splitAmount = parseFloat((amount / memberCount).toFixed(2));
                
                await tx.split.createMany({
                    data: household.members.map(member => ({
                        expenseId: expense.id,
                        userId: member.userId,
                        amount: splitAmount,
                        isPaid: member.userId === paidById
                    }))
                });
            } else if (splitType === 'CUSTOM' && splits) {
                // For custom splits, create splits for selected users
                const selectedUsers = Object.entries(splits)
                    .filter(([_, isIncluded]) => isIncluded)
                    .map(([userId]) => userId);

                if (selectedUsers.length === 0) {
                    throw new Error("At least one user must be selected for custom split");
                }

                const splitAmount = parseFloat((amount / selectedUsers.length).toFixed(2));
                
                await tx.split.createMany({
                    data: selectedUsers.map(userId => ({
                        expenseId: expense.id,
                        userId,
                        amount: splitAmount,
                        isPaid: userId === paidById
                    }))
                });
            }

            // 3. Return the created expense with all its splits
            return await tx.expense.findUnique({
                where: { id: expense.id },
                include: { 
                    splits: true,
                    paidBy: {
                        select: { name: true, email: true }
                    }
                }
            });
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error creating expense:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to create expense';
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
