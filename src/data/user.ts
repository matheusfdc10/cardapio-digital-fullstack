import { db } from "@/lib/db";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";

export const getUserByEmail = async (email: string): Promise<User | null> => {
    try {
        const user = await db.user.findUnique({ where: { email } });

        return user;
    } catch(error) {
        return null;
    }
}

export const getUserById = async (id: string): Promise<User | null> => {
    try {
        const user = await db.user.findUnique({ where: { id } });

        return user;
    } catch(error) {
        return null;
    }
}

export const createUser = async (user: {
    name: string,
    email: string,
    password: string,
}): Promise<User | null> => {
    try {
        const hashedPassword = await bcrypt.hash(user.password, 12);

        const newUser = await db.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: hashedPassword,
            }
        });

        return newUser;
    } catch(error) {
        return null;
    }
}