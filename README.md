# Flying Tito

A small canvas game with no build step or backend. Serve this folder locally because the JavaScript uses browser modules:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000/`. Use arrow keys or WASD to move, Space or Escape to pause, and G/H to toggle the debug grid and hitboxes.

## How the game fits together

`main.js` loads the art, runs one animation loop, and switches between title, playing, paused, and game-over screens. Starting or retrying creates a new `GameSession`, so no state or timers carry over from the last run.

The session in `src/session.js` owns score, lives, hazards, spawning, and collision checks. Entities in `src/entities.js` own movement and animation state. `src/renderer.js` only draws the current session; drawing does not advance the game. `src/input.js` tracks held keys, and `src/assets.js` loads images before Start is enabled.

The game world is 1140 × 640 pixels and scales to the browser window. Adjust speeds and world values in `src/config.js`; adjust spawn timing in `src/session.js`. Movement uses seconds rather than frames, so it stays consistent across refresh rates.
