export default class HardDrives {
    constructor(options = {}) {
        this.language = options.language || 'en';
        this.collected = [];
        this.localStorage = null;
        
        // Initialize localStorage if available
        if (typeof window !== 'undefined' && window.localStorage) {
            this.localStorage = window.localStorage;
        }
    }
    
    getLocaleStorage() {
        return this.localStorage;
    }
    
    setCollectedHardDrives(markers) {
        if (Array.isArray(markers)) {
            this.collected = [...markers];
        }
    }
    
    getCollectedHardDrives() {
        return this.collected;
    }
    
    isCollected(pathName) {
        return this.collected.includes(pathName);
    }
    
    setCollected(pathName) {
        if (!this.isCollected(pathName)) {
            this.collected.push(pathName);
        }
    }
    
    resetCollected() {
        this.collected = [];
    }
}