/**
 * HardDrives Collection Manager
 * Manages collected hard drives and local storage
 */

export default class HardDrives {
    constructor(options = {}) {
        this.language = options.language || 'en';
        this.storageKey = 'satisfactory_collected_harddrives';
        this.collected = this.loadFromStorage();
    }

    /**
     * Get locale storage object (returns browser localStorage)
     */
    getLocaleStorage() {
        return localStorage;
    }

    /**
     * Get collected data from storage
     */
    getCollectedData() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey) || '{}');
        } catch (error) {
            console.warn('Error loading hard drives from localStorage:', error);
            return {};
        }
    }

    /**
     * Load collected hard drives from local storage
     */
    loadFromStorage() {
        return this.getCollectedData();
    }

    /**
     * Save collected hard drives to local storage
     */
    saveToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.collected));
        } catch (error) {
            console.warn('Error saving hard drives to localStorage:', error);
        }
    }

    /**
     * Check if a hard drive is collected
     */
    isCollected(pathName) {
        return this.collected[pathName] === true;
    }

    /**
     * Mark a hard drive as collected
     */
    setCollected(pathName, collected = true) {
        this.collected[pathName] = collected;
        this.saveToStorage();
    }

    /**
     * Get all collected hard drives
     */
    getCollectedHardDrives() {
        return Object.keys(this.collected).filter(pathName => this.collected[pathName]);
    }

    /**
     * Set collected hard drives from an array of markers
     */
    setCollectedHardDrives(markers) {
        if (Array.isArray(markers)) {
            markers.forEach(marker => {
                if (marker && marker.pathName) {
                    this.setCollected(marker.pathName, true);
                }
            });
        }
    }

    /**
     * Reset all collected hard drives
     */
    resetCollected() {
        this.collected = {};
        this.saveToStorage();
    }

    /**
     * Get count of collected hard drives
     */
    getCollectedCount() {
        return this.getCollectedHardDrives().length;
    }

    /**
     * Import collected data from object
     */
    importCollected(data) {
        if (typeof data === 'object' && data !== null) {
            this.collected = { ...data };
            this.saveToStorage();
        }
    }

    /**
     * Export collected data
     */
    exportCollected() {
        return { ...this.collected };
    }
}