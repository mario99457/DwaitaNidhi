import localforage from "localforage";
import Utils from "./Utils";
import Formatter, { D, E, F, TH } from "./Formatter";
import GlobalSearch from "./Search";
import { Buffer } from "buffer";

export class ApiEndpoints {

  static FetchTimeoutMs: number = 4e3;
  static gitHubServer: string = "";
  static availableGithubServerUrls: { [key: string]: string } = {
    githubusercontent:
      "https://raw.githubusercontent.com/mario99457/dwaitanidhi_data/main/",
    githubapi:"https://api.github.com/repos/mario99457/dwaitanidhi_data/contents/"
  };
  static gitHubServerDefaultUrls: string[] = [
    ApiEndpoints.availableGithubServerUrls.githubusercontent,
  ];
  static gitHubServerUrls: string[] = ApiEndpoints.gitHubServerDefaultUrls;
  
  // GitHub authentication
  static GITHUB_TOKEN: string = ""; // Will be set from environment or user input
  static USE_AUTHENTICATION: boolean = false;
  
  // Chunked data loading
  static CHUNK_SIZE: number = 50; // Number of items per chunk
  static loadedChunks: { [key: string]: Set<number> } = {};
  
  static audioEndPoints: { [key: string]: string } = (() => {
    let t: { [key: string]: string } = {
          audio: "/sutraani/audio.txt"
    };    
    return t;
  })();

  static prefetchEndPoints: { [key: string]: string } = {
/*     sutraani: "sutraani/index.txt",
    bhashyam: "sutraani/bhashya.txt",
    sutradipika: "sutraani/sutradipika.txt", */
    books: "books.txt",
/*     sutraaniSummary: "sutraani/summary.txt",
    gitaIndex: "gita/index.txt",
    gbhashyam: "gita/bhashya.txt",
    gitaSummary: "gita/summary.txt",
    prameyadipika: "gita/prameyadipika.txt",
    audio:"sutraani/audio.txt" */
  };
  static allEndPoints: { [key: string]: string } = {
    ...ApiEndpoints.prefetchEndPoints,
    ...ApiEndpoints.audioEndPoints,
  };

  // Dynamic endpoint protection
  static endpointVariations: { [key: string]: string[] } = {
    'books': ['books.txt'], // Only use the correct file name
    // 'sutraaniindex': ['sutraani/index.txt'],
    // 'sutraanisummary': ['sutraani/summary.txt'],
    // 'bhashyam': ['sutraani/bhashya.txt'],
    // 'sutradipika': ['sutraani/sutradipika.txt'],
    // 'gitaIndex': ['gita/index.txt'],
    // 'gitaSummary': ['gita/summary.txt'],
    // 'gbhashyam': ['gita/bhashya.txt'],
    // 'prameyadipika': ['gita/prameyadipika.txt']
  };

  // Get a random endpoint variation to make scraping harder
  static getRandomEndpoint(endpoint: string): string {
    const variations = ApiEndpoints.endpointVariations[endpoint];
    if (variations && variations.length > 0) {
      // Since we only have one file per endpoint now, always return the first one
      return variations[0];
    }
    return ApiEndpoints.allEndPoints[endpoint] || `${endpoint}.txt`;
  }

  // Method to set GitHub token
  static setGitHubToken(token: string): void {
    ApiEndpoints.GITHUB_TOKEN = token;
    ApiEndpoints.USE_AUTHENTICATION = !!token;
    console.log("GitHub authentication enabled");
  }

  // Method to clear GitHub token
  static clearGitHubToken(): void {
    ApiEndpoints.GITHUB_TOKEN = "";
    ApiEndpoints.USE_AUTHENTICATION = false;
    console.log("GitHub authentication disabled");
  }

  // Get authentication headers
  static getAuthHeaders(): HeadersInit {
    if (ApiEndpoints.USE_AUTHENTICATION && ApiEndpoints.GITHUB_TOKEN) {
      return {
        'Authorization': `token ${ApiEndpoints.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3.raw',
        'User-Agent': 'DwaitaNidhi-App'
      };
    }
    return {};
  }

  // Additional protection strategies
  static requestCount: { [key: string]: number } = {};
  static lastRequestTime: { [key: string]: number } = {};
  static MAX_REQUESTS_PER_MINUTE = 100; // Increased from 30
  static REQUEST_THROTTLE_MS = 500; // Reduced from 2000ms to 500ms
  static ENABLE_THROTTLING = false; // Temporarily disabled for debugging

  // Throttle requests to prevent rapid data extraction
  static async throttleRequest(endpoint: string): Promise<boolean> {
    // Skip throttling if disabled
    if (!ApiEndpoints.ENABLE_THROTTLING) {
      return true;
    }

    const now = Date.now();
    const lastRequest = ApiEndpoints.lastRequestTime[endpoint] || 0;
    const requestCount = ApiEndpoints.requestCount[endpoint] || 0;

    // Reset counter if more than 1 minute has passed
    if (now - lastRequest > 60000) {
      ApiEndpoints.requestCount[endpoint] = 0;
    }

    // Check if too many requests
    if (requestCount >= ApiEndpoints.MAX_REQUESTS_PER_MINUTE) {
      console.warn(`Rate limit exceeded for ${endpoint}`);
      return false;
    }

    // Check throttle - only apply to rapid successive requests
    if (now - lastRequest < ApiEndpoints.REQUEST_THROTTLE_MS && requestCount > 5) {
      console.warn(`Request throttled for ${endpoint} - too many rapid requests`);
      return false;
    }

    // Update counters
    ApiEndpoints.requestCount[endpoint] = requestCount + 1;
    ApiEndpoints.lastRequestTime[endpoint] = now;
    return true;
  }

  // Method to disable throttling (for development)
  static disableThrottling(): void {
    ApiEndpoints.ENABLE_THROTTLING = false;
    console.log("Request throttling disabled for development");
  }

  // Method to enable throttling
  static enableThrottling(): void {
    ApiEndpoints.ENABLE_THROTTLING = true;
    console.log("Request throttling enabled");
  }

  // Obfuscate data to make it harder to understand
  static obfuscateData(data: any): any {
    if (Array.isArray(data)) {
      return data.map(item => ApiEndpoints.obfuscateData(item));
    } else if (data && typeof data === 'object') {
      const obfuscated = {};
      Object.keys(data).forEach(key => {
        // Use non-obvious key names
        const obfuscatedKey = btoa(key).slice(0, 8);
        obfuscated[obfuscatedKey] = ApiEndpoints.obfuscateData(data[key]);
      });
      return obfuscated;
    }
    return data;
  }

  // Deobfuscate data for use in the app
  static deobfuscateData(data: any): any {
    if (Array.isArray(data)) {
      return data.map(item => ApiEndpoints.deobfuscateData(item));
    } else if (data && typeof data === 'object') {
      const deobfuscated = {};
      Object.keys(data).forEach(obfuscatedKey => {
        // Try to find the original key
        const originalKey = this.findOriginalKey(obfuscatedKey);
        if (originalKey) {
          deobfuscated[originalKey] = ApiEndpoints.deobfuscateData(data[obfuscatedKey]);
        }
      });
      return deobfuscated;
    }
    return data;
  }

  // Map of obfuscated keys to original keys
  static keyMap: { [key: string]: string } = {};

  static findOriginalKey(obfuscatedKey: string): string {
    // This is a simplified version - in practice you'd have a proper mapping
    const commonKeys = ['i', 's', 'a', 'p', 'n', 'e', 'pc', 'name', 'title', 'author', 'key'];
    for (const key of commonKeys) {
      if (btoa(key).slice(0, 8) === obfuscatedKey) {
        return key;
      }
    }
    return obfuscatedKey; // Fallback
  }

  // Enhanced loadDataChunk with all protections
  static async loadDataChunk(endpoint: string, chunkIndex: number): Promise<any> {
    // Check throttling
    if (!(await ApiEndpoints.throttleRequest(endpoint))) {
      throw new Error('Request rate limited');
    }

    const chunkKey = `${endpoint}_chunk_${chunkIndex}`;
    
    // Check if chunk is already loaded
    if (CachedData.data[chunkKey]) {
      return CachedData.data[chunkKey];
    }

    try {
      let url: string;
      
      // Use random endpoint variation
      const filePath = ApiEndpoints.getRandomEndpoint(endpoint);
      
      if (ApiEndpoints.USE_AUTHENTICATION && ApiEndpoints.GITHUB_TOKEN) {
        // Use GitHub API with authentication
        url = `https://api.github.com/repos/mario99457/dwaitanidhi_data/contents/${filePath}`;
      } else {
        // Use raw.githubusercontent.com (public access)
        url = `${ApiEndpoints.availableGithubServerUrls.githubusercontent}${filePath}`;
      }

      const headers = ApiEndpoints.getAuthHeaders();
      
      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
        signal: AbortSignal.timeout(ApiEndpoints.FetchTimeoutMs)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      let fullData;
      if (ApiEndpoints.USE_AUTHENTICATION) {
        // GitHub API returns base64 encoded content
        const jsonResponse = await response.json();
        if (jsonResponse.content && jsonResponse.encoding === 'base64') {
          fullData = JSON.parse(atob(jsonResponse.content));
        } else {
          throw new Error('Invalid response format from GitHub API');
        }
      } else {
        // Raw content from raw.githubusercontent.com
        fullData = await response.json();
      }

      // Obfuscate the data before storing
      const obfuscatedData = ApiEndpoints.obfuscateData(fullData);

      // Split data into chunks
      const chunks = ApiEndpoints.splitDataIntoChunks(obfuscatedData, ApiEndpoints.CHUNK_SIZE);
      
      // Store all chunks in cache (obfuscated)
      chunks.forEach((chunk, index) => {
        const chunkKey = `${endpoint}_chunk_${index}`;
        CachedData.data[chunkKey] = chunk;
      });

      // Track loaded chunks
      if (!ApiEndpoints.loadedChunks[endpoint]) {
        ApiEndpoints.loadedChunks[endpoint] = new Set();
      }
      ApiEndpoints.loadedChunks[endpoint].add(chunkIndex);

      // Return deobfuscated chunk for use
      return ApiEndpoints.deobfuscateData(chunks[chunkIndex] || null);
    } catch (error) {
      console.error(`Error loading chunk ${chunkIndex} for ${endpoint}:`, error);
      throw error;
    }
  }

  // Split large data into smaller chunks
  static splitDataIntoChunks(data: any, chunkSize: number): any[] {
    if (Array.isArray(data)) {
      const chunks = [];
      for (let i = 0; i < data.length; i += chunkSize) {
        chunks.push(data.slice(i, i + chunkSize));
      }
      return chunks;
    } else if (data && typeof data === 'object') {
      const keys = Object.keys(data);
      const chunks = [];
      for (let i = 0; i < keys.length; i += chunkSize) {
        const chunkKeys = keys.slice(i, i + chunkSize);
        const chunk = {};
        chunkKeys.forEach(key => {
          chunk[key] = data[key];
        });
        chunks.push(chunk);
      }
      return chunks;
    }
    return [data];
  }

  // Get specific data by ID without loading entire file
  static async getDataById(endpoint: string, id: string): Promise<any> {
    // Calculate which chunk contains this ID
    const chunkIndex = Math.floor(parseInt(id) / ApiEndpoints.CHUNK_SIZE);
    
    try {
      const chunk = await ApiEndpoints.loadDataChunk(endpoint, chunkIndex);
      return chunk?.find(item => item.i === id) || null;
    } catch (error) {
      console.error(`Error getting data by ID ${id} from ${endpoint}:`, error);
      return null;
    }
  }

  // Get range of data without loading entire file
  static async getDataRange(endpoint: string, startId: string, endId: string): Promise<any[]> {
    const startChunk = Math.floor(parseInt(startId) / ApiEndpoints.CHUNK_SIZE);
    const endChunk = Math.floor(parseInt(endId) / ApiEndpoints.CHUNK_SIZE);
    
    const results = [];
    
    for (let chunkIndex = startChunk; chunkIndex <= endChunk; chunkIndex++) {
      try {
        const chunk = await ApiEndpoints.loadDataChunk(endpoint, chunkIndex);
        if (chunk) {
          const filtered = chunk.filter(item => 
            parseInt(item.i) >= parseInt(startId) && parseInt(item.i) <= parseInt(endId)
          );
          results.push(...filtered);
        }
      } catch (error) {
        console.error(`Error loading chunk ${chunkIndex} for range query:`, error);
      }
    }
    
    return results;
  }

  static async setAvailableServerList(): Promise<void> {
    let t: string | "" = localStorage.userSelectedDataSource;
    if (ApiEndpoints.availableGithubServerUrls[t]) {
      ApiEndpoints.gitHubServerUrls = [
        ApiEndpoints.availableGithubServerUrls[t],
      ];
      console.log(
        "Github Server restricted by the user to: ",
        ApiEndpoints.availableGithubServerUrls[t]
      );
    } else {
      ApiEndpoints.gitHubServerUrls = ApiEndpoints.gitHubServerDefaultUrls;
      console.log("Github Server set to ALL.");
    }
  }

  static async chooseGitHubServer(e: () => void = () => {}, a: number = 0): Promise<void> {
    ApiEndpoints.gitHubServer = "";
    if (navigator.onLine) {
      if (a >= ApiEndpoints.gitHubServerUrls.length) {
        console.log(
          "All Servers tried, none are unreachable. Github url remains empty."
        );
        e();
      } else {
        const i = ApiEndpoints.gitHubServerUrls[a];
        console.log("Attempting to reach github server: ", i + "README.md");
        try {
          const t = await fetch(i + "README.md");
          if (t && t.status === 200) {
            ApiEndpoints.gitHubServer = i;
            console.log("Successfully contacted GitHub URL: ", i);
            e();
          } else {
            console.log("Unable to contact Github URL: ", i);
            await ApiEndpoints.chooseGitHubServer(e, a + 1);
          }
        } catch (t) {
          console.log("Unable to contact GitHub URL: ", t);
          await ApiEndpoints.chooseGitHubServer(e, a + 1);
        }
      }
    } else {
      console.log("Device is offline. Github url remains empty.");
      e();
    }
  }

  static async sendRequestToGitHubServer(
    endpoint: string,
    successCallback: (t: any) => void = () => {},
    errorCallback: (t: any) => void = () => {}
  ): Promise<void> {
    const o = Utils.getTime();
    try {
      console.log(`Attempting to fetch endpoint: ${endpoint}`);
      
      // Check throttling
      if (!(await ApiEndpoints.throttleRequest(endpoint))) {
        console.warn(`Request throttled for ${endpoint}`);
        errorCallback(`Request throttled for ${endpoint}`);
        return;
      }

      let url: string;
      
      // Use random endpoint variation
      const filePath = ApiEndpoints.getRandomEndpoint(endpoint);
      console.log(`Using file path: ${filePath}`);
      
      if (ApiEndpoints.USE_AUTHENTICATION && ApiEndpoints.GITHUB_TOKEN) {
        // Use GitHub API with authentication
        url = `https://api.github.com/repos/mario99457/dwaitanidhi_data/contents/${filePath}`;
      } else {
        // Use raw.githubusercontent.com (public access)
        url = `${ApiEndpoints.availableGithubServerUrls.githubusercontent}${filePath}`;
      }
      
      console.log(`Making request to: ${url}`);

      const headers = ApiEndpoints.getAuthHeaders();
      console.log(`Using headers:`, headers);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
        signal: AbortSignal.timeout(ApiEndpoints.FetchTimeoutMs)
      });

      console.log(`Response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        console.error(`HTTP error: ${response.status} ${response.statusText}`);
        errorCallback(`HTTP ${response.status}: ${response.statusText}`);
        return;
      }

      let data;
      if (ApiEndpoints.USE_AUTHENTICATION) {
        // GitHub API returns base64 encoded content
        const jsonResponse = await response.json();
        if (jsonResponse.content && jsonResponse.encoding === 'base64') {
          data = JSON.parse(Buffer.from(jsonResponse.content, 'base64').toString());
        } else {
          data = jsonResponse;
        }
      } else {
        // Raw content from raw.githubusercontent.com
        const text = await response.text();
        console.log(`Raw response text length: ${text.length}`);
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          console.error(`JSON parse error:`, parseError);
          console.error(`Response text:`, text.substring(0, 200));
          errorCallback(`JSON parse error: ${parseError}`);
          return;
        }
      }

      console.log(`Successfully parsed data for ${endpoint}:`, data);
      console.log(`Data type:`, typeof data);
      console.log(`Is array:`, Array.isArray(data));
      console.log(`Data length:`, Array.isArray(data) ? data.length : 'N/A');
      
      const e = (Utils.getTime() - o) / 1000;
      const a = Utils.getStorageOfObjectMB(data);
      console.log(`Server Success: ${endpoint} : ${a} MB : ${e} sec`);
      
      successCallback(data);
    } catch (error) {
      const e = Utils.getTime();
      console.error(`Server Failed: ${endpoint} : ${(e - o) / 1000} sec`);
      console.error(`Error details:`, error);
      errorCallback(error);
    }
  }

  static async pushToGitHubServer(e: string, c: string): Promise<void> {
    if (ApiEndpoints.availableGithubServerUrls.githubapi) {
      const n = ApiEndpoints.availableGithubServerUrls.githubapi + ApiEndpoints.allEndPoints[e];
      const request = { n, e, c, s: "" };
      const options = { method: 'GET' };

      try {
        const data = await fetch('https://dwaitanidhiapi.netlify.app/api/git/fetch?resource=' + n, options);
        if (data.ok) {
          const response = await data.json();
          request["s"] = response.sha;

          const updateResponse = await fetch('https://dwaitanidhiapi.netlify.app/api/git/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
          });

          if (updateResponse.ok) {
            await localforage.removeItem(e);
            console.log(`Removed stale key ${e} from Localforage.`);
          } else {
            console.log(await updateResponse.json());
          }
        } else {
          console.log(await data.json());
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log("Error: No github servers are reachable.");
    }
  }
}

export default class CachedData {
  static CACHE_VERSION_KEY: string = "dwaitanidhi-cache-version";
  static CACHE_VERSION_VALUE: string = "dwaitanidhi-spa";
  static data: { [key: string]: any } = {};
  static currentTime: number = 0;
  static staleKeys: string[] = [];
  static staleThresholdInMs: number = 2592e5;
  static expireThresholdInMs: number = 2592e6;
  static selectedBook: string = "";
  static EMPTY_DATA: { data: any[] } = {
    data: [],
  };
  static fetchDone: { [key: string]: boolean } = {};

  static async initializeLocalForage(e: () => void): Promise<void> {
    try {
      const t = await localforage.getItem(CachedData.CACHE_VERSION_KEY);
      if (t != CachedData.CACHE_VERSION_VALUE) {
        console.log("New User. Welcome !");
        console.log("Localforage is cleared.");
        await localforage.clear();
        await localforage.setItem(CachedData.CACHE_VERSION_KEY, CachedData.CACHE_VERSION_VALUE);
        console.log("Localforage is initialized.");
        e();
      } else {
        console.log("Existing User. Welcome back !");
        console.log("Valid localforage found.");
        e();
      }
    } catch (error) {
      console.error("Error initializing localforage:", error);
    }
  }

  static defaultDataToEmpty(t: string[]): void {
    t.forEach((t) => {
      if (!CachedData.data[t] || !CachedData.data[t].data) {
        console.log(
          `Error: CachedData.data.${t}.data is unavailable. Setting to []`
        );
        CachedData.data[t].data = [];
      }
    });
  }

  static async fetchDataForKeys(
    t: string[],
    n: () => void = () => {},
    s: (t: string) => void = () => {},
    a: {} = {},
    c: () => void = () => {},
    storeImmediately: boolean = false
  ): Promise<void> {
    let r: string[], o: number;
    r = [];
    o = t.length;

    //Set the endpoints for all books 
    if(a)
      for(const [key, value] of Object.entries(a))
        ApiEndpoints.allEndPoints[key] = value;

    t.forEach((e) => {
      if (CachedData.fetchDone[e]) {
        n();
      } else {
        r.push(e);
      }
    });
    if (0 < r.length) {
      o = Utils.getTime();
      await CachedData._fetchFromLocalforage(r, n, async (t, e) => {
        let a: number;
        a = Utils.getTime();
        if (0 < t.length) {
          t.forEach((t) => (CachedData.fetchDone[t] = !0));
          console.log("Cache Hit for: ", t, " ", a - o + " ms");
        }
        if (0 < e.length) {
          console.log("Cache Miss for: ", e);
          a = e.length;
          await ApiEndpoints.chooseGitHubServer(async () => {
            for (const t of e) {
              await CachedData._fetchFromServer(
                t,
                () => {
                  CachedData.fetchDone[t] = !0;
                  n();
                  --a <= 0 && CachedData._refreshStaleData();
                },
                (t, e) => {
                  console.log("Error: Prefetch failed for key: ", e);
                  console.log("Error Details: ", t);
                  console.log(
                    `Warning: Initializing CachedData.data.${e} to empty object.`
                  );
                  if (e) {
                    CachedData.data[e] = CachedData.EMPTY_DATA;
                    CachedData.fetchDone[e] = !1;
                    s(e);
                    --a <= 0 && CachedData._refreshStaleData();
                  }
                },
                storeImmediately
              );
            }
          });
        } else if (0 < CachedData.staleKeys.length) {
          console.log("Stale Keys = ", CachedData.staleKeys);
          console.log("Refreshing stale keys from Github server");
          await ApiEndpoints.chooseGitHubServer(() => CachedData._refreshStaleData());
        }
      });
    }
  }

  static async _fetchFromLocalforage(
    t: string[],
    a: () => void,
    i: (t: string[], e: string[]) => void
  ): Promise<void> {
    const n: string[] = [];
    const s: string[] = [];
    let r = t.length;

    for (const e of t) {
      try {
        const data = await localforage.getItem(e);
        if (data === null || CachedData.isFetchedDataExpired(e, data)) {
          s.push(e);
        } else {
          CachedData.data[e] = data.data;
          a();
          n.push(e);
          if (CachedData.isFetchedDataStale(e, data)) {
            CachedData.staleKeys.push(e);
          }
        }
      } catch (error) {
        console.error(`Error fetching from localforage for key ${e}:`, error);
      } finally {
        r--;
        if (r <= 0) {
          i(n, s);
        }
      }
    }
  }

  static async _refreshStaleData(): Promise<void> {
    if (CachedData.staleKeys.length > 0) {
      console.log("Refreshing stale data: ", CachedData.staleKeys);
      for (const key of CachedData.staleKeys) {
        await CachedData._fetchFromServer(key);
      }
      CachedData.staleKeys = [];
    }
  }

  static async _fetchFromServer(
    i: string,
    n: () => void = () => {},
    s: (t: any, e: any) => void = () => {},
    r: boolean = false
  ): Promise<void> {
    const o = Utils.getTime();
    try {
      const t = await ApiEndpoints.sendRequestToGitHubServer(
        i,
        async (data) => {
          const e = (Utils.getTime() - o) / 1000;
          const a = Utils.getStorageOfObjectMB(data);
          console.log(`Server Success: ${i} : ${a} MB : ${e} sec`);
          await CachedData.setValueInLocalForage(i, data, s);
          if (r) {
            CachedData.data[i] = data;
          }
          n();
        },
        (error) => {
          const e = Utils.getTime();
          console.log(`Server Failed: ${i}  : ${(e - o) / 1000} sec`);
          if (!i) {
            console.log("Error, key is not available");
          }
          s(error, i);
        }
      );
    } catch (error) {
      console.error(`Error fetching from server for key ${i}:`, error);
    }
  }

  static async setValueInLocalForage(
    t: string,
    e: any,
    a: (t: any, e: any) => void = () => {}
  ): Promise<void> {
    try {
      const data = {
        data: e,
        time: Utils.getTime(),
      };
      await localforage.setItem(t, data);
    } catch (error) {
      a(error, e);
    }
  }

  static async getValueFromLocalForage(t: string): Promise<any> {
    try {
      return await localforage.getItem(t);
    } catch (error) {
      console.error(`Error getting value from localforage for key ${t}:`, error);
      return null;
    }
  }

  static isFetchedDataExpired(t: any, e: any): boolean {
    return (
      !t.startsWith("audio") &&
      ((t = e.time || 0), Utils.getTime() - t > CachedData.expireThresholdInMs)
    );
  }

  static isFetchedDataStale(t: any, e: any): boolean {
    return (
      !t.startsWith("audio") &&
      ((t = e.time || 0), Utils.getTime() - t > CachedData.staleThresholdInMs)
    );
  }

  static getBookClass(name: any) {
    if (name == "sutraani") {
      return Sutraani;
    }
    else if (name == "gita") {
      return Gita;
    }
    return null;
  }

  static async clearAllCache(): Promise<void> {
    try {
      console.log("Clearing all cached data...");
      
      // Clear all cached data
      await localforage.clear();
      
      // Reset CachedData state
      CachedData.data = {};
      CachedData.fetchDone = {};
      CachedData.staleKeys = [];
      
      // Reinitialize localforage
      await localforage.setItem(CachedData.CACHE_VERSION_KEY, CachedData.CACHE_VERSION_VALUE);
      
      console.log("All cached data cleared successfully");
      
      // Immediately reload books.txt so navigation works without refresh
      console.log("Reloading books.txt after cache clear...");
      await Prefetch.loadInitialData(() => {
        console.log("Books data reloaded successfully after cache clear");
      });
      
    } catch (error) {
      console.error("Error clearing cache:", error);
      throw error;
    }
  }
}
export class Prefetch {
  static startTime: number = 0;
  static endTime: number = 0;
  static callback: any;
  static keysToPrefetch: string[] = [];
  static pendingResolve: number = 0;

  static async showPrefetchDialog(t: () => void): Promise<void> {
    t();
    // TODO: Show progress bar
  }

  static async hidePrefetchDialog(): Promise<void> {
    // TODO: Hide progress bar
  }

  static async prefetchRequiredServerData(
    t: string[],
    e: () => void
  ): Promise<string> {
    t = (t || []).filter((t) => !0 !== CachedData.fetchDone[t]);
    if (t.length === 0) {
      e();
      return "No data to prefetch";
    }

    await Prefetch.showPrefetchDialog(async () => {
      Prefetch.keysToPrefetch = t;
      Prefetch.callback = e;
      Prefetch.pendingResolve = Prefetch.keysToPrefetch.length;
      Prefetch.startTime = Utils.getTime();
      console.log("Attempting to prefetch: ", Prefetch.keysToPrefetch);

      await CachedData.fetchDataForKeys(
        Prefetch.keysToPrefetch,
        Prefetch.prefetchProgressHandler,
        Prefetch.prefetchErrorHandler
      );
    });

    return "Data fetched";
  }

  // New method: Load only books.json initially
  static async loadInitialData(e: () => void): Promise<void> {
    try {
      const startTime = Utils.getTime();
      console.log("Loading initial books.json...");
      console.log("Available endpoints:", ApiEndpoints.allEndPoints);
      
      await CachedData.fetchDataForKeys(
        ["books"],
        async () => {
          const loadTime = (Utils.getTime() - startTime) / 1000;
          console.log(`books.json loaded successfully in ${loadTime} seconds.`);
          console.log("Books data:", CachedData.data.books);
          console.log("Books data type:", typeof CachedData.data.books);
          console.log("Books is array:", Array.isArray(CachedData.data.books));
          console.log("Books length:", CachedData.data.books?.length);
          console.log("App ready for navigation - much faster startup!");
          e();
        },
        (errorKey) => {
          console.error(`Error loading books.json: ${errorKey}`);
          console.error("Full error details:", errorKey);
          e(); // Still call callback to prevent app from hanging
        },
        {}, // endpoints
        () => {}, // progress callback
        true // store immediately
      );
    } catch (error) {
      console.error("Error during loadInitialData:", error);
      e(); // Still call callback to prevent app from hanging
    }
  }

  // New method: Load specific book data when accessed
  static async loadBookData(bookName: string, callback: () => void = () => {}): Promise<void> {
    try {
      const startTime = Utils.getTime();
      const book = CachedData.data.books?.find((book: any) => book.name === bookName);
      if (!book) {
        console.error(`Book ${bookName} not found in books.json`);
        callback();
        return;
      }

      const keysToLoad: string[] = [];
      const endpointsToAdd: { [key: string]: string } = {};

      // Add index and summary
      endpointsToAdd[bookName + "index"] = bookName + "/index.txt";
      endpointsToAdd[bookName + "summary"] = bookName + "/summary.txt";
      keysToLoad.push(bookName + "index");
      keysToLoad.push(bookName + "summary");

      // Add audio if available
      if (book.audio) {
        endpointsToAdd[bookName + "audio"] = bookName + "/audio.txt";
        keysToLoad.push(bookName + "audio");
      }

      // Add commentaries
      book?.commentaries?.forEach((c: any) => {
        endpointsToAdd[c.key] = c.data;
        keysToLoad.push(c.key);
      });

      console.log(`Loading data for book ${bookName}:`, keysToLoad);

      await CachedData.fetchDataForKeys(
        keysToLoad,
        () => {
          const loadTime = (Utils.getTime() - startTime) / 1000;
          console.log(`Book ${bookName} data loaded successfully in ${loadTime} seconds`);
          callback();
        },
        (errorKey) => {
          console.error(`Error loading book ${bookName} data: ${errorKey}`);
          callback();
        },
        endpointsToAdd,
        () => {}, // progress callback
        true // store immediately
      );
    } catch (error) {
      console.error(`Error loading book ${bookName} data:`, error);
      callback();
    }
  }

  // Keep the old method for backward compatibility but make it optional
  static async prefetchBooksAndDependencies(e: () => void): Promise<void> {
    try {
      // Fetch the `books` JSON file
      console.log("Fetching books.json...");
      await CachedData.fetchDataForKeys(
        ["books"],
        async () => {
          console.log("books.json fetched successfully.");
          const books = CachedData.data.books;

          const keysToPrefetch: string[] = [];
          // Extract keys of additional JSON files to fetch
          books.map((book: any) => {
            ApiEndpoints.allEndPoints[book.name + "index"] = book.name + "/index.txt";
            ApiEndpoints.allEndPoints[book.name + "summary"] = book.name + "/summary.txt";

            keysToPrefetch.push(book.name + "index");
            keysToPrefetch.push(book.name + "summary");
                        
            if (book.audio) {
              ApiEndpoints.allEndPoints[book.name + "audio"] = book.name + "/audio.txt";
              keysToPrefetch.push(book.name + "audio");
            }

            // Add additional keys for commentaries
            book?.commentaries?.map((c) => {
              ApiEndpoints.allEndPoints[c.key] = c.data;
              keysToPrefetch.push(c.key);
            });
          });
          
          console.log("Additional keys to prefetch:", keysToPrefetch);

          // Prefetch additional JSON files
          await Prefetch.prefetchRequiredServerData(keysToPrefetch, e);
        },
        (errorKey) => {
          console.error(`Error fetching books.json or dependencies: ${errorKey}`);
        }
      );
    } catch (error) {
      console.error("Error during prefetchBooksAndDependencies:", error);
    }
  }

  static async prefetchProgressHandler(): Promise<void> {
    // TODO: Update progress bar % based on the number of files fetched
    Prefetch.pendingResolve--;
    if (Prefetch.pendingResolve <= 0) {
      Prefetch.endTime = Utils.getTime();
      console.log(
        `Prefetch completed in ${(Prefetch.endTime - Prefetch.startTime) / 1000} seconds`
      );
      await Prefetch.hidePrefetchDialog();
      if (Prefetch.callback) {
        Prefetch.callback();
      }
    }
  }

  static async prefetchErrorHandler(): Promise<void> {
    console.log("Prefetch failed. Showing error page");
    await Prefetch.hidePrefetchDialog();
  }
}

export class Sutraani {
  static allTitles = [];

  static summary = CachedData.data.sutraaniSummary;

  static supportedCommentaries = [
    {
      name: "सूत्रदीपिका",
      key: "sutradipika",
      author: "श्रीजगन्नाथयति विरचिता",
      lang: "s",
      number: "",
      hidden: false,
      audio: false
    },
    {
      name: "भाष्यम्",
      key: "bhashyam",
      author: "श्रीमदानन्दतीर्थ भगवद्पादाचार्य विरचितं",
      lang: "s",
      number: "",
      hidden: true,
      audio: false
    },
  ];
  static init() {
    CachedData.defaultDataToEmpty(["sutraani"]);
  }
  static getCommentaries(e : any) {
    return Sutraani.supportedCommentaries.map((t : any) => {
      return {
        key: t.key,
        commname: t.name,
        author: t.author,
        hidden: t.hidden,
        editHref: "", //Sutraani.getEditCommentaryTag(t.key, e),
        show: true,
        lang: t.lang,
        //extLink: Sutraani.getExternalPageForCommentary(e, t),
        number:
          t.number && 0 < e[t.number]
            ? Formatter.toDevanagariNumeral(e[t.number])
            : "",
        text: Formatter.formatVyakhya(CachedData.data[t.key][e.i]),
      };
    });
  }
  static getLeftArrow(e : any) {
    const t = Sutraani.allTitles.find((t : any) => t.srno == e.srno - 1);
    return t;
  }
  static getRightArrow(e : any) {
    const t = Sutraani.allTitles.find((t : any) => t.srno == e.srno + 1);
    return t;
  }
  static getIndexList(t?: any): any {
    var e = [...Sutraani.allTitles];
    return "" == t
      ? {
          titles: e,
        }
      : "z" == t
      ? {
          titles: e.sort((t : any, e : any) => t.s.localeCompare(e.s)),
        }
      : {
          titles: e,
        };
  }

  static populateIndexList() {
    0 == Sutraani.allTitles?.length &&
      (Sutraani.allTitles = CachedData.data?.sutraaniindex?.data
        .sort((t : any, e : any) => t.i - e.i)
        .map((e : any, t : any) => ((e.srno = t + 1), e)));
  }

  static populateCommenatries(){
    0 == Sutraani.supportedCommentaries?.length &&
    (Sutraani.supportedCommentaries = CachedData.data.books?.find((book: Book) => 
          book.name == CachedData.selectedBook).commentaries);
  }

  static getSummary(i: string) {
    return CachedData.data.sutraanisummary[i];
  }

  static generateScore(t : any, e : any) {
    e = (e = E(e)).replaceAll(" ", "").replaceAll("ऽ", "");
    var a = t.s.trim().replaceAll(" ", "").replaceAll("ऽ", ""), i = 9e4 - t.i;
    
    return Sutraani.partialMatchWithTitleNumber(t, e) ? 81e4 + i : a == e ? 72e4 + i : a.startsWith(e) ? 63e4 + i : 0 <= a.indexOf(e) ? 54e4 + i : 0
  }

  static partialMatchWithTitleNumber(t : any, e : any) {
    return null != (e = e.match(/([\d]+)(?:[^a-zA-Z0-9](?:([\d]+)(?:[^a-zA-Z0-9](?:([\d]+)){0,1}){0,1}){0,1}){0,1}/)) && (void 0 !== e[3] ? t.a == e[1] && t.p == e[2] && (t.n + "").startsWith(e[3] + "") : void 0 !== e[2] ? t.a == e[1] && t.p == e[2] : void 0 !== e[1] && t.a == e[1])
  }

  static searchSutraani(i: string):any[] {
    var a = GlobalSearch.getDevanagariSearchStrings(i);
    Sutraani.populateIndexList();      
    Sutraani.allTitles.forEach(((t : any) => {
        t.searchData = {
            score: 0,
            datanav: "/sutraani/" + t["n"]
      }
    })), 
    Sutraani.allTitles.forEach(((e : any) => a.forEach(((t : any) => e.searchData.score = Math.max(e.searchData.score, Sutraani.generateScore(e, t))))));
      return Sutraani.allTitles.filter(((t : any) => 0 < t.searchData.score)).sort(((t : any, e : any) => e.searchData.score - t.searchData.score)).map(((t : any) => ({
        titlenum: F(`${t.a}.${t.p}.` + t.n, a),
        title: F(t.s, a),
        datanav: t.searchData.datanav,
        i: t.i
      })));
    }
   
    static searchBooks (q : any, b: any) {
        var books = CachedData.getBookClass("sutraani");

        var commentariesToSearch = CachedData.getBookClass("sutraani")?.supportedCommentaries;
        
        var o = GlobalSearch.getDevanagariSearchStrings(q)
          , t : any[] = [];
        return CachedData.data.sutraani.data.forEach((i : any) => {
            var n = i.i
              , s : any[] = [];

            var booksToSearch = b && b !== "all" ? booksToSearch?.filter(c=>c.key == b) : commentariesToSearch;
            commentariesToSearch.forEach((t :any) => {
                var e : any, a;
                e = "",
                a = CachedData.data[t.key][n],
                e = a ? a : e, 
                (a = o.find(t => 0 <= e.indexOf(t))) && s.push({
                    name: t.name,
                    key: t.key,
                    fragment: TH(D(e), o),
                    show: true,
                    author: t.author,
                    datanav: `/sutraani/${n}/${t.key}?highlight=` + a,
                    //datanav: `/sutraani/${t.key}?expand=sutra-commentary-${t.key}-region&focus=sutra-commentary-${t.key}-region&highlight=` + a
                })
            }),
            0 < s.length && t.push({
                name: i.s,
                titlenum: D(`${i.a}.${i.p}.` + i.n),
                commentaries: s,
                visible: !0
            })
        }
        ),
        t          
    }

    static updateContent(key, i, t){
      //TODO: get commentary
      //update text based on i
      //convert to json string
      //convert to base64 string
      //send to server

      CachedData.data[key][i] = t; 
      let updatedContent = JSON.stringify(CachedData.data[key]);
      let encodedData = Buffer.from(updatedContent).toString('base64');
      ApiEndpoints.pushToGitHubServer(key, encodedData);
    }

    static updateSummary(key, lang, i, t){
      //TODO: get commentary
      //update text based on i
      //convert to json string
      //convert to base64 string
      //send to server

      CachedData.data[key][i][lang] = t; 
      let updatedContent = JSON.stringify(CachedData.data[key]);
      let encodedData = Buffer.from(updatedContent).toString('base64');
      ApiEndpoints.pushToGitHubServer(key, encodedData);
    }
}

export class Gita {
  static allTitles = [];
  static summary = CachedData.data.gitasummary;
  static supportedCommentaries = [];
  
  //   {
  //     name: "भाष्यम्",
  //     key: "gbhashyam",
  //     author: "श्रीमदानन्दतीर्थ भगवद्पादाचार्य विरचितं",
  //     lang: "s",
  //     number: "",
  //     hidden: true,
  //   },{
  //     name: "प्रमोयदीपिका",
  //     key: "prameyadipika",
  //     author: "श्रीजयतीर्थंंयति विरचिता",
  //     lang: "s",
  //     number: "",
  //     hidden: true,
  //   },
  // ];


  static init() {
    CachedData.defaultDataToEmpty(["gita"]);
  }
  
  static getCommentaries(e : any) {
    return Gita.supportedCommentaries.map((t : any) => {
      return {
        key: t.key,
        commname: t.name,
        author: t.author,
        hidden: t.hidden,
        editHref: "", //Sutraani.getEditCommentaryTag(t.key, e),
        show: true,
        lang: t.lang,
        //extLink: Sutraani.getExternalPageForCommentary(e, t),
        number:
          t.number && 0 < e[t.number]
            ? Formatter.toDevanagariNumeral(e[t.number])
            : "",
        text: Formatter.formatVyakhya(CachedData.data[t.key]?.[e.i] || ""),
      };
    });
  }
  static getLeftArrow(e : any) {
    const t = Gita.allTitles.find((t : any) => t.srno == e.srno - 1);
    return t;
  }
  static getRightArrow(e : any) {
    const t = Gita.allTitles.find((t : any) => t.srno == e.srno + 1);
    return t;
  }
  static getIndexList(t?: any): any {
    var e = [...Gita.allTitles];
    return "" == t
      ? {
          titles: e,
        }
      : "z" == t
      ? {
          titles: e.sort((t : any, e : any) => t.s.localeCompare(e.s)),
        }
      : {
          titles: e,
        };
  }

  static populateIndexList() {
    0 == Gita.allTitles?.length &&
      (Gita.allTitles = CachedData.data?.gitaindex?.data
        .sort((t : any, e : any) => t.i - e.i)
        .map((e : any, t : any) => ((e.srno = t + 1), e)));
  }

  static populateCommenatries(){
    0 == Gita.supportedCommentaries?.length &&
    (Gita.supportedCommentaries = CachedData.data.books?.find((book: Book) => 
          book.name == CachedData.selectedBook).commentaries);
  }

  static getSummary(i: string) {
    return CachedData.data.gitasummary[i];
  }

  static generateScore(t : any, e : any) {
    e = (e = E(e)).replaceAll(" ", "").replaceAll("ऽ", "");
    var a = t.s.trim().replaceAll(" ", "").replaceAll("ऽ", ""), i = 9e4 - t.i;
    
    return Gita.partialMatchWithTitleNumber(t, e) ? 81e4 + i : a == e ? 72e4 + i : a.startsWith(e) ? 63e4 + i : 0 <= a.indexOf(e) ? 54e4 + i : 0
  }

  static partialMatchWithTitleNumber(t : any, e : any) {
    return null != (e = e.match(/([\d]+)(?:[^a-zA-Z0-9](?:([\d]+)(?:[^a-zA-Z0-9](?:([\d]+)){0,1}){0,1}){0,1}){0,1}/)) && (void 0 !== e[3] ? t.a == e[1] && t.p == e[2] && (t.n + "").startsWith(e[3] + "") : void 0 !== e[2] ? t.a == e[1] && t.p == e[2] : void 0 !== e[1] && t.a == e[1])
  }

  static searchBook(i: string):any[] {
    var a = GlobalSearch.getDevanagariSearchStrings(i);
    Gita.populateIndexList();      
    Gita.allTitles.forEach(((t : any) => {
        t.searchData = {
            score: 0,
            datanav: "/gita/" + t["n"]
      }
    })), 
    Gita.allTitles.forEach(((e : any) => a.forEach(((t : any) => e.searchData.score = Math.max(e.searchData.score, Gita.generateScore(e, t))))));
      return Gita.allTitles.filter(((t : any) => 0 < t.searchData.score)).sort(((t : any, e : any) => e.searchData.score - t.searchData.score)).map(((t : any) => ({
          titlenum: F(`${t.a}.${t.p}.` + t.n, a),            
          title: F(t.s, a),
          datanav: t.searchData.datanav,
          i: t.i
      })));
    }
   
    static searchBooks (q : any, b: any) {
        var books = CachedData.getBookClass("gita");

        var commentariesToSearch = CachedData.getBookClass("gita")?.supportedCommentaries;
        
        var o = GlobalSearch.getDevanagariSearchStrings(q)
          , t : any[] = [];
        return CachedData.data.gitaIndex.data.forEach((i : any) => {
            var n = i.i
              , s : any[] = [];

            var booksToSearch = b && b !== "all" ? booksToSearch?.filter(c=>c.key == b) : commentariesToSearch;
            commentariesToSearch.forEach((t :any) => {
                var e : any, a;
                e = "",
                a = CachedData.data[t.key][n],
                e = a ? a : e, 
                (a = o.find(t => 0 <= e.indexOf(t))) && s.push({
                    name: t.name,
                    key: t.key,
                    fragment: TH(D(e), o),
                    show: true,
                    author: t.author,
                    datanav: `/gita/${n}/${t.key}?highlight=` + a,
                    //datanav: `/sutraani/${t.key}?expand=sutra-commentary-${t.key}-region&focus=sutra-commentary-${t.key}-region&highlight=` + a
                })
            }),
            0 < s.length && t.push({
                name: i.s,
                titlenum: D(`${i.a}.${i.p}.` + i.n),
                commentaries: s,
                visible: !0
            })
        }
        ),
        t          
    }      

    static updateContent(i, t){
      ApiEndpoints.pushToGitHubServer(i, t);
    }
}

export class GenericBook {
  static allTitles = [];
  static summary = null;
  static supportedCommentaries = [];

  static init() {
    // Initialize with empty data
    GenericBook.allTitles = [];
    GenericBook.summary = null;
    GenericBook.supportedCommentaries = [];
  }

  static getCommentaries(e : any) {
    if (!GenericBook.supportedCommentaries || GenericBook.supportedCommentaries.length === 0) {
      console.warn("No commentaries available for current book");
      return [];
    }
    
    return GenericBook.supportedCommentaries.map((t : any) => {
      return {
        key: t.key,
        commname: t.name,
        author: t.author,
        hidden: t.hidden,
        editHref: "",
        show: true,
        lang: t.lang,
        number:
          t.number && 0 < e[t.number]
            ? Formatter.toDevanagariNumeral(e[t.number])
            : "",
        text: Formatter.formatVyakhya(CachedData.data[t.key]?.[e.i] || ""),
      };
    });
  }
  static getLeftArrow(e : any) {
    const t = GenericBook.allTitles.find((t : any) => t.srno == e.srno - 1);
    return t;
  }
  static getRightArrow(e : any) {
    const t = GenericBook.allTitles.find((t : any) => t.srno == e.srno + 1);
    return t;
  }
  static getIndexList(t?: any): any {
    var e = [...GenericBook.allTitles];
    return "" == t
      ? {
          titles: e,
        }
      : "z" == t
      ? {
          titles: e.sort((t : any, e : any) => t.s.localeCompare(e.s)),
        }
      : {
          titles: e,
        };
  }

  static populateIndexList() {
    // Check if data exists and is in the correct format
    const bookIndexKey = CachedData.selectedBook + "index";
    const bookData = CachedData.data[bookIndexKey];
    
    if (!bookData || !bookData.data || !Array.isArray(bookData.data)) {
      console.warn(`No valid data found for ${bookIndexKey}`);
      GenericBook.allTitles = [];
      return;
    }

    // Always repopulate
    try {
      GenericBook.allTitles = bookData.data
        .filter((item: any) => item && item.i)
        .sort((a: any, b: any) => {
          const aNum = parseInt(a.i) || 0;
          const bNum = parseInt(b.i) || 0;
          return aNum - bNum;
        })
        .map((item: any, index: number) => {
          return { ...item, srno: index + 1 };
        });
      console.log(`Populated ${GenericBook.allTitles.length} titles for ${CachedData.selectedBook}`);
    } catch (error) {
      console.error("Error populating index list:", error);
      GenericBook.allTitles = [];
    }
  }

  static populateCommenatries(){
    // Check if books data exists
    if (!CachedData.data.books || !Array.isArray(CachedData.data.books)) {
      console.warn("No books data available for populating commentaries");
      GenericBook.supportedCommentaries = [];
      return;
    }

    // Find the current book
    const currentBook = CachedData.data.books.find((book: any) => 
      book.name === CachedData.selectedBook
    );

    if (!currentBook || !currentBook.commentaries) {
      console.warn(`No commentaries found for book ${CachedData.selectedBook}`);
      GenericBook.supportedCommentaries = [];
      return;
    }

    // Always repopulate
    try {
      GenericBook.supportedCommentaries = currentBook.commentaries;
      //add a timeout of 2 seconds
      new Promise(resolve => setTimeout(resolve, 2000));
      console.log(`Populated ${GenericBook.supportedCommentaries.length} commentaries for ${CachedData.selectedBook}`);
    } catch (error) {
      console.error("Error populating commentaries:", error);
      GenericBook.supportedCommentaries = [];
    }
  }

  static getSummary(i: string) {
    if (!i || !CachedData.selectedBook) {
      return null;
    }
    
    const summaryKey = CachedData.selectedBook + "summary";
    const summaryData = CachedData.data[summaryKey];
    
    if (!summaryData) {
      console.warn(`No summary data found for ${summaryKey}`);
      return null;
    }
    
    return summaryData[i] || null;
  }

  static generateScore(t : any, e : any) {
    e = (e = E(e)).replaceAll(" ", "").replaceAll("ऽ", "");
    var a = t.s.trim().replaceAll(" ", "").replaceAll("ऽ", ""), i = 9e4 - t.i;
    
    return GenericBook.partialMatchWithTitleNumber(t, e) ? 81e4 + i : a == e ? 72e4 + i : a.startsWith(e) ? 63e4 + i : 0 <= a.indexOf(e) ? 54e4 + i : 0
  }

  static partialMatchWithTitleNumber(t : any, e : any) {
    return null != (e = e.match(/([\d]+)(?:[^a-zA-Z0-9](?:([\d]+)(?:[^a-zA-Z0-9](?:([\d]+)){0,1}){0,1}){0,1}){0,1}/)) && (void 0 !== e[3] ? t.a == e[1] && t.p == e[2] && (t.n + "").startsWith(e[3] + "") : void 0 !== e[2] ? t.a == e[1] && t.p == e[2] : void 0 !== e[1] && t.a == e[1])
  }

  static searchBook(i: string):any[] {
    var a = GlobalSearch.getDevanagariSearchStrings(i);
    GenericBook.populateIndexList();      
    GenericBook.allTitles.forEach(((t : any) => {
        t.searchData = {
            score: 0,
            datanav: `/${CachedData.selectedBook}/` + t["n"]
      }
    })), 
    GenericBook.allTitles.forEach(((e : any) => a.forEach(((t : any) => e.searchData.score = Math.max(e.searchData.score, GenericBook.generateScore(e, t))))));
      return GenericBook.allTitles.filter(((t : any) => 0 < t.searchData.score)).sort(((t : any, e : any) => e.searchData.score - t.searchData.score)).map(((t : any) => ({
          titlenum: F(`${t.a}.${t.p}.` + t.n, a),            
          title: F(t.s, a),
          datanav: t.searchData.datanav,
          i: t.i
      })));
    }
   
    static searchBooks (q : any, b: any) {

      var booksToSearch = b && b !== "all" ? CachedData.data.books.filter((book: Book) => book.name == b) :
                            CachedData.data.books.filter((book: Book) => book.searchable)
      
      var o = GlobalSearch.getDevanagariSearchStrings(q)
        , t : any[] = [];
      return booksToSearch.map(bs => { 
        return CachedData.data[bs.name + "index"].data.forEach((i : any) => {
          var n = i.i
            , s : any[] = [];
            
          //var booksToSearch = b && b !== "all" ? booksToSearch?.filter(c=>c.key == b) : commentariesToSearch;
          bs.commentaries.forEach((t :any) => {
              var e : any, a;
              e = "",
              a = CachedData.data[t.key][n],
              e = a ? a : e, 
              (a = o.find(t => 0 <= e.indexOf(t))) && s.push({
                  name: t.name,
                  key: t.key,
                  fragment: TH(D(e), o),
                  show: true,
                  author: t.author,
                  datanav: `/${bs.name}/${n}/${t.key}?highlight=` + a,
                  //datanav: `/sutraani/${t.key}?expand=sutra-commentary-${t.key}-region&focus=sutra-commentary-${t.key}-region&highlight=` + a
              })
          }),
          0 < s.length && t.push({
              name: i.s,
              titlenum: D(`${i.a}.${i.p}.` + i.n),
              commentaries: s,
              visible: !0
          })
        })
      }),
      t          
    }      

    static updateContent(key, i, t){
      //TODO: get commentary
      //update text based on i
      //convert to json string
      //convert to base64 string
      //send to server

      CachedData.data[key][i] = t; 
      let updatedContent = JSON.stringify(CachedData.data[key]);
      let encodedData = Buffer.from(updatedContent).toString('base64');
      ApiEndpoints.pushToGitHubServer(key, encodedData);
    }

    static updateSummary(key, lang, i, t){
      //TODO: get commentary
      //update text based on i
      //convert to json string
      //convert to base64 string
      //send to server

      CachedData.data[key][i][lang] = t; 
      let updatedContent = JSON.stringify(CachedData.data[key]);
      let encodedData = Buffer.from(updatedContent).toString('base64');
      ApiEndpoints.pushToGitHubServer(key, encodedData);
    }
}

export class ArrayExtension extends Array {
  constructor(){
    super()
  };
  static intersect(...t  : any[]) {
    return [this, ...t].reduce(((t, e) => t.filter(((t : any) => e.includes(t)))))
  }
  static between = (a : any, t : any) => {
    return a[0] <= t && t <= a[1]
  }
  findFirst = (t : any) => {
    for (var e = 0; e < this.length; ++e)
        if (0 <= t.indexOf(this[e])) return this[e];
    return null
  }
  rotate = (t : any) => {
    return t %= this.length, this.slice(t, this.length).concat(this.slice(0, t))
  }
  getLast = () => {
    return this[this.length - 1]
  }
  setLast = (t : any) => {
    return 0 == this.length ? this.push(t) : this[this.length - 1] = t, this
  }
  getSecondLast = () => {
    return this[this.length - 2]
  }
  setSecondLast = (t : any) => {
    if (0 != this.length) return 1 == this.length ? this.unshift(t) : this[this.length - 2] = t, this
  }
  removeLast = () => {
    for (var t = [], e = 0; e < this.length - 1; ++e) t.push(this[e]);
    return t
  };
}

export class StringExtension extends String {
  constructor(){
    super()
  };
  getLastChar = () => {
    return this[this.length - 1]
  }
  getSecondLastChar = () => {
    return this[this.length - 2]
  }
  removeLastChar = () => {
    return this.slice(0, -1)
  }
  find = (t : any) => {
    return this.split("").find(t)
  }
  clone = () => {
    return this
  }
  replaceAll = (t : any, e : any) => {
    return t = RegExp(t, "ig"), this.replace(t, e)
  }
  toNumber = () => {
    return parseInt(this.toString(), 10) || 0
  }
  firstUpper = () => {
    return this.charAt(0).toUpperCase() + this.slice(1)
  }
  last = () => {
    return this[this.length - 1]
  }
  isAllRoman = () => {
    return /^[a-zA-Z0-9]+$/.test(this.toString())
  }
  levenstein = (t : any) => {
    var e, a, i = t + "",
        n = [],
        s = Math.min;
    if (!this || !i) return (i || this).length;
    for (e = 0; e <= i.length; n[e] = [e++]);
    for (a = 0; a <= this.length; n[0][a] = a++);
    for (e = 1; e <= i.length; e++)
        for (a = 1; a <= this.length; a++) n[e][a] = i.charAt(e - 1) == this.charAt(a - 1) ? n[e - 1][a - 1] : n[e][a] = s(n[e - 1][a - 1] + 1, s(n[e][a - 1] + 1, n[e - 1][a] + 1));
    return n[i.length][this.length]
  }
}
export class NumberExtension extends Number {
  constructor(){
    super()
  };
  toNumber = () => {
    return this.valueOf()
  }
}