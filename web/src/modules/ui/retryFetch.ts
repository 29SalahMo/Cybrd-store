export async function retryFetch<T>(
  url: string,
  options: RequestInit = {},
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error | null = null
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options)
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      return await response.json() as T
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (attempt + 1)))
      }
    }
  }
  throw lastError || new Error('Request failed after retries')
}

