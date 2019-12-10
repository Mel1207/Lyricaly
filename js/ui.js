export class UI
{
    constructor()
    {
        this.searchResults = document.querySelector('#search-results');
        this.searchForm = document.querySelector('#search-form');
        this.searchInput = document.querySelector('#search');
    }

    createResultItem(song)
    {  
        this.searchResults.innerHTML += `
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
                    <a href="javascript:void(0)" class="secondary-content song-favorite" data-id="${song.id}">
                        <i class="fas fa-star amber-text"></i>
                    </a>
                </div>
            </li>
        `;

    }

    createFavoriteItem(song)
    {

    }

    removeFavoriteItem()
    {

    }

    clearResultsList(message='')
    {   
        this.searchResults.innerHTML = message ? `
            <li class="song-item empty">
                <div class="content">
                    ${message}
                </div>
            </li>
        ` : '';
    }

    clearFavoritesList()
    {

    }

    showNotification(message, classes='')
    {
        M.toast({html: message, classes: classes});
    }

    showLoading()
    {
        this.searchResults.innerHTML = `
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

    hideLoading()
    {

    }
}