import bcrypt from 'bcryptjs';
import postgres from 'postgres';
import { users, products, reviews } from '../lib/placeholder-data'
import { error } from 'console';
const sql = postgres(process.env.POSTGRES_URL!, {ssl: 'require'});
async function dropSeededProducts() {
  await sql`DROP TABLE IF EXISTS products CASCADE`;
}

async function seedProducts() {
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      userId UUID NOT NULL,
      name VARCHAR(100) NOT NULL,
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
    products.map((product) => {
      return sql`
        INSERT INTO products (id, userId, name, price, quantity, description, productImg)
        VALUES (${product.id}, ${product.userId}, ${product.name}, ${product.price}, ${product.quantity}, ${product.description}, ${product.productImg})
        ON CONFLICT (id) DO NOTHING;
      `;
    })
  );

  return insertedProducts;
}

async function seedReviews(){
 await sql `
 CREATE TABLE IF NOT EXISTS reviews(
 id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

 userId UUID NOT NULL,
 author VARCHAR(20) NOT NULL,
 productId UUID NOT NULL,

 rating INT CHECK (rating between 1 and 5) NOT NULL,
 comment TEXT,

  CONSTRAINT fk_user
    FOREIGN KEY (userId)
    REFERENCES account(id)
    ON DELETE CASCADE,


  CONSTRAINT fk_product
    FOREIGN KEY (productId)
    REFERENCES products(id)
    ON DELETE CASCADE
 );
 ` 
  const insertedReviews = await Promise.all(
    reviews.map(async (review) =>{
      const authorResult = await sql `
      select name from account where (account.id = ${review.userId});
      `
      const author = authorResult[0].name
      return sql `
      INSERT INTO reviews( id, userId, productId, author, rating, comment)
      VALUES (${review.id},${review.userId}, ${review.productId}, ${author}, ${review.rating}, ${review.comment})
      ON CONFLICT (id) DO NOTHING;
    `
    })
  )
  return insertedReviews;
}
async function dropSeededReviews(){
  const text = 'worked';
  try{
    await sql  `DROP TABLE IF EXISTS reviews`
  }
  catch(error){console.log(error)}
}

async function dropSeededAccount(){
  const text = 'worked';
  try{
    await sql  `DROP TABLE IF EXISTS account`
  }
  catch(error){console.log(error)}
}

async function seedAccount() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  try {
    await sql`CREATE TYPE user_role AS ENUM ('Buyer', 'Seller', 'Admin');`;
  } catch (error) {
    const code = (error as { code?: string } | null)?.code;
    if (code !== "42710") {
      throw error;
    }
  }

  await sql`
    CREATE TABLE IF NOT EXISTS account (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      username VARCHAR(25) NOT NULL UNIQUE,
      name VARCHAR(50) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role user_role NOT NULL DEFAULT 'Buyer',
      bio TEXT,
      userPhoto TEXT,
      approved BOOLEAN DEFAULT false,
      createdAt TIMESTAMP DEFAULT NOW()
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO account (id, username, name, email, password, role, bio, userPhoto, approved)
        VALUES (${user.id}, ${user.username}, ${user.name}, ${user.email}, ${hashedPassword}, ${user.role}, ${user.bio}, ${user.userPhoto}, ${user.approved})
        ON CONFLICT (id) DO NOTHING;
      `;
    })
  );

  return insertedUsers;
}

async function alterAccount(){
  return sql`ALTER TABLE IF EXISTS account
              ADD COLUMN IF NOT EXISTS userimg text
  `
}

async function alterUserImg(){
  return sql `ALTER TABLE IF EXISTS account 
              ALTER COLUMN userimg TYPE TEXT
  `
}

export async function GET() {
  try {
    console.log("POSTGRES_URL:", process.env.POSTGRES_URL);  
      // await dropSeededAccount();
      // await seedAccount();
      
      // await dropSeededProducts();
      // await seedProducts();

      // await seedReviews();
      // await dropSeededReviews();

      // await alterAccount();
      await alterUserImg()
    return Response.json({ message: 'Database seeded successfully' });
    } catch (error) {
    console.log(error)
    return Response.json({ error }, { status: 500 });
    }
}