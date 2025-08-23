import Database from "better-sqlite3";

const db = new Database("./data.db", { verbose: console.log });

// Initialize DB tables
db.exec(`
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

export const getCached = (type, city, ttl) => {
  const row = db.prepare("SELECT data, timestamp FROM cache WHERE type = ? AND city = ?").get(type, city.toLowerCase());
  if (row && (Date.now() - row.timestamp < ttl * 1000)) {
    return JSON.parse(row.data);
  }
  return null;
};

export const setCached = (type, city, data) => {
  db.prepare("INSERT OR REPLACE INTO cache (type, city, data, timestamp) VALUES (?, ?, ?, ?)")
    .run(type, city.toLowerCase(), JSON.stringify(data), Date.now());
};

export const addFavorite = (city) => {
  db.prepare("INSERT OR IGNORE INTO favorites (city) VALUES (?)").run(city);
};

export const removeFavorite = (city) => {
  db.prepare("DELETE FROM favorites WHERE city = ?").run(city);
};

export const getFavorites = () => {
  const rows = db.prepare("SELECT city FROM favorites").all();
  return rows.map((r) => r.city);
};