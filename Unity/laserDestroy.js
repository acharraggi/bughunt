function Start()
{
	run();
}

function run()
{
	yield WaitForSeconds(10);
	Destroy(this.gameObject);	
}

function OnTriggerEnter(col : Collider)
{
	if (col.tag == "player")
	{
		Destroy(this.gameObject);
	}
}