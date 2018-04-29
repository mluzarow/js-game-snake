/**
 * Game controller for the snake game.
 */
class Snake {
	/**
	 * Constructor for class Snake.
	 * 
	 * @param {Int} width  tile width of the snake board
	 * @param {Int} height tile height of the snake board
	 */
	constructor (width, height) {
		/**
		 * @var {Int} TILE_EMPTY empty tile marker
		 * @var {Int} TILE_APPLE consumable tile marker
		 * @var {Int} TILE_FULL  full (with player snake) tile marker
		 */
		this.TILE_EMPTY = 0;
		this.TILE_APPLE = 1;
		this.TILE_FULL = 2;
		
		/**
		 * @var {Int} width  width of game board in tiles
		 * @var {Int} height height of game board in tiles
		 */
		this.boardWidth = width;
		this.boardHeight = height;
		
		/**
		 * @var {Element} $gameWrap   game board display wrapper
		 * @var {Element} $bannerWin  "You win!" display wrapper
		 * @var {Element} $bannerLose "You lose!" display wrapper
		 */
		this.$gameWrap = document.getElementById ("board-wrap");
		this.$bannerWin = document.getElementById ("banner-win");
		this.$bannerLose = document.getElementById ("banner-lose");
		
		/**
		 * @var {Element} $gameBoard HTML game board
		 * @var {Array}   gameBoard  game state data
		 */
		this.$gameBoard = document.getElementById ("board");
		this.gameBoard = [];
		
		/**
		 * @var {Object} input game input state dictionary
		 * @var {Array}  snake list of snake tile coordinates
		 */
		this.input = {'x' : 0, 'y' : 0};
		this.snake = [];
		
		// Draw the HTML for the game board & set up state array
		this.drawBoard ();
		
		// Bind controls
		this.bindEvents ();
		
		// Show the game board
		this.$gameWrap.classList.add ("active");
		
		// Center the camera, add an apple, move player
		this.initGameState();
		
		setInterval (this.gameLoop.bind (this), 500);
	}
	
	/**
	 * Main game loop.
	 */
	gameLoop () {
		var removeLastPlayerTile = true;
		var lastPos = {
			"x" : this.snake[this.snake.length - 1].x,
			"y" : this.snake[this.snake.length - 1].y
		};
		var nextPos = {
			"x" : this.snake[0].x + this.input.x,
			"y" : this.snake[0].y + this.input.y
		}
		
		if (
			(nextPos.y >= this.boardHeight || nextPos.y < 0) ||
			(nextPos.x >= this.boardWidth || nextPos.x < 0)
		) {
			// Don't do anything if move escapes bounds
			return;
		}
		
		if (this.gameBoard[nextPos.y][nextPos.x] !== this.TILE_EMPTY) {
			if (this.gameBoard[nextPos.y][nextPos.x] === this.TILE_APPLE) {
				this.$gameBoard.children[nextPos.y].children[nextPos.x].classList.remove ("apple");
				removeLastPlayerTile = false;
			}
		}
		
		var newX = nextPos.x;
		var newY = nextPos.y;
		var oldX = this.snake[this.snake.length - 1].x;
		var oldY = this.snake[this.snake.length - 1].y;
		
		for (var i = 0; i < this.snake.length; i++) {
			let curX = this.snake[i].x;
			let curY = this.snake[i].y;
			
			this.snake[i].x = newX;
			this.snake[i].y = newY;
			
			this.gameBoard[newY][newX] = this.TILE_FULL;
			
			newX = curX;
			newY = curY;
		}
		
		this.$gameBoard.children[this.snake[0].y].children[this.snake[0].x].classList.add ("player");
		
		if (removeLastPlayerTile === true) {
			this.$gameBoard.children[oldY].children[oldX].classList.remove ("player");
			this.gameBoard[oldY][oldX] = this.TILE_EMPTY;
		} else {
			this.snake.push (lastPos);
			this.placeApple ();
		}
	}
	
	initGameState () {
		// Place player @ center(ish)
		let vOrigin = Math.floor (this.boardHeight / 2);
		let hOrigin = Math.floor (this.boardWidth / 2);
		
		// Center camera on player
		let vPlayer = this.$gameBoard.children[vOrigin].children[hOrigin].offsetTop;
		let hPlayer = this.$gameBoard.children[vOrigin].children[hOrigin].offsetLeft;
		
		this.gameBoard[vOrigin][hOrigin] = this.TILE_FULL;
		this.$gameBoard.children[vOrigin].children[hOrigin].classList.add ("player");
		this.snake.push ({
			"x" : hOrigin,
			"y" : vOrigin
		});
		
		this.$gameBoard.style.top = (-1 * vPlayer) + parseInt (window.innerHeight / 2);
		this.$gameBoard.style.left = (-1 * hPlayer) + parseInt (window.innerWidth / 2);
		
		this.placeApple();
		
		this.input.x = 0;
		this.input.y = -1;
	}
	
	placeApple () {
		var localData = this.gameBoard;
		var rowPos = 0;
		var colPos = 0;
		
		do {
			rowPos = Math.floor (Math.random () * localData.length);
			
			var localRow = [];
			for (var i = 0; i < localData[rowPos].length; i++) {
				if (localData[rowPos][i] !== this.TILE_FULL) {
					localRow.push (i);
				}
			}
			
			if (localRow.length === 0) {
				localData.splice (rowPos, 1);
			} else {
				colPos = localRow[Math.floor (Math.random () * localRow.length)];
			}
		} while (localRow.length === 0);
		
		this.$gameBoard.children[rowPos].children[colPos].classList.add ("apple");
		this.gameBoard[rowPos][colPos] = this.TILE_APPLE;
	}
	
	/**
	 * Bind user controls.
	 */
	bindEvents () {
		window.addEventListener ("keydown", function (e) {
			if (e.keyCode === 87) {
				// w
				this.input.x = 0;
				this.input.y = -1;
			} else if (e.keyCode === 83) {
				// s
				this.input.x = 0;
				this.input.y = 1;
			} else if (e.keyCode === 68) {
				// d
				this.input.x = 1;
				this.input.y = 0;
			} else if (e.keyCode === 65) {
				// a
				this.input.x = -1;
				this.input.y = 0;
			}
		}.bind (this));
	}
	
	/**
	 * Draw game board HTML & init state data.
	 */
	drawBoard () {
		for (var i = 0; i < this.boardHeight; i++) {
			this.gameBoard[i] = [];
			
			let gameRow = document.createElement ("div");
			gameRow.classList.value = "game-row row-" + i;
			
			for (var k = 0; k < this.boardWidth; k++) {
				this.gameBoard[i][k] = this.TILE_EMPTY;
				
				let gameTile = document.createElement ("div");
				gameTile.classList.value = "tile tile-" + k;
				
				gameRow.appendChild (gameTile);
			}
			
			this.$gameBoard.appendChild (gameRow);
		}
	}
}
