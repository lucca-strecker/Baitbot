
//==============================================================================================
// This "Test.js" is basically just a playground / sandbox to test all kinds of (node) functions
//==============================================================================================

// Testing how to seperate subtrings on certain characters.

//==============================================================================================

// const text = "Sure! Big Butts are a thing of beauty. I hope you understand. ., 25. Juni 2020 um 16:21 Uhr schrieb <testemailproject123@gmail.com>: > Could you explain it again? >"
//
// const days = ['Am Mo', 'Am Di', 'Am Mi', 'Am Do', 'Am Fr', 'Am Sa', 'Am So'];
// var n = 8;
//
// for (var i = 0; i < days.length; i++) {
//
// if (text.includes(days[i])) {
//   console.log("match");
//   console.log(text.substring(0, text.indexOf(days[i]))+ " Yep");
//
//
// } else {
//   console.log(days[i] + " nope");
//   n -= 1;
// }
// if(n == 1){
//   console.log("no match");
// }
// }

//==============================================================================================

// const incomingMail = "I like big butts.I cannot lie!"
// var shortendMail = 'hi';
//
// const days = ['Am Mo', 'Am Di', 'Am Mi', 'Am Do', 'Am Fr', 'Am Sa', 'Am So'];
// var n = 7;
//
// for (var i = 0; i < days.length; i++) {
//
// if (incomingMail.includes(days[i])) {
//
// shortendMail = incomingMail.substring(0, incomingMail.indexOf(days[i]));
// console.log(shortendMail);
//
// } else {
//   n-=1;
//   // console.log(n);
//   // console.log(days[i] + " nope");
// }
// }
// if(n==0){
//   shortendMail = incomingMail;
//   // console.log(shortendMail);
//   // console.log("n is null");
// }


//==============================================================================================
// Testing timer that is supposed to fetch Mails every 5 minutes.
//==============================================================================================

// console.log("I am doing my 5 minutes check");
//
// var minutes = 0.1, the_interval = minutes * 60 * 1000;
// setInterval(function() {
//   console.log("I am doing my 5 minutes check");
//   // do your stuff here
// }, the_interval);
//
// two();
// function two () {
//   console.log("EEEOOO");
// }


//==============================================================================================
// Testing CHECK function, to find our whether the mail has been answered to or not
//==============================================================================================
//
// const low = require("lowdb");
// const FileSync = require("lowdb/adapters/FileSync");
// const express = require("express");
//
// const mailadapter = new FileSync(".Data/user.json");
// const dbm = low(mailadapter);
//
// const mailInput = [];
// const mailSender = [];
// const mailBool = [];
//
//
// const incomingBool = dbm.get("user").map("answered").last().value();
//
//
// console.log(dbm
//   .get("user")
//   .map('text')
//   .last()
//   .value()
// );
//

//=======================
// SAVE INTO EXISTING DB
//=======================

// const test = 'test'
// //
// //
// //
// console.log(dbm
//   .get("user")
//   .last()
//   .assign({answered: 1, answer: test})
//   .write()
// );

//================================================
// HAVE ACCESS CODES LINK TO CERTAIN CONVERSATIONS
//================================================

// var test = Math.floor(Math.random() * 999999) + 111111; //Returns 6-digit String (number) between 111111 and 999999
//
// var name = "test"
//
// var shortendName = name.substring(0,name.indexOf(' <'));
//
// console.log(name);
//
// const low = require("lowdb");
// const FileSync = require("lowdb/adapters/FileSync");
// const express = require("express");
//
// const mailadapterA = new FileSync(".Data/access.json");
// const dba = low(mailadapterA);
//
//
// if(dba.has(name) == true){
// console.log(name + " <- User schon vorhanden");
// } else {
//   dba.set(name, []).write()
//   dba.get(name)
//     .push({code: test, name: name})
//     .write();
// console.log(name + " <- Neuer User");
// }
//
//  console.log(dba
//   .get(name)
//   .map("code")
//   .value());
//
//   var number = dba
//    .get(name)
//    .map("code")
//    .value();
//    console.log(number[0]);


//===================
// TESTING THE TIMER
//===================



//===================
// TEST USER ACCESS
//===================


// const low = require("lowdb");
// const FileSync = require("lowdb/adapters/FileSync");
// const express = require("express");
// const bodyParser = require("body-parser");
//
// const fs = require('fs');
// const parse = require('node-html-parser').parse;
//
// var mailadapter = new FileSync(".Data/user.json");
// var dbm = low(mailadapter);
//
// var inputList = dbm.get("user").filter({"code": 485750}).sortBy('id').map('text').value();
// var answerList = dbm.get("user").filter({"code": 485750}).sortBy('id').map('answer').value();
//
// // console.log(inputList[0]);
// // console.log(answerList[0]);
// var codes = dbm.get("user").map('code').value();
// console.log(codes[1]);
// console.log(dbm.get("user").map('code').value());
//
// function appendText() {
//   //fetch(/threads/1232376464)
//   var conversations = ['msg1', 'msg2', 'msg2'];
//   var paragraphs = conversations.map(function(c) {
//   	return "<p>"+ c +"</p>";
//   });
//   $("body").append(paragraphs);   // Append new elements
// }

// console.log(dbm.get("user").filter({"code": 485750}).sortBy('id').map('text').value());

// db.get('posts')
//   .filter({published: true})
//   .sortBy('views')
//   .take(5)
//   .value()


//
