import { loadAssets } from './src/assets.js';
import { WORLD } from './src/config.js';
import { InputController } from './src/input.js';
import { Renderer } from './src/renderer.js';
import { GameSession } from './src/session.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const screens = {
    title: document.getElementById('title-screen'),
    paused: document.getElementById('pause-screen'),
    gameOver: document.getElementById('game-over-screen'),
};
const devtools = document.getElementById('devtools');
const gridButton = document.getElementById('toggle-grid-btn');
const hitboxesButton = document.getElementById('toggle-hitboxes-btn');

function resizeCanvas() {
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(WORLD.width * scale);
    canvas.height = Math.round(WORLD.height * scale);
    ctx.setTransform(canvas.width / WORLD.width, 0, 0, canvas.height / WORLD.height, 0, 0);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Game {
    constructor(assets) {
        this.session = new GameSession(assets);
        this.renderer = new Renderer(ctx, assets);
        this.input = new InputController(action => this.handleAction(action));
        this.state = 'title';
        this.debug = { grid: false, hitboxes: false };
        this.lastFrame = null;
        this.frame = this.frame.bind(this);
        requestAnimationFrame(this.frame);

        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.state === 'playing') this.setState('paused');
        });
        window.addEventListener('blur', () => {
            if (this.state === 'playing') this.setState('paused');
        });
    }

    start() {
        this.session = new GameSession(this.session.assets);
        this.input.clear();
        this.setState('playing');
    }

    setState(state) {
        this.state = state;
        this.lastFrame = null;
        for (const [name, screen] of Object.entries(screens)) {
            screen.hidden = name !== state;
        }
        devtools.hidden = state !== 'playing';
        if (state === 'playing' && document.activeElement instanceof HTMLButtonElement) {
            document.activeElement.blur();
        }
        if (state === 'gameOver') {
            document.getElementById('final-score').textContent = this.session.score;
        }
    }

    handleAction(action) {
        if (action === 'pause') {
            if (this.state === 'playing') this.setState('paused');
            else if (this.state === 'paused') this.setState('playing');
        } else if (action === 'grid' || action === 'hitboxes') {
            this.debug[action] = !this.debug[action];
            const button = action === 'grid' ? gridButton : hitboxesButton;
            button.setAttribute('aria-pressed', String(this.debug[action]));
        }
    }

    frame(time) {
        const dt = this.lastFrame === null ? 0 : Math.min((time - this.lastFrame) / 1000, .25);
        this.lastFrame = time;

        if (this.state === 'playing') {
            // Keep collision steps small even when the browser delays a frame.
            let remaining = dt;
            while (remaining > 0.000001 && !this.session.isOver) {
                const step = Math.min(remaining, 1 / 60);
                this.session.update(step, this.input.movement);
                remaining -= step;
            }
            if (this.session.isOver) this.setState('gameOver');
        }

        this.renderer.render(this.session, this.debug);
        requestAnimationFrame(this.frame);
    }
}

async function boot() {
    const startButton = document.getElementById('start-btn');
    const loadingStatus = document.getElementById('loading-status');

    try {
        const assets = await loadAssets();
        const game = new Game(assets);

        loadingStatus.hidden = true;
        startButton.disabled = false;
        startButton.addEventListener('click', () => game.start());
        document.getElementById('resume-btn').addEventListener('click', () => game.setState('playing'));
        document.getElementById('retry-btn').addEventListener('click', () => game.start());
        gridButton.addEventListener('click', () => game.handleAction('grid'));
        hitboxesButton.addEventListener('click', () => game.handleAction('hitboxes'));
    } catch (error) {
        console.error(error);
        loadingStatus.textContent = 'Could not load the game. Please refresh to try again.';
    }
}

boot();
