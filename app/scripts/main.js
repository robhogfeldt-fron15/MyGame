// CREATE A REFERENCE TO FIREBASE
var rootUrl = "https://fron15game.firebaseio.com/"
var dbRef = new Firebase('https://fron15game.firebaseio.com/');

// REGISTER DOM ELEMENTS
var emailField = $('#email');
var pwdField = $('#pwd');

//REGISTER NEW USER
$("#regUser").on("click", function(){
dbRef.createUser({
email    : $("#email").val(),
password    : $("#pwd").val(),
}, function(error, userData) {
if (error) {
    $("#error").text(error);
    console.log("Error creating user:", error);
} else {
    console.log("Successfully created user account with uid:", userData.uid);
    var newUser = {
      email: $("#email").val()
    };
  this.saveUser(userData.uid,newUser)
 }
})
});

//SAVE/CREATE USER RECORD
var saveUser = function(id, userData){
dbRef.child("users").child(id).set(userData);
};

//LOGIN USER
$("#loginUser").on("click", function(){
dbRef.authWithPassword({
email    : $("#email").val(),
password    : $("#pwd").val(),
}, function(error, authData) {
  if (error) {
      $("#error").text(error);
      console.log("Login Failed!", error);
  } else {
    console.log("Login Success!:", authData);
    window.location.href = './views/profile.html';
  }
})
});





var data={"sentences":[
        {
            "first":"gubbe",
            "second":"kör",
            "third":"bil"
        },
        {
            "first":"John",
            "second":"Jones",
            "third":"2010"
        }
]}


$('#startBtn').on('click', function(){


  var array = data.sentences[0];
  var keys = Object.keys(array);


$.each(array, function( i, l ){
    var line = "#" + i;
    var length = l.length;
    createPlayBricks(array[i]);
    createBricks( line, length );

  });


});

function createPlayBricks(word) {

  var cList = $('#chars')
  for (var i = 0; i < word.length; i++) {

    var li = $('<div/>')
        .addClass('square draggable')
        .appendTo(cList)
        .text(word[i])
  }

  $(".draggable").draggable({
          snap: ".squaredotted",
          snapMode: "inner",
        });

      }

      var firstWord = [];
      var secondWord = [];
      var thirdWord = [];
      var id = 0
      var word=[];

function createBricks(line, length) {

    var line = $(line);
    var play = $('#chars');
      for (var i = 0; i < length; i++) {

        var brick = $('<div/>')

            .addClass('square droppable squaredotted')
            .appendTo(line);

      }
      $(".squaredotted").droppable({

          drop: function(event, ui) {
           var dropIndex = $(this).index();
           var parentId = $(this).parent().attr('id');
           console.log(parentId);
           var char =  $(ui.draggable).html();
            word[dropIndex] = char;
          var w =  switchResult(parentId, char, dropIndex)
          if (w.word === w.correctWord) {
          console.log('success');
            }
            console.log(w);
            },
           out: function(event, ui) {
             var drop = $(this).index();
           var char =  $(ui.draggable).html();
            word[drop] = 0;
              console.log(word);
          }

        });

}



// function isRight(line, char, id) {
//
//   var array = data.sentences[0];
//   var choosenLine = switchResult(line.id, array, char);
//   console.log(choosenLine);
//
//
//
//   if (choosenLine.word === choosenLine.correctWord) {
// console.log('success');
//   }
//
// }

function switchResult(line, char, dropIndex){
  console.log(line + char + dropIndex);
    var array = data.sentences[0];
  switch(line) {
    case "first":
        firstWord[dropIndex] = char;
        var obj = {
               word:  firstWord.join(""),
               correctWord: array.first
           };
           return obj;
        break;
    case "second":
        secondWord[dropIndex] = char;
          var obj = {
                 word:  secondWord.join(""),
                 correctWord: array.second
             };
            return obj;
        break;
    case "third":
       thirdWord[dropIndex] = char;
         var obj = {
                word:  thirdWord.join(""),
                correctWord: array.third
            };
           return obj;
        break;
    default:
        console.log("none");
}
}


function createWordfromArr(){

}
