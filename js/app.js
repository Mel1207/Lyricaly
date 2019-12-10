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
     * Add all event listeners to the DOM
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
     * Handle search action
     *
     * @returns
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

    handleLoadAllFavorites()
    {
        const favorites = Song.allFavorites();
        this.ui.clearFavoritesList(favorites.length == 0 ? 'You have no favorites' : null);
        favorites.forEach((song) => {            
            this.ui.createFavoriteItem(song);
        });
    }

    handleAddToFavorites(song)
    {
        if (song.inFavorites()) {
            this.ui.showNotification('Song already in favorites!', 'light-green darken-3')
            return;
        }

        if (Song.allFavorites().length == 0) {
            this.ui.clearFavoritesList();
        }

        song.addToFavorites();
        this.ui.createFavoriteItem(song);
        this.ui.showNotification('Song added to favorites!', 'green');
    }

    handleRemoveFromFavorites(song)
    {
        if (!song.inFavorites()) {
            this.ui.showNotification('Song not in favorites!', 'yellow darken-4')
            return;
        }

        song.removeFromFavorites();
        this.ui.removeFavoriteItem(song.id);
        this.ui.showNotification('Song removed from favorites', 'green')

        if (Song.allFavorites().length == 0) {
            this.ui.clearFavoritesList('You have no favorites');
        }
    }

    handleClearFavorites()
    {
        Song.clearFavorites();
        this.ui.clearFavoritesList('You have no favorites');
        this.ui.showNotification('Favorites cleared!', 'light-green darken-3')
    }
}

M.AutoInit();

window.App = App;
window.Song = Song;
window.UI = UI;

const ui = new UI();
const app = new App(ui);
app.bindEventListeners();