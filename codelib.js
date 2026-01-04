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
let LocalStorageKey_LastRankedScore="LastRankedScore_1_1";
let LocalStorageKey_WinningStreak="WinningStreakCount_1_1";
let LocalStorageKey_Players="Players_1_0";
let LocalStorageKey_SelectedPlayer="SelectedPlayer_1_0";
let Players=[];
let SelectedPlayer=null;
let PendingPlayerImage=null;
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
    LoadPlayers();

    hideGameControls();

    var menu_practice = document.getElementById("practice")
    menu_practice.onclick = function(event) {StartGame_PracticeMode()};

    var menu_beattheclock = document.getElementById("beattheclock")
    menu_beattheclock.onclick = function(event) {ShowGameStart_BeatTheClock()};

    var menu_rankings = document.getElementById("rankings")
    menu_rankings.onclick = function(event) {ShowGameRankings()};

    var menu_clearRankings = document.getElementById("clearRankings")
    if (menu_clearRankings)
    {
        menu_clearRankings.onclick = function(event) {ClearRankings()};
    }

    var menu_clearPlayers = document.getElementById("clearPlayers")
    if (menu_clearPlayers)
    {
        menu_clearPlayers.onclick = function(event) {ClearPlayers()};
    }

    var button_selectedCreatePlayer = document.getElementById("selectedCreatePlayer");
    if (button_selectedCreatePlayer)
    {
        button_selectedCreatePlayer.onclick = function(event) {OpenCreatePlayerModal();};
    }

    var button_selectedChangePlayer = document.getElementById("selectedChangePlayer");
    if (button_selectedChangePlayer)
    {
        button_selectedChangePlayer.onclick = function(event) {OpenSelectPlayerModal();};
    }

    var button_menu= document.getElementById("MenuButton");
    button_menu.onclick = function(event) {ClearScreenAndShowMenu()};

    var button_shuffle= document.getElementById("ShuffleButton");
    button_shuffle.onclick = function(event) {ShuffleMatrix()};

    var button_stop= document.getElementById("StopButton");
    button_stop.onclick = function(event) {GameCancelled=true;};
    
    var button_Go= document.getElementById("gobutton");
    button_Go.onclick = function(event) {StartGame_BeatTheClock()};

    var button_SavePlayer= document.getElementById("savePlayer");
    button_SavePlayer.onclick = function(event) {SavePlayerFromForm()};

    var button_CancelCreatePlayer= document.getElementById("cancelCreatePlayer");
    button_CancelCreatePlayer.onclick = function(event) {ClearScreenAndShowMenu();};

    var file_PlayerImage= document.getElementById("playerImage");
    file_PlayerImage.onchange = function(event) {HandlePlayerImageSelection(event);};
    
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

function GetDefaultPlayerImage()
{
    return "linear-gradient(135deg, rgba(124, 58, 237, 0.6), rgba(34, 211, 238, 0.6))";
}

function buildBackgroundImage(imageValue)
{
    if (!imageValue)
    {
        return GetDefaultPlayerImage();
    }

    if (imageValue.startsWith("linear-gradient"))
    {
        return imageValue;
    }

    return "url('" + imageValue + "')";
}

function LoadPlayers()
{
    var storedPlayers = localStorage.getItem(LocalStorageKey_Players);
    var storedSelectedPlayer = localStorage.getItem(LocalStorageKey_SelectedPlayer);

    if (storedPlayers!==null)
    {
        Players = JSON.parse(storedPlayers);
    }

    if (storedSelectedPlayer!==null)
    {
        SelectedPlayer = Players.find(p => p.id === storedSelectedPlayer) || null;
    }

    if (!SelectedPlayer && Players.length>0)
    {
        // auto select the first player to keep menu usable
        SelectedPlayer = Players[0];
        SaveSelectedPlayer();
    }

    UpdateSelectedPlayerUI();
    UpdateMainMenuState();
}

function SavePlayers()
{
    localStorage.setItem(LocalStorageKey_Players, JSON.stringify(Players));
}

function SaveSelectedPlayer()
{
    if (SelectedPlayer)
    {
        localStorage.setItem(LocalStorageKey_SelectedPlayer, SelectedPlayer.id);
    }
    else
    {
        localStorage.removeItem(LocalStorageKey_SelectedPlayer);
    }
}

function UpdateSelectedPlayerUI()
{
    var heroImage = document.getElementById("mainmenutopimage");
    var selectedPlayerAvatar = document.getElementById("selectedPlayerAvatar");
    var selectedPlayerName = document.getElementById("selectedPlayerName");
    var gameCompletePic = document.getElementById("GameCompleteImage");
    var gameCompleteProfile = document.getElementsByClassName("GameCompleteProfilePic")[0];

    var imageValue = SelectedPlayer ? SelectedPlayer.image : null;
    var playerName = SelectedPlayer ? SelectedPlayer.name : "No player selected";

    if (heroImage)
    {
        heroImage.style.backgroundImage = "linear-gradient(120deg, rgba(124,58,237,0.6), rgba(34,211,238,0.6)), " + buildBackgroundImage(imageValue);
    }

    if (selectedPlayerAvatar)
    {
        selectedPlayerAvatar.style.backgroundImage = buildBackgroundImage(imageValue);
    }

    if (selectedPlayerName)
    {
        selectedPlayerName.innerHTML = playerName;
    }

    if (gameCompletePic)
    {
        gameCompletePic.style.backgroundImage = buildBackgroundImage(imageValue);
    }

    if (gameCompleteProfile)
    {
        gameCompleteProfile.style.backgroundImage = buildBackgroundImage(imageValue);
    }
}

function UpdateMainMenuState()
{
    var hasSelectedPlayer = SelectedPlayer!=null;
    var menu_practice = document.getElementById("practice")
    var menu_beattheclock = document.getElementById("beattheclock")
    var menu_rankings = document.getElementById("rankings")
    var menu_clearRankings = document.getElementById("clearRankings");
    var changePlayerButton = document.getElementById("selectedChangePlayer");

    [menu_practice, menu_beattheclock, menu_rankings, menu_clearRankings].forEach(function(button){
        if (button)
        {
            button.disabled=!hasSelectedPlayer;
        }
    });

    if (changePlayerButton)
    {
        changePlayerButton.disabled = !hasSelectedPlayer || Players.length<=1;
    }
}

function OpenCreatePlayerModal()
{
    PendingPlayerImage=null;
    var playerNameInput = document.getElementById("playerName");
    var playerImageInput = document.getElementById("playerImage");
    var preview = document.getElementById("playerPreview");

    if (playerNameInput)
    {
        playerNameInput.value="";
    }

    if (playerImageInput)
    {
        playerImageInput.value="";
    }

    if (preview)
    {
        preview.style.backgroundImage = GetDefaultPlayerImage();
    }

    location.href="#modalCreatePlayer";
}

function HandlePlayerImageSelection(event)
{
    var file = event.target.files[0];
    var preview = document.getElementById("playerPreview");

    if (!file)
    {
        PendingPlayerImage=null;
        if (preview)
        {
            preview.style.backgroundImage = GetDefaultPlayerImage();
        }
        return;
    }

    var reader = new FileReader();
    reader.onload = function(e) {
        PendingPlayerImage = e.target.result;
        if (preview)
        {
            preview.style.backgroundImage = buildBackgroundImage(PendingPlayerImage);
        }
    };
    reader.readAsDataURL(file);
}

function SavePlayerFromForm()
{
    var playerNameInput = document.getElementById("playerName");
    var name = playerNameInput.value.trim();

    if (name.length===0)
    {
        alert("Please add a player name.");
        return;
    }

    var newPlayer = {
        id: "player_" + new Date().getTime().toString(),
        name: name,
        image: PendingPlayerImage
    };

    Players.push(newPlayer);
    SelectedPlayer=newPlayer;
    SavePlayers();
    SaveSelectedPlayer();
    UpdateSelectedPlayerUI();
    UpdateMainMenuState();
    ClearScreenAndShowMenu();
}

function ClearPlayers()
{
    Players=[];
    SelectedPlayer=null;
    PendingPlayerImage=null;
    SavePlayers();
    SaveSelectedPlayer();
    UpdateSelectedPlayerUI();
    UpdateMainMenuState();
}

function DeletePlayer(playerId)
{
    var playerToDelete = Players.find(function(p){return p.id===playerId;});

    if (!playerToDelete)
    {
        return;
    }

    if (!confirm("Are you sure you want to delete \"" + playerToDelete.name + "\"?"))
    {
        return;
    }

    var index = Players.findIndex(function(p){return p.id===playerId;});
    var deletingSelectedPlayer = SelectedPlayer && SelectedPlayer.id===playerId;
    Players.splice(index,1);

    if (deletingSelectedPlayer)
    {
        SelectedPlayer = Players.length>0 ? Players[0] : null;
    }

    SavePlayers();
    SaveSelectedPlayer();
    UpdateSelectedPlayerUI();
    UpdateMainMenuState();
    
    if (Players.length<=1)
    {
        ClearScreenAndShowMenu();
    }
    else
    {
        renderPlayerList();
    }
}

function OpenSelectPlayerModal()
{
    if (Players.length<=1)
    {
        return;
    }

    renderPlayerList();
    location.href="#modalSelectPlayer";
}

function renderPlayerList()
{
    var listContainer = document.getElementById("playerList");

    if (!listContainer)
    {
        return;
    }

    while(listContainer.firstChild)
    {
        listContainer.removeChild(listContainer.firstChild);
    }

    if (Players.length===0)
    {
        var helper = document.createElement("p");
        helper.setAttribute("class","helper-text");
        helper.innerHTML="No players created yet. Add one to start playing.";
        listContainer.appendChild(helper);
        return;
    }

    Players.forEach(function(player){
        var button = document.createElement("button");
        button.setAttribute("class","player-select-card");
        button.setAttribute("type","button");
        button.onclick = function(){SelectedPlayer = player; SaveSelectedPlayer(); UpdateSelectedPlayerUI(); UpdateMainMenuState(); ClearScreenAndShowMenu();};

        var content = document.createElement("div");
        content.setAttribute("class","player-select-card__content");

        var avatar = document.createElement("div");
        avatar.setAttribute("class","selected-player__avatar small");
        avatar.style.backgroundImage = buildBackgroundImage(player.image);

        var name = document.createElement("div");
        name.setAttribute("class","selected-player__name");
        name.innerHTML=player.name;

        content.appendChild(avatar);
        content.appendChild(name);
        button.appendChild(content);

        var deleteButton = document.createElement("button");
        deleteButton.setAttribute("class","player-delete-button");
        deleteButton.setAttribute("type","button");
        deleteButton.setAttribute("aria-label","Delete player");
        deleteButton.innerHTML="✕";
        deleteButton.onclick = function(event){
            event.stopPropagation();
            DeletePlayer(player.id);
        };

        button.appendChild(deleteButton);

        listContainer.appendChild(button);
    });
}

function ensurePlayerSelected()
{
    if (!SelectedPlayer)
    {
        alert("Please create and select a player to continue.");
        ClearScreenAndShowMenu();
        return false;
    }

    return true;
}

function LoadRankingsData(localStorageKey)
{
    
    var retrievedObject = localStorage.getItem(localStorageKey);
    if (retrievedObject===null)
    {
        return false;
    }
    var parsedList = JSON.parse(retrievedObject);
    if (!Array.isArray(parsedList))
    {
        RankingList=[];
        return false;
    }
    RankingList= parsedList.map(function(item){
        item.playerName = item.playerName || ((item.forename || "") + " " + (item.surname || "")).trim();
        if (!item.playerName || item.playerName.trim().length===0)
        {
            item.playerName="Player";
        }
        item.playerImage = item.playerImage || null;
        return item;
    });
    return true;
}


function SaveRankingsData(localStorageKey)
{
    localStorage.setItem(localStorageKey, JSON.stringify(RankingList));
}

function GetStoredObject(storageKey)
{
    var stored = localStorage.getItem(storageKey);
    if (!stored)
    {
        return null;
    }

    try
    {
        return JSON.parse(stored);
    }
    catch
    {
        return null;
    }
}


function ClearRankingsData(localStorageKey)
{
    localStorage.removeItem(localStorageKey);    
    localStorage.removeItem(LocalStorageKey_LastScore);
    localStorage.removeItem(LocalStorageKey_LastRankedScore);
    localStorage.removeItem(LocalStorageKey_WinningStreak);
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
    var LastScore = GetStoredObject(LocalStorageKey_LastScore);
    var WinningStreak=parseInt(localStorage.getItem(LocalStorageKey_WinningStreak));

    if (isNaN(WinningStreak)){WinningStreak=0};

    if (LastScore!=null && LastScore.Score!=null)
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
    if (!ensurePlayerSelected())
    {
        return;
    }
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
    if (!ensurePlayerSelected())
    {
        return;
    }
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
    var RankingItem = new Object();
    var playerName = SelectedPlayer ? SelectedPlayer.name : "Player";
    var playerImage = SelectedPlayer ? SelectedPlayer.image : null;

    RankingItem.playerName= playerName;
    RankingItem.playerId = SelectedPlayer ? SelectedPlayer.id : null;
    RankingItem.playerImage = playerImage;
    RankingItem.scoreDate=new Date().toISOString();
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

function getRankingDisplayName(rankingItem)
{
    if (!rankingItem)
    {
        return "Player";
    }

    if (rankingItem.playerName)
    {
        return rankingItem.playerName;
    }

    var legacyName = ((rankingItem.forename || "") + " " + (rankingItem.surname || "")).trim();
    return legacyName.length>0 ? legacyName : "Player";
}

function getRankingImageValue(rankingItem)
{
    if (rankingItem && rankingItem.playerImage)
    {
        return rankingItem.playerImage;
    }
    return null;
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
            var _divRankingItem_pic = document.getElementById("item" + (i+1) + "_pic");

            _divRankingItem_name.innerHTML=getRankingDisplayName(RankingList[i]);
            _divRankingItem_score.innerHTML=roundedToFixed((RankingList[i].Score/RankingList[i].MaxScore)*100,1) + "% in " + FormatTimeTaken(RankingList[i].TimeTaken);

            if (_divRankingItem_pic)
            {
                _divRankingItem_pic.style.backgroundImage = buildBackgroundImage(getRankingImageValue(RankingList[i]));
            }

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
    var playerLabel = SelectedPlayer ? SelectedPlayer.name : "Player";

    GameScorePercentDiv.innerHTML="You scored <strong>" + roundedToFixed(GameScorePercent,1) + " %</strong> in <strong>" + FormatTimeTaken(TimeTaken) + "</strong>";
    GameCompleteTipsSubHeader.innerHTML="";


    if (RankedScore)
    {
        GameCompletedHeader.innerHTML="NICE JOB, " + playerLabel.toUpperCase() + ". YOU RANKED!!&nbsp;&nbsp;&nbsp;";  
        GameCompleteRankingSubHeader.innerHTML= "Check the leaderboard to see where you placed.";  
    }
    else
    {
        GameCompletedHeader.innerHTML="KEEP GOING, " + playerLabel.toUpperCase() + "!";
        GameCompleteRankingSubHeader.innerHTML="Unlucky. You didnt get on the leaderboard this time...";  
    }
}


function StartGame_BeatTheClock()
{
    if (!ensurePlayerSelected())
    {
        return;
    }
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
    if (!ensurePlayerSelected())
    {
        return;
    }
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
