function bot () {
  
var natural = require('natural');

var brackets = [];


//
//=================================================
// RECHTSCHREIBUNG
// Dieser Teil dient zum Rechtschreib-Zwecks - Falsch geschriebene Sätze sollen hier korrigiert werden.
// ### WIRD IN DER AKTUELLEN VERSION NICHT BENUTZT! ###

var corpus = ['dog', 'jumped']; // Array voll mit worten in richtiger Schreibweise, der Bot sucht nach Korrekturen hierzu, quasi die Wort Datenbank oder das Dicitonary
var spellcheck = new natural.Spellcheck(corpus);

//console.log(spellcheck.getCorrections('dohg', 1)); // man bekommt die korrektur des Wortes "dohg"

var str = "I love. Dogs, and cats! Do you? Love dogos?"

//
//=================================================
// INPUT
// Dieser Teil ist ein Platzhalter für den Input, über eine Variable können verschiedene Inputs zu Test-Zwecken eingespeist werden.

//const input = 'The lazy dohg jumpid over the red fox'; // Dieser Input steht nur exemplarische für den eingehenden Text, etwa weitergeleitete Mails

//const input2 = 'invest in my gold and get rich';
//const input3 = 'I offer you special price';
//const input4 = 'What is the price';
//const input5 = 'hey! What is your Name? Would you like to invest and get rich';
//const input6 = 'Hi Mate! Whats your name? Are you fine? Can you help me?';
//const input7 = 'Hi. Who am I talking to? I need some help!';
//const input8 = 'Are you a bot?';

// var input = input8; // Legt fest welcher Input gerade verwendet werden soll.

//
//=================================================
// VARIABLER INPUT / TEST
// In diesem Teil wird versucht, der Input variabel über das Terminal zu erlangen.


const prompt = require('prompt-sync')(); // Node js module names prompt-syn

const custInput = prompt('Start the conversation (type in..)');

const input = (`${custInput}`); // INPUT ÜBER TERMINAL

//
//=================================================
// TRAINING
// Dieser Teil dient zum einspeisen von Trainings "Daten", anhand deren der Bot später die Intentionen hinter einem Satz / Text erkennen kann.

var classifier = new natural.BayesClassifier();

const data = require('./data/data.json');
const answers = require('./data/answers.json');

data.forEach(item => {
  classifier.addDocument(item.text, item.category);
})


classifier.train();

//
//=================================================
// TEXT UNTERTEILEN
// In diesem Teil wird der Iput Text in seine einzelnen Sätze unterteilt, damit diese EINZELN auf deren Intention geprrüft werden können.
//


// satze();
//
// function satze() {
//
//   var Tokenizer = require('sentence-tokenizer'); // Anderer tokenizer / nicht aus der "natural" library, kann Text in Sätze unterteilen, wie folgt
//   var tokenizer = new Tokenizer('Chuck');
//   tokenizer.setEntry(input);
//   // console.log(tokenizer.getSentences());
//   brackets.push(tokenizer.getSentences());
//
// }

// 2te herangeheensweise:
// Dieser selbst geschriebene Code kann ebenso den Input unterteilen, jedoch trennt er auch zwischen Kommas, was nützlich sein könnte.

brackets.push(input.split('=').join(',').split(':').join(',').split(',').join('.').split('.').join('?').split('?').join('!').split('!'));
brackets[0].pop();

// console.log(brackets);


//=================================================
// INTENTION BESTIMMEN
// Die Funktion intend(input) aktiviert den classifier für einen bestimmten input, der hier als int eingeht.


function intend(int) {
  var intention = classifier.classify(int);

  return intention;
}


//
//=================================================
// ANTWORTEN GENERIEREN
// In diesem Teil sollen die auf das Thema passenden Antworten gedfunden & generiert werden.
// Dieser Teil generiert die Antworten ebenfalls / wie die Intentionen / aus einer JSON Datei heraus: (answers.json)
//
for (var i = 0; i < brackets[0].length; i++) {
  //console.log(intend(brackets[0][i]) + ' TEST INTENDS');
  for (var j = 0; j < answers.length; j++) {

    if (intend(brackets[0][i]) == answers[j].category) {
      console.log(answers[j].text); // AUSGABE ANTWORT
    }
  }
}

// Ende
}