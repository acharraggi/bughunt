private var startTime : float;
private var shootTimeLeft : float;
private var shootTimeSeconds = 1;
var enemylaser : GameObject;
private var shootSpwnT : Transform;
var enemyDeath : GameObject;
var deathAnim : GameObject;
private var canBeHit = true;
var gameMgObj : GameObject;
private var laserSpeed = 0.8;
private var currentWave = 0;

function Start()
{
	shootSpwnT = this.transform.Find("shootSpwn");
	gameMgObj = gameObject.Find("gameManager");
	var script1 = gameMgObj.transform.gameObject.GetComponent("gameManager");	
	laserSpeed = script1.laserSpeed;
	currentWave = script1.currentWave;
}

function Update () {
    if(transform.position.x < -6 || transform.position.x > 6 || transform.position.y < -5) {
    	Destroy(this.gameObject);  // we've moved off screen
    }
	if (deathAnim != null){
	 if (!deathAnim.animation.IsPlaying("death"))
	 {
		Destroy(deathAnim);
		Destroy(this.gameObject);
	 }
	}
	else {
		shootTimeLeft = Time.time - startTime;
		if(shootTimeLeft >= shootTimeSeconds){
			Fire();
			startTime = Time.time;
			shootTimeLeft = 0.0;
		}
	} 
}

function Fire(){
	var instLaser : GameObject = Instantiate (enemylaser, shootSpwnT.transform.position, shootSpwnT.transform.rotation);
	instLaser.rigidbody.velocity = 	transform.TransformDirection(Vector3.up*-laserSpeed);
}

function OnTriggerEnter(col : Collider) 
{
//	if(col.tag == "enemyTarget") {  // reached end of path off screen
//		Destroy(this.gameObject);
//	}
//	else
	if (canBeHit == true){
		if (col.tag == "laser")
		{
//			print (col.tag);
			canBeHit = false;
			renderer.enabled = false;
			deathAnim = Instantiate(enemyDeath,transform.position, transform.rotation)as GameObject;
			deathAnim.animation["death"].speed = 2;
			var script1 = gameMgObj.transform.gameObject.GetComponent("gameManager");	
   			script1.playerScore +=10000;
   			script1.audioEnemyBoom.audio.Play();  // enemy explosion sound
		}
	}	
	
}