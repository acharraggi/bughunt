enum shipState {MOVINGUP,MOVINGDOWN,MOVINGLEFT,MOVINGRIGHT,SHOOT, IDLE};
var currentState : shipState;
var speed : float;
var laser : GameObject;
var lsrSpawn1 : GameObject;
var lsrSpawn2 : GameObject;
private var initialLaserSpeed = 10;
private var fireRate : float = 0.2;
private var nextFire = 0.0;
var playerInvincible = false;
var gameMgObj : GameObject;
var shield : GameObject;
var shieldOn = false;
var guiTime : float;
var seconds : int;
var startTime : float;

function Start()
{
	gameMgObj = gameObject.Find("gameManager");	
	shield = gameObject.Find("shield");
	shield.renderer.enabled = false;
	startTime = Time.time;
}
function Update()
{
	if (shieldOn == true){
		activateShield();	

	}else{
		deActivateShield();	
	}
	
	guiTime = Time.time - startTime;
	seconds = guiTime % 60;
	print (seconds);
	if (seconds == 3){
		playerInvincible = false;
		shieldOn = false;
	}
	
	if (Input.GetKey (KeyCode.UpArrow))
	{
		if(transform.position.y < 3.75)
		{
			currentState = shipState.MOVINGUP;
			ActionShip(currentState);
		}
	}
	
	if (Input.GetKey (KeyCode.DownArrow))
	 {
	 	if (transform.position.y > -3)
	 	{
	 		currentState = shipState.MOVINGDOWN;
	 		ActionShip(currentState);
	 	}
	 }
	 
	 if (Input.GetKey (KeyCode.LeftArrow))
	 {
	 	if (transform.position.x > -2)
	 	{
			currentState = shipState.MOVINGLEFT;
			ActionShip(currentState);	
	 	}
	 }
	 
	if (Input.GetKey (KeyCode.RightArrow))
	{
		if (transform.position.x < 2)
		{
	 		currentState = shipState.MOVINGRIGHT;
	 		ActionShip(currentState);
	 	}
	}	
	 
	if (Input.GetKey (KeyCode.Space)&&Time.time > nextFire)
	{
		nextFire = Time.time + fireRate;
	 	currentState = shipState.SHOOT;
     	ActionShip(currentState);
	} 
}
function ActionShip( state : shipState )
{
	switch (state)
	{ 
		case shipState.SHOOT: 
			var cloneLaser1 : GameObject = Instantiate(laser,lsrSpawn1.transform.position,lsrSpawn1.transform.rotation) as GameObject;
			cloneLaser1.rigidbody.velocity =transform.TransformDirection(Vector3.up*initialLaserSpeed);
			var cloneLaser2 : GameObject = Instantiate(laser,lsrSpawn2.transform.position,lsrSpawn2.transform.rotation) as GameObject;
			cloneLaser2.rigidbody.velocity = transform.TransformDirection(Vector3.up*initialLaserSpeed);
     	break;
     	case shipState.MOVINGUP:   
        	transform.Translate(0,speed*Time.deltaTime,0,Space.World);    	
        break;
     	case shipState.MOVINGDOWN:    
        	transform.Translate(0,speed*-Time.deltaTime,0,Space.World);       
        break;
     	case shipState.MOVINGLEFT:    
       		transform.Translate(speed*-Time.deltaTime,0,0,Space.World);     
        break;
     	case shipState.MOVINGRIGHT: 
     		transform.Translate(speed*Time.deltaTime,0,0,Space.World);	
        break;
	}
}

function OnTriggerEnter(enemy : Collider) 
{
	if (playerInvincible == false)
{
	if (enemy.tag == "enemyLaser" || enemy.tag == "enemy"){
   	Destroy(this.gameObject);  
   	var script1 = gameMgObj.transform.gameObject.GetComponent("gameManager");	
	var pPosition = transform.position;
	script1.destroyPlayer(pPosition);
	script1.respawn = true;	
	script1.playerLives -=1;
	}
}
}

function activateShield()
{
	shield.renderer.enabled = true;	
}

function deActivateShield()
{
	shield.renderer.enabled = false;
}

