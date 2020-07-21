// var query = location.href.split("/"); //A string of all parameters in the URL
// var thisID = query[query.length-1]
//
//   // call loadSurveys() on starting of the app to see what's in the database
// loadSurveys();
//
//
//   // loads all entries from the database and creates list items in the html document
// function loadSurveys() {
//     $.get('/convos', function(users) {
//
//       // clear list when the data is loaded from the server
//       $('ul#surveys li').remove();
//
// for (var i = 0; i < users.length; i++) {
//   // console.log(users[i].code);
//   if(users[i].code == thisID){
//       console.log(users[i].code);
//     $('<div id=incoming><p></p></div>').text(users[i].text).appendTo('div#input');
//     $('<div id=outgoing><p></p></div>').text(users[i].answer).appendTo('div#input');  //#answer anstatt #input eigentlich (wegen nth-child)
// } else {
//   console.log("NOPE");
// }
// };
//     });
//   }


  var query = location.href.split("/"); //A string of all parameters in the URL
var thisID = query[query.length-1]

$('<div id="scamID"></div>').text("#" + thisID).appendTo('.scam-topic');

  // call loadSurveys() on starting of the app to see what's in the database
loadSurveys();



  // loads all entries from the database and creates list items in the html document
function loadSurveys() {
    $.get('/convos', function(users) {

      // clear list when the data is loaded from the server
      $('ul#surveys li').remove();
      var x = -1;
      var y = 0;
for (var i = 0; i < users.length; i++) {
  // console.log(users[i].code);

  if(users[i].code == thisID){
    x+=2;
    y+=2;
    // var x = i+2;
    $('<div id="mainblockscammer"></div>').appendTo('div#input');
    $('<div id="mainblockbot"></div>').appendTo('div#input');
      console.log(users[i].code);

    $('<div class=markScam></div>').text("SCAMMER").appendTo("#input> div:nth-child("+x+")");
    $('<div class=subjScam></div>').text("SUBJECT: " + users[i].subj).appendTo("#input> div:nth-child("+x+")");
    $('<div class=dateScam></div>').text(users[i].date).appendTo("#input> div:nth-child("+x+")");
    $('<img id="scammerprofile" src="https://cdn.glitch.com/c8712629-d3ad-4fa9-a510-e8b303ac5bf0%2FScammer.png?v=1595154952281.png">').prependTo("#input> div:nth-child("+x+")");
    $('<div class=incoming></div>').text(users[i].text).appendTo("#input> div:nth-child("+x+")");

    $('<img id="botprofile" src="https://cdn.glitch.com/c8712629-d3ad-4fa9-a510-e8b303ac5bf0%2FBot.png?v=1595154956091">').appendTo("#input> div:nth-child("+y+")");
    $('<div class=markBot></div>').text("BAITBOT").appendTo("#input> div:nth-child("+y+")");
    $('<div class=subjBot></div>').text("SUBJECT: " + users[i].subj).appendTo("#input> div:nth-child("+y+")");
    $('<div class=dateBot></div>').text(users[i].date).appendTo("#input> div:nth-child("+y+")");
    $('<div class=outgoing></div>').text(users[i].answer).appendTo("#input> div:nth-child("+y+")");




} else {
  console.log("NOPE");
}
};
      adding();
  });
}

  function adding() {
    // $( "#mainblockscammer" ).prepend('<div class="subject" id="subjectscammer"> TEST js.63 </div>');
    // $( "#mainblockscammer" ).prepend('<div class="mark" id="scammermark"> SCAMMER</div>');
    // $( "#mainblockscammer" ).prepend('<div class="profile" id="scammerprofile"><img src="http://localhost:3000/profilepic_scammer.png">  </div>');
    //
    // $( "#mainblockbot" ).prepend('<div class="subject" id="subjectbot"> TEST js.63 </div>');
    // $( "#mainblockbot" ).prepend('<div class="mark" id="botmark"> BAITBOT</div>');
    // $( "#mainblockbot" ).prepend('<div class="profile" id="botprofile">‍<img src="http://localhost:3000/profilepic_bot.png"></div>');

  }
