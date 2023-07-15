import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { google } from "googleapis";

const app = express();
const PORT = process.env.PORT || 3000;

// Set up authentication
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_id: process.env.CLIENT_ID,
    project_id: process.env.PROJECT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_secret: process.env.CLIENT_SECRET,
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// Create a client instance
const client = await auth.getClient();

// Create Google Sheets API instance
const sheets = google.sheets({ version: "v4", auth: client });

// Enable CORS for specific origin
app.use(cors());

// Parse request body and extended the size to 1mb
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));

const spreadsheetId = process.env.SPREADSHEET_ID;

// GET route
app.get("/", getData);

async function getData(req, res) {
  const data = structureData(req, res);

  // Prepare the data to be written to the Google Sheet
  const values = [
    ["GET Data", JSON.stringify(data.GET)],
    ["Headers", JSON.stringify(data.headers)],
    ["Environment Variables", JSON.stringify(data.env)],
    ["Date", data.date],
    ["Time", data.time],
  ];

  const range = "Sheet1!A1:B5";
  const resource = {
    values: values,
  };

  try {
    // Write data to Google Sheet
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: spreadsheetId,
      range: range,
      valueInputOption: "USER_ENTERED",
      resource: resource,
    });

    console.log("Data written successfully:", response.data);
    res.send(data);
  } catch (error) {
    console.error("Error writing data to Google Sheet:", error);
    res.status(500).send("Error writing data to Google Sheet");
  }
}

function structureData(req, res) {
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

// POST route
app.post("/", (req, res) => {
  console.log("POST request received");
  let data = {};
  data["POST"] = req.body;
  res.send(data);
});

app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
});
