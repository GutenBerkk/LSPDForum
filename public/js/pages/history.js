/* ============================================
   LSPD — History Page
   ============================================ */

function renderHistoryPage() {
  return `
    <div class="page">
      <div class="page-header">
        <div class="container">
          <h1 class="page-title animate-fade-in-up">Historie sboru</h1>
          <p class="page-subtitle animate-fade-in-up" style="animation-delay: 0.1s;">
            Od založení po současnost — příběh Los Santos Police Department
          </p>
        </div>
      </div>

      <section class="section">
        <div class="container">
          <div class="timeline">

            <div class="timeline-item scroll-reveal">
              <div class="timeline-dot"></div>
              <div class="timeline-year">1889</div>
              <h3 class="timeline-title">Založení LSPD</h3>
              <p class="timeline-text">
                Los Santos Police Department bylo založeno jako první policejní složka 
                v rychle rostoucím městě Los Santos. Původně tvořilo sbor pouhých 
                12 důstojníků pod vedením prvního Chief of Police, Jonathana Davise.
              </p>
            </div>

            <div class="timeline-item scroll-reveal">
              <div class="timeline-dot"></div>
              <div class="timeline-year">1920</div>
              <h3 class="timeline-title">Éra prohibice</h3>
              <p class="timeline-text">
                V průběhu prohibice čelilo LSPD nebývalému nárůstu organizovaného zločinu. 
                Sbor byl rozšířen na 200 příslušníků a byly vytvořeny první specializované 
                jednotky pro boj s pašeráky alkoholu a organizovaným zločinem.
              </p>
            </div>

            <div class="timeline-item scroll-reveal">
              <div class="timeline-dot"></div>
              <div class="timeline-year">1955</div>
              <h3 class="timeline-title">Modernizace sboru</h3>
              <p class="timeline-text">
                LSPD prošlo rozsáhlou modernizací. Byla zavedena radiová komunikace, 
                moderní vozový park a vytvořen detektivní oddíl. Sbor začal spolupracovat 
                s federálními složkami na větších případech.
              </p>
            </div>

            <div class="timeline-item scroll-reveal">
              <div class="timeline-dot"></div>
              <div class="timeline-year">1978</div>
              <h3 class="timeline-title">Vznik SWAT jednotky</h3>
              <p class="timeline-text">
                V reakci na rostoucí počet násilných incidentů byla založena speciální 
                jednotka SWAT (Special Weapons and Tactics). Tato elitní jednotka se 
                rychle stala jednou z nejvýkonnějších v celém státě San Andreas.
              </p>
            </div>

            <div class="timeline-item scroll-reveal">
              <div class="timeline-dot"></div>
              <div class="timeline-year">1992</div>
              <h3 class="timeline-title">Těžké časy</h3>
              <p class="timeline-text">
                Los Santos zažilo jedny z nejtemnějších dnů ve své historii. LSPD čelilo 
                masivním nepokojům a gangové násilí dosáhlo vrcholu. Sbor byl nucen 
                přehodnotit své postupy a posílit vztahy s komunitou.
              </p>
            </div>

            <div class="timeline-item scroll-reveal">
              <div class="timeline-dot"></div>
              <div class="timeline-year">2005</div>
              <h3 class="timeline-title">Reforma a obnova</h3>
              <p class="timeline-text">
                Pod novým vedením prošlo LSPD zásadní reformou. Byl kladen důraz na 
                community policing, transparentnost a zodpovědnost. Kriminalita začala 
                postupně klesat a důvěra veřejnosti v policii se obnovovala.
              </p>
            </div>

            <div class="timeline-item scroll-reveal">
              <div class="timeline-dot"></div>
              <div class="timeline-year">2020</div>
              <h3 class="timeline-title">Digitální éra</h3>
              <p class="timeline-text">
                LSPD přijalo nejmodernější technologie. Byly zavedeny systémy prediktivního 
                policingu, body kamery pro všechny příslušníky a pokročilé forenzní laboratoře. 
                Sbor se stal vzorem moderního policejního útvaru.
              </p>
            </div>

            <div class="timeline-item scroll-reveal">
              <div class="timeline-dot"></div>
              <div class="timeline-year">Současnost</div>
              <h3 class="timeline-title">LSPD dnes</h3>
              <p class="timeline-text">
                Dnes LSPD zaměstnává přes 70 aktivních příslušníků ve více než 10 
                specializovaných odděleních. Pokračujeme v naší misi chránit a sloužit 
                občanům Los Santos s nejvyšší mírou profesionality a oddanosti.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  `;
}

function initHistoryPage() {
  initScrollReveal();
}
