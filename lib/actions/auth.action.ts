"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";
import { cache } from "react";

const ONE_WEEK = 7 * 24 * 60 * 60;

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;
  try {
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists) {
      return {
        success: false,
        message: "User already exists, Please sign in.",
      };
    }
    await db.collection("users").doc(uid).set({
      name,
      email,
    });
    return {
      success: true,
      message: "Account created successfully, Please sign in.",
    };
  } catch (error: any) {
    console.error(error);
    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "This email is already in use",
      };
    }
    return {
      success: false,
      message: "Failed to create an account. Please try again.",
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;
  try {
    // Verify the ID token first (this is faster than getUserByEmail)
    const decodedToken = await auth.verifyIdToken(idToken);
    
    // Check if user exists in Firestore
    const firestoreUser = await db
      .collection("users")
      .doc(decodedToken.uid)
      .get();
    
    if (!firestoreUser.exists) {
      // Create user document if it doesn't exist
      await db
        .collection("users")
        .doc(decodedToken.uid)
        .set({
          name: decodedToken.name ?? "No name",
          email: decodedToken.email,
        });
    }
    
    await setSessionCookie(idToken);
    
    return {
      success: true,
      message: "Sign in successful",
    };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      message: "Failed to log into account, Please try again.",
    };
  }
}


export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK * 1000,
  });
  cookieStore.set("session", sessionCookie, {
    maxAge: ONE_WEEK,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
}

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  
  if (!sessionCookie) return null;
  
  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    
    // Get user from Firestore
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();

    if (!userRecord.exists) return null;

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.error("Error verifying session:", error);
    return null;
  }
});

export async function isAuthenticated() {
  const user = await getCurrentUser();

  return !!user;
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
