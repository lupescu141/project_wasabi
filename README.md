Käyttäjätestitunnukset:
email:
password:

Admintestitunnukset:
email:
password:

Home URL: /home
Adminlogin URL: api/adminlogin
Hallintapaneeli URL: /management

Hallintapaneeli (Vain admin käyttäjillä oikeus):

- tilaustenseuranta
  - Ei hae tilaustietoja, näkyvät tilaukset ovat sample tilauksia
  - Tilausten statusta pystyy muokkaamaan painamalla tilausnumeroa
- Työntekijöiden yhteystiedot
  - Työntekijöiden yhteystietoja ei haeta
- Add Product -nappi
  - Pystyy lisäämään tuotteen tietokannan "products"-tauluun
  - Riippuen valitseeko Buffet tai Menu, eri columnien tietoja lähetetään
  - Jos valitsee Menu, Pystyy myös lähettämään kuvatiedoston serverille ja kuvatiedoston path:in tietokantaan. Kuva näkyy tuotteen vieressä Menu sivulla
- Next Week's Buffet -nappi
  - Pystyt lisäämään tietokannan "weekly_buffet_next" tauluun buffet-tuotteita "products" taulusta
- Delete Product -nappi
  - Pystyt poistamaan tuotteita tietokannan "products" taulusta

Home:

- Buffet karuselli
  - Ensimmäinen kortti on nykyisen päivämäärän buffet-menu
  - Päivän vaihtuessa (23:58), ensimmäisen kortin tiedot poistetaan tietokannan "weekly_buffet" taulusta ja niiden tilalle haetaan saman viikonpäivän tiedot tietokannan "weekly_buffet_next_week" taulusta. Ensimmäinen kortti siirtyy myös viimeiseksi ja päivämäärä muuttuu oikeaksi.

Menu:

- Menu-lista
  - Menun tuotteet tietokannan "products" taulussa, jotka eivät ole buffet-tuotteita

Contact:

- Ravintolan yhteystiedot
- Kartta (HSL API), endpoint on valmiiksi Itäkeskus

About:

- Tietoa ravintolasta

Kirjautuminen/Rekisteröinti:

- Paina käyttäjälogoa (oikeinpuoleisin vaihtoehto) navigaatiopalkissa ja valitse "login/register"
- Rekisteröinnin jälkeen täytyy vielä kirjautua sisään

Profile (Oikeus vain kirjautuneena):

- Paina käyttäjälogoa (oikeinpuoleisin vaihtoehto) navigaatiopalkissa ja valitse "profile"
- Käyttäjän tiedot eivät täyty valmiiksi kenttiin
- Kun käyttäjä on täyttänyt kaikki kentät ja painanut "save"-nappia, käyttäjän tiedot päivittyvät tietokannan "users" tauluun
