import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { users, listings } from '../lib/placeholder-data';

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL is not defined");
}

const sql = postgres(process.env.POSTGRES_URL, {
  ssl: process.env.NODE_ENV === "production" ? "require" : false,
});

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

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
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
        ON CONFLICT (id) DO NOTHING;
      `;
    })
  );

  return insertedUsers;
}

async function seedListings() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

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
    ]);

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}
