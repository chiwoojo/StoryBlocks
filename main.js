/**
 *    
 *    Main JS file
 *    
 */

var socket = io();

var data = {
  username : '',
  message : '',
  color : ''
};

//to see if voice synthesis is playing
var playing = false;

//to accout for async nature of grabbing available voices from the Google Server to Google Chrome
var grabbedVoices = false;

//below code from socket.io example
var COLORS = [
  'red lighten-3', 'pink lighten-3', 'purple lighten-3', 'deep-purple lighten-3',
  'indigo lighten-3', 'blue lighten-3', 'light-blue lighten-3', 'cyan lighten-3',
  'teal lighten-3', 'green lighten-3', 'light-green lighten-3', 'lime lighten-3'
];

function  getUsernameColor (username) {
  var hash = 7;
  for (var i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + (hash << 5) - hash;
  }
  var index = Math.abs(hash% COLORS.length);
  return COLORS[index];
}

//send message
$('#message-form').submit(function(e) {
  e.preventDefault();
  var message = $('#m').val();
  var username = data.username === '' ? 'Anon' : data.username;
  var color = data.color === '' ? "red lighten-3" : data.color;
  socket.emit('chat message', {message: message, username: username, color: color});
  $('#m').val('');
  return false; 
});

//change user name
$('#username-form').on('click', function(e) {
  console.log("inside of username-form jQuery click");
  e.preventDefault();
  var username = $('#u').val();
  data.color = getUsernameColor(username);
  data.username = username;
  $('#u').val('');
  return false;
});

//read story when button is clicked
$('#play-sound').on('click', function(e) {
  
  //to check if onvoiceschanged, if it has been played. Solves multiple calls problem.
  var playedOnce = false;
  
  e.preventDefault();
  if (!playing) {
    playing = true;
    var msg = new SpeechSynthesisUtterance(getStory());
    
    if (!grabbedVoices) {
      window.speechSynthesis.onvoiceschanged = function() {
        if (!playedOnce) {
          grabbedVoices = true;
          playedOnce = true;
          var voices = window.speechSynthesis.getVoices();
          msg.voice = voices[3];
          msg.onend = function(event) {
            playing = false;
          };
          window.speechSynthesis.speak(msg);
        } 
      };
    } else {
      var voices = window.speechSynthesis.getVoices();
      msg.voice = voices[3];
      msg.onend = function(event) {
        playing = false;
      };
      window.speechSynthesis.speak(msg);
    }
  } else {
    playing = false;
    //turn off speech reading
    speechSynthesis.cancel();
  }
});

//when emit 'chat message' fires from server
socket.on('chat message', function(data) {
  console.log('Data is ', data);
  var messageDiv = $('<div>')
                     .attr('id', data.uniqueId)
                     .attr('class', 'btn tooltipped ' + data.color)
                     .attr('data-position', "bottom")
                     .attr('data-tooltip', data.username)
                     .attr('data-delay', '50')
                     .text(data.message);
  $('#messages').append(messageDiv);
  $('.tooltipped').tooltip();
});      

//initiate modal functionality
$('.modal-trigger').leanModal();

//intiatie NAV collapse function
$(".button-collapse").sideNav();

/**
 *    This function grabs all the text from the DIVs
 */
function getStory() {
  var story = [];
  $('.tooltipped').each(function() {
    console.log("$(this) is ", $(this));
    var oneBlock = $(this).html();
    console.log("oneBlock is ", oneBlock);
    story.push(oneBlock);
  });
  return story.join(' ');
}

//get available voices
function getVoiceOpt() {
  var voices = window.speechSynthesis.getVoices();
  voices.forEach(function(voices, i) {
    console.log(voices.name);
  });
}


