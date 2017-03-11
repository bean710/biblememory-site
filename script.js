/*global $, jQuery*/

var memory_verse = "1 Corinthians 13:1-7";

var num = 0,
i = 0;


$(document).ready(function () {
  "use strict";
  $("#loading").css('visibility', 'hidden');

  $("#text").val(memory_verse);

  getBibleText(memory_verse, "nasb");


});

function myGenerate() {
  "use strict";

  $("#loading").css('visibility', 'visible');

  if($("input[name=top]:checked").val() == "auto") {

    var input = $('#text').val(),
    version = $('#sel').val();

    //lookUp(input, version);
    getBibleText(input, version);
  } else {
    myGenFromText();
  }

  if ($("input[name=projmode]:checked").val()) {
    $("#scripture").css("font-size", "36px");
  } else {
    $("#scripture").css("font-size", "24px");
  }

}

function getBibleText(ref, ver) {

  var verse_split;

  jQuery.ajax({
    url:'https://getbible.net/json',
    dataType: 'jsonp',
    data: 'p='+ref+'&v='+ver,
    jsonp: 'getbible',
    success:function(json){
      i = 0;
      // set text direction
      if (json.direction == 'RTL'){
        var direction = 'rtl';
        $("#scripture").css("text-align", "right");
      } else {
        var direction = 'ltr';
        $("#scripture").css("text-align", "left");
      }
      // check response type
      if (json.type == 'verse'){
        var output = '';
        jQuery.each(json.book, function(index, value) {
          output += '<center><b>'+value.book_name+' '+value.chapter_nr+'</b></center><br/><p class="'+direction+'">';
          jQuery.each(value.chapter, function(index, value) {
            output += '  <small class="ltr">' +value.verse_nr+ '</small>  ';

            var newVerse = value.verse.split(" ");

            for (j = 0; j < newVerse.length; j += 1) {
              i += 1;
              newVerse[j] = "<span id='w" + i + "'>" + newVerse[j] + "</span> ";
              output += newVerse[j];
            }

            output += '<br/>';
          });
          output += '</p>';
        });
        jQuery('#scripture').html(output);  // <---- this is the div id we update
      } else if (json.type == 'chapter'){
        var output = '<center><b>'+json.book_name+' '+json.chapter_nr+'</b></center><br/><p class="'+direction+'">';
        jQuery.each(json.chapter, function(index, value) {
          output += '  <small class="ltr">' +value.verse_nr+ '</small>  ';

          var newVerse = value.verse.split(" ");

          for (j = 0; j < newVerse.length; j += 1) {
            i += 1;
            newVerse[j] = "<span id='w" + i + "'>" + newVerse[j] + "</span> ";
            output += newVerse[j];
          }

          output += '<br/>';
        });
        output += '</p>';
        jQuery('#scripture').html(output);  // <---- this is the div id we update
      } else if (json.type == 'book'){
        var output = '';
        jQuery.each(json.book, function(index, value) {
          output += '<center><b>'+json.book_name+' '+value.chapter_nr+'</b></center><br/><p class="'+direction+'">';
          jQuery.each(value.chapter, function(index, value) {
            output += '  <small class="ltr">' +value.verse_nr+ '</small>  ';
            //output += value.verse;

            var newVerse = value.verse.split(" ");

            for (j = 0; j < newVerse.length; j += 1) {
              i += 1;
              newVerse[j] = "<span id='w" + i + "'>" + newVerse[j] + "</span> ";
              output += newVerse[j];
            }

            output += '<br/>';
          });
          output += '</p>';
        });
      }
      $("#scripture").html(output);
      num = i;
      $("#loading").css('visibility', 'hidden');
    },
    error:function(){
      jQuery('#scripture').html('<h2>No scripture was returned, please try again!</h2>'); // <---- this is the div id we update
    },
  });
}

function myGenFromText() {
  var text, final = "";

  text = $("#textarea").val();

  var text_split = text.split(" ");
  console.log(text_split)
  var j;

  for (j = 0; j < text_split.length; j++) {
    text_split[j] = "<span id='w" + j + "'>" + text_split[j] + "</span> ";

    final += text_split[j];
  }

  num = j;

  console.log(final)
  $("#scripture").html(final);
}

var doThatThing = function (event) {
  "use strict";
  $("#button").click();
};

function blankWords() {
  "use strict";

  var rand,
  l,
  used,
  foo = 0;

  console.log(i, num);

  for (l = 0; l < $("#num").val(); l += 1) {
    foo = 0;
    rand = Math.floor((Math.random() * num-1) + 1);
    while ($("#w" + rand).css("backgroundColor") === "rgb(0, 0, 0)" ||
    $("#w" + rand).css("backgroundColor") === "rgb(0, 0, 0, 0)" ||
    $("#w" + rand).css("backgroundColor") === "black") {
      foo++;
      rand = Math.floor((Math.random() * num) + 1);
      if (foo > num + 1) {
        console.log("Blanked all words.");
        break;
      }
    }
    console.log($("#w" + rand).css("backgroundColor") + "      " + rand);
    $("#w" + rand).css("background-color", "black");
  }

}
