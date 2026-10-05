import { SpriteAnimation } from './animation.js';
import { clamp, eitherOf, PLAYER_SPEED, randomBetween, WORLD } from './config.js';

export class Player {
    constructor(assets) {
        this.x = WORLD.grid * 8;
        this.y = WORLD.grid * 10;
        this.width = WORLD.grid * 2;
        this.height = WORLD.grid * 4;
        this.invulnerableFor = 0;
        this.animations = {
            idle: new SpriteAnimation(assets.catIdle, .07, { loop: true, pingPong: true }),
            startUp: new SpriteAnimation(assets.catStartUp, .07),
            up: new SpriteAnimation(assets.catUp, .07, { loop: true, pingPong: true }),
            stopUp: new SpriteAnimation(assets.catStopUp, .07),
            hurt: new SpriteAnimation(assets.catHurt, .07, { loop: true, pingPong: true }),
        };
        this.state = 'idle';
    }

    update(dt, movement) {
        const edge = WORLD.grid * 2;
        this.x = clamp(
            this.x + movement.x * PLAYER_SPEED.x * dt,
            edge + this.width / 2,
            WORLD.width / 2 - this.width / 2,
        );
        this.y = clamp(
            this.y + movement.y * PLAYER_SPEED.y * dt,
            edge + this.height / 2,
            WORLD.height - edge - this.height / 2,
        );

        this.invulnerableFor = Math.max(0, this.invulnerableFor - dt);
        if (this.invulnerableFor === 0) this.updateFlightState(movement.y < 0);
        this.animations[this.state].update(dt);
    }

    updateFlightState(flyingUp) {
        if (flyingUp) {
            if (this.state === 'idle' || this.state === 'stopUp' || this.state === 'hurt') {
                this.setState('startUp');
            } else if (this.state === 'startUp' && this.animations.startUp.finished) {
                this.setState('up');
            }
        } else if (this.state === 'startUp' || this.state === 'hurt') {
            this.setState('idle');
        } else if (this.state === 'up') {
            this.setState('stopUp');
        } else if (this.state === 'stopUp' && this.animations.stopUp.finished) {
            this.setState('idle');
        }
    }

    setState(state) {
        if (this.state === state) return;
        this.state = state;
        this.animations[state].reset();
    }

    takeHit() {
        if (this.invulnerableFor > 0) return false;
        this.invulnerableFor = .8;
        this.setState('hurt');
        return true;
    }

    get hitbox() {
        return {
            x: this.x - this.width / 2,
            y: this.y - this.height / 2,
            width: this.width,
            height: this.height,
        };
    }

    draw(ctx) {
        // The art extends past the smaller collision rectangle.
        ctx.drawImage(this.animations[this.state].image, this.x - 92, this.y - 80);
    }
}

export class Bird {
    constructor(assets, x = WORLD.width + 80) {
        this.x = x;
        this.y = -64;
        this.width = WORLD.grid * 4;
        this.height = WORLD.grid * 1.5;
        this.targetY = randomBetween(180, 420);
        this.velocityX = -randomBetween(480, 600);
        this.velocityY = 600;
        this.planeVelocityY = Math.random() < .5 ? -60 : 60;
        this.phase = 'dive';
        this.animations = {
            startDive: new SpriteAnimation(assets.birdStartDive, .1),
            dive: new SpriteAnimation(assets.birdDive, .07, { loop: true, pingPong: true }),
            transition: new SpriteAnimation(assets.birdTransition, .09),
            plane: new SpriteAnimation(assets.birdPlane, .07, { loop: true, pingPong: true }),
        };
        this.state = 'startDive';
    }

    update(dt) {
        this.x += this.velocityX * dt;
        this.y += this.velocityY * dt;

        if (this.phase === 'dive' && this.y >= this.targetY) {
            this.y = this.targetY;
            this.velocityY = this.planeVelocityY;
            this.phase = 'plane';
            this.setState('transition');
        }

        this.animations[this.state].update(dt);
        if (this.state === 'startDive' && this.animations.startDive.finished) {
            this.setState('dive');
        } else if (this.state === 'transition' && this.animations.transition.finished) {
            this.setState('plane');
        }
    }

    setState(state) {
        this.state = state;
        this.animations[state].reset();
    }

    get hitbox() {
        return {
            x: this.x - this.width / 2,
            y: this.y - this.height / 2,
            width: this.width,
            height: this.height,
        };
    }

    get isOffscreen() {
        return this.x + this.width / 2 < 0;
    }

    draw(ctx) {
        ctx.drawImage(this.animations[this.state].image, this.x - 72, this.y - 72)
    }
}

export class LowObstacle {
    constructor(assets) {
        this.dimensionW = 2
        this.dimensionH = eitherOf(8, 12)
        this.width = WORLD.grid * this.dimensionW
        this.height = WORLD.grid * this.dimensionH
        this.x = WORLD.width
        this.y = WORLD.height - this.height
        this.animations = {
            postHead: new SpriteAnimation(assets.postHead, .1),
            postShaft: new SpriteAnimation(assets.postShaft, .1),
        }
    }

    update(dt) {
        this.x -= WORLD.scrollSpeed * dt
    }

    get hitbox() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        }
    }

    get isOffscreen() {
        return this.x + this.width < 0
    }

    draw(ctx) {
        ctx.drawImage(this.animations['postHead'].image, this.x - 58, this.y)
        ctx.drawImage(this.animations['postShaft'].image, this.x - 57, this.y + 322)
    }
}
