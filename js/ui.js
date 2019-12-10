export class UI
{
    constructor()
    {
        this.searchInput = document.querySelector('#search');
        this.searchForm = document.querySelector('#search-form');
        this.resultsList = document.querySelector('#results-list');
        this.favoritesList = document.querySelector('#favorites-list');
        this.clearFavorites = document.querySelector('#favorites-clear');
    }

    createResultItem(song)
    {  
        this.resultsList.innerHTML += `
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

    createFavoriteItem(song)
    {
        this.favoritesList.innerHTML += `
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

    removeFavoriteItem(id)
    {
        const favoriteItem = this.favoritesList.querySelector(`.song-item#favorite-${id}`);
        if (favoriteItem) {
            favoriteItem.remove();
        }
    }

    clearResultsList(message=null)
    {   
        this.resultsList.innerHTML = message ? `
            <li class="song-item empty">
                <div class="content">
                    ${message}
                </div>
            </li>
        ` : '';
    }

    clearFavoritesList(message=null)
    {
        this.favoritesList.innerHTML = message ? `
            <li class="song-item empty">
                <div class="content">
                    ${message}
                </div>
            </li>
        ` : '';
    }

    showNotification(message, classes='')
    {
        M.Toast.dismissAll();
        M.toast({html: message, classes: classes, displayLength: 1500});
    }

    showLoading()
    {
        this.resultsList.innerHTML = `
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