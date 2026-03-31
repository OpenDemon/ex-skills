import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  personas,
  personaFiles,
  messages,
  InsertPersona,
  InsertPersonaFile,
  InsertMessage,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ─── Persona helpers ─────────────────────────────────────────────────────────

export async function createPersona(data: InsertPersona) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const [result] = await db.insert(personas).values(data);
  return (result as any).insertId as number;
}

export async function getPersonasByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(personas)
    .where(eq(personas.userId, userId))
    .orderBy(desc(personas.updatedAt));
}

export async function getPersonaById(id: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(personas)
    .where(and(eq(personas.id, id), eq(personas.userId, userId)))
    .limit(1);
  return result[0];
}

export async function updatePersona(
  id: number,
  userId: number,
  data: Partial<InsertPersona>
) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db
    .update(personas)
    .set(data)
    .where(and(eq(personas.id, id), eq(personas.userId, userId)));
}

export async function deletePersona(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db
    .delete(personas)
    .where(and(eq(personas.id, id), eq(personas.userId, userId)));
}

// ─── PersonaFile helpers ─────────────────────────────────────────────────────

export async function createPersonaFile(data: InsertPersonaFile) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const [result] = await db.insert(personaFiles).values(data);
  return (result as any).insertId as number;
}

export async function getFilesByPersonaId(personaId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(personaFiles)
    .where(eq(personaFiles.personaId, personaId))
    .orderBy(desc(personaFiles.createdAt));
}

export async function updatePersonaFile(
  id: number,
  data: Partial<InsertPersonaFile>
) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(personaFiles).set(data).where(eq(personaFiles.id, id));
}

// ─── Message helpers ─────────────────────────────────────────────────────────

export async function createMessage(data: InsertMessage) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const [result] = await db.insert(messages).values(data);
  return (result as any).insertId as number;
}

export async function getMessagesByPersonaId(personaId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select()
    .from(messages)
    .where(eq(messages.personaId, personaId))
    .orderBy(desc(messages.createdAt))
    .limit(limit);
  return rows.reverse();
}

export async function clearMessagesByPersonaId(personaId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db
    .delete(messages)
    .where(and(eq(messages.personaId, personaId), eq(messages.userId, userId)));
}
