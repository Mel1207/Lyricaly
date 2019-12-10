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
        document.querySelector('#form').addEventListener('submit', e => {
            e.preventDefault();
            this.handleSearch();
        });
    }

    handleSearch()
    {
        Song.search(ui.searchInput).then(results => {
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