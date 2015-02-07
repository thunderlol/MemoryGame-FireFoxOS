var POINT_GAME = 10; //quanto vale cada par encontrado
var TOTAL_CORRECT = 10; //numero total de pares que podem ser encontrados
var time = 0;
var tread_time = null;
function ScoreBoardGameControl (){ 
    
    var nivelAtual = "Fácil";
    var score = 0;//pontuação do jogo
    var corrects = 0;  //total de pares encontrados até o momento
	//Função que atualiza os pontos
	this.updateScore =  function (difference){
		var scoreDiv = document.getElementById("score");
//		scoreDiv.innerHTML =  score;
//		
//              Animação para 'contar' os pontos
                animScore(scoreDiv, difference, score);
	}

	//Tota vez que é encontrado um par, o incrementScore é chamado
	this.incrementScore =  function (){
		corrects++;
		score+= POINT_GAME;
		if (corrects ==  TOTAL_CORRECT){
						pauseTimer();
                        var message_final = document.getElementById('final');
                        var message_finalscore = document.getElementById("final_score");
						var message_finaltime = document.getElementById("final_time");
                        message_final.setAttribute('class', 'show');
                        animScore(message_finalscore, "final", score );
						message_finaltime.innerHTML = convertTime(time);
		}
	}

	//decremento como punição por ter errado, tirar isso depois
	this.decrementScore =  function (){
		score-= parseInt(POINT_GAME / 2);
	}
}

function Card(picture){
	var FOLDER_IMAGES = 'resources/'
	var IMAGE_QUESTION  = "question.png"
	this.picture = picture;
	this.visible = false;
	this.block = false;

	this.equals =  function (cardGame){
		if (this.picture.valueOf() == cardGame.picture.valueOf()){
			return true;
		}
		return false;
	}
	this.getPathCardImage =  function(){
		return FOLDER_IMAGES+picture;
	}
	this.getQuestionImage =  function(){
		return FOLDER_IMAGES+IMAGE_QUESTION;
	}
}

function ControllerLogicGame(){
	var firstSelected;
	var secondSelected;
	var block = false;
	var TIME_SLEEP_BETWEEN_INTERVAL = 1000;
	var eventController = this;

	this.addEventListener =  function (eventName, callback){
		eventController[eventName] = callback;
	};

	this.doLogicGame =  function (card,callback){
		if (!card.block && !block) {
			if (firstSelected == null){
				firstSelected = card;
				card.visible = true;
			}else if (secondSelected == null && firstSelected != card){
				secondSelected = card;
				card.visible = true;
			}

			if (firstSelected != null && secondSelected != null){
				block = true;
				var timer = setInterval(function(){
					if (secondSelected.equals(firstSelected)){
						firstSelected.block = true;
						secondSelected.block = true;
						eventController["correct"](); 
					}else{
						firstSelected.visible  = false;
						secondSelected.visible  = false;
						eventController["wrong"]();
					}        				  		
					firstSelected = null;
					secondSelected = null;
					clearInterval(timer);
					block = false;
					eventController["show"]();
				},TIME_SLEEP_BETWEEN_INTERVAL);
			} 
			eventController["show"]();
		};
	};

}

function CardGame (cards , controllerLogicGame,scoreBoard){
	var LINES = 4;
	var COLS  = 5;
	this.cards = cards;
	var logicGame = controllerLogicGame;
	var scoreBoardGameControl = scoreBoard;

	this.clear = function (){
		var game = document.getElementById("game");
		game.innerHTML = '';
	}

	this.show =  function (){
		this.clear();
		scoreBoardGameControl.updateScore(0);
		var cardCount = 0;
		var game = document.getElementById("game");
		for(var i = 0 ; i < LINES; i++){
			for(var j = 0 ; j < COLS; j++){
				card = cards[cardCount++];
				var cardImage = document.createElement("img");
				if (card.visible){
					cardImage.setAttribute("src",card.getPathCardImage());
                    cardImage.setAttribute("height",50);
                    cardImage.setAttribute("width",50);
				}else{
					cardImage.setAttribute("src",card.getQuestionImage());
                    cardImage.setAttribute("height",50);
                    cardImage.setAttribute("width",50);
				}
				cardImage.onclick =  (function(position,cardGame) {
					return function() {
						card = cards[position];
						var callback =  function (){
							cardGame.show();
						};
						logicGame.addEventListener("correct",function (){
							scoreBoardGameControl.incrementScore();
							scoreBoardGameControl.updateScore(1);
						});
						logicGame.addEventListener("wrong",function (){
							scoreBoardGameControl.decrementScore();
							scoreBoardGameControl.updateScore(-1);
						});

						logicGame.addEventListener("show",function (){
							cardGame.show();
						});

						logicGame.doLogicGame(card);
						
					};
				})(cardCount-1,this);

				game.appendChild(cardImage);
			}
			var br = document.createElement("br");
			game.appendChild(br);
		}
	}
}

function BuilderCardGame(nivel){
	var time = 0;
	if(nivel=="Fácil"){
        var pictures = new Array ('e10.png','e10.png',
		'e1.png','e1.png',
		'e2.png','e2.png',
		'e3.png','e3.png',
		'e4.png','e4.png',
		'e5.png','e5.png',
		'e6.png','e6.png',
		'e7.png','e7.png',
		'e8.png','e8.png',
		'e9.png','e9.png');
    }else if(nivel=="Médio"){
        var pictures = new Array ('10.png','10.png',
		'1.png','1.png',
		'2.png','2.png',
		'3.png','3.png',
		'4.png','4.png',
		'5.png','5.png',
		'6.png','6.png',
		'7.png','7.png',
		'8.png','8.png',
		'9.png','9.png');            
    }else{
        var pictures = new Array (
		'10d.png','10d.png',
		'1d.png','1d.png',
		'2d.png','2d.png',
		'3d.png','3d.png',
		'4d.png','4d.png',
		'5d.png','5d.png',
		'6d.png','6d.png',
		'7d.png','7d.png',
		'8d.png','8d.png',
		'9d.png','9d.png');            
    }
    

	this.doCardGame =  function (){
		shufflePictures();
		cards  = buildCardGame();
		cardGame =  new CardGame(cards, new ControllerLogicGame(), new ScoreBoardGameControl())
		cardGame.clear();
		return cardGame;
	}

	var shufflePictures = function(){
		var i = pictures.length, j, tempi, tempj;
		if ( i == 0 ) 
			return false;
		while ( --i ) {
			j = Math.floor( Math.random() * ( i + 1 ) );
			tempi = pictures[i];
			tempj = pictures[j];
			pictures[i] = tempj;
			pictures[j] = tempi;
		}
	}

	var buildCardGame =  function (){
		var countCards = 0;
		cards =  new Array();
		for (var i = pictures.length - 1; i >= 0; i--) {
			card =  new Card(pictures[i]);
			cards[countCards++] = card;
		};
		return cards;
	}
}

function GameControl (){

}

GameControl.createGame = function(nivel){
	killTimer();
    nivelAtual=nivel;
	var builderCardGame =  new BuilderCardGame(nivelAtual);
	tread_time = setInterval(function(){
        time++;
		timer.innerHTML = convertTime(time);
    }, 1000);
	cardGame = builderCardGame.doCardGame();
	cardGame.show();
        var message_final = document.getElementById('final');
        var message_finalscore = document.getElementById("final_score");
        message_finalscore.innerHTML =  '0';
        message_final.setAttribute('class', '');
        var object = document.getElementsByClassName('init');
        object[0].setAttribute('class','init hidden');
}


//FUNÇÕES DESIGN
function animScore(element, difference, score){
    var count_anim = 0;
    var points = POINT_GAME;
    if(difference < 0){
        points = parseInt(POINT_GAME/2);
    }
	if(difference == "final"){
        count_anim = score * (-1);
    }else{
        count_anim = (points *(difference)) * (-1);
    }

    var anim = setInterval(function(){
        if(count_anim > 0){
            count_anim --;
        }else if(count_anim < 0){
            count_anim ++;
        }
        element.innerHTML =  (score + count_anim);
        if(count_anim == 0){
            clearInterval(anim);
        }
    }, 30);
}
function back_button(){
        var object = document.getElementsByClassName('init');
        object[0].setAttribute('class','init');
		pauseTimer();
}
function killTimer(){
	time = 0;
	if(tread_time != null && tread_time != undefined){
		clearInterval(tread_time);
	}
	timer.innerHTML = "00:00";
}
function pauseTimer(){
	if(tread_time != null && tread_time != undefined){
		clearInterval(tread_time);
	}
}
function convertTime(time){
	var min = parseInt(time/60);
		var seg = parseInt(time-(min*60))
		if(min < 10){
			min =  "0"+min;
		}
		if(seg < 10){
			seg =  "0"+seg;
		}
		return (min)+":"+(seg);
}