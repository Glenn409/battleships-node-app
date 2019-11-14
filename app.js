const board = require('./board');
const inquire = require('inquirer');
const gridLabels = [' ','A','B','C','D','E','F','G','H','I','J'];
const cpuDirections = ['LEFT','RIGHT','UP','DOWN'];
let cpuAttacks = [];

const ships = [{
    name:'Destroyer',
    size: 2,
    tag: 'D',
    userHP:2,
    enemyHP:2

},{
    name: 'Submarine',
    size:3,
    tag: 'S',
    userHP:3,
    enemyHP:3
},{
    name: 'Carrier',
    size:5,
    tag: 'C',
    userHP:5,
    enemyHP:5
},
{
    name:'Cruiser',
    size:3,
    tag: 'Z',
    userHP:3,
    enemyHP:3
},
{
    name:'Battleship',
    size:4,
    tag:'B',
    userHP:4,
    enemyHP:5
}
];

let cpuBoard = new board('cpu');
let testBoard = new board('player');
cpuBoard.createBoard();
testBoard.createBoard();

testBoard.displayBoards(cpuBoard);

// testBoard.displayBoards(cpuBoard);x
// testBoard.attack(2,3,cpuBoard);

let count = 0;
const finalizeBoard = function(){
    if(count < ships.length){
        inquire.prompt([
            {
                type: 'input',
                name:'placement',
                message: `Please place your ${ships[count].name} (${ships[count].size} units wide) on the grid\nPlace it by typing the starting coordinates followed by the direction\nWrite your placement in a format like this: A6 UP or J10 RIGHT\n`
            }
        ]).then(function(data){
            let checkData = checkInput(data.placement,false);
            console.log(checkData);
            if(!checkData[0] === true || testBoard.createShip(checkData,ships[count].size, ships[count]) === false){
                console.log('\nBad input please try again.');
                testBoard.displayBoards(false)

                finalizeBoard();
            } else {
                testBoard.createShip(checkData,ships[count].size, ships[count].name)
                count++;
                // console.log(testBoard.board);
                testBoard.displayBoards(false)
                finalizeBoard();
            }
        })
    }
     else {
        setupCpuBoard();
        cpuBoard.displayBoards(false)
        console.log('cpu board above')
        testBoard.displayBoards(false)
        console.log('--------------------------------------------------')
        console.log('-------------------starting game------------------')
        console.log('--------------------------------------------------')
        attackInput(testBoard);
        // attackInput(testBoard);
        // attackInput(testBoard);
        // attackInput(testBoard);
        // attackInput(testBoard);
        // attackInput(testBoard);
        // attackInput(testBoard);
        // attackInput(testBoard);
        // attackInput(testBoard);
        // attackInput(testBoard);
        // attackInput(testBoard);
        // attackInput(testBoard);
        // attackInput(testBoard);
        // attackInput(testBoard);
        // attackInput(testBoard);
        // attackInput(testBoard);
        // attackInput(testBoard);
        // attackInput(testBoard);
        // attackInput(testBoard);
        // attackInput(testBoard);
        // attackInput(testBoard);
        // attackInput(testBoard);
        // attackInput(testBoard);
        // attackInput(testBoard);
        // attackInput(testBoard);
        // testBoard.displayBoards(cpuBoard);
        // attackInput(cpuBoard);


        // testBoard.attack(1,1,cpuBoard);
        // testBoard.displayBoards(cpuBoard);
        
     }
}

let cpuCount = 0;
const setupCpuBoard = function(){
    if(cpuCount < ships.length){
        let data = randomCpuCoords(false);
        let checkData = checkInput(data,false);
        if(!checkData[0] === true || cpuBoard.createShip(checkData,ships[cpuCount].size, ships[cpuCount]) === false){
            // console.log('error');
            // console.log(checkData);
            // console.log('---------')
            setupCpuBoard();
        }else{
            console.log(checkData);
            // console.log('cpu coords r good creating ship');
            cpuBoard.createShip(checkData,ships[cpuCount].size,ships[cpuCount].name);
            cpuCount++;
            // console.log()
            setupCpuBoard();
        }
    }
}

finalizeBoard();

//function to break down the users input for creating a ship
function checkInput(placement,attack){ 
    if(attack === false){
        let cords = placement.split(' ');

        if(cords.length > 2 || cords.length < 2){
            return false;
        } else {
            let x = cords[0].slice(0,1);
            let direction = cords[1];
            let y = cords[0].slice(1);
            y = parseInt(y);
            x = x[0];
            direction = direction.toUpperCase();
            x = x.toUpperCase()
    
            if(checkConditions(x,y,direction) === true){
                return [true,x,y,direction];
            } else {
                return [false];
            }
        }
    } else if (attack === true){
        let indexOfX;
        let x = placement[0];
        for(let i = 0; i < gridLabels.length; i++){
            console.log(gridLabels[i]);
            if(x.toUpperCase() === gridLabels[i]){ 
                indexOfX = i;
            }
        }

        let y = placement.slice(1);
        y = parseInt(y);
        console.log('attacking cords: '+ indexOfX,y);
        return [indexOfX, y];
    }
    // console.log(`\nX: ${x} Y: ${y} direction: ${direction}\n`)
}
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
    if(y >= 1 && y <= 10 && checkDir === true && checkX === true){
        return true;
    } else {
        console.log(`\nThe Coordinates "${x}${y} ${direction}" are invalid. Please enter another Placement\n`)
        return false;
    }
}
function randomCpuCoords(attack){
    let randomX = Math.floor((Math.random() * 10)+1)
    let randomY = Math.floor((Math.random() * 10)+1)

    if(attack){
        return [randomX,randomY]
    } else {
        randomX = gridLabels[randomX];
        let str;
        let randomDir = Math.floor((Math.random() * 4))
        randomDir = cpuDirections[randomDir];
        str = randomX + randomY.toString() + ' '+randomDir;
        return str;
    }
}


function attackInput(board){

    if(checkOverallHP(cpuBoard) === false || checkOverallHP(testBoard) === false){
        console.log('failed');
    } else {
        if(board === cpuBoard){
            console.log('attacking cpuboard');
            inquire.prompt([
                {
                    type:'input',
                    message: 'Input your Attack Coordinate',
                    name: 'coords'
                }
            ]).then(function(data){
                let checkData = checkInput(data.coords,true);
                console.log(checkData);
                testBoard.attack(checkData[0],checkData[1],board);
                testBoard.displayBoards(cpuBoard);
                attackInput(testBoard);
            })
        } else {
            console.log('cpu attackign you')
            let attackCoords = randomCpuCoords(true);
            console.log(attackCoords)
            for(let i = 0; i <= cpuAttacks.length;i++){
                console.log(i);
                if(attackCoords === cpuAttacks[i]){
                    console.log('Computer is attacking at: ' + attackCoords);
                    console.log('computer failed attack chaning coords');
                    attackInput(board);
                } else {
                    console.log('Computer is attacking at: ' + attackCoords);
                    cpuAttacks.push(attackCoords);
        
                    const attackX = attackCoords[0];
                    const attackY = attackCoords[1];
                    cpuBoard.attack(attackX,attackY,board)
                    testBoard.displayBoards(cpuBoard)
                    attackInput(cpuBoard);
                }
            }
        }
    }

}   

//function to check ships hp
function checkOverallHP(user){
    let check = false;
    if(user === cpuBoard){
        for(let i = 0; i < ships.length;i++){
            if(ships[i].enemyHP > 0){
                check = true;
            }
        }
    } else {
        for(let i = 0; i < ships.length;i++){
            if(ships[i].userHP > 0){
                check = true;
            }
        }
    }
    return check;
}


//attackInput for loop when computer attacks user is infinite 
//cpu cant shoot same shot
//check hit markers if hit update ship hp,notify user
//check that ships hp if hit and if destroyed notify user
//check all ships hp if 0 end game

//ai if hit ship do similar hit again
//set up display function to hide ships
//attack 'nuclear'

//setup input errors for attacking coords // creating ships
//reduce console.log
//try to condense/clean code
//read me
