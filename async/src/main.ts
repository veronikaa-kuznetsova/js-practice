interface UrlStatus {
    url: string;
    status: 'available' | 'unavailable';
}

async function checkUrlsAvailability(urls: string[]): Promise<{ overallStatus: 'done'; results: UrlStatus[] }> {
    const timeout = 10000;

    const fetchWithTimeout = (url: string): Promise<UrlStatus> => {
        const controller = new AbortController();
        const {signal} = controller;

        const timeoutPromise = new Promise<UrlStatus>((resolve) => {
            setTimeout(() => {
                resolve({url, status: 'unavailable'});
            }, timeout);
        });

        const fetchPromise = fetch(url, {signal})
            .then(response => {
                if (response.ok) {
                    console.log(`URL ${url} is available`);
                    return {url, status: 'available'};
                } else {
                    return {url, status: 'unavailable'};
                }
            })
            .catch(() => {
                return {url, status: 'unavailable'};
            });

        return Promise.race([fetchPromise, timeoutPromise])
            .finally(() => controller.abort());
    };

    const promises = urls.map(url => fetchWithTimeout(url));

    const results = await Promise.all(promises);

    return {overallStatus: 'done', results};
}

const urls = [
    'https://jsonplaceholder.typicode.com',
    'https://www.youtube.com',
    'https://google.com'
];

checkUrlsAvailability(urls)
    .then(({overallStatus, results}) => {
        console.log('Overall status:', overallStatus);
        console.log('Results:', results);
    })
    .catch(error => {
        console.error('Error:', error);
    });