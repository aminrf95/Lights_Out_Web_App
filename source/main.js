class Light {
    static lightsRemaining = 0;
    static moveCount = 0;
    static moveText = document.createTextNode("Moves: " + Light.moveCount);

    constructor() {
        this.box = document.createElement("div");
        this.box.style.backgroundColor = "green";
        this.box.style.width = "50px";
        this.box.style.height = "50px";
        this.box.style.margin = "10px";

        this.on = true;
        this.neighbors = [];

        this.switchState = this.switchState.bind(this);
        this.flipSwitch = this.flipSwitch.bind(this);
        this.updateMoveCount = this.updateMoveCount.bind(this);
        this.box.onclick = this.flipSwitch;
    }

    //Changes the state of this light only
    switchState() {
        if(this.on) {
            this.box.style.backgroundColor = "gray";
            Light.lightsRemaining--;
        }
        else {
            this.box.style.backgroundColor = "green";
            Light.lightsRemaining++;
        }
        this.on = !this.on;
    }

    //Changes the state of this light and all neighbors, increments moveCount
    flipSwitch() {
        //If game is over, do nothing
        if(Light.lightsRemaining == 0) {return;}
        this.switchState();
        for(let n of this.neighbors) {
            n.switchState();
        }
        this.updateMoveCount();
    }

    updateMoveCount() {
        Light.moveCount++;
        if(Light.lightsRemaining == 0) {
            Light.moveText.nodeValue = "You won in " + Light.moveCount + " moves!";
        }
        else {
            Light.moveText.nodeValue = "Moves: " + Light.moveCount;
        }
    }
}

//Creates a 3x3 grid of lights and registers all neighbors
function makeGrid(size) {
    //Initialize the grid with lights
    let grid = [];
    for(let i = 0; i < size; i++) {
        let row = [];
        for(let j = 0; j < size; j++) {
            let gridLight = new Light();
            row.push(gridLight);
        }
        grid.push(row);
    }
    //Register neighbors for each light
    for(let i = 0; i < size; i++) {
        for(let j = 0; j < size; j++) {
            let gridLight = grid[i][j];
            //First check for valid neighbor index, then register neighbor
            if(i-1 >= 0) {gridLight.neighbors.push(grid[i-1][j]);}
            if(i+1 < size) {gridLight.neighbors.push(grid[i+1][j]);}
            if(j-1 >= 0) {gridLight.neighbors.push(grid[i][j-1]);}
            if(j+1 < size) {gridLight.neighbors.push(grid[i][j+1]);}
        }
    }
    return grid;
}

//Initializes a new game with a specified grid size,
//and embeds it into lights_out_view.html
function initializeGame(size, random) {
    //Keep track of lights on
    let lightOnCount = 0;

    Light.moveCount = 0;
    Light.moveText.nodeValue = "Moves: " + Light.moveCount;

    let moveTextDiv = document.getElementById("gameMessage")
    moveTextDiv.appendChild(Light.moveText);
    let grid = makeGrid(size);
    let gridContainer = document.getElementById("gridContainer");
    //Remove any children
    while(gridContainer.firstChild) {
        gridContainer.removeChild(gridContainer.firstChild);
    }

    for(let i = 0; i < size; i++) {
        let row = document.createElement("div");
        row.className = "row";
        for(let j = 0; j < size; j++) {
            //If randomized, we give a chance for this light to be off
            //Only increment lightsRemaining for lights that are kept lit.
            if(random && (Math.random() < 0.5)) {
                grid[i][j].switchState();
            }
            else {
                lightOnCount++;
            }
            row.appendChild(grid[i][j].box);
        }
        gridContainer.appendChild(row);
    }
    //If by chance all lights are off, pick a random one and turn it on.
    if(lightOnCount == 0) {
        let i = Math.floor(Math.random() * size);
        let j = Math.floor(Math.random() * size);
        grid[i][j].switchState();
        lightOnCount++;
    }
    Light.lightsRemaining = lightOnCount;
}

function newGame() {
    let size = document.getElementById("sizeSelect").value;
    let random = document.getElementById("randomOption").checked;
    initializeGame(size,random);
}

//Main script
initializeGame(3,false);
//End main script
