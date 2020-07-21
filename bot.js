// const testInput = "Hey there! Hello. How are you doing? Hey there! What is your name?";
//
// console.log(testInput);
//
// bot(testInput)


function bot(input) {
  var natural = require("natural");

  var brackets = [];

  var posAnswers = [];

  var sentParts = [];

  var double = [];

  var classifier = new natural.BayesClassifier();

  const data = require("./data.json");
  const answers = require("./answers.json");
  const random = require("./random.json");
  const troll = require("./troll.json");

  data.forEach(item => {
    classifier.addDocument(item.text, item.category);
  });

  classifier.train();

  brackets.push(
    input
      .split("=")
      .join(",")
      .split(":")
      .join(",")
      .split(",")
      .join(".")
      .split(".")
      .join("?")
      .split("?")
      .join("!")
      .split("!")
  );
  brackets[0].pop();

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  function intend(int) {
    var intention = classifier.classify(int);

    return intention;
  }

  var answer = "";

  for (var i = 0; i < brackets[0].length; i++) {
// console.log(intend(brackets[0][i]) + i);
    var x = 0;
    posAnswers.push([]);
    double.push(intend(brackets[0][i]));

    for (var n = 0; n < double.length; n++) {
      if (intend(brackets[0][i]) === double[n]){
        x+=1
      }
    }

    for (var j = 0; j < answers.length; j++) {

      if (intend(brackets[0][i]) == answers[j].category && x<2) {

        posAnswers[i].push(answers[j].text);

      }
    }
}

// console.log(posAnswers);


for (var i = 0; i < brackets[0].length; i++) {
    // console.log(posAnswers[i][getRandomInt(posAnswers[i].length)]);
    if (posAnswers[i][getRandomInt(posAnswers[i].length)] === undefined) {
      }else{
    answer += posAnswers[i][getRandomInt(posAnswers[i].length)] + " ";
  }
  }
//console.log(answer + 'This is the answer');
  if (posAnswers.length == 0) {
    answer = random[getRandomInt(3)].random;
  }
  // HIER: Chance 1: 20 dass eine troll antwort kommt, ohne dass der Inhalt nicht erkannt wird.

  if (getRandomInt(20) < 2) {
    posAnswers = [];
    answer = troll[getRandomInt(3)].troll;
  }
  //console.log(random[getRandomInt(3)].random);

  return answer;
  // Ende
}

module.exports = { bot };
