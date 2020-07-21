const logInBot = require("./logInBot"); //Workaround, um passwort u. benutzernamen aus anderer Datei zu erlangen (Sicherheitsrel.)
const nameLogin = logInBot.getName();
//console.log(nameLogin + " << This is the mail");
const pas = logInBot.getPas();
//console.log(pas + "  << this is the password");

function send(sendto, subj, txt){

var nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: nameLogin,
    pass: pas
  }
});

var mailOptions = {
  from: 'Holladio@gmail.com',
  to: sendto,
  subject: subj,
  text: txt
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
}


module.exports = { send };
