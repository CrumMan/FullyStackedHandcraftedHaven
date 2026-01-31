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
        p.productImg,
        a.name as seller,
        a.id as sellerId
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
  try {
    const products = await sql`
      SELECT 
        p.id,
        p.name,
        p.price,
        p.quantity,
        p.description,
        p.productImg,
        a.name as seller,
        a.id as sellerId
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
