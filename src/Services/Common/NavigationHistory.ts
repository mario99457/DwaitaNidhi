export interface NavigationEntry {
  path: string;
  timestamp: number;
  title?: string;
}

class NavigationHistoryService {
  private _history: NavigationEntry[] = [];
  private maxHistorySize = 10;

  get history(): NavigationEntry[] {
    return this._history;
  }

  push(path: string, title?: string) {
    // Normalize path by removing query parameters for comparison
    const normalizedPath = path.split('?')[0];
    
    // Remove duplicate consecutive entries (comparing normalized paths)
    if (this._history.length > 0 && this._history[this._history.length - 1].path.split('?')[0] === normalizedPath) {
      return;
    }

    this._history.push({
      path: normalizedPath, // Store only the path part, not query parameters
      timestamp: Date.now(),
      title
    });

    // Keep only the last maxHistorySize entries
    if (this._history.length > this.maxHistorySize) {
      this._history = this._history.slice(-this.maxHistorySize);
    }

    // Store in localStorage for persistence across sessions
    this.saveToStorage();
  }

  pop(): NavigationEntry | null {
    if (this._history.length <= 1) {
      return null;
    }

    // Remove current page
    this._history.pop();
    
    // Get the previous page
    const previousEntry = this._history[this._history.length - 1];
    
    this.saveToStorage();
    return previousEntry;
  }

  getPrevious(): NavigationEntry | null {
    if (this._history.length <= 1) {
      return null;
    }
    return this._history[this._history.length - 2];
  }

  getCurrent(): NavigationEntry | null {
    if (this._history.length === 0) {
      return null;
    }
    return this._history[this._history.length - 1];
  }

  clear() {
    this._history = [];
    this.saveToStorage();
  }

  // Debug method to show current history
  debugHistory() {
    console.log('Current Navigation History:', this._history);
    console.log('Testing path detection:');
    console.log('Details page test:', this.getSmartBackDestination('/svijaya/1048'));
    console.log('Title page test:', this.getSmartBackDestination('/svijaya'));
  }

  // Debug method to clear history for testing
  clearHistory() {
    this.clear();
    console.log('Navigation history cleared');
  }

  private saveToStorage() {
    try {
      localStorage.setItem('navigationHistory', JSON.stringify(this._history));
    } catch (error) {
      console.warn('Failed to save navigation history to localStorage:', error);
    }
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem('navigationHistory');
      if (stored) {
        this._history = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load navigation history from localStorage:', error);
      this._history = [];
    }
  }

  // Get a smart back destination based on current location
  getSmartBackDestination(currentPath: string): string {
    const previous = this.getPrevious();
    
    if (!previous) {
      // No history, go to home
      return '/';
    }

    // Normalize current path by removing query parameters
    const normalizedCurrentPath = currentPath.split('?')[0];

    // Check if current path is a details page (has bookName and titleNumber)
    const pathParts = normalizedCurrentPath.split('/').filter(part => part.length > 0);
    const isDetailsPage = pathParts.length >= 2 && 
                         pathParts[0] && 
                         pathParts[1] && 
                         !isNaN(Number(pathParts[1])); // titleNumber should be a number

    // Check if current path is a title index page (has bookName but no titleNumber)
    const isTitleIndexPage = pathParts.length === 1 && pathParts[0];

    // Debug logging
    console.log('NavigationHistory Debug:', {
      currentPath: normalizedCurrentPath,
      previousPath: previous.path,
      pathParts,
      isDetailsPage,
      isTitleIndexPage,
      fullHistory: this._history.map(h => h.path)
    });

    // If we're on a details page and came from search, go back to search
    if (isDetailsPage && previous.path === '/search') {
      console.log('Returning to search from details page');
      return '/search';
    }

    // If we're on a details page and came from title page, go back to title page
    if (isDetailsPage && previous.path.includes('/') && 
        previous.path.split('/').filter(part => part.length > 0).length === 1) {
      console.log('Returning to title page from details page');
      return previous.path;
    }

    // If we're on a title page and came from search, go back to search
    if (isTitleIndexPage && previous.path === '/search') {
      console.log('Returning to search from title page');
      return '/search';
    }

    // Default: go to previous page
    console.log('Returning to previous page:', previous.path);
    return previous.path;
  }
}

// Create a singleton instance
const navigationHistory = new NavigationHistoryService();

// Load history from storage on initialization
navigationHistory.loadFromStorage();

// Clear existing history to remove entries with query parameters
// This is a one-time fix for the current issue
if (typeof window !== 'undefined') {
  const hasQueryParams = navigationHistory.history.some(entry => entry.path.includes('?'));
  if (hasQueryParams) {
    console.log('Clearing navigation history to remove query parameter entries');
    navigationHistory.clear();
  }
}

export default navigationHistory; 