"use server";

import bcrypt from "bcryptjs";
import postgres from "postgres";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

/** * DATABASE CONNECTION
 * This will look for the URL in your .env.local file.
 * While you are not linked to the Vercel Team, this will be undefined.
 */
const sql = postgres(process.env.POSTGRES_URL || "", { 
  ssl: "require",
  // We set a short timeout so it doesn't hang your app while testing locally
  connect_timeout: 1 
});

export async function register(formData: FormData) {
  const username = formData.get("username") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;
  const bio = formData.get("bio") as string;

  // 1. Basic Validation (Works locally!)
  if (!username || !name || !email || !password || !role) {
    return { error: "All fields are required" };
  }

  try {
    // --- START DATABASE SECTION ---
    // Once you are linked to the Vercel Team, uncomment the code below:
    /*
    const existingUser = await sql`
      SELECT id FROM account WHERE email = ${email} OR username = ${username}
    `;

    if (existingUser.length > 0) {
      return { error: "Email or username already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const approved = role === "Buyer";

    await sql`
      INSERT INTO account (username, name, email, password, role, bio, approved)
      VALUES (${username}, ${name}, ${email}, ${hashedPassword}, ${role}, ${bio || ""}, ${approved})
    `;
    */
    // --- END DATABASE SECTION ---

    // --- MOCK LOGIC FOR TESTING ---
    // This simulates the database taking 1.5 seconds to save the user
    console.log("Mocking registration for:", { username, email, role });
    await new Promise((resolve) => setTimeout(resolve, 1500)); 

    return { success: true };
    // ------------------------------

  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Database connection missing. Push to your branch for Team Lead to test." };
  }
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  // 1. Safety Check: If DB is not connected, don't try to query
  if (!process.env.POSTGRES_URL) {
    console.warn("⚠️ Login attempted without Database connection.");
    return { error: "Login is currently disabled (Database not connected)." };
  }

  try {
    const users = await sql`
      SELECT id, username, name, email, password, role, approved
      FROM account
      WHERE email = ${email}
    `;

    if (users.length === 0) {
      return { error: "Invalid email or password" };
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return { error: "Invalid email or password" };
    }

    if (user.role === "Seller" && !user.approved) {
      return { error: "Your seller account is pending approval" };
    }

    const cookieStore = await cookies();
    cookieStore.set("userId", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return { success: true, user: { id: user.id, name: user.name, role: user.role } };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Login failed due to database connection issues." };
  }
}
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("userId");
  redirect("/");
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return null;
  }

  try {
    const users = await sql`
      SELECT id, username, name, email, role, bio, userPhoto, approved
      FROM account
      WHERE id = ${userId}
    `;
    return users[0] || null;
  } catch (error) {
    console.error("Get user error:", error);
    return null;
  }
}

export async function approveSeller(sellerId: string) {
  try {
    await sql`
      UPDATE account
      SET approved = true
      WHERE id = ${sellerId} AND role = 'Seller'
    `;
    return { success: true };
  } catch (error) {
    console.error("Approve seller error:", error);
    return { error: "Failed to approve seller" };
  }
}