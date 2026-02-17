import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

// fetch all products with seller info
export async function getProducts() {
  try {
    const products = await sql`
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
    `; 
    return products;
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}

export async function getFeatured() {
  try {
    const products = await sql`
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
      ORDER BY p.quantity ASC
      LIMIT 6
    `; 
    return products;
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}

// fetch single product by id
export async function getProductById(id: string) {
  try {
    const products = await sql`
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
      WHERE p.id = ${id}
    `;
    return products[0] || null;
  } catch (error) {
    console.error("Database Error:", error);
    return null;
  }
}

// fetch seller by id
export async function getSellerById(id: string) {
  try {
    const sellers = await sql`
      SELECT id, username, name, email, role, bio, userPhoto, approved, userimg
      FROM account
      WHERE id = ${id}
    `;
    return sellers[0] || null;
  } catch (error) {
    console.error("Database Error:", error);
    return null;
  }
}

// fetch products by seller id
export async function getProductsBySeller(sellerId: string) {
  try {
    const products = await sql`
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
      WHERE p.userId = ${sellerId}
    `;
    return products;
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}

// fetch user by email (for login)
export async function getUserByEmail(email: string) {
  try {
    const users = await sql`
      SELECT id, username, name, email, password, role, bio, userPhoto, approved
      FROM account
      WHERE email = ${email}
    `;
    return users[0] || null;
  } catch (error) {
    console.error("Database Error:", error);
    return null;
  }
}

// fetch all sellers pending approval (for admin)
export async function getPendingSellers() {
  try {
    const sellers = await sql`
      SELECT id, username, name, email, role, bio, userPhoto, approved, createdAt
      FROM account
      WHERE role = 'Seller' AND approved = false
    `;
    return sellers;
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}
export async function getReviewInfo(id:string) {
  try{
    const result = await sql `
    SELECT
    r.id,
    r.userId,
    r.productId,
    r.author,
    r.rating,
    r.comment
    FROM reviews r
    where (r.productId = ${id});
    `;
    if(result) return result;
    else return null
  }
  catch(error){
    console.error("Database Error: ", error)
  }
}