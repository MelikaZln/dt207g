// importera och tilldela paket för webbserver, tolkning av formulärdata SQLite och sökvägar
const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Skapa en instans av Express
const app = express();
// Ange  port 
const port = 3050;

// middleware för att tolka formulärdata
app.use(bodyParser.urlencoded({ extended: true }));

// Ange views motor och sökväg till viewerna
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Statiskt fil-sökväg för filerna
app.use(express.static(path.join(__dirname, "public")));

// anslutning till SQLite-databasen
const db = new sqlite3.Database("./db/cv.db", err => {
    if (err) {
        // Vid fel vid anslutning till databasen, logga felet
        console.error("Error opening database", err);
        return;
    }
    // meddelande om det var framg[ngsrikt
    console.log("Connected to the database");
});

//lägga till en ny kurs
app.get("/", (req, res) => {
    res.redirect("/add-course");
});

// sida för att lägga till en ny kurs
app.get("/add-course", (req, res) => {
    // Rendera sidan för att lägga till en ny kurs - felmeddelande och framgångsindikator
    res.render("add-course", { error: "", success: false });
});
// funktion för att lägga till kurs
app.post("/add-course", (req, res) => {
    const { coursecode, coursename, syllabus, progression } = req.body;

    // Validera om något av fälten är tomma
    if (!coursecode || !coursename || !syllabus || !progression) {
        const error = "Alla fält måste fyllas i.";
        return res.status(400).json({ error: error });
    }

    // Lägg till kursen i databasen
    db.run("INSERT INTO courses (coursecode, coursename, syllabus, progression, posted) VALUES (?, ?, ?, ?, datetime('now', 'localtime'))",
        [coursecode, coursename, syllabus, progression], err => {
            if (err) {
                console.error("Error inserting course", err);
                const error = "Ett fel inträffade när kursen skulle läggas till i databasen.";
                return res.status(500).json({ error: error });
            }
            res.status(200).json({ success: "Kursen lades till framgångsrikt." });
        });
});



// Sida för att visa alla kurser och ta bort dem
app.get("/view-courses", (req, res) => {
    // Hämta alla kurser från databasen och rendera sidan för att visa kurser med kurserna som resultat
    db.all("SELECT * FROM courses ORDER BY id DESC", (err, rows) => {
        if (err) {
            // Vid fel vid hämtning av kurser från databasen, logga felet och rendera sidan för att visa kurser med felmeddelande
            console.error("Error fetching courses", err);
            res.render("view-courses", { error: "Ett fel inträffade när kurserna skulle hämtas från databasen.", rows: [] });
            return;
        }
        // Om hämtningen är framgångsrik, rendera sidan för att visa kurser utan felmeddelande och med kurserna som resultat
        res.render("view-courses", { error: null, rows: rows });
    });
});

// Radera en kurs
app.post("/delete/:id", (req, res) => {
    // Extrahera ID för kursen som ska raderas från URL-parametrar
    const id = req.params.id;
    // Radera kursen med det specificerade ID:et från databasen
    db.run("DELETE FROM courses WHERE id = ?", id, err => {
        if (err) {
            // Vid fel vid radering av kurs från databasen, logga felet och rendera en felmeddelandesida
            console.error("Error deleting course", err);
            res.render("error", { message: "Ett fel inträffade när kursen skulle raderas från databasen." });
            return;
        }
        // Om kursen raderas framgångsrikt, omdirigera till sidan för att visa kurser
        res.redirect("/view-courses");
    });
});

// Sida för att visa information om appen
app.get("/about", (req, res) => {
    // Rendera sidan för att visa information om appen
    res.render("about");
});

// Lyssna på serverns port och logga när servern startas
app.listen(port, () => {
    console.log("Application started on port: " + port);
});
