const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();
const fs = require('fs');
const parse = require('node-html-parser').parse;

var moment = require('moment');

const colors = require('colors');
console.log('Baitbot started'.rainbow);

//=======================
// Setup for the Data Base here:
//=======================

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

var mailadapter = new FileSync(".Data/user.json");
var dbm = low(mailadapter);

//dbm.get("user").remove().write() // Clear DB here



//=====================================
// Fetch new mails here: (continuously)
//=====================================

var minutes = 0.1, the_interval = minutes * 60 * 1000;
setInterval(function() {
  fetchMails();
}, the_interval);


function fetchMails(){

const { exec } = require("child_process");
console.log("checking Mails...".white);

exec("node getmail.js", (error, stdout, stderr) => {
    if (error) {
      //  console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
      //  console.log(`stderr: ${stderr}`);
        return;
    }
    //console.log(`stdout: ${stdout}`);
});
}


//=======================
// Start the Server here:
//=======================

// setup webserver
const app = express();
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port: ${server.address().port}`);
});

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//=============================
// LOG IN & VERIFICATION:
//=============================
//login:
app.post("/submit", function(req, res, next) {

mailadapter = new FileSync(".Data/user.json");
dbm = low(mailadapter);


const id = req.body.code

// console.log(id)
var codes = dbm.get("user").map('code').value();
var n = 0;

for (var i = 0; i < codes.length; i++) {
//  console.log(codes[i] + 'These are the codes');
 if (codes[i] == id) {
   n+=1;
}
}
if (n>0) {

console.log("Access Granted");
res.redirect('/conversation/' + id);
} else if (n<1) {

console.log("Access Denied");
res.redirect('/denied');
}
});
//path to specific conversation:
app.get('/conversation/:id', function(req, res, next) {
console.log(req.params.id + 'HERE');
const aCode = req.params.id

res.sendFile('public/conversation.html' , { root : __dirname}, function (err) {
    if (err) {
      next(err)
    } else {
      console.log('Sent:', aCode)
    }
  }
);
});
//load this if login rejected:
app.get('/denied', function(req, res, next) {
res.sendFile('public/denied.html' ,{ root : __dirname});
});


//=============================
// DYNMAIC CONVERSATION LENGTH:
//=============================

// get all conversation data
app.get("/convos", function (request, response) {
  response.json(dbm.get('user'));
});

//==========================================
// CHECK IF THE NEW MAILS ARE ANSWERD TO
// & ANSWER TO THEM (IF UNANSWERED)
//==========================================


setInterval(function() {
  mailCheck();
}, the_interval);

function mailCheck(){

//======================================================
// Setup incoming Mail - Database & Input Variable here:
//======================================================

const sendmail = require ('./sendmail');

const mailadapter = new FileSync(".Data/user.json");
const dbm = low(mailadapter);

//=======================================================================
// CHECK IF MAIL WAS RECEIVED 30(+) MINUTES AGO:
// ANSWERS TO MAILS WITH 30+ MINUTES OF DELAY & LOGS ALL OTHERS WITH LESS
//=======================================================================

// console.log(Date.now() + 'This is Now');
var nowDate = Date.now();
var timeSpan = 1800000; // 30 minutes equal 1800000 miliseconds.


var unanswered = dbm.get("user").filter({ answered: 0 }).map("code").value();

// console.log(unanswered);

for (var i = 0; i < unanswered.length; i++) {

  var mailTo = dbm.get("user").filter({ code: unanswered[i]}).map("scammer").last().value();

  var mailDate = dbm.get("user").filter({ code: unanswered[i]}).map("date").last().value();
  var mailContent = dbm.get("user").filter({ code: unanswered[i]}).map("text").last().value();
  var parseDate = new Date(mailDate);
  var conDate = parseDate.getTime() + 120000;


  if(conDate - nowDate <= timeSpan){
    // console.log("...30 Min Over" + mailContent + " Sending Answer to..." + mailTo);
    console.log("Sending answer to ".green + mailTo + " now".green);
    sendMail(unanswered[i]);
  }else{
        console.log("...New mail(s) found:".green)
        console.log("         (Mail to " + mailTo + " is staged & will be sent in: " + Math.round(((conDate - nowDate-timeSpan)/60000)) + " Minutes)")
        }
}

if(unanswered.length < 1){
  console.log("...All Mails answered to - waiting for new Mails...".red)
}


function sendMail(input) {

var sender = dbm.get("user").filter({ code: input}).map("scammer").last().value();
var incoming = dbm.get("user").filter({ code: input}).map("text").last().value();
var subject = dbm.get("user").filter({ code: input}).map("subj").last().value();
var initial = dbm.get("user").filter({ code: input}).map("initial").last().value();

console.log("...Sending Mail to => ".magenta + sender);
console.log("...Subject => ".magenta + subject);

//=====================================================
// Require "BotCode" - that generates answers to Input:
//=====================================================

const botCode = require('./bot');

//===========================================
// Filter Mail Responses down to "new" input:
//===========================================

var shortendMail = '';

const days = ['On Mo', 'On Tue', 'On Wed', 'On Thu', 'On Fri', 'On Sa', 'On Su', 'Am 0', 'Am 1', 'Am 2', 'Am 3', 'Am Mo', 'Am Di', 'Am Mi', 'Am Do', 'Am Fr', 'Am Sa', 'Am So'];
var n = 18;
//
for (var i = 0; i < days.length; i++) {
    if (incoming.includes(days[i])) { //if the incoming Mail contains strings from previous conv. that substring is cut away.
    shortendMail = incoming.substring(0, incoming.indexOf(days[i]));
      } else {
        n-=1;
            }
}
  
var extractedMails = extractEmails(incoming);

console.log("EXTRACTED: " + extractedMails);
//console.log("EXTRACTED2 " + extractedMails[extractedMails.length-1]);

if(incoming.includes(extractedMails[extractedMails.length-1])){
  console.log("Extraction detected.");
  var cut = extractedMails[extractedMails.length-1];
  var shorter = incoming.substring(incoming.indexOf(cut));
  var shorter2 = shorter.replace(">", " ");
  shortendMail = shorter2.replace(cut, " ");

  n=1;
}


function extractEmails ( text ){
  return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);
  }

if(n==0){ // If incoming mail DOESNT contain strings from previous chat / is a new mail,string remains the same
  var shorter3 = incoming.replace(">", " ");
  shortendMail = shorter3.replace("<", " ");
}

console.log("...This is the (shortened) Mail text => ".magenta
+ shortendMail);

//=======================
//SEND MAIL TO THE SCAMMER
//& SAVE ANSWER IN DBM (Data Base Mail)
//=======================

var sentSubj = "Answer" + subject
//
if (subject.includes("Re:")) {
  sentSubj = subject
} else{
  sentSubj = "Re:" + subject
}


console.log("...This is the processed subject => ".magenta
+ sentSubj);

var answer = botCode.bot(shortendMail) + "\n\nSincerely,\nJohn Harmon";

if(initial == 1){
  answer = "Hey! My friend just forwarded this mail to me, I am very interested in the idea and would like to get into business with you.\nI hope to hear from you soon! \n\nSincerely,\nJohn Harmon"
}

console.log("...This is the processed answer: => ".magenta
+ answer);

sendmail.send(sender, sentSubj, answer);
console.log("...Mail is being sent...".green);

dbm.get("user").filter({ code: input}).last().assign({answered: 1, answer: answer, text: shortendMail})
  .write();
  console.log("...Mail logged as answered".green);
}
}

//=========================
// ADDED A COUNTDOWN TIMER:
//=========================

app.get("/time", function(request, response) {

  var mailadapter = new FileSync(".Data/user.json");
  var dbm = low(mailadapter);

  const time = moment(dbm.get("user").map("date").last().value()).add(1, 'hours');

  response.json(time);
});

//=========================
// Total wasted time counter:
//=========================

app.get("/wastedtime", function(request, response) {

  var mailadapter = new FileSync(".Data/user.json");
  var dbm = low(mailadapter);

  var totalMails = dbm.get("user").size().value();
  var wastedTime = "Total Wasted Scammers Time:  " + totalMails * 3 + "  Minutes"
  console.log(wastedTime);

  response.json(wastedTime);
});


var totalMails = dbm.get("user").size().value();
var wastedTime = "Total Wasted Scammers Time: ".green + totalMails * 3 + " Minutes"
console.log(wastedTime);


//=================
// STAGED MESSAGES:
// These massages represent the optional user input
// that is 'staged' before the message will be sent.
//=================










//
