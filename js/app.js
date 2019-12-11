import { Song } from './song.js';
import { UI } from './ui.js';

/**
 * Application controller.
 * Handles DOM events and actions.
 *
 * @class App
 */
class App
{
    /**
     * Creates an instance of App.
     * 
     * @param {UI} ui
     * @memberof App
     */
    constructor(ui)
    {
        this.ui = ui;
        this.searchResults = [];
    }

    /**
     * Adds all event listeners to the DOM
     *
     * @memberof App
     */
    bindEventListeners()
    {
        // Add startup event
        document.addEventListener('DOMContentLoaded', () => {
            // Load all favorites from storage
            this.handleLoadAllFavorites();
        });

        // Add search form submit event
        this.ui.searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSearch();
        });

		// Add clear favorites event
        this.ui.clearFavorites.addEventListener('click', () => {
            this.handleClearFavorites();
        });

        // Add favorite (star) button click event
        this.ui.resultsList.addEventListener('click', (e) => {
            // Check if `.song-favorite` (star) button is clicked
            const favoriteButton = e.target.closest('.song-item .song-favorite');
            if (favoriteButton) {
                // Get `song-id` attribute from `favoriteButton`
                const songId = favoriteButton.getAttribute('song-id');

                // Find song in `searchResults` using `songId`
                const song = this.searchResults.find((result) => {
                    return result.id == songId
                });

                if (song !== undefined) {
                    this.handleAddToFavorites(song);
                }

            }
        });

        // Add remove favorite (x) button click event
        this.ui.favoritesList.addEventListener('click', (e) => {
            // Check if `.remove-favorite` (x) button is clicked
            const unfavoriteButton = e.target.closest('.song-item .favorite-remove');
            if (unfavoriteButton) {
                // Get `song-id` attribute from `favoriteButton`
                const songId = unfavoriteButton.getAttribute('song-id');

                // Find song in `localStorage` using `songId`
                const song = Song.getFavorite(songId)

                if (song !== undefined) {
                    this.handleRemoveFromFavorites(song);
                }

            }
        });
    }

    /**
     * Handles search action
     *
     * @memberof App
     */
    handleSearch()
    {
        // Get the value of search input, remove leading and trailing whitespace
        const keyword = this.ui.searchInput.value.trim();

        // Check if keyword is empty, show error if true
        if (keyword.length == 0) {
            this.ui.showNotification('Please enter a search term');
            return;
        }

        // Show loading spinner
        this.ui.showLoading();
        
        Song.search(keyword).then(results => {
            // Clear results list, show message if results is empty
            this.ui.clearResultsList(results.length == 0 ? `Cannot find any song matching '${keyword}'. Try something else.` : null);

            // Add the results to this `searchResults` property, so we can access it later
            this.searchResults = results;

            // Loop through each song
            results.forEach(song => {
                // Create list item
                this.ui.createResultItem(song);                
            })
        });
    }

	/**
	 * Handles loading all favorites from `localStorage`
	 *
	 * @memberof App
	*/
    handleLoadAllFavorites()
    {
    	// Get all favorites
        const favorites = Song.allFavorites();
        
        // Clear favorites list content, show message if favorites is empty
        this.ui.clearFavoritesList(favorites.length == 0 ? 'You have no favorites' : null);
        
        // Loop through each favorites
        favorites.forEach((song) => {           
			// Append favorite item to the favorites list 
            this.ui.createFavoriteItem(song);
        });
    }

	/**
	 * Handles add to favorites
	 *
	 * @param {Song} song
	 * @memberof App
	*/
    handleAddToFavorites(song)
    {
    	// If song is already in favorites, show notification and stop the function
        if (song.inFavorites()) {
            this.ui.showNotification('Song already in favorites!', 'light-green darken-3')
            return;
        }

		// If favorites is empty, remove content of favorites list
        if (Song.allFavorites().length == 0) {
            this.ui.clearFavoritesList();
        }

		// Add song to favorites in `localStorage`
        song.addToFavorites();
        
        // Append new item in favorites list
        this.ui.createFavoriteItem(song);
        
        // Notify the user
        this.ui.showNotification('Song added to favorites!', 'green');
    }

	/**
	 * Handles remove from favorites
	 * 
	 * @param {Song} song
	 * @memberof App
	*/
    handleRemoveFromFavorites(song)
    {
    	// If song is not in favorites, show notification and stop the function
        if (!song.inFavorites()) {
            this.ui.showNotification('Song not in favorites!', 'yellow darken-4');
            return;
        }

		// Remove song from `localStorage`
        song.removeFromFavorites();
        
        // Remove item from favorites list
        this.ui.removeFavoriteItem(song.id);
        
        // There are no favorites left, show message
        if (Song.allFavorites().length == 0) {
            this.ui.clearFavoritesList('You have no favorites');
        }
        
        // Notify the user
        this.ui.showNotification('Song removed from favorites', 'green');
    }

	/**
	 * Handles clear favorites
	 * 
	 * @memberof App
	*/
    handleClearFavorites()
    {
    	// Clear favorites from `localStorage`
        Song.clearFavorites();
        
        // Remove all items from favorites list
        this.ui.clearFavoritesList('You have no favorites');
        
        // Notify the user
        this.ui.showNotification('Favorites cleared!', 'light-green darken-3');
    }
}

// Initialize MaterializeCSS components
// This is required according to the documentation
M.AutoInit();

// Initialize new UI instance
const ui = new UI();

// Initialize new App instance, pass the ui as parameter
const app = new App(ui);

// Bind all event listeners to the DOM
app.bindEventListeners();

// This is for debugging, so we can access the classes in console
// Comment this out when deploying
window.app = app;
wjndow.ui = ui;
window.Song = Song;