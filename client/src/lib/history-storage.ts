// localStorage utility for managing download history
// All history is stored client-side, no database needed

export interface HistoryItem {
    id: string;
    originalUrl: string;
    title: string;
    videoUrl: string;  // The actual download link
    thumbnail?: string;
    source?: string;
    createdAt: string;
}

const HISTORY_KEY = 'snapx_download_history';
const MAX_HISTORY_ITEMS = 50; // Keep last 50 downloads

export class HistoryStorage {
    // Get all history items
    static getHistory(): HistoryItem[] {
        try {
            const data = localStorage.getItem(HISTORY_KEY);
            if (!data) return [];
            return JSON.parse(data) as HistoryItem[];
        } catch (error) {
            console.error('Failed to load history:', error);
            return [];
        }
    }

    // Add a new item to history
    static addItem(item: Omit<HistoryItem, 'id' | 'createdAt'>): HistoryItem {
        const newItem: HistoryItem = {
            ...item,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
        };

        try {
            const history = this.getHistory();

            // Check if URL already exists (avoid duplicates)
            const existingIndex = history.findIndex(h => h.originalUrl === item.originalUrl);
            if (existingIndex !== -1) {
                // Update existing entry
                history[existingIndex] = newItem;
            } else {
                // Add new entry at the beginning
                history.unshift(newItem);
            }

            // Keep only the latest MAX_HISTORY_ITEMS
            const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);

            localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
            return newItem;
        } catch (error) {
            console.error('Failed to save to history:', error);
            return newItem;
        }
    }

    // Remove an item from history
    static removeItem(id: string): void {
        try {
            const history = this.getHistory();
            const filtered = history.filter(item => item.id !== id);
            localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
        } catch (error) {
            console.error('Failed to remove from history:', error);
        }
    }

    // Clear all history
    static clearHistory(): void {
        try {
            localStorage.removeItem(HISTORY_KEY);
        } catch (error) {
            console.error('Failed to clear history:', error);
        }
    }

    // Get history count
    static getCount(): number {
        return this.getHistory().length;
    }

    // Search history
    static search(query: string): HistoryItem[] {
        const history = this.getHistory();
        const lowerQuery = query.toLowerCase();
        return history.filter(item =>
            item.title.toLowerCase().includes(lowerQuery) ||
            item.source?.toLowerCase().includes(lowerQuery)
        );
    }

    // Filter by platform/source
    static filterBySource(source: string): HistoryItem[] {
        const history = this.getHistory();
        return history.filter(item =>
            item.source?.toLowerCase() === source.toLowerCase()
        );
    }
}
