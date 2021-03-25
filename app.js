const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
})); // BodyParser is used to get values from post request
app.use(express.static("public")); //This node module  is  used when we want to send static files(like CSS file) from our server
//Get request
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
})

//Post request
app.post("/", function(req, res) {
  const FistName = req.body.FirstName;
  const LastName = req.body.LastName;
  const Email = req.body.Email;
  // Making data for mailchimp servers
  var data = {
    members: [{
      email_address: Email,
      status: "subscribed",
      merge_fields: {
        FNAME: req.body.FirstName,
        LNAME: req.body.LastName,
      }
    }]
  };
  //Converting data to JSON format
  var jsonData = JSON.stringify(data);

  //Make post request to Mailchimp
  const url = "https://us7.api.mailchimp.com/3.0/lists/"+"8ffcaab11c";              //URL with List ID
  const options= {                                                                    //See https.request documentation for options.
    method: "POST",
    auth: "API_KEY"
  }
  const request = https.request(url,options,function(response){                            //Make request to mailChimp server
    if(response.statusCode===200){
      res.sendFile(__dirname+"/success.html");
    }
    else{
      res.sendFile(__dirname+"/failure.html");
    }
    response.on("data",function(data){
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);                                                                     //Send data in request
request.end();                                                                              //End the request

});

app.post("/failure.html",function(req,res){
  res.redirect("/");                                                                             //redirect to home page in case of fai;ure
});

// Set Up server at port 3000
app.listen(process.env.PORT || 3000, function() {                                                  //Dynamic port for Heroku
  console.log("Server running at Port 3000");
});



