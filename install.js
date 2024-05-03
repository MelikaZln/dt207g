require("dotenv").config();
const express = require("express");
const sqlite3 = require("sqlite3").verbose();


// connect
const db = new sqlite3.Database(process.env.DATABASE2);

// create table users
db.serialize(() => {
    // drop table if exists 
    db.run("DROP TABLE IF EXISTS users");
    db.run(`CREATE TABLE users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        created DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    console.log("TEBLE CREATED")
})