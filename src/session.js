import { Bird, LowObstacle, Player } from './entities.js';
import { randomBetween, WORLD } from './config.js';

function overlaps(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x
        && a.y < b.y + b.height && a.y + a.height > b.y;
}

export class GameSession {
    constructor(assets) {
        this.assets = assets;
        this.player = new Player(assets);
        this.birds = [];
        this.obstacles = [];
        this.lives = 3;
        this.score = 0;
        this.elapsed = 0;
        this.distance = 0;
        this.birdSpawnIn = 1.5;
        this.obstacleSpawnIn = randomBetween(5.4, 6.4);
        this.isOver = false;
    }

    update(dt, movement) {
        if (this.isOver) return;

        this.elapsed += dt;
        this.score = Math.floor(this.elapsed + 1e-6);
        this.distance += WORLD.scrollSpeed * dt;
        this.player.update(dt, movement);

        for (const bird of this.birds) bird.update(dt);
        for (const obstacle of this.obstacles) obstacle.update(dt);
        this.birds = this.birds.filter(bird => !bird.isOffscreen);
        this.obstacles = this.obstacles.filter(obstacle => !obstacle.isOffscreen);

        this.birdSpawnIn -= dt;
        this.obstacleSpawnIn -= dt;

        if (this.birdSpawnIn <= 0) {
            this.spawnBirds();
            this.birdSpawnIn = randomBetween(2.2, 3);
        }

        if (this.obstacleSpawnIn <= 0) {
            this.obstacles.push(new LowObstacle(this.assets));
            this.obstacleSpawnIn = randomBetween(5.4, 6.4);
        }

        const playerBox = this.player.hitbox;
        const hit = this.birds.some(bird => overlaps(playerBox, bird.hitbox))
            || this.obstacles.some(obstacle => overlaps(playerBox, obstacle.hitbox));

        if (hit && this.player.takeHit()) {
            this.lives--;
            this.isOver = this.lives === 0;
        }
    }

    spawnBirds() {
        const count = Math.random() < .25 ? (Math.random() < .5 ? 2 : 3) : 1;
        const leader = new Bird(this.assets);
        this.birds.push(leader);

        for (let i = 1; i < count; i++) {
            const x = leader.x + i * (leader.width + WORLD.grid * 2);
            this.birds.push(new Bird(this.assets, x));
        }
    }
}
