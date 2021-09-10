// jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();
const client = require("@mailchimp/mailchimp_marketing");


app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));


// ^ Most JS files will use this format //


app.get("/", function(request, response) {
  response.sendFile(__dirname + "/signup.html");

});

app.post("/", function(req, res) {

  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  console.log(firstName, lastName, email);

  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email
  }

  client.setConfig({
    apiKey: "e46952834b76287c561d99f0cfd0f30a",
    server: "us5",
  });

  const run = async () => {
    try {
      const response = await client.lists.addListMember("93f1e0b0f2", {

        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName,
        }
      });
      console.log(response);
      res.sendFile(__dirname + "/success.html");
    } catch (err) {
      console.log(err.status);
      res.sendFile(__dirname + "/failure.html")
    }
  };


  run();

});

app.post("/failure", function(req, res) {
  res.redirect("/");

});

app.listen(process.env.PORT || 3000, function(res, req) {
  console.log("Server is running")
});

// Api key
// e46952834b76287c561d99f0cfd0f30a-us5

// List-id
// 93f1e0b0f2
