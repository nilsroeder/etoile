/**
 * Global Variables
 */
// score counter
var score = 0;
// fps counter
var fps = 0;
// player lock
var shotLock = false;
// global game object
var game = 0;

/**
 * Player shot action
 * @return void
 */
function playerShot() {
	var player  = resourceManager.getSpritesByName("player")[0];
	var userTrigger = resourceManager.getTriggerByType("user");
	if( userTrigger.length > 0 ) {
		$.each(userTrigger, function(index, trigger){
			var event = trigger.getEventByName("shot");
			if( event !== 0 ){
				event.setPosition(player.getPosition()[0]+53, player.getPosition()[1]-11);
				var prototype = resourceManager.getPrototypeById(event.getPrototype());
				prototype.activate(event);
				shotLock = false;
			}
		});
	}
};
/** 
 * Touch controls.
 * @return void
 */
function touchControls(){
	$("<div id='stick' style='z-index:35; position:absolute; left:80px; top:680px;'> <img src='data/stick.png'/></div>").appendTo("body");
	$("<div id='button' style='z-index:35; position:absolute; left:850px; top:640px;'> <img src='data/button.png'/></div>").appendTo("body");
	
	document.addEventListener('touchstart', function(event) {
		event.preventDefault();
	}, false);
	
	document.addEventListener('touchend', function(event) {
		event.preventDefault();
	}, false);
	
	$('#stick').bind('touchstart',
			function() {
			event.preventDefault();
			if( event.touches[0].clientX > 140 ){
				resourceManager.getSpritesByName("player")[0].setVelocity(6 , 0);
			}
			else if( event.touches[0].clientX < 120 ){
				resourceManager.getSpritesByName("player")[0].setVelocity(-6, 0);
			}
		}
	);
	$('#stick').bind('touchend',
			function() {
			event.preventDefault();
			resourceManager.getSpritesByName("player")[0].setVelocity(0, 0);
		}
	);
	
	$('#button').bind('touchstart',
			function() {
			event.preventDefault();
			if( shotLock === false){
				shotLock = true;
				resourceManager.getSpritesByName("player")[0].getAnimation().start(0,1,'forward',1, playerShot);
			}
		}
	);
};
/**
 * Keyboard Controls
 * @return void
 */
function pcControls(){
	$(document).keydown(
		function(event) {
			var player = resourceManager.getSpritesByName("player")[0];
			switch (event.keyCode) {
				// space bar
				case 32:
					if( shotLock === false){
						shotLock = true;
						player.getAnimation().start(1,1,'forward',1, playerShot);
					}
				break;
				// left arrow key
				case 37:
					player.setVelocity(-3, 0);
				break;
				// right arrow key
				case 39:
					player.setVelocity(3, 0);
				break;
				// 'p' for Pause / Continue
				case 80:
					if( game.isRunning() ) {
						game.stop();
					}
					else{
						game.run();
					}
				break;
				// 'q' for Quit
				case 81:
					game.quit();
				break;
			}
		});

	$(document).keyup(function(event) {
		var player = resourceManager.getSpritesByName("player")[0];
		switch (event.keyCode) {
			// left arrow key
			case 37:
				player.setVelocity(0, 0);
			break;
				// right arrow key
			case 39:
				player.setVelocity(0, 0);
			break;
		}
	});
};
/**
 * Frames per second counter
 * @return void
 */
function fpsCounter(){
	fps++;
};
/**
 * FPS Display
 * @return void
 */
function fpsDisplay(){
	runId = setInterval(function(){
		$('#itext').text("Sprites["+resourceManager.getSpriteList().length+"] FPS["+fps+"]");
		fps = 0;
	},1000);
};
/**
 * Win/Loose gameplay conditions
 * @return void
 */
function levelConditions() {
	if( resourceManager.getSpritesByType("alien").length <= 0 ){
		$("#score").text("WIN");
		game.stop();
	}
	else{
		$("#score").text(score);
	}
};
/**
 * Choose controls and start game
 * @return void
 */
function start() {
	if( (navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i)) ) {
		touchControls();
	}
	else {
		pcControls();
	}
	
	$("<div id='score' style='z-index:35; width:80px; color:#fff; font:Trebuchet MS, Verdana, Helvetica, Arial,sans-serif; font-weight:bold; font-size:24px; text-align:right; position:absolute; left:0px; top:30px;' />").appendTo("body");
	$("<div id='hud' style='z-index:35; width:120px; height:60px; position: absolute; margin-left: 685px; margin-top: -670px;' />").appendTo("body");
	$('<div id="itext" style="color: #eee; overflow: hidden; z-index: 1; width: 200px; height: 40px; position: absolute; margin-left: 600px; margin-top: -700px;">').appendTo("body");
	$("#hud").append("<img src='data/life.png' />");
	$("#hud").append("<img src='data/life.png' />");
	$("#hud").append("<img src='data/life.png' />");
	game.start(fpsDisplay);
};
/**
 * display loading screen
 */
function load() {
	$("#startbutton").remove();
	game = hybridGame();
	game.setDisplayHook( fpsCounter );
	game.setGameplayHook( levelConditions );
	game.init(0, 0, null);
	game.load("data/etoile.xml", start);
};
/**
 * press button to start loading and play
 */
function startScreen(){
	$('<div id="hybridRoot">').appendTo("body");
	$('<a id="startbutton" style="cursor: pointer; position: absolute; margin-left: 400px; margin-top: 320px;">').appendTo("#hybridRoot");
	$('<img src="data/button.png"/>').appendTo("#startbutton");
	
	$("#startbutton").click(function() {
		load();
	});
};

$(function() {
	startScreen();
});
