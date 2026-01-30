import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { users } from '../lib/placeholder-data'
const sql = postgres(process.env.POSTGRES_URL!, {ssl: 'require'});

async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS user (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      username VARCHAR(25) NOT NULL,
      name VARCHAR(50) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      authorization ENUM ('User','Creator','Admin')
      bio TEXT NULL
    );
  `;
  
  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (id, username, name, email, password, authorization, bio)
        VALUES (${user.id}, ${user.username}, ${user.name}, ${user.email}, ${hashedPassword}, ${user.authorization}, ${user.bio})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

export async function GET() {
  try {
    const result = await sql.begin((sql) => [
      seedUsers(),
    ]);

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
