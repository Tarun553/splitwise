import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { userId } = await req.json();

        // Validate required fields
        if (!userId) {
            return NextResponse.json(
                { error: "userId is required" },
                { status: 400 }
            );
        }

        // Check if user exists
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Delete user and related data
        // Note: This will cascade delete all related data (household memberships, expenses, splits)
        // due to the onDelete: 'cascade' setting in Prisma schema
        await prisma.user.delete({
            where: { id: userId }
        });

        return NextResponse.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json(
            { error: "Failed to delete user" },
            { status: 500 }
        );
    }
}
