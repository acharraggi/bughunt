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

function Start()
{

	targetSpwnDir1 = enemyTarg1.position - enemySpwn1.position;
	targetSpwnDir2 = enemyTarg2.position - enemySpwn2.position;
	SendWave1();
	yield WaitForSeconds(5);
	SendWave2();
	yield WaitForSeconds(5);
	SendWave3();
	yield WaitForSeconds(5);
	SendWave4();
	SendWave5();
}

function Update () {
	if (respawn == true && playerLives != 0)
	{
		respawnPlayer();
	}
}

function OnGUI()
{
	GUI.Label (Rect (20, 620, 74, 85),playerLivesTxt, style);
	GUI.Label (Rect (50, 620, 50, 50),playerLives.ToString(),
		style);
	GUI.Label (Rect (250,670, 200, 50),playerScore.ToString(),
		style);
}

//function SendEnemy()
//{
//	var instantiatedProjectile : GameObject = Instantiate(enemyPrefab, enemySpwn1.transform.position, this.transform.rotation);
//	instantiatedProjectile.rigidbody.velocity = transform.TransformDirection(targetDir*enemySpeed);
//}

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