$(function() {
  loadSurveys();

  $("form").submit(function(event) {
    event.preventDefault();
    var scam = $("input#scam").val();
    $.post("/input?" + $.param({scam: scam }), function() {
      $("<p></p>")
        .text(" " + scam)
        .appendTo("ul#users");

      $("input#scam").val("");

      $("input").focus();
      loadSurveys();
    });
  });

  function loadSurveys() {
    $.get("/input", function(input) {
      $("ul#input p").remove();
      input.forEach(function(inputs) {
       $("<p></p>")
          .text(inputs.scam)
          .appendTo("ul#input");
      });
    });
    $.get("/answer", function(input) {
      $("ul#answer p").remove();
      input.forEach(function(inputs) {
       $("<p></p>")
          .text(inputs.scam)
          .appendTo("ul#answer");
      });
    });


  }
});


$.get("/time", function(input) {
// Set the date we're counting down to
var countDownDate = new Date(input).getTime();
console.log(input + 'Current time');
// Update the count down every 1 second
var x = setInterval(function() {

  // Get today's date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  document.getElementById("timer").innerHTML = minutes + "m " + seconds + "s ";


  // If the count down is finished, write some text

  if (distance < 0) {
    clearInterval(x);
    // BEISPIEL CODE / NICHT FUNKTIONSFÄHIG
    // if(stagedMessage == true){
    //   sendStagedMessage();
    // } else {sendBotMessage()}
    alert( "Send message.." );
    // document.getElementById("timer").innerHTML = "EXPIRED";
  }
}, 1000);

});





//
