import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

export type Database = PostgresJsDatabase<typeof schema>

const globalForDb = globalThis as unknown as {
  __qalmarPostgres?: ReturnType<typeof postgres>
  __qalmarDb?: Database
}

function getDb(): Database {
  if (globalForDb.__qalmarDb) return globalForDb.__qalmarDb

  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is not set. Add it to .env.local and restart the dev server.'
    )
  }

  // prepare: false — required by the Supabase transaction pooler (port 6543)
  globalForDb.__qalmarPostgres = postgres(connectionString, { prepare: false })
  globalForDb.__qalmarDb = drizzle(globalForDb.__qalmarPostgres, { schema })
  return globalForDb.__qalmarDb
}

export const db = new Proxy({} as Database, {
  get(_target, prop) {
    const instance = getDb()
    const value = Reflect.get(instance, prop, instance)
    return typeof value === 'function' ? value.bind(instance) : value
  },
})
