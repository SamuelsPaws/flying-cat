const movementKeys = ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'];

export class InputController {
    constructor(onAction) {
        this.keys = new Set();
        this.onAction = onAction;

        window.addEventListener('keydown', event => {
            const key = event.key.toLowerCase();
            if (event.target instanceof HTMLButtonElement && key === ' ') return;
            if (movementKeys.includes(key) || key === ' ') {
                event.preventDefault();
            }

            if (event.repeat) return;
            if (key === ' ' || key === 'escape') this.onAction('pause');
            else if (key === 'g') this.onAction('grid');
            else if (key === 'h') this.onAction('hitboxes');
            else if (movementKeys.includes(key)) this.keys.add(key);
        });

        window.addEventListener('keyup', event => {
            this.keys.delete(event.key.toLowerCase());
        });

        window.addEventListener('blur', () => this.clear());
    }

    clear() {
        this.keys.clear();
    }

    get movement() {
        const pressed = (...keys) => keys.some(key => this.keys.has(key));
        return {
            x: Number(pressed('arrowright', 'd')) - Number(pressed('arrowleft', 'a')),
            y: Number(pressed('arrowdown', 's')) - Number(pressed('arrowup', 'w')),
        };
    }
}
