import express from "express";
import aws from "aws-sdk";
import { response } from "express";
import mysql from 'mysql';
import fs from "fs"
import bodyParser from "body-parser";
import pkg from 'uuid';
const { v4: uuidv4 } = pkg;

let rawpass =  fs.readFileSync('C:\\Users\\Emma\\Documents\\complitou-app\\complitou\\routes\\passwords.json');
let passwords = JSON.parse(rawpass);
var hosturl = "http://localhost:3000"

const router = express.Router();

router.use(bodyParser.urlencoded({extended: false}));

//const ses = new aws.SES({region: "us-east-1"});
const ses = new aws.SES({
    accessKeyId: passwords["aws_access_key_id"],
    secretAccessKey: passwords["aws_secret_access_key"],
    region: "us-east-1"
});

const dbconnection = mysql.createConnection({
  host: "complitou.cpf4qofraygb.eu-west-2.rds.amazonaws.com",
  user: "admin",
  password: passwords["sqlpassword"],
  database: "complitou"
});

router.post('/submitc', function(req, res, next) {
  console.log('starting submission')

  //connect to DB
  dbconnection.connect(function(err) {
      if (err) {
          console.error('Database connection failed:' + err.stack)
          //this probably should reset something or redirect
          return;
      }
      console.log("Connected!");
  });

  //extract values from the request
  var targetName = req.body.theirName;
  var targetEmail = req.body.theirEmail;
  var senderEmail = req.body.yourEmail;
  var message = req.body.complimentContent;
  //create a confirmation code
  var confirmationcodeval = uuidv4();
  var confirmationcode_link = hosturl + "/confirm/" + senderEmail +"/"+confirmationcodeval
  //insert into database using parameters
  var check_sender = "PUT senders (nSend) VALUES (2) WHERE email = ?" //for known sender
  var sender_sql = "INSERT INTO senders (email, nSend) VALUES (?, 1)" //for new sender

  //id targetName targetEmail message senderID validatedBool viewedBool viewdate"
  var compliment_sql = "INSERT INTO complitou (targetName, targetEmail, message, senderID, senderEmail, confirmationCode) VALUES (?,?,?,?,?,?)" 

  dbconnection.query(sender_sql, [senderEmail], function(err, result) {
      if (err) throw err;
      var senderID = result.insertId;
      console.log('sender record inserted');
      dbconnection.query(compliment_sql, [targetName,targetEmail,message,senderID,senderEmail, confirmationcodeval], function(err, result) {
        if (err) throw err;
        console.log('compliment record inserted');
      });  
  });

  //send SES email now
  sesSendValidation(confirmationcode_link, senderEmail)
      .then((val) => {
        console.log("got this back", val);
        res.redirect('/'); //send them somewhere that specifies that they should check their email
      })
      .catch((err) => {
        res.redirect("/error"); //make this a page
  
        console.log("There was an error!", err);
      });
  });


//https://expressjs.com/en/guide/routing.html
//create validation code, add it to the compliment sql
//create route /val/:senderemail/:code
//sending data via localhost:3000/val/actualemail/actualcode
//access via req.params.senderemail and actualcode

router.get("/confirm/:senderemail/:code", function(req, res) {
  var senderEmail = req.params.senderemail;
  var validationcode =  req.params.code;
  console.log("Lets validate senderemail " + senderEmail)
  dbconnection.connect(function(err) {
    if (err) {
        console.error('Database connection failed:' + err.stack)
        //this probably should reset something or redirect
        return;
    }
    console.log("Connected!");
  });

  //id targetName targetEmail message senderID validatedBool viewedBool viewdate"
  var validate_sql = "SELECT * FROM complitou WHERE (senderEmail = ? AND confirmationCode = ? AND validatedBool = 0)" 

  dbconnection.query(validate_sql, [senderEmail, validationcode], function(err, result) {
      if (err) throw err;
      console.log('retrieved compliment');
      console.log(result)
      //send email to compliment receiver
      sesSendCompliment(result[0])
        .then((val) => {
          console.log("got this back", val);
        })
        .catch((err) => {
          res.redirect("/error"); //make this a page

          console.log("There was an error!", err);
        });

      //set validated bool to 1
      var updateid = result[0].id;
      console.log(updateid)
      var update_sql = "UPDATE complitou set validatedBool = 1 WHERE id = ?" 
      dbconnection.query(update_sql, [updateid], function(err, result) {
        if (err) throw err;
        console.log("updated validated bool")

        res.redirect("/success");
      });

      //confirm that this has worked to sender
      //TBA
  });
});

  function sesSendValidation(confirmationLink, senderEmail) {
    var texthtml = `<html><body>Hey there,<br>Someone just submitted a nice compliment on <a href='complitou.com'>complitou.com</a> using this email address.<br><a href='${confirmationLink}'>Click here to validate this compliment.</a> or copy this into your browser: ${confirmationLink}<br>If this was not you, please ignore this email.\n</body></html>`;
    console.log(texthtml)

    var params = {
      Destination: {
        ToAddresses: [senderEmail.trim()]
      },
      Message: {
        Body: {
          Html: {
              Charset: "UTF-8",
              Data: texthtml,
          },
          Text: {
              Charset: "UTF-8",
              Data: "Hey there, Someone just submitted a nice compliment on complitou.com using this email address.\nPlease open this link to validate this compliment:"+confirmationLink+ "\nIf this was not you, please ignore this email.\n"
          }
        },  
        Subject: { Data: "Complitou: Please validate this compliment"}
      },
      Source: "complitou@gmail.com"
    };
    console.log("sending confirmation email")
    return ses.sendEmail(params).promise();
  }

  function sesSendCompliment(result) {
    var texthtml = `<html><body>Hi there, '${result.targetName}'!<br>Someone you know wrote an anonoymous compliment to tell you how much you mean to them.<br>This was their lovely message:<br><i>'${result.message}'<i><br>If you'd like to send your own anonymous compliments to people you care about, please go to <a href='${hosturl}'>Complitou</a><br>Kind regards and best wishes,<br>Complitou</body></html>`
    var textnormal = "Hi there, "+ result.targetname +"!\nSomeone you know wrote an anonoymous compliment to tell you how much you mean to them.<br>This was their lovely message:\n"+ result.message+"\nIf you'd like to send your own anonymous compliments to people you care about, please go to "+hosturl+"\nKind regards and best wishes,\nComplitou"

    var params = {
      Destination: {
        ToAddresses: [result.targetEmail]
      },
      Message: {
        Body: {
          Html: {
          Charset: "UTF-8",
          Data: texthtml,
        },
        Text: {
            Charset: "UTF-8",
            Data: textnormal
        }
      },
  
        Subject: { Data: "Complitou: A Compliment To You"}
      },
      Source: "complitou@gmail.com"
    };
  
    return ses.sendEmail(params).promise();
  }

  export default router;
  