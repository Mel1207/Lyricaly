/**
 * @class Song
 */
export class Song
{
    /**
     * Creates an instance of Song.
     * @param {*} id
     * @param {string} title
     * @param {string} artist
     * @param {string} [album='']
     * @param {string} [year='']
     * @param {string} [cover='']
     * @memberof Song
     */
    constructor(id, title, artist, album = '', year = '', cover = '')
    {
        this.id = id;
        this.title = title;
        this.artist = artist;
        this.album = album;
        this.year = year;
        this.cover = cover;
    }

    /**
     * Retrieves all favorite songs from `localStorage`.
     * 
     * @static
     * @returns {array}
     * @memberof Song
     */
    static allFavorites()
    {
        // Get 'songs' from localStorage
        let songs = localStorage.getItem('songs');

        // If songs is null, set it to an empty array, else parse JSON
        if (songs === null) {
            songs = [];
        } else {
            songs = JSON.parse(songs);
        }

        // Map (convert) each plain object to `Song` instance
        return songs.map((song) => {
            return new Song(song.id, song.title, song.artist, song.album, song.year, song.cover);
        });
    }

    /**
     * Retrieves single favorite song from `localStorage`
     *
     * @static
     * @param {*} id
     * @returns {Song}
     * @memberof Song
     */
    static getFavorite(id)
    {
        // Get all favorite songs
        let songs = Song.allFavorites();

        // Find song matching specified `id`
        let song = songs.find((song) => {
            return song.id == id;
        });

        // Convert plain object to `Song` instance
        return new Song(song.id, song.title, song.artist, song.album, song.year, song.cover);
    }

    static async search(keyword)
    {
        // Search songs from iTunes API
        // Create unique request key, required to bypass CORS/CORB error
		const key = (Math.random() + Date.now()).toString(36).substring(2);

		// Create search URL string
		const url = `https://itunes.apple.com/search?media=music&entity=song&term=${keyword}&limit=10&country=PH&${key}`;

		// Intialize `results` array
		let results = [];

		// Create AJAX request using `fetch`
        await fetch(url).then(response => {
            // Read response as json
            return response.json()
        })

        // Loop through each response object
        .then(response => {
            response.results.forEach((result) => {
                // Check if result item has `kind` property of 'song'
                if (result.kind === 'song') {

                    // Convert each item to a new `Song` instance then append it to `results`
                    results.push(new Song(
                        result.trackId, // id
                        result.trackName, // title
                        result.artistName, // artist						
                        result.collectionName, // album,
                        (new Date(result.releaseDate)).getFullYear(), // year
                        result.artworkUrl100 // cover
                    ));
                }
            });
        });

		return results;			
    }

    inFavorites()
    {
        // Check if song is in favorites
        return Song.getFavorite(this.id) !== undefined;
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
        let songs = Song.allFavorites();
        songs = songs.filter((song) => {
            return song.id != this.id;
        });
        localStorage.setItem('songs', JSON.stringify(songs));
    }

    clearFavorites()
    {
        // Empty favorites in localStorage
        localStorage.setItem('songs', JSON.stringify([]));
    }
}