export class Song
{
    constructor(id, title, artist, album, year, cover)
    {
        this.id = id;
        this.title = title;
        this.artist = artist;
        this.album = album;
        this.year = year;
        this.cover = cover;
    }

    static allFavorites()
    {
        let songs = localStorage.getItem('songs');
        if (songs === null) {
            songs = [];
        } else {
            songs = JSON.parse(songs);
        }

        return songs;
    }

    static getFavorite(id)
    {
        // Get single favorite from localStorage by ID
        let result = songs.find((song) => {
            return song.id === id;
        });

        return result;
    }

    static async search(keyword)
    {
        // Search songs from iTunes API
    }

    get inFavorites()
    {
        // Check if song is in favorites
    }

    addToFavorites()
    {
        // Add song to favorites in localStorage
        let songs = Song.allFavorites();
        songs.push(this);
        localStorage.setItem('songs', JSON.stringify(songs));

    }

    removeFromFavorites()
    {
        // Remove song from favorites in localStorage
    }

    clearFavorites()
    {
        // Empty favorites in localStorage
    }
}