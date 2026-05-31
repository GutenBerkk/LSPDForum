const fs = require('fs');
const path = require('path');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const bcrypt = require('bcryptjs');

async function main() {
  const replacements = [
    {
      file: 'public/js/pages/divisions.js',
      changes: [
        ['Žádné divize k zobrazení', 'Žádná oddělení k zobrazení'],
        ['Momentálně zde nejsou žádné divize LSPD.', 'Momentálně zde nejsou žádná oddělení LSPD.'],
        ['Divize LSPD', 'Oddělení LSPD'],
        ['Seznamte se s jednotlivými divizemi našeho oddělení a jejich specializacemi.', 'Seznamte se s jednotlivými odděleními a jejich specializacemi.']
      ]
    },
    {
      file: 'public/js/app.js',
      changes: [
        ["title: 'Divize — LSPD'", "title: 'Oddělení — LSPD'"]
      ]
    },
    {
      file: 'public/js/pages/admin.js',
      changes: [
        ['🏢 Divize', '🏢 Oddělení'],
        ['Divize LSPD', 'Oddělení LSPD'],
        ['Žádné divize', 'Žádná oddělení'],
        ['Nová Divize', 'Nové oddělení'],
        ['Název divize', 'Název oddělení'],
        ['Divize přidána', 'Oddělení přidáno'],
        ['Divize upravena', 'Oddělení upraveno'],
        ['Divize smazána.', 'Oddělení smazáno.']
      ]
    },
    {
      file: 'public/index.html',
      changes: [
        ['>Divize<', '>Oddělení<']
      ]
    },
    {
      file: 'routes/divisions.js',
      changes: [
        ['Název divize je povinný.', 'Název oddělení je povinný.'],
        ['Divize byla přidána.', 'Oddělení bylo přidáno.'],
        ['Divize nebyla nalezena.', 'Oddělení nebylo nalezeno.'],
        ['Divize byla aktualizována.', 'Oddělení bylo aktualizováno.'],
        ['Divize byla smazána.', 'Oddělení bylo smazáno.']
      ]
    }
  ];

  for (const rep of replacements) {
    const filePath = path.join(__dirname, rep.file);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      for (const [oldStr, newStr] of rep.changes) {
        content = content.split(oldStr).join(newStr);
      }
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${rep.file}`);
    }
  }

  // Create admin user
  const dbPath = path.join(__dirname, 'lspd.db');
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  const username = "Administrative Services Bureau";
  const password = "admin";
  const hashedPassword = bcrypt.hashSync(password, 10);
  const role = "admin";

  const userExists = await db.get('SELECT id FROM users WHERE username = ?', username);
  if (!userExists) {
    await db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, role]);
    console.log(`User ${username} created with role admin.`);
  } else {
    console.log(`User ${username} already exists.`);
  }
}

main().catch(console.error);
