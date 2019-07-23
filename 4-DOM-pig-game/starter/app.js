/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/


//model controler of app
var modelController = (function() {
    //private methods and func goes here

    //main data structure of app
    var mainData = {
        currentScore: {
            current_0: 0,
            current_1: 0
        },

        totalScore: {
            score_0: 0,
            score_1: 0
        },

        activePlayer: 0,
        winningScore: 0
    }


    //public method & func goes here
    return {
        //access main data in publically so we can change it
        getData: function() {
            return mainData;
        },

        //update gloabl score of active player
        updateGloablScore: function() {
            //update global score
            mainData.totalScore['score_' + mainData.activePlayer] += mainData.currentScore['current_' + mainData.activePlayer];

            //set currentscore back to zero
            mainData.currentScore['current_' + mainData.activePlayer] = 0;

            //chnage acitveplayer
            mainData.activePlayer === 0 ? mainData.activePlayer = 1 : mainData.activePlayer = 0;


        }
    }
})();


// ui controller of app
var UiController = (function() {
    //private methods and func goes here


    //accessing all dom elements
    var DomStrings = {
        finalScoreInput: '.final-score',

        startBtn: '.btn-new',
        rollBtn: '.btn-roll',
        holdBtn: '.btn-hold',

        dice_1_image: 'dice-1',
        dice_2_image: 'dice-2',
        diceImageCommon: 'dice-',
        diceImageEx: '.png',
        currentScoreLabel: '#current_',

        player_0_currScore: 'current_0',
        player_1_currScore: 'current_1',

        player_0_globalScore: 'score_0',
        player_1_globalScore: 'score_1',

        player_0_panel: '.player-0-panel',
        player_1_panel: '.player-1-panel'




    }

    //random number generator (between 1 and 6)
    var randomNum = function() {
        var randomNumArr = [];
        randomNumArr[0] = Math.floor((Math.random() * 6) + 1);
        randomNumArr[1] = Math.floor((Math.random() * 6) + 1);

        return randomNumArr;
    }

    //public methods and func goes here
    return {
        //accessing dom strings into main controller via public method
        getDomstrings: function() {
            return DomStrings;
        },

        //random number generator
        randomNumGen: function() {
            return randomNum();
        },


        //getting input value
        getFinalScore: function() {
            return {
                finalScore: document.querySelector(DomStrings.finalScoreInput).value
            }
        },


        //update dice image by using random number arr
        updateDiceImage: function(arr) {
            document.getElementById(DomStrings.dice_1_image).src = DomStrings.diceImageCommon + arr[0] + DomStrings.diceImageEx;
            document.getElementById(DomStrings.dice_2_image).src = DomStrings.diceImageCommon + arr[1] + DomStrings.diceImageEx;
        },

        updateDiceScore: function(obj) {
            //update score and players ui
            document.getElementById(DomStrings.player_0_currScore).textContent = obj.currentScore.current_0;
            document.getElementById(DomStrings.player_1_currScore).textContent = obj.currentScore.current_1;


            document.getElementById(DomStrings.player_0_globalScore).textContent = obj.totalScore.score_0;
            document.getElementById(DomStrings.player_1_globalScore).textContent = obj.totalScore.score_1;
        },

        //classtoggler
        toggleClass: function() {
            document.querySelector(DomStrings.player_0_panel).classList.toggle('active');
            document.querySelector(DomStrings.player_1_panel).classList.toggle('active');
        }




    }
})();


//main app controller here
var appController = (function(mdlCtrl, uiCtrl) {
    //private methods and func here

    //accessing ui dom elements
    var appData = mdlCtrl.getData();
    var DomData = uiCtrl.getDomstrings();

    //start game event listener
    var setFinalScore = function(e) {
        var scoreValue = uiCtrl.getFinalScore();
        //chekcing final score valid or not and setting to main data
        if (scoreValue.finalScore > 0) {
            appData.winningScore = parseInt(scoreValue.finalScore);
        } else {
            alert('please enter valid score')
        }
    }

    //update data in struct
    var updateDiceRoll = function(arr) {
        if (arr[0] === 6) {
            //set player current to 0 change acitveplayer
            // setting current score to 0
            appData.currentScore['current_' + appData.activePlayer] = 0;

            //change active player
            appData.activePlayer === 0 ? appData.activePlayer = 1 : appData.activePlayer = 0;
            uiCtrl.toggleClass();
        } else {
            //update current score
            appData.currentScore['current_' + appData.activePlayer] = appData.currentScore['current_' + appData.activePlayer] + (arr[0] + arr[1]);
        }


        return appData.activePlayer;
    }


    var rollDice = function(e) {
        //1 generate 2 random numbers
        var ranNumArr = uiCtrl.randomNumGen();

        //2 update dice image using random numbers
        uiCtrl.updateDiceImage(ranNumArr);

        //3 if both numbers are 6 than change acitve player & make current score to 0 in data
        //if not 6 than total number of both will store in activeplayer current score in data
        var activePlayer = updateDiceRoll(ranNumArr)



        //get main data so we can pass it to ui
        uiCtrl.updateDiceScore(appData)
    }

    //update global score
    var updateGlobalScore = function(e) {
        //update gloabl score in data strcutre
        //change acitve player
        mdlCtrl.updateGloablScore();


        //update gloabl score in ui
        uiCtrl.updateDiceScore(appData);
        uiCtrl.toggleClass()
    }

    //setting all event listener here
    var setupEventListener = function() {
        //setting start game listener
        document.querySelector(DomData.startBtn).addEventListener('click', setFinalScore);
        document.addEventListener('keypress', function(e) {
            if (e.keyCode === 13 && e.which === 13) {
                setFinalScore();
            }
        })

        //roll button event listener
        document.querySelector(DomData.rollBtn).addEventListener('click', rollDice);

        //hold button event listerne
        document.querySelector(DomData.holdBtn).addEventListener('click', updateGlobalScore);
    }




    //public method and func here
    return {
        //app init method


        init: function() {
            //setting all things to init
            uiCtrl.updateDiceScore({
                currentScore: {
                    current_0: 0,
                    current_1: 0
                },

                totalScore: {
                    score_0: 0,
                    score_1: 0
                },

                activePlayer: 0,
                winningScore: 0
            })

            setupEventListener()
        }
    }
})(modelController, UiController)


appController.init()