import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { users } from '../lib/placeholder-data'
const sql = postgres(process.env.POSTGRES_URL!, {ssl: 'require'});



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
    bio TEXT NULL
  );
`;

  
  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO account (id, username, name, email, password, role, bio)
        VALUES (${user.id}, ${user.username}, ${user.name}, ${user.email}, ${hashedPassword}, ${user.role}, ${user.bio})
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
      seedAccount(),
    ]);

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.log(error)
    return Response.json({ error }, { status: 500 });
  }
}
