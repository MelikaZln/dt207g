
// registrering och inloggning

const express= require ("express");
const bodyParser = require ("body-parser");
const cors = require("cors"); // 
const authRoutes = require("./routes/authRoutes");
const jwt = require("jsonwebtoken");
require("dotenv").config();

process.env.PORT;

const app = express();
const port = process.env.PORT || 3000;
app.use(cors()); // 
app.use(bodyParser.json());
app.use(express.static("public")); // 

  
//routes
app.use("/api", authRoutes);
//protected route
app.get("/api/protected", authticateToken, (req, res) =>{
    res.json({message: "skyddar route"});
})
//validate token 
function authticateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.status(401).json({ message: "Token saknas!" });
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: "Inte korrekt JWT!" });

        req.username = user.username;
        next();
    }); 
}
// starta appen 
app.listen(port, () => {
    console.log(`sever running att http://localhost:${port}`)
})