// route for auth
require("dotenv").config();
const express= require ("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// connect to database
const db = new sqlite3.Database(process.env.DATABASE2);

// new user
router.post("/register", async(req, res) => {
    try {
        const {username, password, email } = req.body;
        if (!username || !password || !email){
            return res.status(400).json({error: "Invalid input, send username, password, and email"});
        }

        const hashPassword = await bcrypt.hash(req.body.password, 10);

        const sql = `INSERT INTO users(username, password, email) VALUES(? , ?, ?)`;
        db.run(sql, [username, hashPassword, email], (err) => {
            if(err){
                return res.status(400).json({message: "error creating user..."});
            } else {
                return res.status(201).json({message: "User created"});
            }
        });
    } catch(error){
        return res.status(500).json({error: "server error"});
    }
});

//login user
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        // validate input
        if (!username || !password) {
            return res.status(400).json({ error: "Invalid input, send username and password" });
        }

        //check if user exists
        const sql = `SELECT * FROM users WHERE username=?`;
        db.get(sql, [username], async (err, row) => {
            if (err) {
                return res.status(400).json({ message: "error authentication...!" });
            } else if (!row) {
                return res.status(401).json({ message: "incorrect username/password" });
            } else {
                // user exist - check username and password
                const passwordMatch = await bcrypt.compare(password, row.password);
                if (!passwordMatch) {
                    return res.status(401).json({ message: "incorrect username/password" });
                } else {
                    //create jwt
                    const payload = {username: username};
                    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: '1h'}); // här kan man välja hur länge det ska dröjas innan man måste logga in igen det kan vara för evigt
                    const response = {
                        message: "user logged in!",
                        toke: token
                    }
                    // correct log in
                    return res.status(200).json({ response});
                }
            }
        });
    } catch (error) {
        return res.status(500).json({ error: "server error" });
    }
});

module.exports= router;