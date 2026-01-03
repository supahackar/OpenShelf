"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
})

export async function registerUser(data: z.infer<typeof registerSchema>) {
    const validatedData = registerSchema.parse(data)

    const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email },
    })

    if (existingUser) {
        return { error: "User already exists" }
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    await prisma.user.create({
        data: {
            name: validatedData.name,
            email: validatedData.email,
            password: hashedPassword,
            role: "STUDENT",
        },
    })

    return { success: true }
}
