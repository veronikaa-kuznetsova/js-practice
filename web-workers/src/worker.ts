import { Entry } from './types';

declare const self: Worker;

self.onmessage = async (event: MessageEvent<string>) => {
    const url = event.data;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Status: ${response.status}`)
        }

        const text = await response.text();
        const data = JSON.parse(text);
        const results = collectEmailsAndNames(data);
        self.postMessage(results);
    } catch (error) {
        const errorMessage = error instanceof Error
            ? error.message
            : 'Error';
        self.postMessage({ error: errorMessage });
    }
};

function collectEmailsAndNames(obj: any, result: Entry[] = []): Entry[] {
    if (typeof obj !== 'object' || obj === null) return result;

    if (Array.isArray(obj)) {
        obj.forEach(item => collectEmailsAndNames(item, result));
        return result;
    }

    const entry: Entry = {};
    if ('email' in obj) entry.email = obj.email;
    if ('name' in obj) entry.name = obj.name;
    if (entry.email || entry.name) result.push(entry);

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            collectEmailsAndNames(obj[key], result);
        }
    }

    return result;
}