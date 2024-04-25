## Moment1 with express, ejs och SQLite 
I den här uppgiften skulle vi göra en webbapplikation med hjälp av express, ejs och en relationsdatabas och jag valde SQLite.

Webb applikationen ska innehålla minst 3 undersidor:
 view-courses.ejs, i den här sidan ska alla befintliga kurser visas, Varje kurs har en kurskod, kursnamn, progression och länk till webbplatsen där kursen beskrivs samt tid då kursen har lagts till. Dessutom finns det också en radera knapp till varje kurs så att man ska kunna ta bort kursen. 

 add-course.ejs, i den här sidan ser man en formulär som man kan lägga till önskad kurs, kursen som man lägger till sparas i databasen som är skapad med SQLite och sedan kan man se kursen på view-course sidan, längst ner på sidan finns det två knappar så man kan gå över till andra sidor.

 about.ejs, den tredje sidan är en sida där hela uppgiften beskrivs och längst ner har vi två knappar för att gå till andra sidor.

Jag har skrivit HTML- och ejs-kod för att skriva ejs filerna. Jag ska inte beskriva HTML koden eftersom det inte är relaterad i denna kurs men när det gäller ejs kan jag beskriva vad jag har gjort. Först av allt påpekar jag att jag använde ejs för att göra mina html-sidor dynamiska genom att inkludera servergenererad data och logik direkt i html-koden.

Jag har använt ejs för att visa variabler t ex i add-course.ejs har jag skrivit <%= error %> för att visa felmeddelanden som skickas från min server. Så variablens värde (värdet till error) kommer att visas i HTML-koden.

Jag har använt mig av ejs för att kunna skriva if-satser och forEach-loopar i min html-fil. T ex har jag skrivit  <% if (error) { %>
        ...
    <% } %> i add-course för att kontrollera min sats och i view-course har jag skrivit 
    <% rows.forEach(row => { %> 
                ....
                <% } %> för att kunna loopa igenom varje kursrad. 


Nu har jag beskrivit mina ejs-filer och vad uppgiften handlar om så ska förklara vad jag har gjort i server.js och install.js.

Först av allt har jag importerat sqlite till install.js alltså den relationsdatabastypen som jag har använt föt att skapa applikationen. Med denna anslutning har jag skapat (databasen till min uppgift) i mappen db. För att vara säker på att alla databas operationer körs i rätt ordningoch väntar på varandra har jag använt db.serialize().
För att förhindra duplicering har jag använt mig av db.run("DROP TABLE IF EXISTS COURSES) på så sätt tas tabellen courses bort om den existrerar.
Efter att jag har blivit säker på att ingen tabell med denna namn finns i databasen skapar jag tabellen och dess kolumner (kurskod, kursnamn, syllabus och progression samt timestamp) med CREATE TABLE ...
Till slut stänger jag anslutningen med db.close().

Nästa fil som jag ska beskriva är server.js. I början av filer har jag importerat viktiga paket(express: som hanterar webbservern, bodyParser: för att tolka formulärdata, sqlite3: arbeta med SQLite-databasen, path: hantera filvägar).

Sedan har jag skapat en instans av Express som fungerar som min webbserver, och valt vilken port jag har valt för att servern ska lyssna på.
app.use(bodyParser.urlencoded({ extended: true })) med den här koden konfiureas express att använda body-parser för att tolka URL-kodad formulärdata.
app.set("view engine", "ejs"); app.set("views", path.join(__dirname, "views")); med dessan kodrader ställs EJS som vymotorn och sökvägeb till vyerna anges.
 app.use(express.static(path.join(__dirname, "public"))); med denna rad konfigureras Express att servera statika filer från den angivna sökvägen.
const db = new sqlite3.Database("./db/cv.db", err => { ... }); skapar en anslutning till SQLite-databasen och loggar meddelande om anslutningen har varit framgångsrik.
app.get("/", (req, res) => { ... }); här har jag en GET-förfrågan, som renderar sidan för att lägga till en ny kurs med fel- och framgångsindikator.
app.post("/add-course", (req, res) => { ...}); här kommer POST-förfrågan, som extraherar kursinfromationen från formuläret och lägger den till databasen. Om ett fel uppstår så får vi felmeddelandet och sidan renderas för att lägga till kursen igen. 
app.get("/view-courses", (req, res) => { ... }); Här kommer en till GET-förfrågan, som hämtar all data från databasen och renderar den på sidan så att kurserna visas och om ett fel uppstår då renderas ett felmeddelande. 
app.post("/delete/:id", (req, res) => { ... }); med denna POST-förfrågan raderas en kurs med en specifik id och om något fel uppstår så renderas felmeddelandesidan.
app.get("/about", (req, res) => {...}); Med denna GET-förfrågan renderas sidan med information om uppgiftbeskrivningen och till slut har vi app.listen(port, () => {...}); som startar servern och lyssnar på den angivna porten och ett emddelande skrivs på log när servern startas. 

jag har beskrivit alla mina filer här förutom css-filen för att det finns inget nytt i den som angår den här kursen.



