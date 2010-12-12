/**
 * Sprite Gameplay Behaviour
 */
function hybridSpriteGameplay(spr) {
	var sprite = spr;
	
	var created0 = function(){
	};
	var created1 = function(){
		sprite.getAnimation().start(1, 1, 'forward', -1, null);
	};
	// play dead animation on destruction and remove afterwards
	var destroyed0 = function(){
		if( sprite.getAnimation() ){
			resourceManager.setDebug(true);
			sprite.setInactive();
			if( sprite.getAnimation().getRows() >= 2 ){
				sprite.getAnimation().start(1, 2,'forward', 1, sprite.setInactive);
			}
		}
		else{
			sprite.setInactive();
		}
		
		if( sprite.getType() === 'alien'){
			score += 60;
		}
		else if ( sprite.getType() === 'drop'){
			score += 5;
		}
	};
	// invader 'typewriter' move, horizontally with a typewriter move at end of the line
	var movement0 = function(){
		sprite.setPosition(sprite.getPosition()[0]+sprite.getVelocity()[0], sprite.getPosition()[1]);
		if( sprite.getPosition()[0] % 150 === 0 ){
			sprite.setPosition(sprite.getPosition()[0], sprite.getPosition()[1]+10);
			sprite.setVelocity(sprite.getVelocity()[0] * -1, sprite.getVelocity()[1]);
		}
		// randomly shoot every now and then
		if(Math.floor(Math.random()*5001) % 5000 === 0){
			var userTrigger = resourceManager.getTriggerByType("user");
			if( userTrigger.length > 0 ) {
				$.each(userTrigger, function(index, trigger){
					var event = trigger.getEventByName("drop");
					if( event !== 0 ){
						event.setPosition(sprite.getPosition()[0]+36, sprite.getPosition()[1]+46);
						var prototype = resourceManager.getPrototypeById(event.getPrototype());
						prototype.activate(event);
					}
				});
			}
		}
	};
	// standard move according to velocity settings
	var movement1 = function(){
		sprite.setPosition(sprite.getPosition()[0]+sprite.getVelocity()[0], sprite.getPosition()[1]+sprite.getVelocity()[1]);
	};
	// standard impact reaction, undo last sprite move to avoid getting stuck
	var impact0 = function(force){
		sprite.setPosition(sprite.getPosition()[0]-sprite.getVelocity()[0], sprite.getPosition()[1]-sprite.getVelocity()[1]);
	};
	// 'rubber' impact with short acceleration backwards
	var impact1 = function(force){
		sprite.setPosition(sprite.getPosition()[0]-(sprite.getVelocity()[0]*2), sprite.getPosition()[1]-(sprite.getVelocity()[1]*2));
	};
	// invader, bomb and missile damage reaction
	var damage0 = function(force){
		sprite.setVitality(sprite.getVitality()[0]-force, sprite.getVitality()[1]);
		if( sprite.getVitality()[0] <= 0 ) {
			sprite.destroyed();
		}
	};
	// player damage reaction
	var damage1 = function(force){
		// on hit reduce lifes by 1
		var lifes = sprite.getVitality()[1]-1;
		
		$("#hud").empty();
		if( lifes > 0 ){
			sprite.setVitality(1, lifes);
			shotLock = false;
			for(var i=1; i<=lifes; i++){
				$("#hud").append("<img src='data/life.png'/>");
			}
			// set animation for hit
			sprite.getAnimation().start(1,2,'forward',1, null);
		}
		else {
			$("#score").text("GAME OVER");
			game.stop();
		}
	};
	/** @scope hybridSpriteGameplay */
	return{
		/**
		 * Function called when sprite is created for the first time
		 */
		getCreated: function(val){
			switch(val){
				case 0: return created0; break;
				case 1: return created1; break;
				default: return created0;
			}
		},
		/**
		 * Function called when a sprite is destroyed, i.e removed from game
		 */
		getDestroyed: function(val){
			switch(val){
				case 0: return destroyed0; break;
				default: return destroyed0;
			}
		},
		/**
		 * Function called when a sprite is moved by the move step within the gameloop
		 */
		getMovement: function(val){
			switch(val){
				case 0: return movement0; break;
				case 1: return movement1; break;
				default: return movement0;
			}
		},
		/**
		 * Function called when a sprite hits another sprite
		 */
		getImpact: function(val){
			switch(val){
				case 0: return impact0; break;
				case 1: return impact1; break;
				default: return impact0;
			}
		},
		/**
		 * Function called when a sprite receives damage
		 */
		getDamage: function(val){
			switch(val){
				case 0: return damage0; break;
				case 1: return damage1; break;
				default: return damage0;
			}
		}
	};
};
