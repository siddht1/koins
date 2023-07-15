import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { google } from "googleapis";
// import dotenv from "dotenv";
// dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;
// Set up authentication
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_id: process.env.CLIENT_ID,
    project_id: process.env.PROJECT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.AUTH_PROVIDER_X509_CERT_URL,
    client_secret: process.env.CLIENT_SECRET,
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// Create a client instance
const client = await auth.getClient();

// Create Google Sheets API instance
const sheets = google.sheets({ version: "v4", auth: client });

// Enable CORS for specific origin
app.use(cors({
//   origin: "https://example.com"
}));

// Parse request body and extended the size to 1mb

app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));

const spreadsheetId = process.env.SPREADSHEET_ID;

// GET route
app.get("/", getData);
function getData(req, res) {

//data = structureData(data);
// if (authenticateUser(data)) {
// res.send(data);
// } else {
// res.send({ 'status': 'not authorized' });
// }
  let s=structureData(req,res);
  res.send(s);
}
function structureData(req,res) {
   const currentDate = new Date();
let data = {};
data["GET"] = req.query;
data["headers"] = req.headers;
data["env"] = process.env;
data["date"] = currentDate.toDateString();
   const options = { timeZone: "Asia/Kolkata" };
  data["time"] = currentDate.toLocaleString("en-US", options);
return data;
}

// function authenticateUser(data) {
// // Perform user authentication here
// if (data['GET']['user'] === 'st1') {
// return true;
// } else {
// return false;
// }
// }
// app.get("/", (req, res) => {
//   let data = {};
//   data["GET"] = req.query;
//   data["headers"]=req.headers;
//   data["env"]=process.env;
// if(data['GET']['user']==='st1')
// {
//   res.send(data);
// }
//   else
// {
//   res.send({'status':'not authorized'});
// }

// });

// POST route
app.post("/", (req, res) => {
  console.log("POST request received");
  let data={};
   data['POST'] = req.body;
  res.send(data);
});

app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
});
