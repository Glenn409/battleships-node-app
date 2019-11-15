const board = require('./board');
const inquire = require('inquirer');
const gridLabels = [' ','A','B','C','D','E','F','G','H','I','J'];
const cpuDirections = ['LEFT','RIGHT','UP','DOWN'];
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
    recentHit: null,
    directionList: [],
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
                superComplexComputerAI()
                attackCoords = didCPUHit.nextAttack;
                console.log(attackCoords);

            } else {
                attackCoords = randomCpuCoords(true);
            }
            for(let i = 0; i <= cpuAttacks.length;i++){
                if(attackCoords === cpuAttacks[i]){
                    didCPUHit.recentHit === false;
                    attackInput(board);
                } else {
                    cpuAttacks.push(attackCoords);  
                    const attackX = attackCoords[0];
                    const attackY = attackCoords[1];
                    cpuBoard.attack(attackX,attackY,board)
                    let num = yourRecentMove[0]
                    let display = gridLabels[num];
                    console.log(`\nCommander your last attack was at: ${display}${yourRecentMove[1]}`)
                    if(cpuBoard.recentHit[0] === false){
                        didCPUHit.recentHit === false;
                        let array = didCPUHit.directionList
                        array.push(didCPUHit.direction)
                        didCPUHit.directionList = array;
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
                    console.log(`Computer is attacked us at: ${display}${attackY}`);
                    if(testBoard.recentHit[0] === true){
                        if(testBoard.recentHit[1] !== false){
                            console.log(`Commander, your ${testBoard.recentHit[1]} is Destroyed!`)
                        } else {
                            didCPUHit.originalCoords = [attackX,attackY];
                            didCPUHit.ai = 'on';
                            console.log ('AI IS ON');
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
    console.log(didCPUHit.coords);
    let nextAttack;
    if(didCPUHit.recentHit === null){
        didCPUHit.nextAttack = didCPUHit.originalCoords;
        nextAttack = didCPUHit.originalCoords;
        let randomDirection = getRandomDirection();
        switch (randomDirection){
            case 'RIGHT':
                nextAttack[1] = nextAttack[1] + 1; 
                break;
            case 'LEFT':
                nextAttack[1] = nextAttack[1] - 1; 
                break;
            case 'UP':
                nextAttack[0] = nextAttack[0] + 1; 
                break;
            case 'DOWN':
                nextAttack[0] = nextAttack[0] - 1; 
                break;
        }
        didCPUHit.recentHit = true;
        didCPUHit.nextAttack = nextAttack;

    }else if(didCPUHit.recentHit === true){
        nextAttack = didCPUHit.nextAttack;
        switch(didCPUHit.direction){
                case 'RIGHT':
                    nextAttack = [nextAttack[0],nextAttack[1] +1]; 
                    break;
                case 'LEFT':
                    nextAttack[1] = nextAttack[1] - 1; 
                    break;
                case 'UP':
                    nextAttack[0] = nextAttack[0] + 1; 
                    break;
                case 'DOWN':
                    nextAttack[0] = nextAttack[0] - 1; 
                    break;
            }

    } else if(didCPUHit.recentHit === false){
        switch (didCPUHit.direction){
            case 'RIGHT':
    
                for(let i = 0; i < didCPUHit.directionList.length;i++){
                    if(didCPUHit.directionList[i] === 'LEFT'){
                        for(let z = 0; z < didCPUHit.directionList.length;z++){
                            if(didCPUHit.direction[z] === 'UP' || didCPUHit.direction[z] === 'DOWN'){
                                didCPUHit = {
                                    recentHit: null,
                                    directionList: [],
                                    direction:false,
                                    ai: 'off',
                                    originalCoords:[],
                                    nextAttack: []
                                }
                                break;
                            }
                        }
                    } else {
                        didCPUHit.direction = 'LEFT'
                        nextAttack = didCPUHit.originalCoords;
                        nextAttack[1] = nextAttack[1] - 1; 
                        console.log(nextAttack);
                    }
                }
                break;
            
                case 'LEFT':
                        for(let i = 0; i < didCPUHit.directionList.length;i++){
                            if(didCPUHit.directionList[i] === 'RIGHT'){
                                for(let z = 0; z < didCPUHit.directionList.length;z++){
                                    if(didCPUHit.direction[z] === 'UP' || didCPUHit.direction[z] === 'DOWN'){
                                        didCPUHit = {
                                            recentHit: null,
                                            directionList: [],
                                            direction:false,
                                            ai: 'off',
                                            originalCoords:[],
                                            nextAttack: []
                                        }
                                        break;
                                    }
                                }
                            } else {
                                didCPUHit.direction = 'RIGHT'
                                nextAttack = didCPUHit.originalCoords;
                                nextAttack[1] = nextAttack[1] + 1; 
                            }
                        }
                    break;

                    case 'UP':
                            for(let i = 0; i < didCPUHit.directionList.length;i++){
                                if(didCPUHit.directionList[i] === 'DOWN'){
                                    for(let z = 0; z < didCPUHit.directionList.length;z++){
                                        if(didCPUHit.direction[z] === 'LEFT' || didCPUHit.direction[z] === 'RIGHT'){
                                            didCPUHit = {
                                                recentHit: null,
                                                directionList: [],
                                                direction:false,
                                                ai: 'off',
                                                originalCoords:[],
                                                nextAttack: []
                                            }
                                            break;
                                        }
                                    }
                                } else {
                                    didCPUHit.direction = 'DOWN'
                                    nextAttack = didCPUHit.originalCoords;
                                    nextAttack[0] = nextAttack[0] + 1; 
                                }
                            }
                        break;

                        case 'DOWN':
                                for(let i = 0; i < didCPUHit.directionList.length;i++){
                                    if(didCPUHit.directionList[i] === 'UP'){
                                        for(let z = 0; z < didCPUHit.directionList.length;z++){
                                            if(didCPUHit.direction[z] === 'LEFT' || didCPUHit.direction[z] === 'RIGHT'){
                                                didCPUHit = {
                                                    recentHit: null,
                                                    directionList: [],
                                                    direction:false,
                                                    ai: 'off',
                                                    originalCoords:[],
                                                    nextAttack: []
                                                }
                                                break;
                                            }
                                        }
                                    } else {
                                        didCPUHit.direction = 'UP'
                                        nextAttack = didCPUHit.originalCoords;
                                        nextAttack[0] = nextAttack[0] - 1; 
                                    }
                                }
                            break;
                            }
    }
}

function checkDirectionList(){

}
function getRandomDirection(){
    let randomNum = Math.floor(Math.random()*3+1)
    switch (randomNum){
        case 1:
            return 'RIGHT';
        case 2:
            return 'LEFT';
        case 3:
            return 'UP';
        case 4:
            return 'DOWN';
    }
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
