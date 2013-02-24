var TILE_SIZE = 32;
var FPS = 30;
var INPUT_KEY_LEFT = 37;
var INPUT_KEY_RIGHT = 39;
var _input_keys = {};
_input_keys[INPUT_KEY_LEFT] = false;
_input_keys[INPUT_KEY_RIGHT] = false;

var config = {};
config.max_row_num = 5;
config.max_col_num = 10;


function onPressed(key_code) { return _input_keys[key_code]; };

var Bar = function() {
  this.x = 200;
  this.y = 500;
  this.w = 60;
  this.h = 5;
  this.vx = 2;
  this.vy = 0;
  this.update = function() {
    if ( onPressed(INPUT_KEY_LEFT) ) {
      this.x = Math.max(this.x - this.vx, 0);
    }
    if ( onPressed(INPUT_KEY_RIGHT) ) {
      this.x = Math.min(this.x + this.vx, $(".field").height());
    }
  };
  this.render = function() {
    $(".bar").css({left: this.x, top: this.y});
  };
};

var Ball = function() {
  this.x =200;
  this.y = 400;
  this.vx = 3.5;
  this.vy = -4.0;
  $(".ball").css({left: this.x, top: this.y});
  this.update = function() {
    this.x += this.vx;
    this.y += this.vy;
    if ( this.x > $(".field").width() ) this.vx = -Math.abs(this.vx);
    if ( this.x < 0 ) this.vx = Math.abs(this.vx);
    if ( this.y > $(".field").height() ) this.vy = -Math.abs(this.vy);
    if ( this.y < 0 ) this.vy = Math.abs(this.vy);
  };
  this.render = function() {
    $(".ball").css({left: this.x, top: this.y});
  };
};


$(function() {
  var bar = new Bar();
  var ball = new Ball();
  var margin = 8;
  for ( var r = 0; r < config.max_row_num; ++r ) {
    for ( var c = 0; c < config.max_col_num; ++c ) {
      var id = "tile-blue-" + r + "-" + c;
      $(".field").append('<div id="'+id+'" class="tile-blue"></div>');
      $("#" + id).css({left: margin + c * TILE_SIZE, top: margin + r * TILE_SIZE});
    }
  }
  function main() {
    // update
    ball.update();
    bar.update();

    // collision check
    // ball x block
    for ( var r = 0; r < config.max_row_num; ++r ) {
      for ( var c = 0; c < config.max_col_num; ++c ) {
        var id = "tile-blue-" + r + "-" + c;
        if ( $("#" + id).is(":visible") ) {
          var tl = margin + c * TILE_SIZE;
          var tt = margin + r * TILE_SIZE;
          var tw = 24;
          var th = 24;
          if ( tl < ball.x && ball.x < tl + tw && tt < ball.y && ball.y < tt + th ) {
            $("#" + id).hide();
            var px = ball.x - ball.vx;
            var py = ball.y + ball.vy;
            if ( px < tl || px > tl + tw ) ball.vx *= -1;
            if ( py < tt || py > tt + th ) ball.vy *= -1;
          }
        }
      }
    }
    // ball x bar
    {
      var tl = bar.x - bar.w / 2;
      var tr = bar.y + bar.w / 2;
      var tt = bar.y - bar.h / 2;
      var tb = bar.y + bar.h / 2;
      if ( tl < ball.x && ball.x < tr && tt < ball.y && ball.y < tb ) {
        ball.vy *= -1;
      }
    }

    // render
    ball.render();
    bar.render();
  };
  setInterval(main, 1000 / FPS);

  window.document.onkeydown = function(event) { _input_keys[event.keyCode] = true; };
  window.document.onkeyup = function(event) { _input_keys[event.keyCode] = false; };

});
