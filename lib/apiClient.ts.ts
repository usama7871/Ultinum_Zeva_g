interface RetryOptions {
  retries?: number;
  backoffMs?: number;
  statusCodesToRetry?: number[];
}

export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retryConfig: RetryOptions = {}
): Promise<Response> {
  const {
    retries = 3,
    backoffMs = 1000,
    statusCodesToRetry = [429, 500, 502, 503, 504],
  } = retryConfig;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);

      if (response.ok) {
        return response;
      }

      if (statusCodesToRetry.includes(response.status) && attempt < retries) {
        const delay = backoffMs * Math.pow(2, attempt);
        console.warn(`[API Warning] Request failed with status ${response.status}. Retrying in ${delay}ms... (Attempt ${attempt + 1}/${retries})`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      return response; // Return failed response if out of retries
    } catch (err) {
      lastError = err as Error;
      if (attempt < retries) {
        const delay = backoffMs * Math.pow(2, attempt);
        console.warn(`[Network Error] Retrying in ${delay}ms... (Attempt ${attempt + 1}/${retries})`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error(`Failed after ${retries} retries.`);
}