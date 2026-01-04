let colIndex=1
let rowIndex=1
let matrixRangeX = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11,12]
let matrixRangeY = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11,12]
let TimerLength=0;
let FormatCellsInLine=false;
let GameCancelled=false;
let GameScorePercent=0;
let TimeTaken=0;
let RankingList=[];
let MaxRankings=10;
let LocalStorageKey_Rankings="Rankings_1_1";
let LocalStorageKey_LastScore="LastScore_1_1";
let LocalStorageKey_LastRankedScore="LastScore_1_1";
let LocalStorageKey_WinningStreak="WinningStreakCount_1_1";
let cellsCorrect=0;
let cellsInCorrect=0;
let RankedScore=false;
let RankingItem;

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
    LoadRankingsData(LocalStorageKey_Rankings);

    hideGameControls();

    var menu_practice = document.getElementById("practice")
    menu_practice.onclick = function(event) {StartGame_PracticeMode()};

    var menu_beattheclock = document.getElementById("beattheclock")
    menu_beattheclock.onclick = function(event) {ShowGameStart_BeatTheClock()};

    var menu_rankings = document.getElementById("rankings")
    menu_rankings.onclick = function(event) {ShowGameRankings()};

    var button_menu= document.getElementById("MenuButton");
    button_menu.onclick = function(event) {ClearScreenAndShowMenu()};

    var button_shuffle= document.getElementById("ShuffleButton");
    button_shuffle.onclick = function(event) {ShuffleMatrix()};

    var button_stop= document.getElementById("StopButton");
    button_stop.onclick = function(event) {GameCancelled=true;};
    
    var button_Go= document.getElementById("gobutton");
    button_Go.onclick = function(event) {StartGame_BeatTheClock()};
    
    location.href='#modalMainMenu';
}

function ShowMenu()
{
    location.href='#modalMainMenu';
}

function setTimerVisibility(showTimer)
{
    var timerMeter = document.getElementById("timerMeter");
    var progress = document.getElementById("progress");

    if (timerMeter)
    {
        timerMeter.style.display = showTimer ? "block" : "none";
    }

    if (progress)
    {
        progress.style.width = showTimer ? "100%" : "0%";
    }
}

function ClearScreenAndShowMenu()
{
    location.href='#close';
    hideGameControls();
    ShowMenu();
}

function LoadRankingsData(localStorageKey)
{
    
    var retrievedObject = localStorage.getItem(localStorageKey);
    if (retrievedObject===null)
    {
        return false;
    }
    RankingList= JSON.parse(retrievedObject);
    return true;
}


function SaveRankingsData(localStorageKey)
{
    localStorage.setItem(localStorageKey, JSON.stringify(RankingList));
}


function ClearRankingsData(localStorageKey)
{
    localStorage.removeItem(localStorageKey);    
    RankingList =[];
}

 
function AddScoreToRankingList(RankingItem)
{
    RankingList.push(RankingItem);
}

function isRankedScore(RankingItem)
{
    // if we don't have a full ranking list then
    // just add without checking.

    if (RankingList.length<MaxRankings)
    {
        return true;
    }

    // sort the Ranked List 
    RankingList.sort(compare);

    // iterate through list and see if this score is higher than any of the scores
    for (var i = 0; i < RankingList.length; i++) 
    {
    
        var RankingItemScore=(RankingItem.Score/(RankingItem.MaxScore))*100;
        var RankingListItemScore=(RankingList[i].Score/(RankingList[i].MaxScore))*100;

        if (RankingItemScore>RankingListItemScore)
        {
            return true;
        }
    }

    // return false if not
    return false;

}

function ProcessWinningStreak()
{
    var LastScore = localStorage.getItem(LocalStorageKey_LastScore);
    var WinningStreak=localStorage.getItem(LocalStorageKey_WinningStreak);

    if (WinningStreak==null){WinningStreak=0};

    if (LastScore!=null)
    {

        if (LastScore.Score<RankingItem.Score)
        {
            // Increment the winning streak
            WinningStreak++;
        }
        else
        {
            WinningStreak=0;
        }
    }

    if (RankedScore)
    {
        localStorage.setItem(LocalStorageKey_LastRankedScore,JSON.stringify(RankingItem));
    }

    localStorage.setItem(LocalStorageKey_LastScore,JSON.stringify(RankingItem));
    localStorage.setItem(LocalStorageKey_WinningStreak,WinningStreak);
}


function ShowGameStart_BeatTheClock()
{
    location.href='#close';
    FormatCellsInLine=false;
    generateMatrixTable(matrixRangeX,matrixRangeY,FormatCellsInLine,false); 
    showGameControls(true,false);
    location.href='#GameScreen';
    ShowStatusControls(false);
    location.href='#modalGameMenu';
}

function ShowGameRankings()
{
    location.href='#close';
    
    UpdateRankingUI();

    location.href='#modalRakings';
}

function ShuffleMatrix()
{
    generateMatrixTable(matrixRangeX,matrixRangeY,FormatCellsInLine,true); 
}


function FormatTimeTaken(duration)
{
    // Hours, minutes and seconds
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    if (mins > 0) {
        ret += "" + mins + " mins. " + (secs < 10 ? "0" : "");
    }

    ret += "" + secs + " sec.";
    return ret;

}

function ShowStatusControls(GameStatus)
{
    switch (GameStatus)
    {
        case false:
        {
            screen_gamestart= document.getElementById("GameStart");
            screen_gamestatus= document.getElementById("GameStatus");
            screen_gamestart.style.display="block";
            screen_gamestatus.style.display="none";
            break;
        }

        case true:
        {
            screen_gamestart= document.getElementById("GameStart");
            screen_gamestatus= document.getElementById("GameStatus");
            button_shuffle= document.getElementById("ShuffleButton");
            screen_gamestart.style.display="none";
            screen_gamestatus.style.display="block";
            button_shuffle.style.display="none";
            break;
        }
    }
}

function CalculateGameScorePercent()
{
    var table = document.getElementById("MatrixTable");
    
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
                    col.style.backgroundColor='rgb(119,221,119)';
                    col.style.color='white';
                }
                else
                {
                    cellsInCorrect++;
                    col.style.backgroundColor='rgb(255,105,97)';
                    col.style.color='white';
                }
            }
        }  
    }

    GameScorePercent=(cellsCorrect/(cellsCorrect+cellsInCorrect))*100;
}


function GetRankingItem()
{  
    // create the Ranking Object
    var RankingItem = new Object();1
    RankingItem.forename= "lucy";
    RankingItem.surname="mantle";
    RankingItem.scoreDate=new Date();
    RankingItem.MaxScore=cellsCorrect+cellsInCorrect;
    RankingItem.Score=cellsCorrect;
    RankingItem.TimeTaken=TimeTaken;
    return RankingItem;
}

function roundedToFixed(_float, _digits){
    var rounded = Math.pow(10, _digits);
    return (Math.round(_float * rounded) / rounded).toFixed(_digits);
  }

function ClearRankings()
{
    ClearRankingsData(LocalStorageKey_Rankings);
    UpdateRankingUI();
}

function UpdateRankingUI()
{
    var _leaderBoardItemCount;
    var _divNoRankings = document.getElementById("NoRankings");
    var LastRankedItem=null;

    var retrievedObject = localStorage.getItem(LocalStorageKey_LastRankedScore);
    if (retrievedObject!==null)
    {
        LastRankedItem=JSON.parse(retrievedObject);
    }

    // Re-Load the ranking data to ensure all objects are ]
    // formatted correctly
    LoadRankingsData(LocalStorageKey_Rankings);
    
    // // hide all of the ranking items in the list
    // // we'll show item as we set them
    for (var i = 0; i < MaxRankings; i++) 
    {
        var _divRankingItem = document.getElementById("RankItem" + (i+1));

        if (_divRankingItem!=null)
        {
            _divRankingItem.style.display="none";
            _divNoRankings.style.display="none";
        }
    }

    if (RankingList.length==0)
    {
        // no rankings yet. show no rankings message
        _divNoRankings.style.display="block";
        return;
    }

    if (RankingList.length<MaxRankings)
    {
        _leaderBoardItemCount=RankingList.length
    }
    else
    {
        _leaderBoardItemCount=MaxRankings
    }

    // sort the object array by score and time
    RankingList.sort(compare);

    // loop through sorted array and update UI
    for (var i = 0; i < _leaderBoardItemCount; i++) 
    {
        // Get the Div Item related to this entry
        var _divRankingItem = document.getElementById("RankItem" + (i+1));

        if (_divRankingItem!=null)
        {
            // get and set the values for item UI
            var _divRankingItem_name = document.getElementById("item" + (i+1) + "_name");
            var _divRankingItem_score = document.getElementById("item" + (i+1) + "_score");
    
            _divRankingItem_name.innerHTML=RankingList[i].forename + " " + RankingList[i].surname;
            _divRankingItem_score.innerHTML=roundedToFixed((RankingList[i].Score/RankingList[i].MaxScore)*100,1) + "% in " + FormatTimeTaken(RankingList[i].TimeTaken);

            // if this is the last ranked item set the back colour to highight
            if (LastRankedItem!=null)
            {
                if (RankingList[i].scoreDate==LastRankedItem.scoreDate)
                {
                    _divRankingItem.style.backgroundColor="yellow";
                }
                else
                {
                    _divRankingItem.style.backgroundColor="white";
                }
            }

            // show the div
            if (i<3)
            {
                _divRankingItem.style.display="block";
            }
            else
            {
                _divRankingItem.style.display="flex";
            }
        }
    }

}

function compare( a, b ) 
{
    var _aPercent=(a.Score/(a.MaxScore))*100;
    var _bPercent=(b.Score/(b.MaxScore))*100;
    var a_TimeTaken=a.TimeTaken;
    var b_TimeTaken=b.TimeTaken;
    
    if ( _aPercent > _bPercent){
      return -1;
    }
    if ( _aPercent < _bPercent){
      return 1;
    }
    return 0;
  }

function RemoveLastRankingScore()
{
    RankingList.pop();
}

function ProcessRankings()
{
    RankingItem=GetRankingItem();

    if (isRankedScore(RankingItem)==true)
    {
        if (RankingList.length>MaxRankings)
        {
            // if we have a a full set of rankings then
            // remove the last entry.
            RemoveLastRankingScore();
        }
        
        AddScoreToRankingList(RankingItem);
        RankedScore=true;
    }
    else
    {
        RankedScore=false;
    }
}

function ShowGameStatusStatus_BeatTheClock()
{
    CalculateGameScorePercent();
    ProcessRankings();
    ProcessWinningStreak();
    SaveRankingsData(LocalStorageKey_Rankings);
    UpdateGameCompleteUI();
    showGameControls(false,true);
    ShowStatusControls(true);
    location.href='#modalGameMenu';
}

function UpdateGameCompleteUI()
{
    var GameScorePercentDiv= document.getElementById("GameComplete_Score");
    var GameCompleteRankingSubHeader=document.getElementById("GameComplete_SubHeader2");
    var GameCompleteTipsSubHeader=document.getElementById("GameComplete_SubHeader3");
    var GameCompletedHeader=document.getElementById("GameComplete_Header");

    GameScorePercentDiv.innerHTML="You scored <strong>" + roundedToFixed(GameScorePercent,1) + " %</strong> in <strong>" + FormatTimeTaken(TimeTaken) + "</strong>";
    GameCompleteTipsSubHeader.innerHTML="";


    if (RankedScore)
    {
        GameCompletedHeader.innerHTML="NICE JOB. YOU RANKED!!&nbsp;&nbsp;&nbsp;";  
        GameCompleteRankingSubHeader.innerHTML= "Check the leaderboard to see where you placed.";  
    }
    else
    {
        GameCompleteRankingSubHeader.innerHTML="Unlucky. You didnt get on the leaderboard this time...";  
    }
}


function StartGame_BeatTheClock()
{
    var div_Timer= document.getElementById("TimeSet");
    TimerLengthText=div_Timer.innerHTML;
    TimerLength=(parseFloat(TimerLengthText.replace(':','.'))*60);
    
    location.href='#close'; 
    GameCancelled=false;

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
            TimeTaken=TimerLength-distanceSecs;
            ShowGameStatusStatus_BeatTheClock();
        }
        }, 1000);
    
}

function StartGame_PracticeMode()
{
    location.href='#close';
    FormatCellsInLine=true;
    generateMatrixTable(matrixRangeX,matrixRangeY,FormatCellsInLine,false); 
    showGameControls(false,false);
    location.href='#GameScreen';
}

function showGameControls(BeatTheClockMode,CompletedGame)
{
    tableMatrix= document.getElementById("MatrixTable");
    divFooter= document.getElementById("matrixfooter");
    button_menu= document.getElementById("MenuButton");
    button_stop= document.getElementById("StopButton");
    button_shuffle= document.getElementById("ShuffleButton");
    setTimerVisibility(BeatTheClockMode);

    tableMatrix.style.visibility="visible"
    divFooter.style.visibility="visible"

    if (BeatTheClockMode){
        button_menu.style.display="none";
        button_stop.style.display="block";
        button_stop.style.float="right";
        button_shuffle.style.display="block";
    }
    else{
        button_menu.style.display="block";
        button_stop.style.display="none";
        button_menu.style.float="none";

        if (CompletedGame){
            button_shuffle.style.display="none";
        }
        else{
            button_shuffle.style.display="block";
        }
    }  
}

function hideGameControls()
{
    tableMatrix= document.getElementById("MatrixTable");
    divFooter= document.getElementById("matrixfooter");
    tableMatrix.style.visibility="hidden";
    divFooter.style.visibility="hidden";
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  } 


//
// TODO : Set Max length dynamically from matrix range
//
function generateMatrixTable(rangeX,rangeY,formatCellAnswers,randomSequence) 
{
    var table = document.querySelector("table");
    var rowNumber = 0;

    FormatCellsInLine=formatCellAnswers;

    if (randomSequence)
    {
        shuffle(rangeX);
        shuffle(rangeY);

    }
    else
    {
        rangeX.sort(function(a, b){return a - b});
        rangeY.sort(function(a, b){return a - b});
    }

    while(table.hasChildNodes())
    {
        // clear any previous table
        table.removeChild(table.firstChild);
    }

    var thead = table.createTHead();
    var row = thead.insertRow();
    var th = document.createElement("th");
    row.appendChild(th);
    th.setAttribute('class','row-header')
    
    for (var key1 of rangeX) 
    {
        var th = document.createElement("th");
            th.setAttribute('class','col-header')
            var text = document.createTextNode(key1);
            th.appendChild(text);
            row.appendChild(th);
    }

    for (var key1 of rangeY) 
    {
        rowIndex=key1
        var row = thead.insertRow();
        var th = document.createElement("th");
        th.setAttribute('class','row-header')
        var text = document.createTextNode(key1);
        th.appendChild(text);
        row.appendChild(th);

        var rowOffset = rowNumber % 2;
        rowNumber++;

        var columnPosition = 0;
        for (var key2 of rangeX) 
        {
            colIndex=key2
            var td = document.createElement("td");

            if ((columnPosition + rowOffset) % 2 === 0) {
                td.setAttribute('class','editable-cell1');
            } else {
                td.setAttribute('class','editable-cell2');
            }

            td.setAttribute('id', rowIndex + '-' + colIndex);
            td.setAttribute('contenteditable','true')
            td.setAttribute('inputmode','numeric');
            td.setAttribute('maxlength','3')
            td.onkeydown = function(event) { CellKeyDown(event);}
            row.appendChild(td);
            columnPosition++;
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
            currentCell.style.backgroundColor='rgb(119,221,119)';
            currentCell.style.color='white';
        }
        else
        {
            currentCell.style.backgroundColor='rgb(255,105,97)';
            currentCell.style.color='white';
        }

    }
}
