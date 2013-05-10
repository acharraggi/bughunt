var enemySpwn1 : Transform;
var enemyTarg1 : Transform;
var enemySpwn2 : Transform;
var enemyTarg2 : Transform;
var enemySpwn3 : Transform;
var enemyPrefab1 : GameObject;
var enemyPrefab2 : GameObject;
var enemyPrefab3 : GameObject;
private var enemySpeed = 0.1;
private var enemySpeed2 = 0.2;
private var enemySpawnDelay = 1.1;
private var targetSpwnDir1 : Vector3;
private var targetSpwnDir2 : Vector3;
private var laserSpeed = 0.8;
var playerObj : GameObject;
var playerSpwn : Transform;
var respawn = false;
var playerLives = 4;
private var player1 : GameObject = null;
var shield : GameObject;
var playerDeathObj : GameObject;
var playerLivesTxt : Texture2D;
var playerScore = 0;
var style : GUIStyle;
 
private var url : String     = "http://ec2-54-244-126-75.us-west-2.compute.amazonaws.com:3000/top10";
private var postUrl : String = "http://ec2-54-244-126-75.us-west-2.compute.amazonaws.com:3000/saveScore";

private var gameEnd = false;
private var gameIntro = true;
private var playerName : String = "";
private var top10 : String = "";
private var top10names : String[] = new String[10];
private var top10count = 0;
private var top10scores : String[] = new String[10];
private var scoreSaved = false;
private var roundRunning = false;
private var roundCount = 0;
private var currentWave = 0;

private var startTime : float;
private var timeLeft : float;
private var timeSeconds = 4.0;
private var timerStarted = false;

var audioIntro : GameObject;
var audioMain : GameObject;
var currentAudio : GameObject;
var audioEnemyBoom : GameObject;
var audioPlayerBoom: GameObject;

function Start()
{
	// only do once
	targetSpwnDir1 = enemyTarg1.position - enemySpwn1.position;
	targetSpwnDir2 = enemyTarg2.position - enemySpwn2.position;
	currentAudio.audio.Play();  //play intro music
	gameIntro = true;
	roundCount = 0;
	init();
}

function init() {
	enemySpeed = 0.0;
	enemySpeed2 = 0.1;
	enemySpawnDelay = 1.1;
	laserSpeed = 4.0;
	playerScore = 0;
	playerLives = 4;
	if(!gameEnd) {
		roundCount += 1;
	}
	else {
		gameEnd = false;
		roundCount = 1;
	}
	scoreSaved = false;
	respawn = false;
	roundRunning=false;

	
	top10="";
	top10count = 0;
	if (player1 == null) {
		player1 = Instantiate(playerObj,playerSpwn.transform.position,playerObj.transform.rotation) as GameObject;
	}
}

function round () {
	roundRunning = true;
	if(currentAudio != audioMain) {
    	currentAudio.audio.Stop();
    	currentAudio = audioMain;
   		currentAudio.audio.Play();
   	}
   	enemySpeed += 0.1;
	enemySpeed2 += 0.1;
	laserSpeed += 1.0;
	enemySpawnDelay = enemySpawnDelay * 0.9;

   	yield WaitForSeconds(1);
	SendWave1();
	yield WaitForSeconds(4);
	if(!gameEnd) {
	  SendWave2();
	  yield WaitForSeconds(5);
	  if(!gameEnd) {
	    SendWave3();
	    yield WaitForSeconds(3);
	    if(!gameEnd) {
	      SendWave4();
	      yield WaitForSeconds(3);
	      if(!gameEnd) {
	        SendWave5();
	        yield WaitForSeconds(3);
	        if(!gameEnd) {
	          SendWave6();
	          yield WaitForSeconds(5);
	        }
	      }
	    }
	  }
	}
	yield WaitForSeconds(5);  // allow enemy lasers to clear
	roundRunning = false;
	if (!gameEnd) {
		roundCount += 1;
	}
}

function Update () {
    if(playerLives <=0) {
    	gameEnd = true;	
    }
    else if (respawn == true)
	{
		respawnPlayer();
	}
	if(gameIntro /* || !roundRunning */ ) {
	   if(currentAudio != audioIntro) {
    	   	currentAudio.audio.Stop();
    		currentAudio = audioIntro;
    		currentAudio.audio.Play();
    	}
    }
	else if(gameEnd) {
	   	if(currentAudio != audioIntro) {
       		currentAudio.audio.Stop();
    		currentAudio = audioIntro;
   			currentAudio.audio.Play();
   		}
    }
}

function OnGUI()
{
	GUI.Label (Rect (10, 20, 74, 85),playerLivesTxt, style);
	GUI.Label (Rect (40, 20, 50, 50),playerLives.ToString(),
		style);
	GUI.Label (Rect (300,20, 100, 50),playerScore.ToString(),
		style);
	
	if (gameIntro) {
		GUI.Label (Rect (10, 150, 170, 50),"Are you ready?", style);
		GUI.Label (Rect (10, 190, 400, 50),"Use arrow keys to move, space bar to shoot.");
		if (GUI.Button(Rect(10,240,150,30),"Click to start game")) {
		    Debug.Log("Clicked the start button");
            gameIntro = false;
            StartCoroutine(round()); 
		}
	}
	else if (gameEnd) {
		GUI.Label (Rect (10, 150, 125, 50),"Game Over!", style);
		GUI.Label (Rect (10, 200, 400, 50),"Enter your name to save your score and see top ten scores:" );
		if(top10 != "") {
			GUI.TextArea (Rect (160, 50, 270, 130), top10, 300);
		}
		
		if(!scoreSaved) {
		  playerName = GUI.TextField (Rect (10, 230, 100, 20), playerName, 25);
		  if (GUI.Button(Rect(120,225,150,30),"Click to save score")) {
		    Debug.Log("Clicked the save score button with player text: "+playerName);
		    if(playerName != "") {
            	scoreSaved = true;
            	StartCoroutine(SaveScore());
            }
            else top10 = "Player name cannot be blank"; 
		 }
		}
		if(top10count > 0) {
			GUI.Label (Rect (10, 270, 200, 25),"High Scores", style);	
			for(var i = 0; i < top10count; i++) {
				GUI.Label (Rect(10,300+(30*i),200,25),top10names[i],style);
				GUI.Label (Rect(250,300+(30*i),120,25),top10scores[i],style);
			}
		}
		if(roundRunning != true) {
			if (GUI.Button(Rect(275,225,150,30),"Click to play again")) {
		    	Debug.Log("Clicked the play again button");
            	init();
            	StartCoroutine(round()); 
            }
		}
	}
	else if (!roundRunning && roundCount > 1) {
		if (!timerStarted) {
			timerStarted = true;
			startTime = Time.time;
		}
		else {
			timeLeft = Time.time - startTime;
			if(timeLeft >= timeSeconds){
				StartCoroutine(round()); 
				timerStarted = false;
			}
			GUI.Label (Rect (10, 150, 300, 50),"Next round in " + Mathf.Round(timeSeconds-timeLeft) + " seconds", style);
		}		
	}
}

function SaveScore()
{
	var postData : String = playerName+","+playerScore.ToString();
	var byteArray : byte[] = System.Text.Encoding.UTF8.GetBytes(postData);

	var www2 : WWW = new WWW (postUrl,byteArray);
	// Wait for upload of score to complete
	yield www2;
	
	if (!String.IsNullOrEmpty(www2.error)) {
		top10 = "Error accessing Bug Hunt game server to save score.\n"+www2.error;
	} 
	else {
		// Start download of the top 10 scores
    	var www : WWW = new WWW (url);
    	// Wait for download to complete
		yield www;
    	if (!String.IsNullOrEmpty(www.error)) {
			top10 = "Error accessing high score list on Bug Hunt game server.\n"+www.error;
		} 
		else {
			top10 = www.text;
//            top10 = "Mike,220000\nMMM,10000\njjj,1000\nXXg,1000\nCCC,1000\nDDD,1000\nBBB,1000\nNNN,1000\nMMM,100\nLAST,10\n";
			var top10temp = top10.Split("\n"[0]);
			top10count = top10temp.Length;
			if(top10count > 10) {
				top10count = 10;
			}
//			Debug.Log("Top10count=" + top10count);
//			Debug.Log("First Line: " + top10temp[0]); 
			for(var i=0; i< top10count; i++) {
				var top10line = top10temp[i].Split(","[0]);
//				Debug.Log("# of line elements: " +top10line.Length);
				if (top10line.Length > 1) {
//				    Debug.Log("First element: " + top10line[0]);
					top10names[i] = top10line[0];
//					Debug.Log(top10names[i]);
					top10scores[i] = top10line[1];
				}
			}
			top10 = "";
		}
	}
}

function SendWave1()
{
	currentWave = 1;
	for (var i = 0; i <= 3; i++)
	{
	  if(!gameEnd) {
		var instantiatedProjectile : GameObject = Instantiate(enemyPrefab1, enemySpwn1.transform.position, 
			this.transform.rotation);
		instantiatedProjectile.rigidbody.velocity = transform.TransformDirection(targetSpwnDir1*enemySpeed2);
		yield WaitForSeconds(enemySpawnDelay);
	  }
	}
}

function SendWave2()
{
	currentWave = 2;
	for (var i = 0; i <= 5; i++)
	{
	  if(!gameEnd) {
		var instantiatedProjectile : GameObject = Instantiate(enemyPrefab2, enemySpwn2.transform.position,
				this.transform.rotation);
		instantiatedProjectile.rigidbody.velocity = transform.TransformDirection(targetSpwnDir2*enemySpeed);
		yield WaitForSeconds(enemySpawnDelay);
	  }
	}
}

function SendWave3()
{
	currentWave = 3;
	var instantiatedProjectile : GameObject = Instantiate(enemyPrefab3, enemySpwn1.transform.position,
	 						this.transform.rotation);
	instantiatedProjectile.rigidbody.velocity = transform.TransformDirection(targetSpwnDir1*enemySpeed2);
	yield WaitForSeconds(enemySpawnDelay);
}


function SendWave4()
{
	currentWave = 4;
	for (var i = 0; i <= 7; i++)
	{
	  if(!gameEnd) {
		var instantiatedProjectile : GameObject = Instantiate (enemyPrefab2, enemySpwn2.transform.position, 						this.transform.rotation);
		instantiatedProjectile.rigidbody.velocity = transform.TransformDirection(targetSpwnDir2*enemySpeed);
		yield WaitForSeconds(enemySpawnDelay);
	  }
	}
}

function SendWave5()
{
	currentWave = 5;
	var instantiatedProjectile : GameObject = Instantiate (enemyPrefab3, enemySpwn1.transform.position, 						this.transform.rotation);
	instantiatedProjectile.rigidbody.velocity = transform.TransformDirection(targetSpwnDir1*enemySpeed2);
	yield WaitForSeconds(enemySpawnDelay);
}

function SendWave6() {
	currentWave = 6;
	for (var i = 0; i <= 5; i++) {
	 if(!gameEnd || player1 != null) { // don't create more if player destroyed
	 	 var instantiatedProjectile : GameObject = Instantiate (enemyPrefab1, enemySpwn3.transform.position, 
	 		this.transform.rotation);
		instantiatedProjectile.rigidbody.velocity = 
			 transform.TransformDirection( (player1.transform.position-enemySpwn3.position)*enemySpeed*3);
	 	yield WaitForSeconds(enemySpawnDelay);
	 }
	}
	currentWave = 6;
}

function destroyPlayer(dpos : Vector3)
{
	var player1 : GameObject = Instantiate(playerDeathObj, dpos, playerDeathObj.transform.rotation) as GameObject;
	player1.animation["death"].speed = 3.5;
	yield WaitForSeconds(0.5);
	Destroy (player1);
}

function respawnPlayer()
{
	startTime = Time.time;
	player1 = Instantiate(playerObj,playerSpwn.transform.position,playerObj.transform.rotation) as GameObject;
	var script1 = player1.transform.gameObject.GetComponent("shipController");
	script1.playerInvincible = true;
	script1.shieldOn = true;
	respawn = false;
}