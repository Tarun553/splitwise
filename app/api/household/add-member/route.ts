import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { userId, householdId } = await req.json();

        // Validate required fields
        if (!userId || !householdId) {
            return NextResponse.json(
                { error: "User ID and Household ID are required" },
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

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Check if user is already a member
        const existingMember = await prisma.householdMember.findFirst({
            where: {
                userId,
                householdId
            }
        });
        if (existingMember) {
            return NextResponse.json(
                { error: "User is already a member of this household" },
                { status: 400 }
            );
        }

        // Add user to household
        const member = await prisma.householdMember.create({
            data: {
                user: { connect: { id: userId } },
                household: { connect: { id: householdId } }
            }
        });

        return NextResponse.json(member);
    } catch (error) {
        console.error('Error adding member to household:', error);
        return NextResponse.json(
            { error: "Failed to add member to household" },
            { status: 500 }
        );
    }
}
