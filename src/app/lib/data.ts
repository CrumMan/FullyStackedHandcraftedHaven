import postgres from "postgres";

// 1. Safe connection setup
const connectionString = process.env.POSTGRES_URL;
const sql = postgres(connectionString || "", { 
  ssl: "require",
  connect_timeout: 1 // Prevents the app from hanging if the DB is unreachable
});

// Helper to check if DB is connected
const isDbConnected = !!connectionString;

// fetch all products with seller info
export async function getProducts() {
  if (!isDbConnected) {
    console.warn("⚠️ Database URL missing. Returning empty product list.");
    return [];
  }

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

// fetch single product by id
export async function getProductById(id: string) {
  if (!isDbConnected) return null;
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
  if (!isDbConnected) return null;
  try {
    const sellers = await sql`
      SELECT id, username, name, email, role, bio, userPhoto, approved
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
  if (!isDbConnected) return [];
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
  if (!isDbConnected) return null;
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
  if (!isDbConnected) return [];
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