const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("resources"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const phone = req.body.phone;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
        PHONE: phone
      }
    }]
  };

  const jsonData = JSON.stringify(data);


  const url = "https://us10.api.mailchimp.com/3.0/lists/8c0ef19b4f";
  const options = {
    method: "POST",
    auth: "sharif:72b9c7ab751620a0ba654ff5e2892d9f-us10"
  };

  const request =  https.request(url, options, function(response) {

    if (response.statusCode===200){
        res.sendFile(__dirname+"/success.html");
    }else{
      res.sendFile(__dirname+"/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
      });
    });
  request.write(jsonData);
  request.end();
});

app.post("/success", function(req, res){
  res.redirect("/");
})


app.listen(3000, function(req, res) {
  console.log("App is running on server 3000");
});


// 72b9c7ab751620a0ba654ff5e2892d9f-us10
// 8c0ef19b4f
