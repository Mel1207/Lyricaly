import { Song } from './song.js';
import { UI } from './ui.js';

class App
{
    constructor(ui)
    {
        this.ui = ui;
    }

    bindEventListeners()
    {
        this.ui.searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSearch();
        })
    }

    handleSearch()
    {
        const keyword = this.ui.searchInput.value.trim();

        if (keyword.length == 0) {
            this.ui.showNotification('Please enter a search term');
            return;
        }

        this.ui.showLoading();
        Song.search(keyword).then(results => {
            this.ui.clearResultsList();
            results.forEach(song => {
                this.ui.createResultItem(song);                
            })
        });
    }

    handleAddToFavorites()
    {

    }

    handleRemoveFromFavorites()
    {

    }

    handleClearFavorites()
    {

    }
}

window.App = App;
window.Song = Song;
window.UI = UI;

const app = new App(new UI());
app.bindEventListeners();