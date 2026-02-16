"use server";

import bcrypt from "bcryptjs";
import postgres from "postgres";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { error } from "console";
import { revalidatePath } from "next/cache";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

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
    }
  );

    return { success: true, user: { id: user.id, name: user.name, role: user.role } };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Login failed due to database connection issues." };
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

export async function requestSellerAccount(userId: string) {
  try {
    const result = await sql`
      UPDATE account
      SET role = 'Seller', approved = false
      WHERE id = ${userId} AND role = 'Buyer'
      RETURNING id
    `;

    if (result.length === 0) {
      return { error: "Invalid request" };
    }

    return { success: true };
  } catch (error) {
    console.error("Request seller error:", error);
    return { error: "Failed to request seller account" };
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
    if(!result[0]){
      return[]
    }
    return result || [];
  }
  catch(error){
    console.error("Server error",error)
    return []
  }
}

export async function updateProduct(formData: FormData, product:any){
  try{
    await sql`
    UPDATE products
    SET 
      name = ${formData.get("name") as string},
      price = ${formData.get("price") as string},
      quantity =  ${formData.get("quantity") as string},
      description =  ${formData.get("description") as string},
      productImg =  ${formData.get("imgUrl") as string}
    where id = ${product.id}
    `
    return {success: true}
  }
  catch(error){
    return{error: "Failed to update product"};
  }
}

export async function createProduct(formData: FormData){
  try{
  const user = await getCurrentUser();
  if (!user) return {error: "Failed to retreive user on creation"}
  const name = formData.get("name") as string;
  const price = formData.get("price") as string;
  const quantity = formData.get("quantity") as string;
  const description = formData.get("description") as string;
  const imgUrl = formData.get("imgUrl") as string;
  await sql `
  INSERT into products
  (name, price, quantity, description, productImg, userId)
  VALUES(${name}, ${price}, ${quantity}, ${description}, ${imgUrl}, ${user.id})
  `
  return {success:true}
  }
  catch(error){
    return{error: "Failed to Create Product"}
  }
}

export async function deleteProduct(id:string) {
  try{
  await sql`
    DELETE from products 
    WHERE id = ${id}
  `
  }
  catch(error){
    return{error:"Failed to Delete Product"}
  }
}

export async function deleteAccount(){
  try{
  const user = await getCurrentUser()
  if (user == null) return
  await sql`
  DELETE FROM account
  WHERE id = ${user.id}
  `
  await sql`
      DELETE FROM products
      WHERE userId = ${user.id}
    `;
       
  const cookieStore = await cookies();
    cookieStore.delete("userId");
  }
  catch(error){
    return{error:"Failed to Delete Account"}
  }
}