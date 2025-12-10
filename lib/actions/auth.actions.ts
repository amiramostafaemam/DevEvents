// // lib/actions/auth.actions.ts
// "use server";

// import { signIn } from "@/lib/auth";
// import { AuthError } from "next-auth";

// export async function authenticate(email: string, password: string) {
//   try {
//     const result = await signIn("credentials", {
//       email,
//       password,
//       redirect: false,
//     });

//     return { success: true };
//   } catch (error) {
//     if (error instanceof AuthError) {
//       return { success: false, error: "Invalid email or password" };
//     }
//     return { success: false, error: "Something went wrong" };
//   }
// }
// lib/actions/auth.actions.ts
"use server";

import { signIn, signOut, auth } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function authenticate(email: string, password: string) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: "Invalid email or password" };
    }
    return { success: false, error: "Something went wrong" };
  }
}

export async function signOutUser() {
  try {
    await signOut({ redirect: false });
    return { success: true };
  } catch (error) {
    console.error("Sign out error:", error);
    return { success: false, error: "Failed to sign out" };
  }
}

export async function getSession() {
  try {
    const session = await auth();
    return session;
  } catch (error) {
    console.error("Get session error:", error);
    return null;
  }
}
