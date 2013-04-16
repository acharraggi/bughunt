private var startTime : float;
private var shootTimeLeft : float;
private var shootTimeSeconds = 1;
var enemylaser : GameObject;
var laserSpeed = 0.8;
private var shootSpwnT : Transform;
var enemyDeath : GameObject;
var deathAnim : GameObject;
var canBeHit = true;
var gameMgObj : GameObject;
function Start()
{
	shootSpwnT = this.transform.Find("shootSpwn");
	gameMgObj = gameObject.Find("gameManager");
}

function Update () {
	shootTimeLeft = Time.time - startTime;
	if(shootTimeLeft >= shootTimeSeconds){
		Fire();
		startTime = Time.time;
		shootTimeLeft = 0.0;
	}
	if (deathAnim != null){
	if (!deathAnim.animation.IsPlaying("death"))
	{
		Destroy(deathAnim);
		Destroy(this.gameObject);
	}
}

}

function Fire(){
	var instLaser : GameObject = Instantiate (enemylaser, shootSpwnT.transform.position, shootSpwnT.transform.rotation);
	instLaser.rigidbody.velocity = 	transform.TransformDirection(Vector3.up*-laserSpeed);
}

function OnTriggerEnter(col : Collider) 
{
	if (canBeHit == true){
		if (col.tag == "laser")
		{
			print (col.tag);
			canBeHit = false;
			renderer.enabled = false;
			deathAnim = Instantiate(enemyDeath,transform.position, transform.rotation)as GameObject;
			deathAnim.animation["death"].speed = 2;
			var script1 = gameMgObj.transform.gameObject
				.GetComponent("gameManager");	
   		script1.playerScore +=10000;
		}
	}	
}