const gridLabels = [' ','A','B','C','D','E','F','G','H','I','J'];
const inquire = require('inquirer')

function board(player,board = []){
    //board is the actual matrix that will keep track of shots taken, ships etc with markers instead of '-'
    this.board = board,
    this.player = player,
    this.destroyer = 2,
    this.submarine = 3,
    this.carrier = 5,
    this.cruiser = 3,
    this.battleship = 4,
    //first index checks if hits ship, second index will set if ship is destroyed
    this.recentHit = [false,false],
    //checks to see if user already has a board in progress
    this.createBoard = function(){
        if(this.board.length === 0){
            // console.log('no board is found creating a fresh board');
            this.board.push(gridLabels);
            for(var i = 1; i < 11;i++){
                this.board.push([i,'-','-','-','-','-','-','-','-','-','-'])
            }
        } else {
            // console.log(this.board)
        }
        //sets players ship locations
        if(player === 'player'){
            console.log('\nYour board is generating now. You must put your ships on the board for battle!');
        }
    },
    //displays a nice looking board or boards (depending if cpu === false) on console.log
    this.displayBoards = function(cpu){
        console.log('\n')
        if(cpu === false){
            console.log("      Your Board");
            console.log('\n');
            for(var y = 0; y < this.board.length;y++){
                let str = '';
                //grabs eachs users line for correct display
                for(var x = 0; x < this.board[y].length;x++){
                    if(typeof this.board[y][x] === 'number'){
                        if(this.board[y][x] < 10){
                            var fixNumOutput = ' ' + this.board[y][x].toString();
                            str += fixNumOutput;
                        }
                        else {
                            str += this.board[y][x];
                        }
                    } else {
                        str += ' '
                        str += this.board[y][x];
                    }
                }
                console.log(str);
            }
        } else {
            console.log("      Your Board                        CPU's Board")
            console.log('\n')
            for(var y = 0; y < this.board.length;y++){
                let cpustr = '';
                let str = '';
                //grabs eachs users line for correct display
                for(var x = 0; x < this.board[y].length;x++){
                    if(typeof this.board[y][x] === 'number'){
                        if(this.board[y][x] < 10){
                            var fixNumOutput = ' ' + this.board[y][x].toString();
                            str += fixNumOutput;
                        }
                        else {
                            str += this.board[y][x];
                        }
                    } else {
                        str += ' '
                        str += this.board[y][x];
                    }
                }
                //grabs cpus line for correct dispaly
                for(var x = 0; x < cpu.board[y].length;x++){
                    if(typeof cpu.board[y][x] === 'number'){
                        if(cpu.board[y][x] < 10){
                            var fixNumOutput = ' ' + cpu.board[y][x].toString();
                            cpustr += fixNumOutput;
                        }
                        else {
                            cpustr += cpu.board[y][x];
                        }
                    } else {
                        cpustr += ' '
                        cpustr += cpu.board[y][x];
                    }
                }
                console.log(`${str}          ${cpustr}`);
            }
        }
        console.log('\n')
    },
    this.attack = function(x,y,opponnent){
        let tile = opponnent.board[y][x];
        switch (tile){
            case 'D':
                opponnent.destroyer = opponnent.destroyer - 1
                if(opponnent.destroyer === 0){
                    opponnent.recentHit = [true,'Destroyer'];
                } else {
                    opponnent.recentHit = [true,false];
                }
                break;
            case 'S':
                opponnent.submarine = opponnent.submarine - 1
                if(opponnent.submarine === 0){
                    opponnent.recentHit = [true,'Submarine'];
                } else {
                    opponnent.recentHit = [true,false];
                }
                break;
            case 'C':
                opponnent.carrier = opponnent.carrier - 1
                if(opponnent.carrier === 0){
                    opponnent.recentHit = [true,'Carrier'];
                } else {
                    opponnent.recentHit = [true,false];
                }
                break;
            case 'Z':
                opponnent.cruiser = opponnent.cruiser - 1
                if(opponnent.cruiser === 0){
                    opponnent.recentHit = [true,'Cruiser'];
                } else {
                    opponnent.recentHit = [true,false];
                }
                break;
            case 'B':
                opponnent.battleship = opponnent.battleship - 1
                if(opponnent.battleship === 0){
                    opponnent.recentHit = [true,'Battleship'];
                } else {
                    opponnent.recentHit = [true,false];
                }
                break;
            default:
                opponnent.recentHit = [false,false];
                break;
        }
        console.log('RECENT HIT: ' + opponnent.recentHit);
        opponnent.board[y][x] = 'X'
        
        // console.log(opponnent.board);
    },
    this.checkAllShipsHP = function(){
        if(this.destroyer === 0 && this.submarine === 0 && this.carrier === 0 && this.battleship === 0 && this.cruiser === 0){
            return false;
        } else return true;
    },
    this.createShip = function(dataArray,shipSize,shipType){
        let indexOfx;
        shipSize -= 1;
        dataArray.shift();
        let x = dataArray[0];
        let y = dataArray[1];
        let direction = dataArray[2];
        for(let i = 0;i < gridLabels.length; i++){
            if(gridLabels[i] === x){
                indexOfx = i;
            }   
        }
        
        switch(direction){
            case 'UP':
                if(withinPerimeters(this.board,indexOfx,y,direction,shipSize) === false){
                    return false
                } else {
                    for(let i = 0; i < shipSize+1;i++){
                        this.board[y-i][indexOfx] = shipType.tag; 
                    }
                    // console.log(this.board);
                }
                break;
            case 'DOWN':
                if(withinPerimeters(this.board,indexOfx,y,direction,shipSize) === false){
                    return false
                } else {
                    for(let i = 0; i < shipSize+1;i++){
                        this.board[y+i][indexOfx] = shipType.tag; 
                    }
                    // console.log(this.board);
                }
                break;
            case 'RIGHT':
                if(withinPerimeters(this.board,indexOfx,y,direction,shipSize) === false){
                    return false
                } else {
                    for(let i = 0; i < shipSize+1;i++){
                        this.board[y][indexOfx+i] = shipType.tag;
                    }
                    // console.log(this.board);
                }
                break;
            case 'LEFT':
                if(withinPerimeters(this.board,indexOfx,y,direction,shipSize) === false){
                    return false
                } else {
                    for(let i = 0; i < shipSize+1;i++){
                        this.board[y][indexOfx-i] = shipType.tag;
                    }
                    // this.board.displayBoards(false);
                    // console.log(this.board);
                }
                break;
        }
        // console.log(this.board);
    }
}

function withinPerimeters(board,x,y,direction,shipSize){
    switch(direction){
        case 'UP':
            for(let i = 0; i <= shipSize;i++){
                // console.log(`i: ${i} y: ${y} x: ${x} shipsize ${shipSize}`)
                if((y-i) === 0 || (board[y-i][x] !== '-')){
                    return false;   
                }
            }
            break;
        case 'DOWN':
            for(let i = 0; i <= shipSize;i++){
                if((y+i) === 11 || (board[y+i][x] !== '-')){
                    return false;  
                }
            }
            break;
        case 'RIGHT':
            for(let i = 0; i <= shipSize;i++){
                if((x+i) > 10 || (board[y][x+i] !== '-')){
                    return false;
                }
            }
            break;
        case 'LEFT':
            for(let i = 0; i <= shipSize; i++){
                if((x-i) === 0 || (board[y][x-i] !== '-')){
                    return false;
                }
            }
    }
}

// ------------------breakdown of the code above--------------------
// 1. this.board which is the actual data in a matrix which is hidden from user
// 2.  this.createBoard() which starats a blank board with no ships
// 3. this.displayBoards(arg1) 
//      -set arg1 to false if u want to display one board being the users board
//      -set arg1 to the name of the cpu opponents variable name to display both boards.
// 4. this.attack(x,y,opponent) basically takes cordinates of attack and the person your attacking
// 5. this.createShips(); is gonna be called after you create a blank board to allow user to generate ship placesments


module.exports = board;

