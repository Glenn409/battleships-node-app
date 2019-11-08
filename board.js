const gridLabels = [' ','A','B','C','D','E','F','G','H','I','J'];
const inquire = require('inquirer')

function board(player,board = []){
    //board is the actual matrix that will keep track of shots taken, ships etc with markers instead of '-'
    this.board = board,
    this.player = player,
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
    this.attack = function(y,x,opponnent){
        cpuBoard.board[2][3] = 'x'
    },
    this.createShip = function(placement,shipSize,shipType,){
        // let cords = placement.split(' ');
        // let x = cords[0].slice(0,1);
        // let direction = cords[1];
        // let y = cords[0].slice(1);
        // y = parseInt(y);
        // x = x[0];
    
        // console.log(`\nX: ${x} Y: ${y} direction: ${direction}\n`)

            console.log('passed');
            for(let i = 0;i < gridLabels.length; i++){
                if(gridLabels[i] === x.toUpperCase()){
                    let indexOfx = i;
                    board[y][indexOfx] = 'X';
                    this.board = board;
                }   
            }
        }
    // this.createShip = function(placement,size,name){
    //     this.isOnGrid(placement,size,name)
    // }
}

// ------------------breakdown of the code above--------------------
// 1. this.board which is the actual data in a matrix which is hidden from user
// 2.  this.createBoard() which starats a blank board with no ships
// 3. this.displayBoards(arg1) 
//      -set arg1 to false if u want to display one board being the users board
//      -set arg1 to the name of the cpu opponents variable name to display both boards.
// 4. this.attack(x,y,opponent) basically takes cordinates of attack and the person your attacking
// 5. this.createShips(); is gonna be called after you create a blank board to allow user to generate ship placesments

//function to check for proper coordinates and direction for ship placement
function checkConditions(x,y,direction){
    const check = direction.toUpperCase() 
    let checkX = false;
    let checkDir;
    //checks direction
    if(check === 'UP' || check === 'DOWN' || check === 'RIGHT' || check === 'LEFT'){
        checkDir = true
    } else checkDir = false;
    //checks x coordinate
    for(let i = 0;i < gridLabels.length; i++){
        if(gridLabels[i] === x){
            checkX = true;
            break;
        }
    }
    //checks y coordinate
    if(y < 1 || y > 10 || checkDir === false || checkX === false){
        console.log(`\nThe Coordinates "${x}${y} ${direction}" are invalid. Please enter another Placement\n`)
        return false;
    } else {
        return true;
    }
}

module.exports = board;

