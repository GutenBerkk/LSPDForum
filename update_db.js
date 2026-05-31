const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');

async function updateDb() {
  const db = await open({
    filename: path.join(__dirname, 'lspd.db'),
    driver: sqlite3.Database
  });

  try {
    const newAboutText = `LSPD je policejní sbor města Los Santos. Slouží a chrání občany města již od roku 1907. Sbor se řídí heslem "fidelitas et verum"  věrnost a pravda.\n\nZákladna je na Vespucci, odkud koordinuje hlídky po celém městě. Sbor disponuje vlastním letectvem, detektivními skupinami, elitními taktickými jednotkami i výcvikovými programy pro nové rekruty.`;

    // Update settings
    await db.run('UPDATE settings SET value = ? WHERE key = ?', [newAboutText, 'about_us_text']);

    // Clear old divisions
    await db.run('DELETE FROM divisions');

    // Insert new divisions
    const divisions = [
      { name: 'K9', description: 'Psovodi s vycvičenými psy pro sledování a zadržení. "You can run, but you can\'t hide."' },
      { name: 'SWAT', description: 'Elitní taktická jednotka pro vysoce rizikové zásahy.' },
      { name: 'Metropolitan Division', description: 'Specializovaná divize s těžkým vybavením. "Can Do, Will Do."' },
      { name: 'Detective Services Group', description: 'Detektivní skupina vyšetřující závažnou trestnou činnost.' },
      { name: 'Recruitment & Employment Division', description: 'Nábor a přijímání nových členů LSPD.' },
      { name: 'Detective Training Program', description: 'Výcvik budoucích detektivů.' },
      { name: 'Mission Row Division', description: 'Divize sídlící na hlavní stanici LSPD.' },
      { name: 'Air Support Division', description: 'Letecká podpora z vrtulníků.' },
      { name: 'Internal Affairs Group', description: 'Vnitřní kontrola a profesionální standardy.' },
      { name: 'Supervisor Training Program', description: 'Výcvik pro vedoucí pracovníky.' },
      { name: 'Field Training Program', description: 'Terénní výcvik nových policistů.' },
      { name: 'Public Communications Division', description: 'Tisková a mediální divize, vztahy s veřejností.' },
      { name: 'Major Crimes Division', description: 'Vyšetřování závažné a organizované trestné činnosti. "When your day ends, our day begins."' },
      { name: 'Vespucci Gang Enforcement Detail', description: 'Speciální tým na potírání gangů v Los Santos.' }
    ];

    for (let i = 0; i < divisions.length; i++) {
      const d = divisions[i];
      await db.run('INSERT INTO divisions (name, description, sort_order, photo) VALUES (?, ?, ?, ?)', [d.name, d.description, i + 1, '/img/logo.png']);
    }

    console.log("Database updated successfully");
  } catch (e) {
    console.log("Error: " + e.message);
  }
}

updateDb();
