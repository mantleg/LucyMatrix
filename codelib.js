let colIndex=1
let rowIndex=1
let matrixRange = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11,12]
let TimerLength=0;
let FormatCellsInLine=false;
let GameCancelled=false;
let GameScore=0;
let TimeLeft=0;


settings = {
    maxLen: 3, 
  }
  
  keys = {
    'backspace': 8,
    'shift': 16,
    'ctrl': 17,
    'alt': 18,
    'delete': 46,
    // 'cmd':
    'leftArrow': 37,
    'upArrow': 38,
    'rightArrow': 39,
    'downArrow': 40,
  }
  
  utils = {
    numbers: {},
    special: {},
    navigational: {},
    isSpecial(e) {
      return typeof this.special[e] !== 'undefined';
    },
    isNavigational(e) {
      return typeof this.navigational[e.keyCode] !== 'undefined';
    },
    isNumber(e) {
        return typeof this.numbers[e] !== 'undefined';
    },
    isBackSpace(e) {
            return typeof this.numbers[e] == keys['backspace'];
    }
  }
  
  utils.special[keys['backspace']] = true;
  utils.special[keys['shift']] = true;
  utils.special[keys['ctrl']] = true;
  utils.special[keys['alt']] = true;
  utils.special[keys['delete']] = true;
  
  utils.navigational[keys['upArrow']] = true;
  utils.navigational[keys['downArrow']] = true;
  utils.navigational[keys['leftArrow']] = true;
  utils.navigational[keys['rightArrow']] = true;

  utils.numbers[0] = true;
  utils.numbers[1] = true;
  utils.numbers[2] = true;
  utils.numbers[3] = true;
  utils.numbers[4] = true;
  utils.numbers[5] = true;
  utils.numbers[6] = true;
  utils.numbers[7] = true;
  utils.numbers[8] = true;
  utils.numbers[9] = true;

Initialize();


function Initialize()
{
    hideGameControls();

    var menu_practice = document.getElementById("practice")
    menu_practice.onclick = function(event) {StartGame_PracticeMode()};

    var menu_beattheclock = document.getElementById("beattheclock")
    menu_beattheclock.onclick = function(event) {ShowGameStart_BeatTheClock()};

    var button_menu= document.getElementById("MenuButton");
    button_menu.onclick = function(event) {ShowMenu()};

    var button_stop= document.getElementById("StopButton");
    button_stop.onclick = function(event) {GameCancelled=true;};
    
    var button_Go= document.getElementById("gobutton");
    button_Go.onclick = function(event) {StartGame_BeatTheClock()};
    
    location.href='#openModal';
}

function ShowMenu()
{
    location.href='#openModal';
}

function ShowGameStart_BeatTheClock()
{
    location.href='#close';
    generateMatrixTable(matrixRange,false); 
    showGameControls(true);
    location.href='#GameScreen';
    ShowStatusControls(false);
    location.href='#inGameStatus';
}

function ShowStatusControls(GameComplete)
{
    switch (GameComplete)
    {
        case false:
        {
            screen_gamestart= document.getElementById("GameStart");
            screen_gamestatus= document.getElementById("GameStatus");
            screen_gamestart.style.visibility="visible";
            screen_gamestatus.style.visibility="hidden";

            break;
        }

        case true:
        {
            screen_gamestart= document.getElementById("GameStart");
            screen_gamestatus= document.getElementById("GameStatus");
            screen_gamestart.style.visibility="hidden";
            screen_gamestatus.style.visibility="visible";
            break;
        }
    }
}

function CalculateGameScore()
{
    var table = document.getElementById("MatrixTable");
    var cellsCorrect=0;
    var cellsInCorrect=0;
    
    for (var i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        for (var j = 0, col; col = row.cells[j]; j++) {
            
            if ((col.className=='editable-cell2')|| col.className=='editable-cell1')
            {
                var matrixValue=GetMatrixValueFromCell(col.id);

                if (matrixValue==col.innerHTML)
                {
                    cellsCorrect++;
                    col.style.backgroundColor='green';
                    col.style.color='white';
                }
                else
                {
                    cellsInCorrect++;
                    col.style.backgroundColor='red';
                    col.style.color='white';
                }
            }
        }  
    }

    GameScore=(cellsCorrect/(cellsCorrect+cellsInCorrect))*100;
}

function ShowGameCompleteStatus_BeatTheClock()
{
    //location.href='#inGameStatus';
    //ShowStatusControls(true);
    CalculateGameScore();
    showGameControls(false);
    var gameScoreDiv= document.getElementById("GameScore");
    gameScoreDiv.innerHTML="You scored <strong>" + Math.round(GameScore) + "%</strong> with <strong>" + Math.round(TimeLeft) + "</strong> seconds left";
    location.href='#GameScore';
}

function StartGame_BeatTheClock()
{
    location.href='#close'; 
    GameCancelled=false;

    TimerLength=300;

    // Set the date we're counting down to
    var countDownDate = new Date();
    countDownDate.setSeconds( countDownDate.getSeconds() + TimerLength);

    // Update the count down every 1 second
    var x = setInterval(function() {

        // Get today's date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distanceSecs = (countDownDate - now) / 1000;

        //Update the progress UI with the % of time complete
        var progress = document.getElementById("progress");
        var progressValue=(distanceSecs/TimerLength)* 100;

        // console.debug(distanceSecs);
        // console.debug(TimerLength);
        // console.debug(progressValue);
        progress.style.width= progressValue + "%";


        // If the count down is finished, write some text
        if (distanceSecs< 0 || GameCancelled) {
            clearInterval(x);
            TimeLeft=distanceSecs;
            ShowGameCompleteStatus_BeatTheClock();
        }
        }, 1000);
    
}

function StartGame_PracticeMode()
{
    location.href='#close';
    generateMatrixTable(matrixRange,true); 
    showGameControls(false);
    location.href='#GameScreen';
}

function showGameControls(BeatTheClockMode)
{
    tableMatrix= document.getElementById("MatrixTable");
    divFooter= document.getElementById("matrixfooter");
    button_menu= document.getElementById("MenuButton");
    button_stop= document.getElementById("StopButton");

    tableMatrix.style.visibility="visible"
    divFooter.style.visibility="visible"

    if (BeatTheClockMode){
        button_menu.style.visibility="hidden";
        button_stop.style.visibility="visible";
    }
    else{
        button_menu.style.visibility="visible";
        button_stop.style.visibility="hidden";
    }    
}

function hideGameControls()
{
    tableMatrix= document.getElementById("MatrixTable");
    divFooter= document.getElementById("matrixfooter");
    tableMatrix.style.visibility="hidden";
    divFooter.style.visibility="hidden";
    
}
//
// TODO : Set Max length dynamically from matrix range
//
function generateMatrixTable(range,formatCellAnswers) 
{
    var table = document.querySelector("table");

    FormatCellsInLine=formatCellAnswers;

    while(table.hasChildNodes())
    {
        // clear any previous table
        table.removeChild(table.firstChild);
    }

    var thead = table.createTHead();
    var row = thead.insertRow();
    var offset=0;

    var th = document.createElement("th");
    row.appendChild(th);
    th.setAttribute('class','row-header')
    
    for (var key1 of range) 
    {
        var th = document.createElement("th");
            th.setAttribute('class','col-header')
            var text = document.createTextNode(key1);
            th.appendChild(text);
            row.appendChild(th);
    }

    for (var key1 of range) 
    {
        rowIndex=key1
        var row = thead.insertRow();
        var th = document.createElement("th");
        th.setAttribute('class','row-header')
        var text = document.createTextNode(key1);
        th.appendChild(text);
        row.appendChild(th);

        if (offset==0) {
            {offset=1};
        }   
        else if (offset==1){
            {offset=0}
        }

        for (var key2 of range) 
        {
            colIndex=key2
            var td = document.createElement("td");

            if (key2%2==offset)
                td.setAttribute('class','editable-cell1')
            else
                td.setAttribute('class','editable-cell2')

            td.setAttribute('id', rowIndex + '-' + colIndex);
            td.setAttribute('contenteditable','true')
            td.setAttribute('inputmode','numeric');
            td.setAttribute('maxlength','3')
            td.onkeydown = function(event) { CellKeyDown(event);}
            row.appendChild(td);
        }
    }
}


function GetMatrixValueFromCell(cellID)
{
    var res = cellID.split("-");
    var value=parseInt(res[0]) * parseInt(res[1]) 
    return value;
}


function GetColourFromCellClass(ClassName)
{
    switch (ClassName)
    {
        case "editable-cell1":
        {
            return "rgb(226, 225, 225)";
            break;
        }
        case "editable-cell2":
        {
            return "rgb(240, 236, 230)";
            break;
        }
    }
}

function CellKeyDown(e1)
{
    if (CheckCellMaxLenght(e1))
    {
        if (FormatCellsInLine){
            formatCell(e1);
        }
    }   
}

function CheckCellMaxLenght(e1)
{
    var cellText=e1.target.innerText.trim();
    var len = cellText.length;
    var IncomingKeyCode=e1.which;
    var IncomingKeyValue=String.fromCharCode(IncomingKeyCode);
    
    isNumber = utils.isNumber(IncomingKeyValue);
    isSpecial = utils.isSpecial(IncomingKeyCode);

    //alert(isSpecial);
    //alert(isNumber);

    if (isSpecial){
        return true;
    }

    if (!isNumber)
    {
        e1.preventDefault();
        return false;
    }

    if (len >= settings.maxLen) {
        e1.preventDefault();
        return false;
    }

    return true;
    
}

function formatCell(e1)
{
    currentCell= e1.srcElement
    var IncomingKeyCode=e1.which;
    var IncomingKeyValue=String.fromCharCode(IncomingKeyCode);
    var CurrentValue=currentCell.innerHTML;
    var newValuePreview;
    var isBackSpace;

    isSpecial = utils.isSpecial(IncomingKeyCode);

    if (isSpecial)
    {
        //if (utils.isBackSpace(IncomingKeyCode)&&CurrentValue.length>0)
        //{
            newValuePreview=CurrentValue.slice(0, -1); 
        //}       
    }
    else
    {
        newValuePreview=CurrentValue+IncomingKeyValue;
    }

    // add logic to detect the cell being cleared down
    if (newValuePreview.length==0)
    {
        currentCell.style.backgroundColor=GetColourFromCellClass(currentCell.className);
        currentCell.style.color="Black";
    }
    else
    {
        var matrixValue=GetMatrixValueFromCell(currentCell.id);

        //alert(matrixValue + "\n" + newValuePreview);

        
        if ((newValuePreview.toString().length)<matrixValue.toString().length)
        {
            // don't bother formatting cell until we have at least the same number
            // of chars as the result
            return
        }

        if (matrixValue==parseInt(newValuePreview))
        {
            currentCell.style.backgroundColor='green';
            currentCell.style.color='white';
        }
        else
        {
            currentCell.style.backgroundColor='red';
            currentCell.style.color='white';
        }

    }
}

