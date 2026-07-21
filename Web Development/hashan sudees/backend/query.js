import { getDb, saveDb } from './db.js'

let _db = null

export function setDbRef(db) {
  _db = db
}

function getDatabase() {
  if (!_db) {
    _db = getDb._db
  }
  return _db
}

function queryAll(sql, params = []) {
  const db = getDatabase()
  if (!db) return []
  try {
    const stmt = db.prepare(sql)
    if (params.length > 0) stmt.bind(params)
    const rows = []
    while (stmt.step()) {
      rows.push(stmt.getAsObject())
    }
    stmt.free()
    return rows
  } catch (err) {
    const result = db.exec(sql)
    if (!result.length) return []
    const cols = result[0].columns
    return result[0].values.map(v => {
      const obj = {}
      cols.forEach((c, i) => obj[c] = v[i])
      return obj
    })
  }
}

function queryOne(sql, params = []) {
  const rows = queryAll(sql, params)
  return rows.length > 0 ? rows[0] : null
}

function execute(sql, params = []) {
  const db = getDatabase()
  if (!db) return null
  try {
    const results = db.exec(sql + "; SELECT last_insert_rowid() as id", params)
    saveDb()
    const idResult = results.find(r => r.columns?.includes('id'))
    return idResult?.values[0]?.[0] ?? null
  } catch (err) {
    console.error('SQL execute error:', err.message, sql)
    throw err
  }
}

function insert(sql, params = []) {
  const db = getDatabase()
  if (!db) return null
  try {
    const results = db.exec(sql + "; SELECT last_insert_rowid() as id", params)
    saveDb()
    const idResult = results.find(r => r.columns?.includes('id'))
    return idResult?.values[0]?.[0] ?? null
  } catch (err) {
    console.error('SQL insert error:', err.message, sql)
    throw err
  }
}

export { queryAll, queryOne, execute, insert, getDatabase }
