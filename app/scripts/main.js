

//SENTENCES
var data={"sentences":[
        {
            "first":"gubbe",
            "second":"kör",
            "third":"bil"
        },
        {
            "first":"man",
            "second":"äter",
            "third":"mat"
        }
]}


// CREATE A REFERENCE TO FIREBASE

var rootUrl = "https://fron15game.firebaseio.com/"
var dbRef = new Firebase('https://fron15game.firebaseio.com/');
var allUserRef = new Firebase(rootUrl + "/users/");
var me =  dbRef.getAuth();


// REGISTER DOM ELEMENTS
var emailField = $('#email');
var pwdField = $('#pwd');


//Some Globals
var firstWord = [];
var secondWord = [];
var thirdWord = [];
var word=[];
var array = [];
var choosenSentence;


//REGISTER / LOGIN USERS
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
      uid: userData.uid
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
    window.location.href = './profile.html';
  }
})
return false;
});

//GET ALL LOGGED IN USERS
function listLoggedInUsers() {
  var list = $('<ul/>').appendTo('#showusers');
  var t = $('#table');
      dbRef.child("users").once('value', function(dataSnapshot) {



  var users = dataSnapshot.val();
  if (users) {
    jQuery.each(users, function(i, val) {
    var li;
    var me =  dbRef.getAuth().password.email;
      if (val.email !== me) {
        var li = $('<td/>')
        .attr('id', users[i].uid)
            .addClass('playUser')
            .appendTo(t)
            .text(val.email)
        }
      });
    }

    $('#table').on('click','td', function(e){
      var uid = e.target.id;
      alert(uid);
        createGame(uid);
    });
});
}






//CREATE GAME WITH CLICKED PLAYER
var createGame =  function(uid) {
var array = data.sentences[Math.floor(Math.random()*data.sentences.length)];
    //SEND INVITE TO USER
    allUserRef.child(uid).child("gameinvite").set({from: dbRef.getAuth().uid, word: array});
var message = array.first + " " + array.second + " " + array.third;
//CLEAR OLD CANVAS
var pixelDataRef = new Firebase(rootUrl).child("draw");
    pixelDataRef.remove();
    createPaintPlan(message);
};






//CREATE CHARS
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


//CREATE BOARD
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




function updateFirebaseAdd(myWord, parentId) {
  var correct ="";
  var playerwordRef = new Firebase('https://fron15game.firebaseio.com/playerword/' + parentId);
  playerwordRef.once("value", function(argument) {

  var arg = argument.val();
  correct = arg.correctWord;
})

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

  console.log(newWord);
  if (newWord.join("") === correct) {
  alert("Ordet stämmer!")
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

//SET-UP FIREBASE-LISTENERS
$(document).ready(function(){
  $('#pl1').text(me.password.email);
  $('#intro').text("Utmana en inloggad användare genom att klicka i listan till vänster");
  $('.container-canvas').css('display', 'none');
  $('#chars, #message').css('display', 'none');


   dbRef.child("users/" + dbRef.getAuth().uid +"/gameinvite").on("child_changed", function(message) {
   var sender = message.val();
  createWordPlan(sender);
   });
});





//FOR SPELLING PLAYER
 function createWordPlan(array) {
  $('#chars, #first, #second, #third').empty();
  $('#chars, #message, .container-canvas').css('display', 'block');


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

    var pixSize = 8, lastPoint = null, currentColor = "000"
    var pixelDataRef = new Firebase(rootUrl).child('draw');
    var myCanvas = document.getElementById('drawing-canvas');

   var myContext = myCanvas.getContext ? myCanvas.getContext('2d') : null;
   if (myContext == null) {
     alert("You must use a browser that supports HTML5 Canvas to run this demo.");
     return;
   }

   var drawPixel = function(snapshot) {
     var coords = snapshot.key().split(":");
     myContext.fillStyle = "#" + snapshot.val();
     myContext.fillRect(parseInt(coords[0]) * pixSize, parseInt(coords[1]) * pixSize, pixSize, pixSize);
   };
   var clearPixel = function(snapshot) {
     var coords = snapshot.key().split(":");
     myContext.clearRect(parseInt(coords[0]) * pixSize, parseInt(coords[1]) * pixSize, pixSize, pixSize);
   };
   pixelDataRef.on('child_added', drawPixel);
   pixelDataRef.on('child_changed', drawPixel);
   pixelDataRef.on('child_removed', clearPixel);

}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function createPaintPlan(message) {

$('#intro').text("Måla en bild som föreställer:");
$('#mission').text(message);
$('#chars').css('display', 'none');
$('#message').css('display', 'none');
$('.container-canvas').css('display', 'block');
  var pixSize = 8, lastPoint = null, currentColor = "000", mouseDown = 0;
  var pixelDataRef = new Firebase(rootUrl).child('draw');
  var myCanvas = document.getElementById('drawing-canvas');

 var myContext = myCanvas.getContext ? myCanvas.getContext('2d') : null;
 if (myContext == null) {
   alert("You must use a browser that supports HTML5 Canvas to run this demo.");
   return;
 }


 var colors = ["fff","000","f00","0f0","00f","88f","f8d","f88","f05","f80","0f8","cf0","08f","408","ff8","8ff"];
 for (c in colors) {
   var item = $('<div/>').css("background-color", '#' + colors[c]).addClass("colorbox");
   item.click((function () {
     var col = colors[c];
     return function () {
       currentColor = col;
     };
   })());
   item.appendTo('#colorholder');
 }


 myCanvas.onmousedown = function () {mouseDown = 1;};
 myCanvas.onmouseout = myCanvas.onmouseup = function () {
   mouseDown = 0; lastPoint = null;
 };

 var drawLineOnMouseMove = function(e) {
   if (!mouseDown) return;

   e.preventDefault();


   var offset = $('canvas').offset();
   var x1 = Math.floor((e.pageX - offset.left) / pixSize - 1),
     y1 = Math.floor((e.pageY - offset.top) / pixSize - 1);
   var x0 = (lastPoint == null) ? x1 : lastPoint[0];
   var y0 = (lastPoint == null) ? y1 : lastPoint[1];
   var dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
   var sx = (x0 < x1) ? 1 : -1, sy = (y0 < y1) ? 1 : -1, err = dx - dy;
   while (true) {

     pixelDataRef.child(x0 + ":" + y0).set(currentColor === "fff" ? null : currentColor);

     if (x0 == x1 && y0 == y1) break;
     var e2 = 2 * err;
     if (e2 > -dy) {
       err = err - dy;
       x0 = x0 + sx;
     }
     if (e2 < dx) {
       err = err + dx;
       y0 = y0 + sy;
     }
   }
   lastPoint = [x1, y1];
 };
 $(myCanvas).mousemove(drawLineOnMouseMove);
 $(myCanvas).mousedown(drawLineOnMouseMove);

 var drawPixel = function(snapshot) {
   var coords = snapshot.key().split(":");
   myContext.fillStyle = "#" + snapshot.val();
   myContext.fillRect(parseInt(coords[0]) * pixSize, parseInt(coords[1]) * pixSize, pixSize, pixSize);
 };
 var clearPixel = function(snapshot) {
   var coords = snapshot.key().split(":");
   myContext.clearRect(parseInt(coords[0]) * pixSize, parseInt(coords[1]) * pixSize, pixSize, pixSize);
 };
 pixelDataRef.on('child_added', drawPixel);
 pixelDataRef.on('child_changed', drawPixel);
 pixelDataRef.on('child_removed', clearPixel);
};
