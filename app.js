import express, { response } from "./node_modules/express/index.js";
// import { morganMiddleware } from "./middleware/morgan.js";
import router from "./routes/router.js"; //or require('./routes/router.js');
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import bodyParser from "body-parser";
import flash from "express-flash";
import session from "express-session";
import mysql from 'mysql';
import fs from "fs";

//var Recaptcha = require('express-recaptcha').RecaptchaV3; //import Recaptcha from 'express-recaptcha'
//var recaptcha = new Recaptcha('SITE_KEY', 'SECRET_KEY');

let rawpass =  fs.readFileSync('C:\\Users\\Emma\\Documents\\complitou-app\\complitou\\routes\\passwords.json');
let passwords = JSON.parse(rawpass);

const app = express();
app.use(express.json());
app.use(cors());
app.use(router);
//app.use("/", express.static("public"));

import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);

// 👇️ "/home/john/Desktop/javascript"
const __dirname = path.dirname(__filename);
console.log('directory-name', __dirname);

app.use(express.static(__dirname+ '/public'));

//app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit: '5000mb', extended: true, parameterLimit: 100000000000}));
const host_url = "localhost:3000"
const port = 3000;

app.get("/hello", (request, response) => {
    response.status(200).send("hello world")
});

app.get("/faq", (request, response) => {
  response.sendFile(__dirname + "/public/faqpage.html")
});

app.listen(port, () => {
    console.log("port running on localhost 3000")
});

const dbconnection = mysql.createConnection({
  host: "complitou.cpf4qofraygb.eu-west-2.rds.amazonaws.com",
  user: "admin",
  password: passwords["sqlpassword"],
  database: "complitou"
});

