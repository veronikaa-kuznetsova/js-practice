interface CheckUrlResult {
    url: string;
    status: 'available' | 'unavailable';
}

type ProcessStatus = 'inprogress' | 'completed';

interface ProcessInfo {
    totalRequests: number;
    completedRequests: number;
    status: ProcessStatus;
}

function createCheckUrlResult(url: string, available: boolean): CheckUrlResult {
    return {
        url,
        status: available ? 'available' : 'unavailable'
    };
}

async function checkUrl(url: string): Promise<CheckUrlResult> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(url, { signal: controller.signal });

        clearTimeout(timeoutId);
        if (response.ok) {
            return createCheckUrlResult(url, true);
        } else {
            return createCheckUrlResult(url, false);
        }
    } catch (error) {
        return createCheckUrlResult(url, false);
    }
}

async function checkUrls(urls: string[], processInfo: ProcessInfo): Promise<[CheckUrlResult[], ProcessInfo]> {
    processInfo.totalRequests = urls.length;
    processInfo.completedRequests = 0;
    processInfo.status = 'inprogress';

    try {
        const results = await Promise.all(urls.map(url => checkUrl(url)));
        processInfo.completedRequests = results.length;
        processInfo.status = 'completed';
        return [results, processInfo];
    } catch (error) {
        console.error('error', error);
        processInfo.status = 'completed';
        return [[], processInfo];
    }
}

(async () => {
    const urls = [
        'https://jsonplaceholder.typicode.com/posts/1',
        'https://jsonplaceholder.typicode.com/comments?postId=1',
        'https://jsonplaceholder.typicode.commm/comments?postId=1'
    ];

    const processInfo: ProcessInfo = {
        totalRequests: 0,
        completedRequests: 0,
        status: 'inprogress'
    };

    const [result, finalProcessInfo] = await checkUrls(urls, processInfo);
    console.log(`Processed ${finalProcessInfo.completedRequests} out of ${finalProcessInfo.totalRequests}`);
    console.log(result);
})();
