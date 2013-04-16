var scrollSpeed : float = 20;

function Update() {
    var offset : float = Time.time * -scrollSpeed;
    renderer.material.mainTextureOffset = Vector2 (0, offset);
}