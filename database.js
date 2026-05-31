const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, 'lspd.db');

let db;

async function initializeDatabase() {
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Enable WAL mode for better performance
  await db.exec('PRAGMA journal_mode = WAL');
  await db.exec('PRAGMA foreign_keys = ON');

  // Create tables
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      excerpt TEXT,
      author TEXT NOT NULL,
      image TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS leadership (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      rank TEXT NOT NULL,
      photo TEXT,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS recruitment_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      type TEXT DEFAULT 'text',
      options TEXT,
      sort_order INTEGER DEFAULT 0,
      required INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS recruitment_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      username TEXT NOT NULL,
      answers TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      admin_note TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS complaints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT NOT NULL,
      email TEXT,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      admin_note TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS divisions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      photo TEXT,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);

  // Seed admin account
  const adminExists = await db.get('SELECT id FROM users WHERE username = ?', 'admin');
  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    await db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ['admin', hashedPassword, 'admin']);
    console.log('✅ Admin account created (admin / admin123)');
  }

  // Seed default recruitment questions
  const questionsCount = await db.get('SELECT COUNT(*) as count FROM recruitment_questions');
  if (questionsCount.count === 0) {
    const defaultQuestions = [
      { question: 'Jaké je vaše celé jméno (IC)?', type: 'text', sort_order: 1 },
      { question: 'Kolik vám je let (IC)?', type: 'text', sort_order: 2 },
      { question: 'Jaké je vaše telefonní číslo (IC)?', type: 'text', sort_order: 3 },
      { question: 'Proč chcete vstoupit do LSPD?', type: 'textarea', sort_order: 4 },
      { question: 'Máte předchozí zkušenosti u bezpečnostních složek?', type: 'textarea', sort_order: 5 },
      { question: 'Máte čistý trestní rejstřík?', type: 'select', options: JSON.stringify(['Ano', 'Ne']), sort_order: 6 },
      { question: 'Kolik hodin týdně můžete věnovat službě?', type: 'text', sort_order: 7 },
      { question: 'Popište situaci, kdy jste museli řešit konflikt.', type: 'textarea', sort_order: 8 },
    ];

    for (const q of defaultQuestions) {
      await db.run(
        'INSERT INTO recruitment_questions (question, type, options, sort_order) VALUES (?, ?, ?, ?)',
        [q.question, q.type, q.options || null, q.sort_order]
      );
    }
    console.log('✅ Default recruitment questions seeded');
  }

  // Seed default leadership
  const leadershipCount = await db.get('SELECT COUNT(*) as count FROM leadership');
  if (leadershipCount.count === 0) {
    const defaultLeadership = [
      { name: 'James Mitchell', rank: 'Chief of Police', sort_order: 1 },
      { name: 'Sarah Williams', rank: 'Assistant Chief', sort_order: 2 },
      { name: 'Robert Chen', rank: 'Deputy Chief', sort_order: 3 },
    ];

    for (const l of defaultLeadership) {
      await db.run('INSERT INTO leadership (name, rank, sort_order) VALUES (?, ?, ?)', [l.name, l.rank, l.sort_order]);
    }
    console.log('✅ Default leadership seeded');
  }

  // Seed default posts
  const postsCount = await db.get('SELECT COUNT(*) as count FROM posts');
  if (postsCount.count === 0) {
    const defaultPosts = [
      {
        title: 'LSPD zahajuje novou náborovou kampaň',
        content: 'Los Santos Police Department oznamuje spuštění nové náborové kampaně. Hledáme odvážné muže a ženy, kteří chtějí sloužit a chránit občany Los Santos. Přihlášky přijímáme prostřednictvím našeho online náborového formuláře.\n\nPožadavky:\n- Čistý trestní rejstřík\n- Věk minimálně 21 let\n- Platný řidičský průkaz\n- Fyzická a psychická způsobilost\n\nVšichni uchazeči projdou důkladným výběrovým řízením včetně fyzických testů, psychologického hodnocení a pohovoru.',
        excerpt: 'Hledáme nové příslušníky do řad LSPD. Přidejte se k nám a pomozte chránit Los Santos.',
        author: 'admin'
      },
      {
        title: 'Úspěšná operace proti pouličním gangům',
        content: 'V rámci operace "Clean Streets" se příslušníkům LSPD podařilo zadržet několik klíčových členů pouličních gangů v oblasti South Los Santos. Operace probíhala několik týdnů a vyústila v zabavení velkého množství nelegálních zbraní a drog.\n\nChief Mitchell k operaci uvedl: "Tato akce jasně ukazuje, že LSPD netoleruje organizovaný zločin v našem městě. Budeme pokračovat v boji za bezpečnější Los Santos."',
        excerpt: 'Operace Clean Streets přinesla významné výsledky v boji proti organizovanému zločinu.',
        author: 'admin'
      }
    ];

    for (const p of defaultPosts) {
      await db.run(
        'INSERT INTO posts (title, content, excerpt, author) VALUES (?, ?, ?, ?)',
        [p.title, p.content, p.excerpt, p.author]
      );
    }
    console.log('✅ Default posts seeded');
  }

  // Seed default settings
  const settingsCount = await db.get('SELECT COUNT(*) as count FROM settings');
  if (settingsCount.count === 0) {
    const defaultSettings = [
      { key: 'primary_color', value: '#d4af37' },
      { key: 'logo_url', value: '/img/logo.png' },
      { key: 'hero_images', value: JSON.stringify(['/img/hero-bg.png']) },
      { key: 'about_us_text', value: 'San Andreas Highway Patrol je elitní složkou státní policie zodpovědnou za bezpečnost na dálnicích a hlavních silničních tazích státu San Andreas. Naším posláním je chránit životy, prosazovat dopravní zákony a poskytovat pomoc všem řidičům.\n\nDisponujeme moderním vybavením, profesionálně vyškolenými troopery a širokou škálou specializovaných jednotek — od vrtulníkové podpory přes K9 jednotky až po speciální zásahové týmy. Sloužíme nepřetržitě, 24 hodin denně, 7 dní v týdnu.' }
    ];

    for (const s of defaultSettings) {
      await db.run('INSERT INTO settings (key, value) VALUES (?, ?)', [s.key, s.value]);
    }
    console.log('✅ Default settings seeded');
  }

  // Seed default divisions
  const divisionsCount = await db.get('SELECT COUNT(*) as count FROM divisions');
  if (divisionsCount.count === 0) {
    const defaultDivisions = [
      { name: 'Patrol Division', description: 'Základní pilíř LSPD. Zajišťuje hlídkovou činnost, bezpečnost na silnicích a první kontakt s občany při krizových situacích.', sort_order: 1 },
      { name: 'Traffic Division', description: 'Specializovaná divize zaměřující se na plynulost a bezpečnost dopravy, vyšetřování dopravních nehod a pronásledování vozidel.', sort_order: 2 }
    ];
    for (const d of defaultDivisions) {
      await db.run('INSERT INTO divisions (name, description, sort_order) VALUES (?, ?, ?)', [d.name, d.description, d.sort_order]);
    }
    console.log('✅ Default divisions seeded');
  }

  console.log('✅ Database initialized successfully');
  return db;
}

function getDb() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}

module.exports = { initializeDatabase, getDb };
