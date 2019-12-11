/**
 * View object.
 * Handles DOM Manipulation.
 *
 * @class UI
*/
export class UI
{
    /**
     * Creates a new instance of UI
     *
     * @memberof UI
    */
    constructor()
    {
        this.searchInput = document.querySelector('#search');
        this.searchForm = document.querySelector('#search-form');
        this.resultsList = document.querySelector('#results-list');
        this.favoritesList = document.querySelector('#favorites-list');
        this.clearFavorites = document.querySelector('#favorites-clear');
    }
    
    /**
     * Appends new item in results list
     *
     * @param {Song} song
     * @memberof UI
    */
    createResultItem(song)
    {  
        this.resultsList.innerHTML += /* html */`
            <li class="song-item" id="result-${song.id}">
                <div class="song-image">
                    <img src="${song.cover}" alt="${song.album} Artwork">
                </div>
                <div class="song-info">
                    <div class="title">${song.title}</div>
                    <div class="details">
                        <span>${song.artist}</span>
                        <span>${song.album} (${song.year})</span>
                    </div>
                </div>
                <div class="song-actions">
                    <a href="javascript:void(0)" class="secondary-content song-favorite" song-id="${song.id}">
                        <i class="fas fa-star amber-text"></i>
                    </a>
                </div>
            </li>
        `;
    }

    /**
     * Appends new item in favorites list
     *
     * @param {Song} Song
     * @memberof UI
    */
    createFavoriteItem(song)
    {
        this.favoritesList.innerHTML += /* html */`
            <li class="song-item" id="favorite-${song.id}">
                <div class="song-image">
                    <img src="${song.cover}" alt="${song.album} Artwork">
                </div>
                <div class="song-info">
                    <div class="title">${song.title}</div>
                    <div class="details">
                        <span>${song.artist}</span>
                        <span>${song.album} (${song.year})</span>
                    </div>
                </div>
                <div class="song-actions">
                    <a href="javascript:void(0)" class="secondary-content favorite-remove" song-id="${song.id}">
                        <i class="fas fa-times grey-text"></i>
                    </a>
                </div>
            </li>
        `;
    }

    /**
     * Removes item from favorites list using specifies `id`
     *
     * @param {*} id
     * @memberof UI
    */
    removeFavoriteItem(id)
    {
        // Find element with class `song-item` and id of `favorite-${id}`
        const favoriteItem = this.favoritesList.querySelector(`.song-item#favorite-${id}`);
        
        // Remove element if found
        if (favoriteItem) {
            favoriteItem.remove();
        }
    }

    /**
     * Removes all items from results list, append given message
     *
     * @param {string} message
     * @memberof UI
    */
    clearResultsList(message=null)
    {   
    	let content = '';
    
        // If message is not null, replace content with message
        if (message) {
            content = /* html */`
                <li class="song-item empty">
                    <div class="content">
                        ${message}
                    </div>
                </li>
            `;
        }
        
        this.resultsList.innerHTML = content;
    }

    /**
     * Removes all items from favorites list, append given message
     *
     * @param {string} message
     * @memberof UI
    */
    clearFavoritesList(message=null)
    {
        
        let content = '';
    
        // If message is not null, replace content with message
        if (message) {
            content = /* html */`
                <li class="song-item empty">
                    <div class="content">
                        ${message}
                    </div>
                </li>
            `;
        }
        
        this.favoritesList.innerHTML = content;
    }
    
    /**
     * Shows material toast notification
     *
     * @param {string} message
     * @param {string} classes
     * @memberof UI
    */
    showNotification(message, classes='')
    {
        // Remove all existing toast notifications
        M.Toast.dismissAll();
        
        // Show toast message
        M.toast({html: message, classes: classes, displayLength: 1500});
    }

    /**
     * Clears results list and appends loading animation
     *
     * @memberof UI
    */
    showLoading()
    {
        this.resultsList.innerHTML = /* html */`
            <li class="song-item empty">
                <div class="content">
                    <div class="preloader-wrapper active">
                        <div class="spinner-layer spinner-red-only">
                            <div class="circle-clipper left">
                                <div class="circle"></div>
                            </div>
                            <div class="gap-patch">
                                <div class="circle"></div>
                            </div>
                            <div class="circle-clipper right">
                                <div class="circle"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        `;
    }
}