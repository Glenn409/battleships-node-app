const board = require('./board');
const inquire = require('inquirer');
const gridLabels = [' ','A','B','C','D','E','F','G','H','I','J'];
const cpuDirections = ['LEFT','RIGHT','UP','DOWN'];
// const cpuAIchecks = [1,2,3,4,5,6,7,8,9,10,'A','B','C','D','E','F','G','H','I','J','S','Z','X'];
let userAttacks = []
let cpuAttacks = []

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
let userBoard = new board('player');
cpuBoard.createBoard();
userBoard.createBoard();

userBoard.displayBoards(cpuBoard);

// userBoard.displayBoards(cpuBoard);x
// userBoard.attack(2,3,cpuBoard);

let count = 0;
const setupBoard = function(){
    if(count < ships.length){
        inquire.prompt([
            {
                type: 'input',
                name:'placement',
                message: `Please place your ${ships[count].name} (${ships[count].size} units wide) on the grid\nPlace it by typing the starting coordinates followed by the direction\nWrite your placement in a format like this: A6 UP or J10 RIGHT\n`
            }
        ]).then(function(data){
            let checkData = checkInput(data.placement,false);
            if(!checkData[0] === true || userBoard.createShip(checkData,ships[count].size, ships[count]) === false){
                console.log('\nBad input please try again.');
                userBoard.displayBoards(false)
                setupBoard();
            } else {
                userBoard.createShip(checkData,ships[count].size, ships[count].name)
                count++;
                userBoard.displayBoards(false)
                setupBoard();
            }
        })
    }
     else {
         //after all user ships r created, we create a random cpu board
         //then we start them game
        setupCpuBoard();
        console.log('\n--------------------------------------------------')
        console.log('-------------------Starting-Game------------------')
        console.log('--------------------------------------------------\n')
        userBoard.displayBoards(cpuBoard)
        runGame(cpuBoard)
     }
}

let cpuCount = 0;
//sets up a cpu board with ships
const setupCpuBoard = function(){
    if(cpuCount < ships.length){
        let data = randomCpuCoords(false);
        let checkData = checkInput(data,false);
        if(!checkData[0] === true || cpuBoard.createShip(checkData,ships[cpuCount].size, ships[cpuCount]) === false){
            setupCpuBoard();
        } else {
            cpuBoard.createShip(checkData,ships[cpuCount].size,ships[cpuCount].name);
            cpuCount++;
            setupCpuBoard();
        }
    }
}

setupBoard();

let round = 1;
let yourRecentMove;
//created a object that gets constantly manipulated and reset depending if cpu hits/destroys ships
//so we can use the info within the object to run a basic cpu AI
let cpuAI = {
    recentHit: '',
    directionList: ['LEFT','RIGHT','UP','DOWN'],
    direction:false,
    ai: 'off',
    originalCoords:[],
    nextAttack: []
}

function runGame(board){
    let userShipCount = shipStatus(userBoard);
    let cpuShipCuont = shipStatus(cpuBoard)

    //this runs all the Users attacks and checks input
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
                    let userAttackCoords = [checkData[0],checkData[1]]
                    if(checkData[0] === undefined){
                        console.log(`\n${data.coords} are Invalid Attack Coordinates!\n`);
                        runGame(board)
                    } else if(checkDuplicate(userAttackCoords,userAttacks)){
                        console.log(`\nCommander, you already shot at ${data.coords}.\nPlease input another set of Attack Coordinates`)
                        runGame(board)
                    }else {
                        console.log(`\nRound ${round}`);
                        console.log('------------------------------------------------------')    
                        console.log(`Amount of ships remaining\nYou: ${userShipCount}/5\nCpu: ${cpuShipCuont}/5`)
                        console.log('------------------------------------------------------')
                        yourRecentMove = checkData;
                        userBoard.attack(checkData[0],checkData[1],board);
                        userAttacks.push(userAttackCoords)
                        if(cpuBoard.checkAllShipsHP() === false){
                            userBoard.displayBoards(cpuBoard)
                            console.log('Good Job Commander the Enemy has been Defeated!');
                        } else {    
                            runGame(userBoard)
                        }
                    }
                }
                catch{
                    console.log(`\n${data.coords} are Invalid Attack Coordinates!\n`);
                    runGame(board);
                }
            })
        } else {
            //this runs all the computer attacks and changes the cpu AI object
            let attackCoords;
            if(cpuAI.ai === 'on'){
                attackCoords = cpuAI.nextAttack;
            } else {
                attackCoords = randomCpuCoords(true);
            }

            if(checkDuplicate(attackCoords,cpuAttacks) === true){
                cpuAI.recentHit = false;
               superComplexComputerAI();
               runGame(board);
            } else {
                cpuAttacks.push(attackCoords);  
                const attackX = attackCoords[0];
                const attackY = attackCoords[1];
                cpuBoard.attack(attackX,attackY,board)
                let num = yourRecentMove[0]
                let display = gridLabels[num];
                console.log(`Commander your last attack was at: ${display}${yourRecentMove[1]}`)
                console.log(`The Enemy attacked us at: ${display}${attackY}`);
                console.log('------------------------------------------------------')

                if(userBoard.recentHit[0] === false){
                    cpuAI.recentHit = false;
                    superComplexComputerAI()
                }

                if(cpuBoard.recentHit[0] === true){
                    if(cpuBoard.recentHit[1] !== false){
                        console.log(`The Enemies' ${cpuBoard.recentHit[1]} is Destroyed!`);
                    } else {
                        console.log('- Commander, You Hit a Ship! -')
                    }
                    cpuBoard.recentHit = [false,false];
                }
                display = gridLabels[attackX];


                if(userBoard.recentHit[0] === true){
                    if(userBoard.recentHit[1] !== false){
                        console.log(`Commander, your ${userBoard.recentHit[1]} is Destroyed!`)
                        cpuAI = {
                            recentHit: '',
                            directionList: ['LEFT','RIGHT','UP','DOWN'],
                            direction:false,
                            ai: 'off',
                            originalCoords:[],
                            nextAttack: []
                        }
                    } else {
                        if(cpuAI.ai ==='off'){
                            cpuAI.recentHit = true;
                            cpuAI.ai = 'on'
                            cpuAI.originalCoords = [attackX,attackY];
                            cpuAI.nextAttack = [attackX,attackY];
                        }
                        superComplexComputerAI()
                        console.log(`- Commander the Enemy hit us! -`)
                    }
                    userBoard.recentHit = [false,false];
                }

                userBoard.displayBoards(cpuBoard)
                if(userBoard.checkAllShipsHP() === false){
                    console.log('You have been Defeated!');
                } else {
                    round++;
                    runGame(cpuBoard)
                }
            }
        }
}   

function superComplexComputerAI(){  
    if(cpuAI.originalCoords === []){
        console.log('failed no org coords');
        return false
    }
     if(cpuAI.recentHit === true && cpuAI.ai === 'on'){
        let newX
        let newY
        if(cpuAI.direction === false){
            cpuAI.direction = getRandomDirection();
        }
        switch(cpuAI.direction){
                case 'RIGHT':
                        newX = cpuAI.nextAttack[0] + 1
                        newY = cpuAI.nextAttack[1]
                        if(checkAiConditions(newX,newY)){
                            cpuAI.nextAttack = [newX,newY];
                        } else {
                            cpuAI.recentHit = false;
                            superComplexComputerAI();
                        }
                    break;
                case 'LEFT':
                        newX = cpuAI.nextAttack[0] - 1
                        newY = cpuAI.nextAttack[1] 
                        if(checkAiConditions(newX,newY)){
                            cpuAI.nextAttack = [newX,newY];
                        } else {
                            cpuAI.recentHit = false;
                            superComplexComputerAI();
                        }
                    break;
                case 'UP':
                        newX = cpuAI.nextAttack[0] 
                        newY = cpuAI.nextAttack[1] - 1
                        if(checkAiConditions(newX,newY)){
                            cpuAI.nextAttack = [newX,newY];
                        } else {
                            cpuAI.recentHit = false;
                            superComplexComputerAI();
                        }
                    break;
                case 'DOWN':
                        newX = cpuAI.nextAttack[0] 
                        newY = cpuAI.nextAttack[1] + 1
                        if(checkAiConditions(newX,newY)){

                            cpuAI.nextAttack = [newX,newY];
                        } else {
                            cpuAI.recentHit = false;
                            superComplexComputerAI();
                        }
                    break;
            }

    } else if(cpuAI.recentHit === false && cpuAI.ai === 'on'){
        cpuAI.direction = getRandomDirection();
        cpuAI.nextAttack = cpuAI.originalCoords;
        cpuAI.recentHit = true;
        superComplexComputerAI();
    }
}
//prevent duplicate attacks at same Coordinates
function checkDuplicate(attackingCoords,array){
    for(let i = 0; i < array.length;i++){
        let cpuMove = array[i];
        if(attackingCoords[0] === cpuMove[0] && attackingCoords[1] === cpuMove[1]){
            return true;
        } 
    }
    return false
}
//checks AI guess so it doesnt shoot off the grid
function checkAiConditions(x,y){
    if(y >= 1 && y <= 10 && x >= 1 && x <= 10){
        return true;
    } else {
        return false;
    }
}
//picks randomdirection for computer AI
function getRandomDirection(){
    let randomNum = Math.floor(Math.random() * cpuAI.directionList.length)
    let randomDirection = cpuAI.directionList[randomNum];
    cpuAI.directionList.splice(randomNum,1);
    return randomDirection;
}
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
//generates random CPU coords for creating ships
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

//shows how many ships r still alive
function shipStatus(player){
    let shipsAlive = 0
    if(player.destroyer > 0){
        shipsAlive += 1
    }
    if(player.submarine > 0){
        shipsAlive += 1
    }
    if(player.carrier > 0){
        shipsAlive += 1
    }
    if(player.cruiser > 0){
        shipsAlive += 1
    }
    if(player.battleship > 0){
        shipsAlive += 1
    }
    return shipsAlive
}
//set up display function to hide ships
//attack 'nuclear'

