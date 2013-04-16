var enemySpwn1 : Transform;
var enemyTarg1 : Transform;
var enemySpwn2 : Transform;
var enemyTarg2 : Transform;
var enemyPrefab1 : GameObject;
var enemyPrefab2 : GameObject;
var enemyPrefab3 : GameObject;
var enemySpeed = 0.1;
var enemySpeed2 = 0.2;
private var targetSpwnDir1 : Vector3;
private var targetSpwnDir2 : Vector3;
var playerObj : GameObject;
var playerSpwn : Transform;
var respawn = false;
var playerLives = 4;
var script1 : Component;
var player1 : GameObject;
var shield : GameObject;
var playerDeathObj : GameObject;
var playerLivesTxt : Texture2D;
var playerScore = 0;
var style : GUIStyle;
 
private var url : String     = "http://ec2-54-244-126-75.us-west-2.compute.amazonaws.com:8080/top10";
private var postUrl : String = "http://ec2-54-244-126-75.us-west-2.compute.amazonaws.com:8080/saveScore";

private var gameEnd = false;
private var gameIntro = true;
private var playerName : String = "";
private var top10 : String = "";
private var scoreSaved = false;

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
	currentAudio.audio.Play();
	gameIntro = true;
	init();
}

function init() {
	playerScore = 0;
	playerLives = 4;
	gameEnd = false;
	scoreSaved = false;
	respawn = false;
	top10="";
	player1 = Instantiate(playerObj,playerSpwn.transform.position,playerObj.transform.rotation) as GameObject;
}

function round1 () {
	if(currentAudio != audioMain) {
    	currentAudio.audio.Stop();
    	currentAudio = audioMain;
   		currentAudio.audio.Play();
   	}
   	yield WaitForSeconds(2);
	SendWave1();
	yield WaitForSeconds(5);
	if(!gameEnd) {
	  SendWave2();
	  yield WaitForSeconds(7);
	  if(!gameEnd) {
	    SendWave3();
	    yield WaitForSeconds(7);
	    if(!gameEnd) {
	      SendWave4();
	      yield WaitForSeconds(3);
	      if(!gameEnd) {
	        SendWave5();
	        yield WaitForSeconds(15);
	        gameEnd=true;
	      }
	    }
	  }
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
	if(gameIntro) {
	   if(currentAudio != audioIntro) {
    	   	currentAudio.audio.Stop();
    		currentAudio = audioIntro;
    		currentAudio.audio.Play();
    	}
    }
	if(gameEnd) {
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
            StartCoroutine(round1()); 
		}
	}
	else if (gameEnd) {
		GUI.Label (Rect (10, 150, 125, 50),"Game Over!", style);
		GUI.Label (Rect (10, 190, 400, 50),"Enter name to save your score and see top ten scores:" );
		playerName = GUI.TextField (Rect (10, 215, 100, 20), playerName, 25);
		if(!scoreSaved) {
		 if (GUI.Button(Rect(10,240,150,30),"Click to save score")) {
		    Debug.Log("Clicked the button with text: "+playerName);
		    if(playerName != "") {
            	scoreSaved = true;
            	StartCoroutine(SaveScore());
            }
            else top10 = "Player name cannot be blank"; 
		 }
		}
		GUI.Label (Rect (10, 300, 125, 50),"High Scores", style);
		GUI.TextArea (Rect (10, 325, 200, 170), top10, 300);
		
		GUI.Label (Rect(10, 520, 300, 50),"Refresh your browser to play again.");
		/* this section needs work, player's ship gets all messed up when playing again that way
		   duplicate ship, and shields aren't attached to ships.
		if (GUI.Button(Rect(250,240,150,30),"Click to play again")) {
		    Debug.Log("Clicked the play again button");
            init();
            StartCoroutine(round1()); 
		}
		*/
	}
}

function SaveScore()
{
	var postData : String = playerName+","+playerScore.ToString();
	var byteArray : byte[] = System.Text.Encoding.UTF8.GetBytes(postData);
	var www2 : WWW = new WWW (postUrl,byteArray);
	// Wait for upload to complete
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
		}
	}
}

function SendWave1()
{
	for (var i = 0; i <= 3; i++)
	{
		var instantiatedProjectile : GameObject = Instantiate 			(enemyPrefab1, enemySpwn1.transform.position, 						this.transform.rotation);
		instantiatedProjectile.rigidbody.velocity = 							transform.TransformDirection(targetSpwnDir1*enemySpeed2);
		yield WaitForSeconds(1.0);
	}
}

function SendWave2()
{
	for (var i = 0; i <= 5; i++)
	{
		var instantiatedProjectile : GameObject = Instantiate 			(enemyPrefab2, enemySpwn2.transform.position, 						this.transform.rotation);
		instantiatedProjectile.rigidbody.velocity = 							transform.TransformDirection(targetSpwnDir2*enemySpeed);
		yield WaitForSeconds(1.0);
	}
}

function SendWave3()
{
	var instantiatedProjectile : GameObject = Instantiate 			(enemyPrefab3, enemySpwn1.transform.position, 						this.transform.rotation);
	instantiatedProjectile.rigidbody.velocity = 							transform.TransformDirection(targetSpwnDir1*enemySpeed2);
	yield WaitForSeconds(1.0);
}


function SendWave4()
{
	for (var i = 0; i <= 7; i++)
	{
		var instantiatedProjectile : GameObject = Instantiate 			(enemyPrefab2, enemySpwn2.transform.position, 						this.transform.rotation);
		instantiatedProjectile.rigidbody.velocity = 							transform.TransformDirection(targetSpwnDir2*enemySpeed);
		yield WaitForSeconds(1.0);
	}
}

function SendWave5()
{
	var instantiatedProjectile : GameObject = Instantiate 			(enemyPrefab3, enemySpwn1.transform.position, 						this.transform.rotation);
	instantiatedProjectile.rigidbody.velocity = 							transform.TransformDirection(targetSpwnDir1*enemySpeed2);
	yield WaitForSeconds(1.0);
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