import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

export type Database = PostgresJsDatabase<typeof schema>

const globalForDb = globalThis as unknown as {
  __qalmarPostgres?: ReturnType<typeof postgres>
  __qalmarDb?: Database
  __qalmarConnectionString?: string
}

function cleanConnectionString(connectionString: string): string {
  try {
    const url = new URL(connectionString)
    // postgres.js uses prepare: false instead of this node-postgres flag
    url.searchParams.delete('pgbouncer')
    return url.toString()
  } catch {
    return connectionString
  }
}

function getDb(): Database {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is not set. Add it to .env.local and restart the dev server.'
    )
  }

  if (
    globalForDb.__qalmarDb &&
    globalForDb.__qalmarConnectionString === connectionString
  ) {
    return globalForDb.__qalmarDb
  }

  if (globalForDb.__qalmarPostgres) {
    void globalForDb.__qalmarPostgres.end({ timeout: 1 }).catch(() => undefined)
    globalForDb.__qalmarPostgres = undefined
    globalForDb.__qalmarDb = undefined
  }

  // prepare: false — required by the Supabase transaction pooler (port 6543)
  globalForDb.__qalmarPostgres = postgres(cleanConnectionString(connectionString), {
    prepare: false,
  })
  globalForDb.__qalmarDb = drizzle(globalForDb.__qalmarPostgres, { schema })
  globalForDb.__qalmarConnectionString = connectionString
  return globalForDb.__qalmarDb
}

export const db = new Proxy({} as Database, {
  get(_target, prop) {
    const instance = getDb()
    const value = Reflect.get(instance, prop, instance)
    return typeof value === 'function' ? value.bind(instance) : value
  },
})
