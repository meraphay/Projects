import { getDb, saveDb } from './db.js'
import { queryAll, execute } from './query.js'

export async function seed() {
  const db = await getDb()

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT DEFAULT '',
    verified INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  )`)

  db.run(`CREATE TABLE IF NOT EXISTS verification_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    used INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  )`)

  db.run(`CREATE TABLE IF NOT EXISTS cities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  )`)

  db.run(`CREATE TABLE IF NOT EXISTS buses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    departure_city_id INTEGER,
    arrival_city_id INTEGER,
    departure_time TEXT NOT NULL,
    arrival_time TEXT NOT NULL,
    duration TEXT NOT NULL,
    date TEXT NOT NULL,
    fare REAL NOT NULL,
    total_seats INTEGER DEFAULT 40,
    FOREIGN KEY (departure_city_id) REFERENCES cities(id),
    FOREIGN KEY (arrival_city_id) REFERENCES cities(id)
  )`)

  db.run(`CREATE TABLE IF NOT EXISTS seats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bus_id INTEGER,
    seat_number TEXT NOT NULL,
    is_booked INTEGER DEFAULT 0,
    FOREIGN KEY (bus_id) REFERENCES buses(id)
  )`)

  db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    bus_id INTEGER,
    seat_ids TEXT NOT NULL,
    total_fare REAL NOT NULL,
    booking_date TEXT NOT NULL,
    status TEXT DEFAULT 'confirmed',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (bus_id) REFERENCES buses(id)
  )`)

  const existingCities = queryAll("SELECT COUNT(*) as c FROM cities")
  if (!existingCities.length || existingCities[0].c === 0) {
    const cities = ['Islamabad', 'Lahore', 'Karachi', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala']
    for (const city of cities) {
      execute("INSERT OR IGNORE INTO cities (name) VALUES (?)", [city])
    }
  }

  const existingBuses = queryAll("SELECT COUNT(*) as c FROM buses")
  if (!existingBuses.length || existingBuses[0].c === 0) {
    const cityRows = queryAll("SELECT id, name FROM cities")
    const cityMap = {}
    for (const row of cityRows) {
      cityMap[row.name] = row.id
    }

    const busData = [
      { name: 'SkyWay Travels', type: 'AC Sleeper', dep: 'Lahore', arr: 'Islamabad', dt: '08:00', at: '12:00', dur: '4h', date: '2026-07-20', fare: 1500 },
      { name: 'Faisal Movers', type: 'AC Standard', dep: 'Lahore', arr: 'Islamabad', dt: '10:00', at: '14:30', dur: '4h 30m', date: '2026-07-20', fare: 1200 },
      { name: 'Daewoo Express', type: 'AC Luxury', dep: 'Islamabad', arr: 'Lahore', dt: '09:00', at: '13:00', dur: '4h', date: '2026-07-20', fare: 1800 },
      { name: 'New Khan Bus', type: 'AC Sleeper', dep: 'Karachi', arr: 'Lahore', dt: '22:00', at: '10:00', dur: '12h', date: '2026-07-20', fare: 3000 },
      { name: 'Bilal Travels', type: 'AC Standard', dep: 'Islamabad', arr: 'Rawalpindi', dt: '07:30', at: '08:00', dur: '30m', date: '2026-07-20', fare: 300 },
      { name: 'SkyWay Travels', type: 'AC Sleeper', dep: 'Lahore', arr: 'Karachi', dt: '21:00', at: '09:00', dur: '12h', date: '2026-07-20', fare: 3500 },
      { name: 'Faisal Movers', type: 'AC Standard', dep: 'Islamabad', arr: 'Lahore', dt: '14:00', at: '18:30', dur: '4h 30m', date: '2026-07-20', fare: 1200 },
      { name: 'Daewoo Express', type: 'AC Luxury', dep: 'Lahore', arr: 'Multan', dt: '08:00', at: '14:00', dur: '6h', date: '2026-07-20', fare: 2200 },
      { name: 'New Khan Bus', type: 'AC Sleeper', dep: 'Multan', arr: 'Karachi', dt: '23:00', at: '07:00', dur: '8h', date: '2026-07-20', fare: 2500 },
      { name: 'Bilal Travels', type: 'AC Standard', dep: 'Peshawar', arr: 'Islamabad', dt: '06:00', at: '09:00', dur: '3h', date: '2026-07-20', fare: 800 },
      { name: 'SkyWay Travels', type: 'AC Sleeper', dep: 'Sialkot', arr: 'Lahore', dt: '09:00', at: '11:00', dur: '2h', date: '2026-07-20', fare: 600 },
      { name: 'Faisal Movers', type: 'AC Standard', dep: 'Faisalabad', arr: 'Islamabad', dt: '07:00', at: '11:30', dur: '4h 30m', date: '2026-07-20', fare: 1000 },
      { name: 'Daewoo Express', type: 'AC Luxury', dep: 'Rawalpindi', arr: 'Peshawar', dt: '10:00', at: '13:00', dur: '3h', date: '2026-07-20', fare: 1500 },
      { name: 'New Khan Bus', type: 'AC Sleeper', dep: 'Karachi', arr: 'Islamabad', dt: '20:00', at: '10:00', dur: '14h', date: '2026-07-20', fare: 4000 },
      { name: 'Bilal Travels', type: 'AC Standard', dep: 'Gujranwala', arr: 'Lahore', dt: '08:00', at: '09:00', dur: '1h', date: '2026-07-20', fare: 400 },
    ]

    for (const bus of busData) {
      const depId = cityMap[bus.dep]
      const arrId = cityMap[bus.arr]
      if (!depId || !arrId) continue

      const busId = execute(
        "INSERT INTO buses (name, type, departure_city_id, arrival_city_id, departure_time, arrival_time, duration, date, fare, total_seats) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [bus.name, bus.type, depId, arrId, bus.dt, bus.at, bus.dur, bus.date, bus.fare, 40]
      )

      const seatLetters = ['A', 'B', 'C', 'D']
      for (let row = 1; row <= 10; row++) {
        for (const letter of seatLetters) {
          execute("INSERT INTO seats (bus_id, seat_number, is_booked) VALUES (?, ?, 0)", [busId, `${letter}${row}`])
        }
      }
    }
  }

  saveDb()
}

if (process.argv[1]?.endsWith('seed.js')) {
  seed().then(() => console.log('Database seeded successfully!')).catch(console.error)
}
