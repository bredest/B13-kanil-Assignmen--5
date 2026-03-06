/**
 * Utility functions for GitHub Issue Tracker
 */

const utils = {
    /**
     * Format a date string to a human-readable format
     * @param {string} dateString 
     * @returns {string}
     */
    formatDate: (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    },

    /**
     * Show/hide an element
     * @param {string} id 
     * @param {boolean} show 
     * @param {string} displayType 
     */
    toggleVisibility: (id, show, displayType = 'block') => {
        const el = document.getElementById(id);
        if (el) {
            el.style.display = show ? displayType : 'none';
        }
    },

    /**
     * Clear all children from an element
     * @param {string} id 
     */
    clearContainer: (id) => {
        const container = document.getElementById(id);
        if (container) {
            container.innerHTML = '';
        }
    }
};
