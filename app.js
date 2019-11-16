const board = require('./board');
const inquire = require('inquirer');
const gridLabels = [' ','A','B','C','D','E','F','G','H','I','J'];
const cpuDirections = ['LEFT','RIGHT','UP','DOWN'];
const cpuAIchecks = [1,2,3,4,5,6,7,8,9,10,'A','B','C','D','E','F','G','H','I','J','S','Z','X'];
let cpuAttacks = [];

const ships = [{
    name:'Destroyer',
    size: 2,
    tag: 'D'

},{
    name: 'Submarine',
    size:3,
    tag: 'S'
},{
    name: 'Carrier',
    size:5,
    tag: 'C'
},
{
    name:'Cruiser',
    size:3,
    tag: 'Z'
},
{
    name:'Battleship',
    size:4,
    tag:'B'
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
            if(!checkData[0] === true || testBoard.createShip(checkData,ships[count].size, ships[count]) === false){
                console.log('\nBad input please try again.');
                testBoard.displayBoards(false)

                finalizeBoard();
            } else {
                testBoard.createShip(checkData,ships[count].size, ships[count].name)
                count++;
                testBoard.displayBoards(false)
                finalizeBoard();
            }
        })
    }
     else {
        setupCpuBoard();
        console.log('\n--------------------------------------------------')
        console.log('-------------------starting game------------------')
        console.log('--------------------------------------------------\n')
        testBoard.displayBoards(cpuBoard)
        attackInput(cpuBoard)
     }
}
let cpuCount = 0;
const setupCpuBoard = function(){
    if(cpuCount < ships.length){
        let data = randomCpuCoords(false);
        let checkData = checkInput(data,false);
        if(!checkData[0] === true || cpuBoard.createShip(checkData,ships[cpuCount].size, ships[cpuCount]) === false){
            setupCpuBoard();
        }else{
            cpuBoard.createShip(checkData,ships[cpuCount].size,ships[cpuCount].name);
            cpuCount++;
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
            if(x.toUpperCase() === gridLabels[i]){ 
                indexOfX = i;
            }
        }

        let y = placement.slice(1);
        y = parseInt(y);
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

let round = 1;
let yourRecentMove;
//start of computer AI
let didCPUHit = {
    recentHit: '',
    directionList: ['LEFT','RIGHT','UP','DOWN'],
    direction:false,
    ai: 'off',
    originalCoords:[],
    nextAttack: []
}

function attackInput(board){
    console.log(`Round ${round}`);
        if(board === cpuBoard){
            console.log('Commander, It is our turn to launch an attack.\n')
            inquire.prompt([
                {
                    type:'input',
                    message: 'Input your Attack Coordinates',
                    name: 'coords'
                }
            ]).then(function(data){
                try{
                    let checkData = checkInput(data.coords,true);
                    yourRecentMove = checkData;
                    testBoard.attack(checkData[0],checkData[1],board);
                    if(cpuBoard.checkAllShipsHP() === false){
                        testBoard.displayBoards(cpuBoard)
                        console.log('Good Job Commander the Enemy has been Defeated!');
                    } else {    
                        attackInput(testBoard)
                    }
                }
                catch{
                    console.log(`\n${data.coords} are Invalid Attack Coordinates!\n`);
                    attackInput(board);
                }
            })
        } else {
            let attackCoords;
            if(didCPUHit.ai === 'on'){
                console.log('----------')
                attackCoords = didCPUHit.nextAttack;
            } else {
                attackCoords = randomCpuCoords(true);
            }
            let arrayCords = [attackCoords[0],attackCoords[1]]
            for(let i = 0; i <= cpuAttacks.length;i++){
                console.log(arrayCords)
                console.log(cpuAttacks[i])

                    
                if(arrayCords === cpuAttacks[i]){
                    console.log('alrdy made thsi move changing direciton');
                    didCPUHit.recentHit = false;
                    attackInput(board);
                } else {
                    cpuAttacks.push(attackCoords);  
                    const attackX = attackCoords[0];
                    const attackY = attackCoords[1];
                    console.log('computer attacking at '+attackX+ ' , ' + attackY)
                    cpuBoard.attack(attackX,attackY,board)
                    let num = yourRecentMove[0]
                    let display = gridLabels[num];
                    console.log(`\nCommander your last attack was at: ${display}${yourRecentMove[1]}`)
    
                    if(testBoard.recentHit[0] === false){
                        didCPUHit.recentHit = false;
                        // let array = didCPUHit.directionList
                        // if(didCPUHit.direction !== false){
                        //     array.push(didCPUHit.direction)
                        //     didCPUHit.directionList = array;
                        // } 
                        superComplexComputerAI()
                        console.log('--------------------')
                        console.log(JSON.stringify(didCPUHit));
                    }

                    if(cpuBoard.recentHit[0] === true){
                        if(cpuBoard.recentHit[1] !== false){
                            console.log(`The Enemies' ${cpuBoard.recentHit[1]} is Destroyed!`);
                        } else {
                            console.log('Commander, You Hit a Ship!')
                        }
                        cpuBoard.recentHit = [false,false];
                    }
                    display = gridLabels[attackX];
                    console.log(`The Enemy attacked us at: ${display}${attackY}`);


                    if(testBoard.recentHit[0] === true){
                        if(testBoard.recentHit[1] !== false){
                            console.log(`Commander, your ${testBoard.recentHit[1]} is Destroyed!`)
                            didCPUHit = {
                                recentHit: '',
                                directionList: ['LEFT','RIGHT','UP','DOWN'],
                                direction:false,
                                ai: 'off',
                                originalCoords:[],
                                nextAttack: []
                            }
                        } else {
                            if(didCPUHit.ai ==='off'){
                                console.log ('AI IS ON');
                                didCPUHit.recentHit = true;
                                didCPUHit.ai = 'on'
                                didCPUHit.originalCoords = [attackX,attackY];
                                didCPUHit.nextAttack = [attackX,attackY];
                            }
                            superComplexComputerAI()
                            console.log(JSON.stringify(didCPUHit));
                            console.log(`Commander the enemy hit us!`)
                        }
                        testBoard.recentHit = [false,false];
                    }
                    testBoard.displayBoards(cpuBoard)
                    if(testBoard.checkAllShipsHP() === false){
                        console.log('You have been Defeated!');
                    } else {
                        round++;
                        attackInput(cpuBoard)
                    }
                    break;

                }
            }
        }
}   

function superComplexComputerAI(){  
    if(didCPUHit.originalCoords === []){
        console.log('failed no org coords');
        return false
    }
    let nextAttack;

     if(didCPUHit.recentHit === true && didCPUHit.ai === 'on'){
        let newX
        let newY
        if(didCPUHit.direction === false){
            console.log('made random direction')
            didCPUHit.direction = getRandomDirection();
            console.log(didCPUHit.direction)
        }
        console.log(didCPUHit.direction);
        switch(didCPUHit.direction){
                case 'RIGHT':
                    console.log('using right')
                        newX = didCPUHit.nextAttack[0] + 1
                        newY = didCPUHit.nextAttack[1]
                        if(testBoard.board[newY,newX]==='X'){
                            console.log('reverse this stuff')
                        }
                        if(testBoard.board[newX,newY] === 'X'){
                            console.log('DETECTED X')
                            // didCPUHit.recentHit = false;
                            // superComplexComputerAI();
                        } else {
                            didCPUHit.nextAttack = [newX,newY];
                            console.log(`x: ${newX} y: ${newY}`)
                        }
                    break;
                case 'LEFT':
                    console.log("using left")
                        newX = didCPUHit.nextAttack[0] - 1
                        newY = didCPUHit.nextAttack[1] 
                        if(testBoard.board[newY,newX]==='X'){
                            console.log('reverse this stuff')
                        }
                        if(testBoard.board[newX,newY]==='X'){
                            console.log('reverse this stuff')
                        }
                        if(testBoard.board[newX,newY] === 'X'){
                            console.log('DETECTED X')
                            // didCPUHit.recentHit = false;
                            // superComplexComputerAI();
                        } else {
                            didCPUHit.nextAttack = [newX,newY];
                            console.log(`x: ${newX} y: ${newY}`)
                        }
                    break;
                case 'UP':
                    console.log('using up')
                        newX = didCPUHit.nextAttack[0] 
                        newY = didCPUHit.nextAttack[1] - 1
                        if(testBoard.board[newY,newX]==='X'){
                            console.log('reverse this stuff')
                        }
                        if(testBoard.board[newX,newY] === 'X'){
                            console.log('DETECTED X')
                            // didCPUHit.recentHit = false;
                            // superComplexComputerAI();
                        } else {
                            didCPUHit.nextAttack = [newX,newY];
                            console.log(`x: ${newX} y: ${newY}`)
                        }
                    break;
                case 'DOWN':
                    console.log('using down')
                        newX = didCPUHit.nextAttack[0] 
                        newY = didCPUHit.nextAttack[1] + 1
                        if(testBoard.board[newY,newX]==='X'){
                            console.log('reverse this stuff')
                        }
                        if(testBoard.board[newX,newY] === 'X'){
                            console.log('DETECTED X')
                            // didCPUHit.recentHit = false;
                            // superComplexComputerAI();
                        } else {
                            didCPUHit.nextAttack = [newX,newY];
                            console.log(`x: ${newX} y: ${newY}`)
                        }
                    break;
            }

    } else if(didCPUHit.recentHit === false && didCPUHit.ai === 'on'){
            
        console.log(JSON.stringify(didCPUHit))
        console.log('computer failed to hit changing course')
        didCPUHit.direction = getRandomDirection();
        console.log('=============')
        console.log(didCPUHit.directionList)
        console.log(didCPUHit.direction)
        console.log('=============')
        didCPUHit.nextAttack = didCPUHit.originalCoords;
        didCPUHit.recentHit = true;
        superComplexComputerAI();
        // switch (didCPUHit.direction){
        //     case 'RIGHT':
        //             superComplexComputerAI();
        //         break;
            
        //     case 'LEFT':
        //             superComplexComputerAI();
        //         break;

        //     case 'UP':
        //             superComplexComputerAI();
        //         break;

        //     case 'DOWN':
        //             superComplexComputerAI();
        //         break;
        // }
    }
}

function getRandomDirection(){
    let randomNum = Math.floor(Math.random() * didCPUHit.directionList.length)
    let randomDirection = didCPUHit.directionList[randomNum];
    didCPUHit.directionList.splice(randomNum,1);
    return randomDirection;
}

//---ai---
//check if its in attack array alrdy
//if not pick a side up down left or right
//add one to that see if it hits
//if  hits keep going until failed, the go other direction until destroyed
//reset object

//ai if hit ship do similar hit again
//set up display function to hide ships
//attack 'nuclear'

//setup input errors for attacking coords // creating ships
//reduce console.log
//try to condense/clean code
//read me


//if hit
// set a random direction to go on
//
