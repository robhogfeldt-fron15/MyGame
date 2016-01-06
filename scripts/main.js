function listLoggedInUsers(){var e=($("<ul/>").appendTo("#showusers"),$("#table"));dbRef.child("users").once("value",function(r){var a=r.val();a&&jQuery.each(a,function(r,t){var o=dbRef.getAuth().password.email;if(t.email!==o){$("<td/>").attr("id",a[r].uid).addClass("playUser").appendTo(e).text(t.email)}}),$("#table").on("click","td",function(e){var r=e.target.id;alert(r),createGame(r)})})}function createPlayBricks(e){for(var r=$("#chars"),a=0;a<e.length;a++){$("<div/>").addClass("square draggable").appendTo(r).text(e[a])}$(".draggable").draggable({snap:".squaredotted",snapMode:"inner"})}function createBricks(e,r){for(var e=$(e),a=($("#chars"),0);r>a;a++){$("<div/>").addClass("square droppable squaredotted").appendTo(e)}$(".squaredotted").droppable({drop:function(e,r){var a=$(this).index(),t=$(this).parent().attr("id"),o=$(r.draggable).html();word[a]=o;var n=switchResult(t,o,a);updateFirebaseAdd(n,t)},out:function(e,r){var a=$(this).index(),t=$(r.draggable).html(),o=$(this).parent().attr("id"),n=switchResult(o,t,a);n.word[a]=0,updateFirebaseAdd(n,o)}})}function updateFirebaseAdd(e,r){var a="",t=new Firebase("https://fron15game.firebaseio.com/playerword/"+r);switch(t.once("value",function(e){var r=e.val();a=r.correctWord}),r){case"first":t.update({first:e.word});break;case"second":t.update({second:e.word});break;case"third":t.update({third:e.word});break;default:console.log("none")}t.on("child_changed",function(e){var r=e.val();console.log(r),r.join("")===a&&alert("Ordet stämmer!")})}function switchResult(e,r,a){switch(e){case"first":firstWord[a]=r;var t={word:firstWord,correctWord:array.first};return t;case"second":secondWord[a]=r;var t={word:secondWord,correctWord:array.second};return t;case"third":thirdWord[a]=r;var t={word:thirdWord,correctWord:array.third};return t;default:console.log("none")}}function createWordPlan(e){$("#chars, #first, #second, #third").empty(),$("#chars, #message, .container-canvas").css("display","block");var r=dbRef.child("playerword");r.set({first:{word:[],correctWord:e.first},second:{word:[],correctWord:e.second},third:{word:[],correctWord:e.third}}),$.each(e,function(r,a){var t="#"+r,o=a.length;createPlayBricks(e[r]),createBricks(t,o)});var a=8,t=new Firebase(rootUrl).child("draw"),o=document.getElementById("drawing-canvas"),n=o.getContext?o.getContext("2d"):null;if(null==n)return void alert("You must use a browser that supports HTML5 Canvas to run this demo.");var s=function(e){var r=e.key().split(":");n.fillStyle="#"+e.val(),n.fillRect(parseInt(r[0])*a,parseInt(r[1])*a,a,a)},d=function(e){var r=e.key().split(":");n.clearRect(parseInt(r[0])*a,parseInt(r[1])*a,a,a)};t.on("child_added",s),t.on("child_changed",s),t.on("child_removed",d)}function shuffle(e){for(var r,a,t=e.length;0!==t;)a=Math.floor(Math.random()*t),t-=1,r=e[t],e[t]=e[a],e[a]=r;return e}function createPaintPlan(e){$("#intro").text("Måla en bild som föreställer:"),$("#mission").text(e),$("#chars").css("display","none"),$("#message").css("display","none"),$(".container-canvas").css("display","block");var r=8,a=null,t="000",o=0,n=new Firebase(rootUrl).child("draw"),s=document.getElementById("drawing-canvas"),d=s.getContext?s.getContext("2d"):null;if(null==d)return void alert("You must use a browser that supports HTML5 Canvas to run this demo.");var i=["fff","000","f00","0f0","00f","88f","f8d","f88","f05","f80","0f8","cf0","08f","408","ff8","8ff"];for(c in i){var l=$("<div/>").css("background-color","#"+i[c]).addClass("colorbox");l.click(function(){var e=i[c];return function(){t=e}}()),l.appendTo("#colorholder")}s.onmousedown=function(){o=1},s.onmouseout=s.onmouseup=function(){o=0,a=null};var u=function(e){if(o){e.preventDefault();for(var s=$("canvas").offset(),d=Math.floor((e.pageX-s.left)/r-1),i=Math.floor((e.pageY-s.top)/r-1),c=null==a?d:a[0],l=null==a?i:a[1],u=Math.abs(d-c),f=Math.abs(i-l),h=d>c?1:-1,v=i>l?1:-1,p=u-f;;){if(n.child(c+":"+l).set("fff"===t?null:t),c==d&&l==i)break;var g=2*p;g>-f&&(p-=f,c+=h),u>g&&(p+=u,l+=v)}a=[d,i]}};$(s).mousemove(u),$(s).mousedown(u);var f=function(e){var a=e.key().split(":");d.fillStyle="#"+e.val(),d.fillRect(parseInt(a[0])*r,parseInt(a[1])*r,r,r)},h=function(e){var a=e.key().split(":");d.clearRect(parseInt(a[0])*r,parseInt(a[1])*r,r,r)};n.on("child_added",f),n.on("child_changed",f),n.on("child_removed",h)}var data={sentences:[{first:"gubbe",second:"kör",third:"bil"},{first:"man",second:"äter",third:"mat"}]},rootUrl="https://fron15game.firebaseio.com/",dbRef=new Firebase("https://fron15game.firebaseio.com/"),allUserRef=new Firebase(rootUrl+"/users/"),me=dbRef.getAuth(),emailField=$("#email"),pwdField=$("#pwd"),firstWord=[],secondWord=[],thirdWord=[],word=[],array=[],choosenSentence;$("#regUser").on("click",function(){dbRef.createUser({email:$("#email").val(),password:$("#pwd").val()},function(e,r){if(e)$("#error").text(e),console.log("Error creating user:",e);else{console.log("Successfully created user account with uid:",r.uid);var a={email:$("#email").val(),uid:r.uid};this.saveUser(r.uid,a)}})});var saveUser=function(e,r){dbRef.child("users").child(e).set(r)};$("#loginUser").on("click",function(){return dbRef.authWithPassword({email:$("#email").val(),password:$("#pwd").val()},function(e,r){e?($("#error").text(e),console.log("Login Failed!",e)):(console.log("Login Success!:",r),window.location.href="./profile.html")}),!1});var createGame=function(e){var r=data.sentences[Math.floor(Math.random()*data.sentences.length)];allUserRef.child(e).child("gameinvite").set({from:dbRef.getAuth().uid,word:r});var a=r.first+" "+r.second+" "+r.third,t=new Firebase(rootUrl).child("draw");t.remove(),createPaintPlan(a)};$(document).ready(function(){$("#pl1").text(me.password.email),$("#intro").text("Utmana en inloggad användare genom att klicka i listan till vänster"),$(".container-canvas").css("display","none"),$("#chars, #message").css("display","none"),dbRef.child("users/"+dbRef.getAuth().uid+"/gameinvite").on("child_changed",function(e){var r=e.val();createWordPlan(r)})});