import { WORLD } from './config.js';

export class Renderer {
    constructor(ctx, assets) {
        this.ctx = ctx;
        this.assets = assets;
    }

    render(session, debug) {
        const ctx = this.ctx
        ctx.clearRect(0, 0, WORLD.width, WORLD.height)

        this.drawBackground(this.assets.sky, session.distance / 3)
        this.drawBackground(this.assets.mountains, session.distance * 2 / 3)
        this.drawBackground(this.assets.silhouettes, session.distance * 2.5 / 3)
        this.drawBackground(this.assets.buildings, session.distance * 2.75 / 3)

        for (const obstacle of session.obstacles) obstacle.draw(ctx)
        for (const bird of session.birds) bird.draw(ctx)
        session.player.draw(ctx)

        if (debug.hitboxes) {
            this.drawHitbox(session.player.hitbox, '#e22424');
            for (const bird of session.birds) this.drawHitbox(bird.hitbox, '#da27d7');
            for (const obstacle of session.obstacles) this.drawHitbox(obstacle.hitbox, '#253ac4');
        }
        if (debug.grid) this.drawGrid();

        for (let i = 0; i < session.lives; i++) {
            ctx.drawImage(this.assets.life, WORLD.grid + i * 48, WORLD.grid);
        }
        ctx.fillStyle = '#18372c';
        ctx.font = 'bold 36px system-ui, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`SCORE: ${session.score}`, WORLD.width - WORLD.grid, WORLD.grid * 2);
        ctx.textAlign = 'left';
    }

    drawBackground(image, distance) {
        const x = -(distance % WORLD.width);
        this.ctx.drawImage(image, x, 0, WORLD.width, WORLD.height);
        this.ctx.drawImage(image, x + WORLD.width, 0, WORLD.width, WORLD.height);
    }

    drawHitbox(box, color) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(box.x, box.y, box.width, box.height);
    }

    drawGrid() {
        const ctx = this.ctx;
        ctx.strokeStyle = 'rgb(255 255 255 / 65%)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = WORLD.grid; x < WORLD.width; x += WORLD.grid) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, WORLD.height);
        }
        for (let y = WORLD.grid; y < WORLD.height; y += WORLD.grid) {
            ctx.moveTo(0, y);
            ctx.lineTo(WORLD.width, y);
        }
        ctx.stroke();
    }
}
