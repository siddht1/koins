import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for specific origin
app.use(cors({
//   origin: "https://example.com"
}));

// Parse request body and extended the size to 1mb

app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));

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
  data["time"] = currentDate.toLocaleTimeString();
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
