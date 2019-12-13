const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
//const cookieParser = require("cookie-parser");
//app.use(cookieParser());
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
const { emailLookup, generateRandomShortURL , urlsForUser } = require("./helper.js");


 

app.use(
  cookieSession({
    name: "session",
    keys: ["cookieK1", "cookieK2"]
   
  })
);


const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "otPxTA" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
  defsdf: { longURL: "https://www.tsn.ca", userID: "otPxTA" },
  erefdf: { longURL: "https://www.google.ca", userID: "123456" },
  asedfr: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  cfbmop: { longURL: "https://www.google.ca", userID: "aJ48lW" },
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  },
  "otPxTA": {
    id: "otPxTA",
    email: "afalconer02@gmail.com",
    password: '$2b$10$/oNj.qexAaq96v70XZ.Zie3HlVfhJE11wuLF33VtdVb10wPWMp9zy'
  }
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
  console.log(req.session.user_id);
  let templateVars = { urls: urlsForUser(req.session.user_id,urlDatabase),
    user : users[req.session.user_id]
    
  };
  console.log(urlsForUser(req.session.user_id,urlDatabase));
  // Mettre un msg lorsque redirige vers la page login
  if (req.session.user_id) {
    res.render("urls_index", templateVars);
  } else {
    res.render("login", templateVars);
  }
});



// Get New: il faut etre login pour voir le
app.get("/urls/new", (req, res) => {
 
  let templateVars = {
    user : users[req.session.user_id]
  };
  
  if (req.session.user_id) {
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});


// Post new URL
app.post("/urls/new", (req, res) => {
  
  let newShortURL = generateRandomShortURL();
  urlDatabase[newShortURL] = { longURL: req.body.longURL, userID: req.session.user_id};
  console.log(urlDatabase);
  res.redirect("/urls");
});

 

// make sure they redirect for users, even if they aren't logged in
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});


// get the details for an URL Update
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    user : users[req.session.user_id],
    shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL};
  
  if (urlDatabase[req.params.shortURL].userID === req.session.user_id) {
    res.render("urls_show", templateVars);
  } else if (!req.session.user_id) {
    res.send("Please Sign in to update a URL ");
  } else {
    console.log(req.session.user_id);
    res.send("Error: You can't update a URL created by another user ");
  }
});

// Delete
app.post("/urls/:shortURL/delete", (req, res) => {
  
  const urlToDelete = req.params.shortURL;
 
  if (urlDatabase[urlToDelete].userID === req.session.user_id) {
    delete urlDatabase[urlToDelete];
    res.redirect("/urls");
  } else if (!req.session.user_id) {
    res.send("Please Sign in to delete a URL ");
  } else {
    console.log(req.session.user_id);
    res.send("Error: You can't delete a URL created by another user ");
  }




});


// Edit URL
app.post("/urls/:shortURL", (req, res) => {
  console.log(req.body.newLongURL);
  const urlToEdit = req.params.shortURL;
  const newLongURL = req.body.newLongURL;
  if (urlDatabase[urlToEdit].userID === req.session.user_id) {
    urlDatabase[urlToEdit].longURL = newLongURL;
    res.redirect("/urls");
  } else if (!req.session.user_id) {
    res.send("Please Sign in to update a URL ");
  } else {
    console.log(req.session.user_id);
    res.send("Error: You can't update a URL created by another user ");
  }

});

// Get to the registration page
app.get("/register", (req, res) => {
  
  let templateVars = {
    user : users[req.session.user_id]
  };
  res.render("register", templateVars);
  
});

// Registration Process
app.post("/register", (req, res) => {
  
  let { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (!email || !password) {
    res.status(400).send("no email/password entered");
    
  } else if (emailLookup("email", users, email)) {
    res.send("email taken");
     
  }
  let id = generateRandomShortURL();
  users[id] = {
    id: id,
    email: email,
    password: hashedPassword
  };

  console.log(id);
  console.log(users[id]);
  req.session.user_id = id;
  res.redirect("urls");
});





app.get("/login", (req, res) => {
  console.log(req.session);
  let templateVars = {
    user : users[req.session.user_id]
    
  };
  res.render("login", templateVars);
});



app.post("/login", (req, res) => {
  
  let { email, password } = req.body;
  let currentUserId = emailLookup("email", users, email);
  console.log(currentUserId);
   
  console.log(password);
  console.log(users[currentUserId]["password"]);



  if (!email || !password) {
    res.status(400).send("no email/password entered");
  } else if  (!emailLookup("email", users, email)) {
    res.send("Error: Problem with either the e-mail or the password");
  } else if (!bcrypt.compareSync(password, users[currentUserId]["password"])) {
    res.send("Error: Problem with either the e-mail or the password");
  }
      
  req.session.user_id = currentUserId;
  res.redirect("/urls");


});

app.post("/logout", (req, res) => {
  delete req.session.user_id;
  res.redirect("/login");
});

