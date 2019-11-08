const board = require('./board');
const inquire = require('inquirer');
const gridLabels = [' ','A','B','C','D','E','F','G','H','I','J'];

const ships = [{
    name:'destroyer',
    size: 2
},{
    name: 'submarine',
    size:3
}];

let cpuBoard = new board('cpu');
let testBoard = new board('player');
cpuBoard.createBoard();
testBoard.createBoard();

// testBoard.displayBoards(cpuBoard);x
// testBoard.attack(2,3,cpuBoard);

let count = 0;
const finalizeBoard = async function(){
    if(count < ships.length){
        console.log("adding a ship")
        inquire.prompt([
            {
                type: 'input',
                name:'placement',
                message: `Please place your ${ships[count].name} (${ships[count].size} units wide) on the grid\nPlace it by typing the starting coordinates followed by the direction\nWrite your placement in a format like this: A6 UP or J10 RIGHT\n`
            }
        ]).then(function(data){
            console.log('data: ' + checkInput(data.placement))
            let checkData = checkInput(data.placement);
            if(checkData[0] === true){
                console.log(checkData);
                // testBoard.createShip(data.placement,ships[count].size, ships[count].name);
                count++;
                // testBoard.displayBoards(false)
                finalizeBoard();
            } else {
                console.log('\nBad input please try again.');
                finalizeBoard();
            }
        })
    }
     else {
        testBoard.displayBoards(false)
     }
}
finalizeBoard();

//function to break down the users input for creating a ship
function checkInput(placement){
    let cords = placement.split(' ');
    let x = cords[0].slice(0,1);
    let direction = cords[1];
    let y = cords[0].slice(1);
    y = parseInt(y);
    x = x[0];
    direction = direction.toUpperCase();
    x = x.toUpperCase()
    console.log(`\nX: ${x} Y: ${y} direction: ${direction}\n`)

    if(checkConditions(x,y,direction) === true){
        return [true,x,y,direction];
    };
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
    if(y < 1 || y > 10 || checkDir === true || checkX === true){
        console.log(`\nThe Coordinates "${x}${y} ${direction}" are invalid. Please enter another Placement\n`)
        return true;
    } else {
        return false;
    }
}