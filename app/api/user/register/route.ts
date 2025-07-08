import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Initialize Prisma client
const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        // Parse request body
        const { name, email, password } = await req.json();

        // Validate required fields
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Name, email, and password are required" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email already exists" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        // Don't return password in response
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        console.error('Error registering user:', error);
        return NextResponse.json(
            { error: "Failed to register user" },
            { status: 500 }
        );
    }
}

// Clean up Prisma client when server shuts down
export async function DELETE() {
    await prisma.$disconnect();
    return NextResponse.json({ message: "Disconnected" });
}
