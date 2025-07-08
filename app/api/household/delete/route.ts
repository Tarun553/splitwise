import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { householdId } = await req.json();

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

        // Delete household and related data
        // Note: This will cascade delete all related data (expenses, splits, household members)
        // due to the onDelete: 'cascade' setting in Prisma schema
        await prisma.household.delete({
            where: { id: householdId }
        });

        return NextResponse.json({ message: "Household deleted successfully" });
    } catch (error) {
        console.error('Error deleting household:', error);
        return NextResponse.json(
            { error: "Failed to delete household" },
            { status: 500 }
        );
    }
}
