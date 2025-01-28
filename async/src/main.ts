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

async function checkUrls(urls: string[], processInfo: ProcessInfo): Promise<[CheckUrlResult[], ProcessInfo]> {
    const results: CheckUrlResult[] = [];

    processInfo.totalRequests = urls.length;
    processInfo.completedRequests = 0;
    processInfo.status = 'inprogress';

    for (const url of urls) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(url, { signal: controller.signal });

            clearTimeout(timeoutId);
            if (response.ok) {
                results.push(createCheckUrlResult(url, true));
            } else {
                results.push(createCheckUrlResult(url, false));
            }

            processInfo.completedRequests++;
        } catch (error) {
            results.push(createCheckUrlResult(url, false));
            processInfo.completedRequests++;
        }
    }

    processInfo.status = 'completed';

    return [results, processInfo];
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