import { Entry } from './types';

const worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });

worker.postMessage('https://raw.githubusercontent.com/json-iterator/test-data/refs/heads/master/large-file.json');

worker.onmessage = (event: MessageEvent<Entry[] | { error: string }>) => {
    const data = event.data;
    const result = document.getElementById('data');

    if (!result) return;

    result.innerHTML = '';

    if ('error' in data) {
        console.log('error', data.error)
        return;
    }

    data.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = `Name: ${item.name || 'Not Available'}, Email: ${item.email || 'Not Available'}`;
        result.appendChild(li);
    });
};

const spinnerJS = document.querySelector('.spinner-js');
if (spinnerJS) {
    const spinner = spinnerJS as HTMLElement;
    let angle = 0;

    function animate() {
        angle = (angle + 1) % 360;
        spinner.style.transform = `rotate(${angle}deg)`;
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}