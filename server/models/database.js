import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function initDb() {
  const db = await open({
    filename: './data.db',
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS cache (
      type TEXT,
      city TEXT,
      data TEXT,
      timestamp INTEGER,
      UNIQUE(type, city)
    );
    CREATE TABLE IF NOT EXISTS favorites (
      city TEXT UNIQUE
    );
  `);
  return db;
}

const db = await initDb();

export const getCached = async (type, city, ttl) => {
  const row = await db.get('SELECT data, timestamp FROM cache WHERE type = ? AND city = ?', [type, city.toLowerCase()]);
  if (row && (Date.now() - row.timestamp < ttl * 1000)) {
    return JSON.parse(row.data);
  }
  return null;
};

export const setCached = async (type, city, data) => {
  await db.run(
    'INSERT OR REPLACE INTO cache (type, city, data, timestamp) VALUES (?, ?, ?, ?)',
    [type, city.toLowerCase(), JSON.stringify(data), Date.now()]
  );
};

export const addFavorite = async (city) => {
  await db.run('INSERT OR IGNORE INTO favorites (city) VALUES (?)', [city]);
};

export const removeFavorite = async (city) => {
  await db.run('DELETE FROM favorites WHERE city = ?', [city]);
};

export const getFavorites = async () => {
  const rows = await db.all('SELECT city FROM favorites');
  return rows.map((r) => r.city);
};