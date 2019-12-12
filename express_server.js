const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
const cookieParser = require("cookie-parser");
app.use(cookieParser());



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

function generateRandomShortURL() {
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
    user : users[req.cookies["user_id"]]
    
};

  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
  let templateVars = {
    user : users[req.cookies["user_id"]]
  };
  res.render("urls_new", templateVars);
});



app.post("/urls", (req, res) => {
  
  let newShortURL = generateRandomShortURL();
  urlDatabase[newShortURL] = req.body.longURL;
  console.log(urlDatabase)
  res.redirect(`/urls/${newShortURL}`)
 
});


app.get("/u/:shortURL", (req, res) => {
   const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { 
    user : users[req.cookies["user_id"]],
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

// Question 1
app.post("/urls/:shortURL", (req, res) => {
  console.log(req.body.newLongURL)
  const urlToEdit = req.params.shortURL;
  const newLongURL = req.body.newLongURL;
  urlDatabase[urlToEdit] = newLongURL;
  res.redirect("/urls");
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

// console.log(id)
// console.log(users[id])
// res.cookie("user_id",id);
// res.redirect("urls");

})

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});