export const WORLD = {
    width: 1140,
    height: 640,
    grid: 32,
    scrollSpeed: 180,
};

export const PLAYER_SPEED = { x: 120, y: 360 };

export function randomBetween(min, max) {
    return min + Math.random() * (max - min);
}

export function eitherOf(opt1, opt2) {
    return Math.random() < 0.5 ? opt1 : opt2
}

export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value))
}
