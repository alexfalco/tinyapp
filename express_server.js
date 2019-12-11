const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
const cookieParser = require("cookie-parser");
app.use(cookieParser());


function generateRandomShortUR() {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  
  let string_length = 6;
  let randomstring = '';
   
  for (let i = 0; i < string_length; i++) {
  let rnum = Math.floor(Math.random() * chars.length);
  randomstring += chars.substring(rnum, rnum + 1);
  }
   
  return randomstring;
  
}



const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("This is Tiny App");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
 
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase,    
     username: req.cookies["username"]
};
  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: req.cookies["username"]
  };
  res.render("urls_new", templateVars);
});



app.post("/urls", (req, res) => {
  
  let newShortURL = generateRandomShortUR();
  urlDatabase[newShortURL] = req.body.longURL;
  console.log(urlDatabase)
  res.redirect(`/urls/${newShortURL}`)
 
  // console.log(req.body);  // Log the POST request body to the console
  // res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

//coup de chande demande pourquoi???
app.get("/u/:shortURL", (req, res) => {
   const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { 
    username: req.cookies["username"],
    shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});


app.post("/urls/:shortURL/delete", (req, res) => {
  const urlToDelete = req.params.shortURL;
  delete urlDatabase[urlToDelete];
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  let newShortURL = generateRandomURL();
  urlDatabase[newShortURL] = req.body.longURL;
  res.redirect(`/urls/${newShortURL}`);
});


app.post("/urls/:shortURL", (req, res) => {
  const urlToEdit = req.params.shortURL;
  const newLongURL = req.body.newLongURL;
  urlDatabase[urlToEdit] = newLongURL;
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
// set a cookie named username = req.body from login 
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.cookie("username", "");
  res.redirect("/urls");
});