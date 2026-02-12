const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
var bodyParser = require('body-parser');

const base_url = process.env.API_BASE_URL || 'http://localhost:3000';

app.set("views", path.join(__dirname, "public", "views"));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files
app.use(express.static(__dirname + "/public"));

function sendRequestError(err, res) {
  const status = err.response?.status || 500;
  if (err.code === 'ECONNREFUSED') {
    return res
      .status(503)
      .send('API server is not running. Start API on http://localhost:3000.');
  }
  return res.status(status).send('Request failed: ' + err.message);
}

app.get("/",async (req,res) =>{
  try {
    const response = await axios.get(base_url + '/books');
    res.render("books", { books: response.data });
  } catch(err){
    console.error(err);
    sendRequestError(err, res);
  }
});
app.get("/book/:id", async (req, res) => {
  try {
    const response = await axios.get(base_url + '/books/' + req.params.id);
    res.render("book", { book: response.data });
  } catch (err) {
    console.error(err);
    sendRequestError(err, res);
  }
});
app.get("/create", (req, res) => {
  res.render("create");
});

app.post("/create", async (req, res) => {
  try {
    const data = { title: req.body.title, author: req.body.author };
    await axios.post(base_url + '/books', data);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    sendRequestError(err, res);
  }
});

app.get("/update/:id", async (req, res) => {
  try {
    const response = await axios.get(base_url + '/books/' + req.params.id);
    res.render("update", { book: response.data });
  } catch (err) {
    console.error(err);
    sendRequestError(err, res);
  }
});
app.post("/update/:id", async (req, res) => {
  try {
    const data = { title: req.body.title, author: req.body.author };
    await axios.put(base_url + '/books/' + req.params.id, data);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    sendRequestError(err, res);
  }
});

app.get("/delete/:id", async (req, res) => {
  try {
    await axios.delete(base_url + '/books/' + req.params.id);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    sendRequestError(err, res);
  }
});

app.listen(5500, () => {
  console.log('Server started on http://localhost:5500');
});
