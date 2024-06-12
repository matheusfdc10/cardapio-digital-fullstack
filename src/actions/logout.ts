"use server";

import { signOut } from "@/auth";

export const logout = async (redirectUrl?: string) => {
    await signOut({
        redirectTo: redirectUrl
    })
}