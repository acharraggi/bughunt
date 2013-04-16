function Start()
{
	run();
}

function run()
{
	yield WaitForSeconds(15);
	Destroy(this.gameObject);	
}

function OnTriggerEnter(col : Collider)
{
	if (col.tag == "enemy")
	{
		Destroy(this.gameObject);
	}
}