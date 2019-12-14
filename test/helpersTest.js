const { assert } = require('chai');

const { emailLookup } = require('../helper.js');



const testUsers = {
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
};

describe("getUserByEmail", function() {
  it("should return a user with valid email", function() {
    const user = emailLookup("email", testUsers, 'user@example.com' );
    const expectedOutput = "userRandomID";
    assert.strictEqual(user, expectedOutput);
  });
  

  it("statement to test that a non-existent email returns undefined", function() {
    const user = emailLookup("email", testUsers, 'user42@example.com' );
    const expectedOutput = undefined;
    assert.strictEqual(user, expectedOutput);
  });

})