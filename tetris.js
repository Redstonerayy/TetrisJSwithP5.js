/*
Tetris

What to do:
-on hold
-group of tiles, which are picked randomly
-collision detection
-scale system to make a grid
-make the bottom line disappear

Blocks: 7; L&J, Z&S, O, T, I

-positions relative to the middle(turningpoint) in fields
-normal koordinate system
-to convert into p5.js koordinates, multiply y with -1
 rotation
-use a maxtrix to rotate the other tiles
 multiply a vector to it and then it`s turned
*/

/*
const tiles = [[[[-1, 1], [-1, 0], [0, 1]],'#f0f000'], // O
			[[[0, -1], [0, 1], [0, 2]], '#00d8d8'], // I
			[[[1, 0], [-1, 0], [0, 1]], '#a000f0'], // T
			[[[0, 1], [-1, 0], [-1, -1]], '#f00000'],  // Z
			[[[0, 1], [1, 0], [1, -1]], '#00f000'], // S
			[[[0, -1], [0, 1], [-1, 1]], '#0000f0'], // J
			[[[0, -1], [0, 1], [1, -1]], '#f0a000']]; // L

//var start = createVector(300, 90);
const xwidth = 20;
const yheight = 25;
const rotate_left_matrix = [[0, -1], [1, 0]];
const rotate_right_matrix = [[0, 1], [-1, 0]];
//var cordsnext = createVector((xwidth - 2)*30, 30);
//var cordsonHold = createVector(30, 30);
//shuffle(tiles, true); // shuffle array
*/

//program functionality functions

function gameconstants(){
	//define game constants
	//tiles, 0,0 excluded because every tile has it excepted I,
	//where it is needed because every turn +1 on x or y must be calculated
	//[x,y]
	this.tiles = [[[[-1, 1], [-1, 0], [0, 1]],'#f0f000', "O"], // O
							 [[[0, -1], [0, 0], [0, 1], [0, 2]], '#00d8d8', "I"], // I
							 [[[1, 0], [-1, 0], [0, 1]], '#a000f0', "T"], // T
							 [[[0, 1], [-1, 0], [-1, -1]], '#f00000', "Z"],  // Z
							 [[[0, 1], [1, 0], [1, -1]], '#00f000', "S"], // S
							 [[[0, -1], [0, 1], [-1, 1]], '#0000f0', "J"], // J
							 [[[0, -1], [0, 1], [1, -1]], '#f0a000', "L"]]; // L
	this.xwidth = 40;
	this.yheight = 25;
	this.rotate_left_matrix = [[0, -1], [1, 0]];
	this.rotate_right_matrix = [[0, 1], [-1, 0]];
	this.blocksize = 30;
}


//multiply a 2D vector with a 2x2 matrix
//using a turning matrix the cordinates of each rectangle of the tile will be
//turned by 90 in relation to the origin of the cordinate system
function multiplyvector2matrix2x2(matrix, vector){
	return [vector[0]*matrix[0][0] + vector[1]*matrix[0][1], vector[0]*matrix[1][0] + vector[1]*matrix[1][1]];
}


//make tile class
function tile(xpos, ypos, tileshape, tilecolor, tilename){
	//init
	this.x = xpos;
	this.y = ypos;
	this.tileshape = tileshape;
	this.tilecolor = tilecolor;
	this.tilename = tilename;
	//methods
	this.show = function(){
		fill(this.tilecolor);
		if(this.tilename != "I"){
			rect(this.x, this.y, gconsts.blocksize, gconsts.blocksize);// 0, 0 position
		}
		for(let i = 0; i < this.tileshape.length; i++){
			let rectx = this.x + this.tileshape[i][0]*gconsts.blocksize;
			let recty = this.y + this.tileshape[i][1]*gconsts.blocksize*-1; //-1 because y-axis is reversed in js
			rect(rectx,recty, gconsts.blocksize, gconsts.blocksize);
		}
	}

	this.isvalidmove = function(cordinatearray){
		let valid = true;
		let gridpos = this.getgridpos();
		//check left and right border
		//tileshape
		for (var i = 0; i < cordinatearray.length; i++) {
			if((gconsts.xwidth - 6) < (gridpos[0] + cordinatearray[i][0]) || (gridpos[0] + cordinatearray[i][0] < 5)){
				valid = false;
			}
		}
		//check 0, 0 point
		if((gconsts.xwidth - 6) < gridpos[0] || gridpos[0] < 5){
			valid = false;
		}
		//check if tiles block
		// y cordinate can be out of array range if it`s at the bottom
		try {
			//tileshape
			for (var i = 0; i < cordinatearray.length; i++) {
				console.log(gridpos[1] + cordinatearray[i][1]);
				console.log(gridpos[0] + cordinatearray[i][0]);
				if(grid.grid[gridpos[1] + cordinatearray[i][1]][gridpos[0] + cordinatearray[i][0]] != 0){
					valid = false;
				}
			}
			//check 0, 0 point
			if(grid.grid[gridpos[1]][gridpos[0]] != 0){
				valid = false;
			}
		} catch (e) {
			valid = false;
		}
		return valid;
	}

	this.rotateleft = function(){
		if(this.tilename === "O"){//pointless to turn and a problem because its only 2x2
			return;
		}
		new_tileshape = [];
		for(let i = 0; i < this.tileshape.length; i++){//change cordinates for each rectangle position
			new_tileshape.push(multiplyvector2matrix2x2(gconsts.rotate_left_matrix, this.tileshape[i]));
		}
		if(this.tilename === "I"){
			for(let i = 0; i < this.tileshape.length; i++){
				new_tileshape[i][0] += 1;
			}
		}
		if(this.isvalidmove(new_tileshape)){
			this.tileshape = new_tileshape;
		}
	}

	this.rotateright = function(){
		if(this.tilename === "O"){//pointless to turn and a problem because its only 2x2
			return;
		}
		new_tileshape = [];
		for(let i = 0; i < this.tileshape.length; i++){//change cordinates for each rectangle position
			new_tileshape.push(multiplyvector2matrix2x2(gconsts.rotate_right_matrix, this.tileshape[i]));
		}
		if(this.tilename === "I"){
			for(let i = 0; i < this.tileshape.length; i++){
				new_tileshape[i][1] += 1;
			}
		}
		if(this.isvalidmove(new_tileshape)){
			this.tileshape = new_tileshape;
		}
	}

	this.down = function(){
		this.y += gconsts.blocksize;
	}

	this.moveleft = function(){//use the tileshape and subtract 1
		if(this.isvalidmove(this.tileshape.map((value) => {
			return [value[0] - 1, value[1]];
		}))){
		this.x -= gconsts.blocksize;
		}
	}

	this.moveright = function(){//use the tileshape and add 1
		if(this.isvalidmove(this.tileshape.map((value) => {
			return [value[0] + 1, value[1]];
		}))){
			this.x += gconsts.blocksize;
		}
	}

	this.harddrop = function(){

	}

	this.getgridpos = function(){
		return [this.x/gconsts.blocksize, this.y/gconsts.blocksize];
	}
}


//grid class
function Grid(xwidth, yheight){
	this.xwidth = xwidth;
	this.yheight = yheight;
	this.tiles = [];
	//methods
	this.emptygrid = function(xwidth, yheight){
		grid = [];
		for(let i = 0; i < yheight; i++){
			grid.push([]);
			for(let j = 0; j < xwidth; j++){
				grid[i].push(0);
			}
		}
		return grid;
	}
	this.grid = this.emptygrid(xwidth, yheight);

	this.showgridlines = function(){
		for(let i = 1; i < this.yheight; i++){
			line(5 * gconsts.blocksize, i * gconsts.blocksize, (this.xwidth - 5) * gconsts.blocksize, i * gconsts.blocksize);
		}
		for(let i = 5; i < this.xwidth - 4; i++){
			line(i * gconsts.blocksize, 0, i * gconsts.blocksize, this.yheight * gconsts.blocksize);
		}
	}

	this.tilesdown = function(){
		for (let i = 0; i < this.tiles.length; i++) {
			for(let j = 0; j < this.tiles[i].tileshape.length; j++){
				this.tiles[i].tileshape[j][1] += 1;
			}
		}
	}

	this.gridshowtiles = function () {
		for (let i = 0; i < this.tiles.length; i++) {
			this.tiles[i].show();
		}
	}
}


//make keypresses
function keyPressed(){
	if (keyCode === 37){ // left
		current_tile.moveleft();
	} else if (keyCode === 38){ // up switch with on hold
		let temp = current_tile;
		if(onHold != undefined){
			current_tile = {...onHold};
			current_tile.x = temp.x;
			current_tile.y = temp.y;
			if(!current_tile.isvalidmove(current_tile.tileshape)){//tilepostion after switch is not valid
				current_tile = temp;
			} else {//place the new on hold tile cuz switch is valid
				onHold = temp;
				onHold.x = 2 * gconsts.blocksize;
				onHold.y = 3 * gconsts.blocksize;
			}
		} else {
			let tilenumber = Math.floor(Math.random() * 7);//0-6
			current_tile = new tile(gconsts.blocksize * (Math.floor(Math.random() * (gconsts.xwidth - 11)) + 6), 60, gconsts.tiles[tilenumber][0], gconsts.tiles[tilenumber][1], gconsts.tiles[tilenumber][2]);
			onHold = temp;
			onHold.x = 2 * gconsts.blocksize;
			onHold.y = 3 * gconsts.blocksize;
		}

	} else if (keyCode === 39){ // right
		current_tile.moveright();
	} else if (keyCode === 40){ // down
		current_tile.rotateright();
	} else if (keyCode === 32) { //space
		current_tile.harddrop();
	} else {
	}
}


//program structure functions

//program
function setup(){
	//gameconstants
	gconsts = new gameconstants();//be carefull, you may brake the game when changing

	//random tile at the start
	//random x starting position for each new tile
	let tilenumber = Math.floor(Math.random() * 7);//0-6
	current_tile = new tile(gconsts.blocksize * (Math.floor(Math.random() * (gconsts.xwidth - 11)) + 6), 60, gconsts.tiles[tilenumber][0], gconsts.tiles[tilenumber][1], gconsts.tiles[tilenumber][2]);
	//set onhold
	onHold = undefined;
	//make grid
	grid = new Grid(gconsts.xwidth, gconsts.yheight);//gconsts.xwidth, gconsts.yheight

	//canvas
	createCanvas(gconsts.xwidth * gconsts.blocksize, gconsts.yheight * gconsts.blocksize);
	//make the current_tile move down with the setInterval() function
	setInterval(() => {
		console.log(current_tile.tileshape);
		if(current_tile.isvalidmove(current_tile.tileshape.map((value) => {
			return [value[0], value[1] + 1];
		}))){
			current_tile.down();
		} else {
			console.log(current_tile.tileshape);
			//new tile, old tile in grid.tiles array
			grid.tiles.push(current_tile);
			let gridpos = current_tile.getgridpos();
			for(let i = 0; i < current_tile.tileshape.length; i++){
				let gridx = gridpos[0] + current_tile.tileshape[i][0];
				let gridy = gridpos[1] - current_tile.tileshape[i][1];
				console.log(gridx, gridy);
				grid.grid[gridy][gridx] = 1;
			}
			console.log(gridpos);
			grid.grid[gridpos[1]][gridpos[0]] = 1;
			let tilenumber = Math.floor(Math.random() * 7);//0-6
			current_tile = new tile(gconsts.blocksize * (Math.floor(Math.random() * (gconsts.xwidth - 11)) + 6), 60, gconsts.tiles[tilenumber][0], gconsts.tiles[tilenumber][1], gconsts.tiles[tilenumber][2]);
			console.log(grid.grid);
		}
	}, 1000);
}


function draw(){
	//show background
	background("grey");
	grid.showgridlines();
	textSize(20);
	fill("black");
	text("On Hold", 30, 20);
	text("Next",  gconsts.xwidth * gconsts.blocksize - 100, 20)

	//background tiles
	grid.gridshowtiles();

	//tiles
	current_tile.show();
	if(onHold != undefined){
		onHold.show();
	}
}
