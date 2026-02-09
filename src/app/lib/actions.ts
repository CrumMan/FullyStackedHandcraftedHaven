"use server";

import bcrypt from "bcryptjs";
import postgres from "postgres";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function register(formData: FormData) {
  const username = formData.get("username") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;
  const bio = formData.get("bio") as string;

  if (!username || !name || !email || !password || !role) {
    return { error: "All fields are required" };
  }

  try {
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

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Failed to create account" };
  }
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
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
    }
  );

    return { success: true, user: { id: user.id, name: user.name, role: user.role } };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Login failed" };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("userId");
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

export async function updateAccount(formData: FormData){
  const user = await getCurrentUser();
  let userId
  if (user != null){
    userId = user.id;
  }
 if (user == null){
  return{error: 'user not authenticated'};
 }
  
  try{
    await sql`
    UPDATE account
    SET name = ${formData.get("name") as string}, 
    username = ${formData.get("username") as string},
    email = ${formData.get("email") as string},
    bio = ${formData.get("bio") as string}
    where id = ${userId}
    `
    return {success: true}
  } catch(error){
    return{error: "Failed to update account"};
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

export async function getProductsByUserId(){
  try{
    const user = await getCurrentUser()
    if (!user?.id) {
      console.error("User not authenticated")
      return []
    }

    const result = await sql `
    SELECT 
        p.id,
        p.name,
        p.price,
        p.quantity,
        p.description,
        p.productImg as "productImg",
        a.name as "seller",
        a.id as "sellerId"
      FROM products p
      JOIN account a ON p.userId = a.id
      WHERE a.id = ${user?.id}
      `
    if(!result[0].id){
      return[]
    }
    return result || [];
  }
  catch(error){
    console.error("Server error",error)
    return []
  }
}