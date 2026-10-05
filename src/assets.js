const imageFiles = {
    sky: 'backgrounds/bg-city-sky.png',
    mountains: 'backgrounds/bg-city-mountains.png',
    buildings: 'backgrounds/bg-city-buildings.png',
    silhouettes: 'backgrounds/bg-city-silhouettes.png',
    life: 'lives.png',
};

function frames(name, count) {
    return Array.from({ length: count }, (_, index) => `${name}-${index + 1}.png`);
}

function loadImage(file) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error(`Could not load images/${file}`));
        image.src = `images/${file}`;
    });
}

export async function loadAssets() {
    const files = {
        ...imageFiles,
        catIdle: frames('cat/cat-fly-idle', 8),
        catStartUp: frames('cat/cat-tst-up', 8),
        catUp: frames('cat/cat-fly-up', 4),
        catStopUp: frames('cat/cat-tst-upidle', 8),
        catHurt: frames('cat/cat-hurt', 4),
        birdStartDive: frames('bird/bird-dive', 4),
        birdDive: frames('bird/bird-diving', 2),
        birdTransition: frames('bird/bird-tst-diveplane', 8),
        birdPlane: frames('bird/bird-plane', 2),
        postShaft: frames('post/post-shaft', 1),
        postHead: frames('post/post-head', 1),
    };

    const entries = await Promise.all(Object.entries(files).map(async ([name, file]) => {
        const images = Array.isArray(file)
            ? await Promise.all(file.map(loadImage))
            : await loadImage(file);
        return [name, images];
    }));

    return Object.fromEntries(entries);
}
