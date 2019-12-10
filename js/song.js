export class Song
{
    constructor(id, title, artist, album = '', year = '', cover = '')
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
        let songs = Song.allFavorites();
        let result = songs.find((song) => {
            return song.id == id;
        });
        return result;
    }

    static async search(keyword)
    {
        // Search songs from iTunes API
        // Create unique request key, required to bypass CORS/CORB error
		const key = (Math.random() + Date.now()).toString(36).substring(2);

		// Create search URL string
		const url = `https://itunes.apple.com/search?media=music&entity=song&term=${keyword}&${key}`;

		// Intialize results array
		let results = [];

		// Create HTTP request using `fetch`
		const request = await fetch(url, {
			method: 'GET',
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Accept': 'application/json',
				'Authorization': 'Bearer ' + key,
				'Content-Type': 'application/json'
			},
		})

		// Read the response as JSON and convert it to Object
		.then(response => {
			return response.json()
		})

		// Do stuff with the data
		.then(response => {
			response.results.forEach((result) => {
				// Check if result item has `kind` property of 'song'
				if (result.kind === 'song') {

					// Convert each item to a new `Song` object
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