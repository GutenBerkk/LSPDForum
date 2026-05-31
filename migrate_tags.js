const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');

async function migrate() {
  const db = await open({
    filename: path.join(__dirname, 'lspd.db'),
    driver: sqlite3.Database
  });
  try {
    await db.exec("ALTER TABLE posts ADD COLUMN tag TEXT DEFAULT 'Informace'");
    console.log("Column added successfully");
  } catch (e) {
    console.log("Error: " + e.message);
  }
}
migrate();
