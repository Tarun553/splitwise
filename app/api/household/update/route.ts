import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { householdId, name } = await req.json();

        // Validate required fields
        if (!householdId) {
            return NextResponse.json(
                { error: "householdId is required" },
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

        // Update household
        const updatedHousehold = await prisma.household.update({
            where: { id: householdId },
            data: {
                name: name || household.name,
            },
        });

        return NextResponse.json(updatedHousehold);
    } catch (error) {
        console.error('Error updating household:', error);
        return NextResponse.json(
            { error: "Failed to update household" },
            { status: 500 }
        );
    }
}
