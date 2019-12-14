



const emailLookup = function(propName, ObjUsers, property) {
  for (let id in ObjUsers) {
    if (ObjUsers[id][propName] === property) {
      return id;
    }
  }
  return undefined;
};

const generateRandomShortURL = function() {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  
  let stringLength = 6;
  let randomString = '';
   
  for (let i = 0; i < stringLength; i++) {
    let rnum = Math.floor(Math.random() * chars.length);
    randomString += chars.substring(rnum, rnum + 1);
  }
   
  return randomString;
  
};

const urlsForUser = function(currentUserID,urlDatabase) {
 
  let currentUserURLs = {};
  
  for (const CurrId in urlDatabase) {
    
    if (urlDatabase[CurrId].userID === currentUserID) {
     

      currentUserURLs[CurrId] = urlDatabase[CurrId];
     
    }
  }

  return currentUserURLs;
};



module.exports = { emailLookup, generateRandomShortURL , urlsForUser };