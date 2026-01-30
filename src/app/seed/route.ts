import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { users, products } from '../lib/placeholder-data'
const sql = postgres(process.env.POSTGRES_URL!, {ssl: 'require'});
async function dropSeededProducts() {
  await sql`DROP TABLE IF EXISTS products`
}
async function seedProducts(){
  await sql`
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

  userId UUID NOT NULL,
  name VARCHAR(20) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  description TEXT NOT NULL,
  productImg TEXT NOT NULL,

  CONSTRAINT fk_user
    FOREIGN KEY (userId)
    REFERENCES account(id)
    ON DELETE CASCADE
);
`;
  const insertedProducts = await Promise.all(
    products.map(async (product) =>{
      return sql `
      INSERT INTO products (id, userId, name, price, quantity, description, productImg)
      VALUES (${product.id}, ${product.userId}, ${product.name}, ${product.price}, ${product.quantity}, ${product.description}, ${product.productImg})
      ON CONFLICT (id) DO NOTHING;
      `
    })
  )
  return insertedProducts;
}

async function dropSeededAccount(){
  const text = 'worked';
  try{
    await sql  `DROP TABLE IF EXISTS account`
  }
  catch(error){console.log(error);
  }
  return text;

}

async function seedAccount() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  
  try { await sql` CREATE TYPE authorization_type AS ENUM ('User', 'Creator', 'Admin'); `; } 
    catch (error) { console.log("ENUM ERROR CODE:", (error as any).code);
     if ((error as any).code !== '42710'){
       throw error; }
  }

  await sql`
  CREATE TABLE IF NOT EXISTS account (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username VARCHAR(25) NOT NULL,
    name VARCHAR(50) NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role authorization_type NOT NULL,
    bio TEXT NULL,
    userPhoto TEXT NOT NULL
  );
`;

  
  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO account (id, username, name, email, password, role, bio, userPhoto)
        VALUES (${user.id}, ${user.username}, ${user.name}, ${user.email}, ${hashedPassword}, ${user.role}, ${user.bio}, ${user.userPhoto})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}


export async function GET() {
  try {
    console.log("POSTGRES_URL:", process.env.POSTGRES_URL);
    const result = await sql.begin((sql) => [
      dropSeededAccount(),
      seedAccount(),
    ]);
    const newResult = await sql.begin((sql) => [
      
      dropSeededProducts(),
      seedProducts(),
    ]);

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.log(error)
    return Response.json({ error }, { status: 500 });
  }
}
