const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
  defsdf: { longURL: "https://www.tsn.ca", userID: "123456" },
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
  "123456": {
    id: "123456", 
    email: "afalconer02@gmail.com", 
    password: "allo"
  }
}


const emailLookup = function(propName, ObjUsers, property){
  for(let id in ObjUsers){
    if (ObjUsers[id][propName] === property){
      return id;
    }
  }
  return undefined;
}

const generateRandomShortURL = function() {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  
  let string_length = 6;
  let randomstring = '';
   
  for (let i = 0; i < string_length; i++) {
  let rnum = Math.floor(Math.random() * chars.length);
  randomstring += chars.substring(rnum, rnum + 1);
  }
   
  return randomstring;
  
}

const urlsForUser = function(currentUserID) {
  let currentUserURLs = {};
  for (const CurrId in urlDatabase) {
    if (urlDatabase[CurrId].userID === currentUserID) {
      currentUserURLs[CurrId] = urlDatabase[CurrId];
    }
  }
  return currentUserURLs;
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
    
  let templateVars = { urls: urlsForUser(req.cookies["user_id"]),    
    user : users[req.cookies["user_id"]]  
    
};
// Mettre un msg lorsque redirige vers la page login
  if (req.cookies["user_id"]) {
    res.render("urls_index", templateVars);
    }
    else {
      res.render("login", templateVars)
    }
});



// Get New: il faut etre login pour voir le
app.get("/urls/new", (req, res) => {
 
  let templateVars = {
    user : users[req.cookies["user_id"]]
  };
  
  if (req.cookies["user_id"]) {
  res.render("urls_new", templateVars);
  }
  else {
    res.redirect("/login")
  }
});


// Post new URL
app.post("/urls/new", (req, res) => {
  
  let newShortURL = generateRandomShortURL();
    urlDatabase[newShortURL] = { longURL: req.body.longURL, userID: req.cookies["user_id"]}
    console.log(urlDatabase)
  res.redirect("/urls")
});

 

// make sure they redirect for users, even if they aren't logged in
app.get("/u/:shortURL", (req, res) => {
   const longURL = urlDatabase[req.params.shortURL].longURL
  res.redirect(longURL);
});


// get the details for an URL Update
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { 
    user : users[req.cookies["user_id"]],
    shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL};
  
  if (urlDatabase[req.params.shortURL].userID === req.cookies["user_id"]) {
    res.render("urls_show", templateVars);
  }
  else if (!req.cookies["user_id"]) {
    res.send("Please Sign in to update a URL ") 
  }
  else {
    console.log(req.cookies["user_id"])
  res.send("Error: You can't update a URL created by another user ")
  }
});

// Delete
app.post("/urls/:shortURL/delete", (req, res) => {
  
  const urlToDelete = req.params.shortURL;
 
  if (urlDatabase[urlToDelete].userID === req.cookies["user_id"]) {
    delete urlDatabase[urlToDelete];
    res.redirect("/urls");
  }
  else if (!req.cookies["user_id"]) {
    res.send("Please Sign in to delete a URL ") 
  }
  else {
    console.log(req.cookies["user_id"])
  res.send("Error: You can't delete a URL created by another user ")
  }




});


// Edit URL 
app.post("/urls/:shortURL", (req, res) => {
  console.log(req.body.newLongURL)
  const urlToEdit = req.params.shortURL;
  const newLongURL = req.body.newLongURL;
  if (urlDatabase[urlToEdit].userID === req.cookies["user_id"]) {
    urlDatabase[urlToEdit].longURL = newLongURL;
    res.redirect("/urls");
  }
  else if (!req.cookies["user_id"]) {
    res.send("Please Sign in to update a URL ") 
  }
  else {
    console.log(req.cookies["user_id"])
  res.send("Error: You can't update a URL created by another user ")
  }

});


app.get("/register", (req, res) => {
  
  let templateVars = {
    user : users[req.cookies["user_id"]]
  };
  res.render("register", templateVars);
  
})


app.post("/register", (req, res) => {
  
  let { email, password } = req.body;
  
  if (!email || !password){
    
   
    res.status(400).send("no email/password entered");
    
  }
  else if (emailLookup("email", users, email)) {
      res.send("email taken")
     
  }
  let id = generateRandomShortURL() 
  users[id] = {
    id: id,
    email: email,
    password: password
  }

  console.log(id)
  console.log(users[id])
  res.cookie("user_id",id);
  res.redirect("urls");
})





app.get("/login", (req, res) => {
  let templateVars = {
    user : users[req.cookies["user_id"]]
  };
  res.render("login", templateVars);
});



app.post("/login", (req, res) => {
  
  let { email, password } = req.body;
  let currentUserId = emailLookup("email", users, email)
  console.log(currentUserId)
   

   if (!email || !password){
     res.status(400).send("no email/password entered");
  }
   else if  (!emailLookup("email", users, email)) {
      res.send("Error")   
   }

   else if (users[currentUserId]["password"] !== password ) {
      res.send("Error") 
   }
    
res.cookie("user_id",currentUserId)
res.redirect("/urls");


})

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});