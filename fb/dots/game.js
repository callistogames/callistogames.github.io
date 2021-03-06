/*
 * Eat Dots - game.js
 * Copyright (C) 2014 Callisto Game Studios. All rights reserved.
 */
 
 var game, gamec, menuc, hiscorec, howtoc;

function ViewController (id) {
	
	this.id = id;	
	this.activate = function () {
		$(this.id).fadeIn();
	}
	this.deactivate = function () {
		$(this.id).hide();
	}		
}

function Game () {
	this.difficulty = 1600;
	this.score = 0;
	this.startTime;
	this.timer = this.difficulty;
	this.green = {
		pos: {
			x: 0,
			y: 0
		},
		radius: 12,
		id: "#green"
	}
	this.red = {
		pos: {
			x: 0,
			y: 0
		},
		radius: 12,
		id: "#red"
	}
	this.square = {
		pos: {
			x: 0,
			y: 0
		},
		radius: 15,
		level: 0,
		id: "#square"
	}
	this.play = function () {
		this.square.pos = gamec.getSquarePos();
		gamec.frame();

		if (Math.abs(this.green.pos.x-this.square.pos.x) < this.square.radius &&
		Math.abs(this.green.pos.y-this.square.pos.y) < this.square.radius) {
			this.score += 1;
			this.startTime = (new Date()).getTime();
			this.square.radius += gamec.width*0.00426;
			if (this.square.radius > 0.225*gamec.width) {
				this.square.radius = 15;
				this.square.level += 1;
			}
			this.generate();
		}
		if (Math.abs(this.red.pos.x-this.square.pos.x) < this.square.radius &&
		Math.abs(this.red.pos.y-this.square.pos.y) < this.square.radius) {
			document.dispatchEvent(new CustomEvent("gameover"));
		}
		this.timer = this.difficulty-((new Date()).getTime()-this.startTime);
		if (this.timer < 0) {
			document.dispatchEvent(new CustomEvent("gameover"));
		}
		setTimeout(function () {
			game.play();
		}, 0);
	}
	this.generate = function () {
		this.red.pos.x = Math.random()*0.9*gamec.width+0.05*gamec.width;
		this.red.pos.y = Math.random()*0.9*gamec.height+0.05*gamec.height;
		this.green.pos.x = Math.random()*0.9*gamec.width+0.05*gamec.width;
		this.green.pos.y = Math.random()*0.9*gamec.height+0.05*gamec.height;
		
		if (Math.abs(this.red.pos.x-this.square.pos.x) < this.square.radius+20 &&
		Math.abs(this.red.pos.y-this.square.pos.y) < this.square.radius) {
			game.generate();
		}
		if (Math.abs(this.green.pos.x-this.square.pos.x) < this.square.radius+20 &&
		Math.abs(this.green.pos.y-this.square.pos.y) < this.square.radius) {
			game.generate();
		}
	}
} // END Game{}

function gameInit () {
	gamec = new ViewController();
	gamec.id = "#game";
	
	gamec.redImg = new Image();
	gamec.redImg.src = "images/enemy-blob.png";
	gamec.greenImg = new Image();
	gamec.greenImg.src = "images/green-dot.png";
	gamec.sqImg = new Image();
	gamec.sqImg.src = "images/wamba.png";
	
	gamec.canvas = document.getElementById("game-canvas");
	gamec.ctx = gamec.canvas.getContext("2d");
	$("#game").mousemove(function (e) {
		gamec.mouseX = e.clientX;
		gamec.mouseY = e.clientY;
	});
	gamec.height = gamec.canvas.height;
	gamec.width = gamec.canvas.width;
	rect = $("#game-container").offset();
	gamec.getSquarePos = function () {
		return {
			x: this.mouseX - rect.left,
			y: this.mouseY - rect.top
		};
	}
	
	gamec.frame = function () {
		gamec.ctx.clearRect(0, 0, gamec.width, gamec.height);
		gamec.ctx.drawImage(gamec.redImg, game.red.pos.x-game.red.radius, game.red.pos.y-game.red.radius, 2*game.red.radius, 2*game.red.radius);
		gamec.ctx.drawImage(gamec.greenImg, game.green.pos.x-game.green.radius, game.green.pos.y-game.green.radius, 2*game.green.radius, 2*game.green.radius);
		gamec.ctx.drawImage(gamec.sqImg, game.square.pos.x-game.square.radius, game.square.pos.y-game.square.radius, 2*game.square.radius, 2*game.square.radius);
		$("#score").text(game.score);
		$("#timer").text(game.timer);
	}
	
	menuc = new ViewController();
	menuc.id = "#menu";
	
	menuc.load = function () {
		clearInterval(this.interval);
		$("#menu-square").css("left", "0px");
		this.interval = setInterval(function () {
			$("#menu-green").css({
				"top": Math.random()*480+"px",
				"left": Math.random()*720+"px"
			});
			$("#menu-red").css({
				"top": Math.random()*480+"px",
				"left": Math.random()*720+"px"
			});
			$("#menu-square").css("top", Math.random()*480+"px");
		}, 5000);
	}
	
	hiscorec = new ViewController();
	hiscorec.id = "#high-score";
	hiscorec.hiscore = 0;
	hiscorec.load = function (score) {
		if (score > this.hiscore) {
			this.hiscore = score;
		}
		$("#final").text(score);
		$("#high").text(this.hiscore);
	}
	
	document.addEventListener("gameover", function (e) {
		gamec.deactivate();
		hiscorec.activate();
		hiscorec.load(game.score);
		game = null;
	});
	
	howtoc = new ViewController();
	howtoc.id = "#howto";
	
	//hiscorec.activate();
	menuc.activate();
	menuc.load();
}

function startGame () {
	game = new Game();
	gamec.activate();
	game.startTime = (new Date()).getTime();
	game.generate();
	game.play();
}

function returnToMenu () {
	menuc.activate();
	menuc.load();
}