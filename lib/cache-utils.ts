import fs from "fs";
import path from "path";

const CACHE_DIR = path.join(process.cwd(), "site-cache");
const LIFE_CACHE_FILE = path.join(CACHE_DIR, "life.json");

/**
 * Ensure the cache directory exists
 */
export function ensureCacheDir(): void {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

/**
 * Read cache file if it exists
 */
export function readLifeCache(): any | null {
  try {
    ensureCacheDir();
    if (fs.existsSync(LIFE_CACHE_FILE)) {
      const fileContent = fs.readFileSync(LIFE_CACHE_FILE, "utf-8");
      return JSON.parse(fileContent);
    }
    return null;
  } catch (error) {
    console.error("Error reading life cache:", error);
    return null;
  }
}

/**
 * Write data to cache file
 */
export function writeLifeCache(data: any): void {
  try {
    ensureCacheDir();
    fs.writeFileSync(LIFE_CACHE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing life cache:", error);
  }
}

/**
 * Check if cache file exists
 */
export function lifeCacheExists(): boolean {
  try {
    return fs.existsSync(LIFE_CACHE_FILE);
  } catch (error) {
    return false;
  }
}

