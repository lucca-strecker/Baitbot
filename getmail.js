var Imap = require("imap"),inspect = require("util").inspect;
var fs = require("fs"),fileStream;
const sendmail = require ('./sendmail');
var forwarded = require('forwarded');

//=====================================================================================
//INITIALISIERUNG & LOGIN IN DEN EMAIL ACCOUNT DES BOT (AUSSCHLIEßLICH AUF GLITCH.COM):
//=====================================================================================

const logInBot = require("./logInBot"); //Workaround, um passwort u. benutzernamen aus anderer Datei zu erlangen (Sicherheitsrel.)
const nameLogin = logInBot.getName();
//console.log(nameLogin + " << This is the mail");
const pas = logInBot.getPas();
//console.log(pas + "  << this is the password");

//===========================================================================
//FETCHEN DER RAW DATA NEUER MAILS (AUF DEM EMAIL ACCOUNT DES BOTS) MIT IMAP:
//===========================================================================

var buffer = "";

var myMap;

var imap = new Imap({
  user: nameLogin,
  password: pas,
  host: "imap.gmail.com",
  port: 993,
  tls: true,
  connTimeout: 10000, // Standard
  authTimeout: 5000, // Standard
  debug: console.log, // Or your custom function with only one incoming argument. Default: null
  tlsOptions: { rejectUnauthorized: false },
  mailbox: "INBOX", // mailbox to monitor
  searchFilter: ["UNSEEN"], // the search filter being used after an IDLE notification has been retrieved
  markSeen: true, // all fetched email willbe marked as seen and not fetched next time
  fetchUnreadOnStart: false, // use it only if you want to get all unread email on lib start. Default is `false`,
  mailParserOptions: { streamAttachments: false }, // options to be passed to mailParser lib.
  attachments: false, // download attachments as they are encountered to the project directory
  attachmentOptions: { directory: "attachments/" } // specify a download directory for attachments
});

function openInbox(cb) {
  imap.openBox("INBOX", false, cb);
}

imap.once("ready", function() {
  openInbox(function(err, box) {
    if (err) console.error(err);
    imap.search(["UNSEEN", ["SINCE", "April 20, 2010"]], function(
      err,
      results
    ) {
      if (err) console.error(err);
      if (results.length > 0) {
      var f = imap.fetch(results, { bodies: "", markSeen: true });
      f.on("message", function(msg, seqno) {
        var prefix = "(#" + seqno + ") ";
        msg.on("body", function(stream, info) {
          stream.on("data", function(chunk) {
            buffer += chunk.toString("utf8");
          });
          stream.once("end", function() {
            if (info.which === ""){
            }
          });
        });
        msg.once("attributes", function(attrs) {
        });
        msg.once("end", function() {
        });
      });
      f.once("error", function(err) {
      });
      f.once("end", function() {
        imap.end();
        processing(buffer);
      });
    } else {
    // results is empty, nothing to do ... stop Imap
    imap.end();
    return; // stop
  }
    });
  });
});

imap.once("error", function(err) {
  //  console.log(err);
});

imap.once("end", function() {
  //console.log('Connection ended');
});

imap.connect();

//=========================================================================
//NEUER DATENSATZ FÜR ALLE NACHRICHTEN /PRO SENDER (SCAMMER) WIRD ANGELEGT:
//=========================================================================

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const mailadapter = new FileSync(".Data/user.json");
const dbm = low(mailadapter);

// Set some defaults (required if your JSON file is empty)
dbm.defaults({user: []}).write();

//================================
//PARSEN DER EXTRAHIERTEN RAW-MAIL:
//================================

const simpleParser = require("mailparser").simpleParser;

function processing(input) {

  console.log("->All Mails fetched");
  simpleParser(input, (err, parsed) => {
  //  console.log(parsed); // komplette geparste Mail
  // console.log(parsed.from.text + " <-- Sender of the Mail");// absender der geparsten Mail
  // console.log(parsed.subject + " <-- Mail Subject/Title");// titel der geparsten Mail
  //   console.log(parsed.text + " <-- Mail Text"); // text der geparsten Mail
  //   console.log(parsed.date + " <-- Mail Recieve-Date");// datum der geparsten Mail

  // ZUWEISEN VON "INCOMING ID" (EINE VARIABLE DIE DIE ANZAHL AN ERHALTENEN NACHRICHTEN PRO ABSENDER ZÄHLT)

  var incomingID =   1;


  //HINZUFÜGEN NEUER NUTZER IN DBA (DATA BASE ACCESS)

  const mailadapterA = new FileSync(".Data/access.json");
  const dba = low(mailadapterA);


  var randomNumber = Math.floor(Math.random() * 999999) + 111111; //Returns 6-digit String (number) between 111111 and 999999

  var access = '';

  var name = '';
  var initial = 0;

  var double = 0;

  var existant = 0;

  var extractedScamName = extractEmails(parsed.from.text);

  var scammerMail = extractedScamName[extractedScamName.length-1];
  console.log(scammerMail);


  access = dbm.get("user").filter({ scammer: extractedScamName }).map("code").last().value();
    console.log(extractedScamName + "This is the Mailadress");
    console.log(access + "THIS IS THE AC 1");
  if(access == undefined){
    console.log(scammerMail + "This is the scammer Mailadress");
    access = dbm.get("user").filter({ name: scammerMail }).map("code").last().value();
    console.log(access + "THIS IS THE AC 2");
  }


  var subject = parsed.subject;
  var text = parsed.text;

  var allUsers = dbm.get("user").filter({ name: scammerMail }).map().value();
  var allUsers2 = dbm.get("user").filter({ scammer: scammerMail }).map().value();
  console.log(allUsers.length + "ALL HERE")

if(subject.includes(":BB:") && allUsers.length >= 1 || subject.includes(":BB:") && allUsers2.length >= 1 ){
  console.log(subject + " Already forwarded - sending info");

  var extractedName = extractEmails(parsed.from.text);
  name = extractedName[extractedName.length-1];

  double = 1;

  var answer = "Thank you for working with Baibot - Antiscam! \nThe scammer whos mail you forwarded is already on our list! \n\n- you can chekcout the current conversation at www.baibot.glitch.me\nThe access code is:  " + access + "\n\nEnjoy!\n\nBaitbot Team";

  sendmail.send(name, "Do Not Reply! - BAITBOT", answer);

  }else if (subject.includes(":BB:") && text.includes("--- Forwarded message ---")) { // if subject of the mail includes :BB: it is an initializaltion mail.
    console.log(subject + "Initial Code");

    var extractedMail = extractEmails(parsed.text);

    scammerMail = extractedMail[0];

    var extractedName = extractEmails(parsed.from.text);
    name = extractedName[extractedName.length-1];

    subject = "Answer";

    initial = 1;

    access = randomNumber;

    var answer = "Thank you for participating in the Batibot - Antiscam Programm! \nYou can now access the Bots conversation with your scammer under www.baitbot.glitch.me \n\n- simply enter your individual access code: " + access + "\n\nEnjoy!\n\nBaitbot Team";
    sendmail.send(name, "Do Not Reply! - BAITBOT", answer);
  } else if (subject.includes(":BB:")) { // if subject of the mail includes :BB: it is an initializaltion mail.
    console.log(subject + "Initial Code");

    var extractedMail = extractEmails(parsed.text);

    scammerMail = extractedMail[extractedMail.length-1];

    var extractedName = extractEmails(parsed.from.text);
    name = extractedName[extractedName.length-1];

    initial = 1;

    access = randomNumber;

    var answer = "Thank you for participating in the Batibot - Antiscam Programm! \nYou can now access the Bots conversation with your scammer under www.baitbot.glitch.me \n\n- simply enter your individual access code: " + access + "\n\nEnjoy!\n\nBaitbot Team";
    sendmail.send(name, "Do Not Reply! - BAITBOT", answer);
}
  else {
    name = dbm.get("user").filter({ scammer: scammerMail }).map("name").last().value();
  }

    function extractEmails ( text ){
      return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);
      }

  // var allUsers = dbm.get("user").filter({ name: name }).map("name").value();
  var allScammers = dbm.get("user").filter({ scammer: scammerMail }).map("scammer").value();

console.log(allScammers.length + "All Scammer length");


  if (allScammers.length >= 1 && double < 1) {

    console.log("Scammer schon vorhanden");

    var getCode = dbm.get("user").filter({ scammer: scammerMail }).map("code").last().value();

    incomingID = dbm.get("user").filter({ scammer: scammerMail }).map("id").last().value() + 1;

    dbm
      .get("user")
      .push({initial: initial, scammer: scammerMail, name: name, text: text, subj: subject, date: parsed.date, id: incomingID, answered: 0, code: getCode}).write();

  } else if (double < 1 && initial > 0){
    console.log("Neuer User");
    dbm
      .get("user")
      .push({initial: initial, scammer: scammerMail, name: name, text: text, subj: subject, date: parsed.date, id: incomingID, answered: 0, code: access}).write();
  } else if (double > 0){
    console.log(scammerMail + " User not known to db or already initiated");
  } else {
    console.log(scammerMail + " Unknown Person - Doing nothing");
  }




  });
}



// LOGGEN IM TERMINAL VON ALLEN USERN IN .DATA (DATABASE FOLDER)
// console.log(
//   dbm
//     .get("user")
//     .map()
//     .value()
// );
