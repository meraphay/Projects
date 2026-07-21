import initSqlJs from 'sql.js'
import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import { setDbRef } from './query.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.join(__dirname, 'bookme.db')

let db = null

export async function getDb() {
  if (db) return db
  const SQL = await initSqlJs()
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH)
    db = new SQL.Database(buffer)
  } else {
    db = new SQL.Database()
  }
  getDb._db = db
  setDbRef(db)
  db.run("PRAGMA journal_mode=WAL")
  db.run("PRAGMA foreign_keys=ON")
  return db
}

export function saveDb() {
  if (!db) return
  try {
    const data = db.export()
    const buffer = Buffer.from(data)
    const tmp = DB_PATH + '.tmp'
    fs.writeFileSync(tmp, buffer)
    fs.renameSync(tmp, DB_PATH)
  } catch (err) {
    console.error('Failed to save database:', err)
  }
}

export function closeDb() {
  if (db) {
    saveDb()
    db.close()
    db = null
  }
}
