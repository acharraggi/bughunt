var speed : float;

function Update ()
{
	var move : float = speed * Time.deltaTime;
	transform.Translate(Vector3.down * move, Space.World);
	if (transform.position.y < -17.1)
	{
		transform.position = Vector3(transform.position.x, 19.154, transform.position.z);
	}
}