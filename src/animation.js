export class SpriteAnimation {
    constructor(frames, frameTime, { loop = false, pingPong = false } = {}) {
        this.frames = frames;
        this.frameTime = frameTime;
        this.loop = loop;
        this.pingPong = pingPong;
        this.reset();
    }

    reset() {
        this.index = 0;
        this.elapsed = 0;
        this.direction = 1;
        this.finished = false;
    }

    update(dt) {
        if (this.finished) return;

        this.elapsed += dt;
        while (this.elapsed >= this.frameTime) {
            this.elapsed -= this.frameTime;

            if (this.loop && this.pingPong) {
                if (this.index === this.frames.length - 1) this.direction = -1;
                if (this.index === 0) this.direction = 1;
                this.index += this.direction;
            } else if (this.loop) {
                this.index = (this.index + 1) % this.frames.length;
            } else if (this.index < this.frames.length - 1) {
                this.index++;
            } else {
                this.finished = true;
                break;
            }
        }
    }

    get image() {
        return this.frames[this.index];
    }
}
