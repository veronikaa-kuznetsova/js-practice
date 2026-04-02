type UrlStatus = {
  url: string;
  status: 'available' | 'unavailable';
};

type OverallStatus = 'success' | 'partial' | 'failed';

type CheckResult = {
  overallStatus: OverallStatus;
  results: UrlStatus[];
};

type Options = {
  timeout?: number;
  concurrency?: number;
};

function checkUrlsAvailability(
    urls: string[],
    options: Options = {}
): Promise<CheckResult> {
  const timeout = options.timeout ?? 10000;
  const concurrency = options.concurrency ?? 5;

  const results: UrlStatus[] = new Array(urls.length);

  let activeCount = 0;
  let currentIndex = 0;

  function checkSingleUrl(url: string): Promise<UrlStatus> {
    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    return fetch(url, {signal: controller.signal})
        .then((response): UrlStatus => {
          return {
            url,
            status: response.ok ? 'available' : 'unavailable'
          };
        })
        .catch((): UrlStatus => {
          return {
            url,
            status: 'unavailable'
          };
        })
        .finally(() => {
          clearTimeout(timeoutId);
        });
  }

  function getOverallStatus(results: UrlStatus[]): OverallStatus {
    const availableCount = results.filter(r => r.status === 'available').length;

    if (availableCount === results.length) return 'success';
    if (availableCount === 0) return 'failed';
    return 'partial';
  }

  return new Promise<CheckResult>((resolve) => {
    function runNext(): void {
      if (currentIndex >= urls.length && activeCount === 0) {
        resolve({
          overallStatus: getOverallStatus(results),
          results
        });
        return;
      }

      while (activeCount < concurrency && currentIndex < urls.length) {
        const index = currentIndex;
        const url = urls[index];

        currentIndex++;
        activeCount++;

        checkSingleUrl(url).then((result) => {
          results[index] = result;
        }).finally(() => {
          activeCount--;
          runNext();
        });
      }
    }

    runNext();
  });
}

const urls = [
  'https://jsonplaceholder.typicode.com',
  'https://www.youtube.com',
  'https://google.com',
  'https://this-does-not-exist-12345.com'
];

checkUrlsAvailability(urls, {
  timeout: 10000,
  concurrency: 3
}).then((result) => {
  console.log('Overall status:', result.overallStatus);
  console.log('Results:', result.results);
});