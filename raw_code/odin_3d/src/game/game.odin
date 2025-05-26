package game


GameState :: struct {
	score: int,
}


Command :: enum int {
	NONE    = 0,
	CLICKED = 1,
}
