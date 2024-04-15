// Importera SQlite och skapa en anslutning till databasen "cv.db"
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db/cv.db");

// kör flera databasoperationer inom en serie
db.serialize(() => {
    //Ta bort tabellen "courses" om den redan existerar
    db.run("DROP TABLE IF EXISTS courses");

    // Skapa en ny tabell, courses
    db.run(`
        CREATE TABLE courses(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            coursecode TEXT NOT NULL,
            coursename TEXT NOT NULL,
            syllabus TEXT NOT NULL,
            progression TEXT NOT NULL,
            posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
    `);
});

// Stäng anslutningen till databasen när alla operationer är slutförda
db.close();
