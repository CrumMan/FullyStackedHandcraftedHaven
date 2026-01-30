import bcrypt from 'bcrypt';
import postgres from 'postgres';
<<<<<<< HEAD
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
=======
import { users, listings } from '../lib/placeholder-data';

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL is not defined");
}

const sql = postgres(process.env.POSTGRES_URL, {
  ssl: process.env.NODE_ENV === "production" ? "require" : false,
});
>>>>>>> 07c8fa69d840ff1f4ea9c7e7498efb23d6f2ef29

async function seedAccount() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  // Create ENUM safely
  try {
    await sql`
      CREATE TYPE authorization_type AS ENUM ('User', 'Creator', 'Admin');
    `;
  } catch (error: any) {
    // 42710 = duplicate_object
    if (error.code !== '42710') {
      throw error;
    }
  }

  await sql`
<<<<<<< HEAD
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
=======
    CREATE TABLE IF NOT EXISTS account (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      username VARCHAR(25) NOT NULL,
      name VARCHAR(50) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role authorization_type NOT NULL,
      bio TEXT NULL
    );
  `;
>>>>>>> 07c8fa69d840ff1f4ea9c7e7498efb23d6f2ef29

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
<<<<<<< HEAD
        INSERT INTO account (id, username, name, email, password, role, bio, userPhoto)
        VALUES (${user.id}, ${user.username}, ${user.name}, ${user.email}, ${hashedPassword}, ${user.role}, ${user.bio}, ${user.userPhoto})
=======
        INSERT INTO account (
          id, username, name, email, password, role, bio
        )
        VALUES (
          ${user.id},
          ${user.username},
          ${user.name},
          ${user.email},
          ${hashedPassword},
          ${user.role},
          ${user.bio}
        )
>>>>>>> 07c8fa69d840ff1f4ea9c7e7498efb23d6f2ef29
        ON CONFLICT (id) DO NOTHING;
      `;
    })
  );

  return insertedUsers;
}

async function seedListings() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

<<<<<<< HEAD
export async function GET() {
  try {
    console.log("POSTGRES_URL:", process.env.POSTGRES_URL);
    const result = await sql.begin((sql) => [
      // dropSeededAccount(),
      // seedAccount(),
      // dropSeededProducts(),
      // seedProducts(),
=======
  await sql`
    CREATE TABLE IF NOT EXISTS listings (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      artist_id UUID NOT NULL,
      description TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price NUMERIC(10,2) NOT NULL,
      keywords TEXT[],
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  const insertedListings = await Promise.all(
    listings.map((listing) => {
      return sql`
        INSERT INTO listings (
          id,
          artist_id,
          description,
          quantity,
          price,
          keywords
        )
        VALUES (
          ${listing.id},
          ${listing.artist_id},
          ${listing.description},
          ${listing.quantity},
          ${listing.price},
          ${listing.keywords}
        )
        ON CONFLICT (id) DO NOTHING;
      `;
    })
  );

  return insertedListings;
}

export async function GET() {
  try {
    await sql.begin(() => [
      seedAccount(),
      seedListings(),
>>>>>>> 07c8fa69d840ff1f4ea9c7e7498efb23d6f2ef29
    ]);

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}
