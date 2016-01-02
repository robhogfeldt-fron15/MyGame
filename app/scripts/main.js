//SENTENCES
var data={"sentences":[
        {
            "first":"gubbe",
            "second":"kör",
            "third":"bil"
        },
        {
            "first":"kvinna",
            "second":"skjuter",
            "third":"älg"
        }
]}

var choosenSentence;
// CREATE A REFERENCE TO FIREBASE
var rootUrl = "https://fron15game.firebaseio.com/"
var dbRef = new Firebase('https://fron15game.firebaseio.com/');

// REGISTER DOM ELEMENTS
var emailField = $('#email');
var pwdField = $('#pwd');


//Some Globals
var firstWord = [];
var secondWord = [];
var thirdWord = [];
var word=[];
var array = [];

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
      email: $("#email").val(),

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


function listLoggedInUsers() {
  var list = $('<ul/>').appendTo('#showusers');
      dbRef.child("users").once('value', function(dataSnapshot) {

  var users = dataSnapshot.val();

  if (users) {
    jQuery.each(users, function(i, val) {
    var me =  dbRef.getAuth().password.email;
      if (val.email !== me) {

        var li = $('<li/>')
            .addClass('playUser')
            .appendTo(list)
            .text(val.email);


            $(li).on("click", function() {

          createGame(this);

          });
        }


      });
    }

});
}

var me =  dbRef.getAuth();
var userRef = new Firebase(rootUrl + "/users/" + me.uid + '/');
var gameRef = new Firebase(rootUrl + "/users/" + me.uid + '/games/');
console.log(userRef.toString());



var createGame =  function(opp) {
  // body..
  var onComplete = function(error) {
  if (error) {
    console.log('Synchronization failed');
  } else {
    console.log('Synchronization succeeded');
  }


  }


  userRef.child('games').push({
    game: {

      opp : $(opp).html()},
    } ,onComplete)

    userRef.child('games').on("child_added", function(snapshot) {
  var opponent = snapshot.val();
  console.log(opponent.game.opp);
  if (dbRef.getAuth().password.email === opponent.game.opp) {
    console.log("sssss");
  }
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

};



userRef.child('games').on("child_added", function(snapshot) {
  var opponent = snapshot.val();
  console.log(snapshot.val());
  if (dbRef.getAuth().password.email === opponent.game.opp) {
    console.log("sssss");
  }
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});



// newGameRef.on("child_changed", function(snapshot) {
//   var thisUser = dbRef.getAuth().password.email;
//   var players = snapshot.val();
//
// if (thisUser === players.playerOne.name) {
//   $('.hideForpOne').css('display', 'none');
//
// }else {
//     $('.hideForpTwo').css('display', 'none');
// }
//
//
//
// });








$('#startBtn').on('click', function(){

array = data.sentences[Math.floor(Math.random()*data.sentences.length)];
choosenSentence = array;
console.log(array);
$('.playerOne').text(array.first +" "+ array.second +" "+ array.third);
var gamewordRef = dbRef.child("gameword");
gamewordRef.set({
  array
});

var playerwordRef = dbRef.child("playerword");
playerwordRef.set({
  first:{
    word : [],
    correctWord : array.first
  },
  second:{
    word : [],
    correctWord : array.second
  },
  third:{
    word : [],
    correctWord : array.third
  }
});

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
           var char =  $(ui.draggable).html();
               word[dropIndex] = char;

           var myWord = switchResult(parentId, char, dropIndex)
               updateFirebaseAdd(myWord, parentId)
        },
           out: function(event, ui) {
             var drop = $(this).index();
             var char =  $(ui.draggable).html();
             var parentId = $(this).parent().attr('id');
             var myWord =  switchResult(parentId, char, drop);
                 myWord.word[drop] = 0;
                 updateFirebaseAdd(myWord, parentId);

          }

        });

}


var playerwordRef = new Firebase('https://fron15game.firebaseio.com/playerword/');

function updateFirebaseAdd(myWord, parentId) {

var playerwordRef = new Firebase('https://fron15game.firebaseio.com/playerword/' + parentId);
switch(parentId) {
  case "first":
      playerwordRef.update({ first: myWord.word})
      break;
  case "second":
      playerwordRef.update({ second: myWord.word})
      break;
  case "third":
      playerwordRef.update({ third: myWord.word})
      break;
  default:
      console.log("none");
}

// TODO: Cchange CSS if word is correct
playerwordRef.on("child_changed", function(snapshot) {
  var newWord = snapshot.val();

  if (newWord.join("") === myWord.correctWord) {
  console.log("newWord)");
  }

});
}




function switchResult(line, char, dropIndex){


  switch(line) {
    case "first":
        firstWord[dropIndex] = char;
        var obj = {
               word:  firstWord,
               correctWord: array.first
           };

           return obj;
        break;
    case "second":
        secondWord[dropIndex] = char;
          var obj = {
                 word:  secondWord,
                 correctWord: array.second
             };
            return obj;
        break;
    case "third":
       thirdWord[dropIndex] = char;
         var obj = {
                word:  thirdWord,
                correctWord: array.third
            };
           return obj;
        break;
    default:
        console.log("none");
}
}
