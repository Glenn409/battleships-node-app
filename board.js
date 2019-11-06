const gridLabels = [' ','A','B','C','D','E','F','G','H','I','J'];

function board(board = [],player){
    //board is the actual matrix that will keep track of shots taken, ships etc with markers instead of '-'
    this.board = board,
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
    },
    //displays a nice looking board on console.log
    this.displayBoards = function(cpu){
        console.log('\n')
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
        console.log('\n')
    },
    this.attack = function(y,x,opponnent){
        cpuBoard.board[2][3] = 'x'
    }
}
//proper displays both users and cpus board on console on same line for a clean node ui xd
function displayCurrentGame(){

}

let cpuBoard = new board();
let testBoard = new board();
cpuBoard.createBoard();
testBoard.createBoard();
testBoard.displayBoards(cpuBoard);

testBoard.attack(2,3,cpuBoard);
testBoard.displayBoards(cpuBoard);
// console.log(testBoard.board);