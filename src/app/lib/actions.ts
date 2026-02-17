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
  const userimg = formData.get("userimg") as string;

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
      INSERT INTO account (username, name, email, password, role, bio, approved, userimg)
      VALUES (${username}, ${name}, ${email}, ${hashedPassword}, ${role}, ${bio || ""}, ${approved}, ${userimg || ""})
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
      SELECT id, username, name, email, role, bio, userPhoto, approved, userimg
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
    bio = ${formData.get("bio") as string},
    userimg = ${formData.get("userimg")as string}
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
export async function createReview(formData: FormData, id:string){
  try{
    const user = await getCurrentUser();
    if(!user){throw new Error("User not found")}
    await sql `
    INSERT INTO reviews (userId, productId, comment, rating, author)
    VALUES(${user.id}, ${id}, ${formData.get("comment")as string}, ${Number(formData.get("rating"))}, ${user.name})
    `
    return { success: true };
  }

  catch(error){
    return{error:"Failed to Create Review"}
  }
}

// Delete a review - user can only delete their own, admin can delete any
export async function deleteReview(reviewId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: "Not authenticated" };
    }

    // Check if review exists and get its owner
    const reviews = await sql`
      SELECT id, userId FROM reviews WHERE id = ${reviewId}
    `;

    if (reviews.length === 0) {
      return { error: "Review not found" };
    }

    const review = reviews[0];

    // Only allow deletion if user owns the review or is admin
    if (review.userid !== user.id && user.role !== "Admin") {
      return { error: "You can only delete your own reviews" };
    }

    await sql`DELETE FROM reviews WHERE id = ${reviewId}`;
    return { success: true };
  } catch (error) {
    console.error("Delete review error:", error);
    return { error: "Failed to delete review" };
  }
}

// Admin: delete any account
export async function adminDeleteAccount(accountId: string) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "Admin") {
      return { error: "Admin access required" };
    }

    // Prevent admin from deleting themselves
    if (accountId === user.id) {
      return { error: "Cannot delete your own admin account" };
    }

    // Products will cascade delete due to FK constraint
    await sql`DELETE FROM account WHERE id = ${accountId}`;
    return { success: true };
  } catch (error) {
    console.error("Admin delete account error:", error);
    return { error: "Failed to delete account" };
  }
}

// Change password - requires current password verification
export async function changePassword(formData: FormData) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: "Not authenticated" };
    }

    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return { error: "All fields are required" };
    }

    if (newPassword !== confirmPassword) {
      return { error: "New passwords do not match" };
    }

    if (newPassword.length < 6) {
      return { error: "Password must be at least 6 characters" };
    }

    // Get current hashed password from DB
    const accounts = await sql`
      SELECT password FROM account WHERE id = ${user.id}
    `;

    if (accounts.length === 0) {
      return { error: "Account not found" };
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, accounts[0].password);
    if (!isValid) {
      return { error: "Current password is incorrect" };
    }

    // Hash and save new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await sql`
      UPDATE account SET password = ${hashedPassword} WHERE id = ${user.id}
    `;

    return { success: true };
  } catch (error) {
    console.error("Change password error:", error);
    return { error: "Failed to change password" };
  }
}