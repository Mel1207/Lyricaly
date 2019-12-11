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

        // Check if song is undefined (not found)
        if (song == undefined) {
            return undefined;
        }

        // Convert plain object to `Song` instance
        return new Song(song.id, song.title, song.artist, song.album, song.year, song.cover);
    }

	/**
	 * Removes all favorites from `localStorage`
	 * 
	 * @memberof Song
	*/
    static clearFavorites()
    {
        // Empty favorites in localStorage
        localStorage.setItem('songs', JSON.stringify([]));
    }

	/**
	 * Searches songs using iTunes API
	 *
	 * @param keyword
	 * @returns {array}
	 * @memberof Song
	*/
    static async search(keyword)
    {
        /**
		 * Create unique request key, required to bypass CORS/CORB error.
		 * This is a dirty hack so iTunes won't block if we send to much
		 * AJAX requests in a short period of time.
		 *
		 * What this is doing is creating a unique string that we append
		 * to our fetch URL. It's okay if you don't understand this.
		*/
		const key = (Math.random() + Date.now()).toString(36).substring(2);

		// Create search URL string (Note that we appended the key)
		const url = `https://itunes.apple.com/search?media=music&entity=song&term=${keyword}&limit=10&country=PH&${key}`;

		// Intialize `results` array
		// So we can return an empty array, if AJAX fails
		let results = [];

		// Create AJAX request using `fetch`
        await fetch(url).then(response => {
            // Read response as json
            return response.json()
        })
        .then(response => {
        	// Loop through each response object
            response.results.forEach((result) => {
                // Check if result item has `kind` property of 'song'
                // Because sometimes iTunes will give us an audiobook (weird)
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

	/**
	 * Checks if song is in favorites
	 *
	 * @returns {boolean}
	 * @memberof Song
	*/
    inFavorites()
    {
    	// Find the song and check if its not undefined
        return Song.getFavorite(this.id) !== undefined;
    }

	/**
	 * Adds song to favorites
	 * 
	 * @memberof Song
	*/
    addToFavorites()
    {
        // First we check if song is already in favorites
        if (this.inFavorites()) {
        	// Stop the function, there's nothing to do here
        	return;
        }
        
        // Get all songs from `localStorage`
        let songs = Song.allFavorites();
        
        // Append current song
        songs.push(this);
        
        // Put the new songs array in `localStorage`
        localStorage.setItem('songs', JSON.stringify(songs));
    }

	/**
	 * Removes song from favorites
	 *
	 * @memberof Song
	*/
    removeFromFavorites()
    {
    	// Check if song is not in favorites
    	if (!this.inFavorites()) {
    		// Stop function, there's nothing to do here
    		return;
    	}
    
        // Get all songs from `localStorage`
        let songs = Song.allFavorites();
        
        // Filter through each song
        songs = songs.filter((song) => {
        	// Remove the ones that matches the `id` of the song we want to remove
            return song.id != this.id;
        });
        
        // Put the new songs array in `localStorage`
        localStorage.setItem('songs', JSON.stringify(songs));
    }
}