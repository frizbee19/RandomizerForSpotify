import '../App.css';
import '../Mobile.css';
import { useState, useEffect } from 'react';

import InfoDisplay from '../Components/InfoDisplay';
import PreviewPlayer from '../Components/PreviewPlayer';
import About from '../Components/About';
import { useMobile } from '../Components/MobileProvider';

import DiceLogo from '../Icons/DiceLogo.svg';
import BannerLogo from '../Icons/BannerLogo.svg';

function Home(props) {
  // const [searchInput, setSearchInput] = useState("");
  const [displayedSong, setDisplayedSong] = useState();
  const [displayedGenre, setDisplayedGenre] = useState("");
  const [genresList, setGenresList] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [showExplicit, setShowExplicit] = useState(false);
  // const [autoplay, setAutoplay] = useState(false);
  // const [autoplayQueue, setAutoplayQueue] = useState(false);
  const [error, setError] = useState(props.error);

  // var genresList = [];
  var accessToken = props.accessToken;
  var isMobile = useMobile();

  var displayType = isMobile ? 'App-mobile' : 'App-main';

  useEffect(() => {
    setError(props.error);
  }, [props.error]);

  useEffect(() => {
    if (props.accessToken) {
      getGenreList()
        .then(genres => {
          setGenresList(genres);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [props.accessToken]);

  function generateRandomQuery() {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';

    const randomCharacter = characters.charAt(Math.floor(Math.random() * characters.length));
    let randomQuery = '';

    // if (Math.random() < 0.5) {
    //   randomQuery = randomCharacter + '%';
    // }
    // else {
    //   randomQuery = '%' + randomCharacter + '%'
    // }
    randomQuery = randomCharacter;

    if (Math.random() < 0.5) {
      randomQuery = randomQuery.toUpperCase();
    }
    console.log(randomQuery);


    return randomQuery;
  }

  async function getGenreList(access_token = accessToken) {
    var searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + access_token
      }
    }
    var genresResult = await fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds', searchParameters)
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          setError(true);
          throw Error(`${response.status} - ${response.statusText}`);
        }
      })
      .then(data => {
        console.log(data.genres);
        return data.genres;
      })
      .catch(error => {
        console.error(error);
      });
    return genresResult;
  }

  /* ---------------------------- TRACK SEARCH ----------------------------*/


  /**
   * Performs a search for a song with the specified query, offset, and genre.
   *
   * @param {string} query - The search query.
   * @param {number} [offset=0] - The offset of the search results.
   * @param {string} [genre=''] - The genre of the song.
   * @return {Promise<Object>} - A promise that resolves to the search results.
   */
  async function search(query, offset = 0, genre = '') {
    // Construct the search URL
    const searchUrl = `https://api.spotify.com/v1/search?q=${query}%20genre%3A${genre}&type=track&offset=${offset}`;

    var searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }

    // Perform the search and handle the response
    var tracksResult = await fetch(searchUrl, searchParameters)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          setError(true);
          throw Error(`${response.status} - ${response.statusText}`);
        }
      })
      .then(data => {
        // Return the search results
        // console.log(data.tracks);
        return data.tracks;
      })
      .catch(error => {
        console.log(error);
      })

    // Return the search results
    return tracksResult;
  }

  /**
   * Performs a random search for a song with the specified genre and offset.
   * If no genre is selected, it selects a random genre from the list of available genres.
   * If the song is explicit and the `showExplicit` flag is not set, it performs a new random search.
   * Otherwise, it sets the displayed song and genre.
   */
  async function randomSearch() {
    // Get the list of genres if it is empty, otherwise use the cached list
    let genres = genresList.length === 0 ? await getGenreList() : genresList;
    
    // Update the list of genres
    setGenresList(genres);

    // Select a random genre from the list
    let randomGenre = selectedGenre.length === 0
      ? genres[Math.floor(Math.random() * genres.length)]
      : selectedGenre;

    // Generate a random offset
    let randomOffset = Math.floor(Math.random() * 1000);

    // Perform the search with the specified query, offset, and genre
    let tracks = await search(generateRandomQuery(), randomOffset, randomGenre);

    // Check if the search returned a valid song
    if (!tracks || !tracks.items[0] || (tracks.items[0].explicit && !showExplicit)) {
      // If the song is explicit and the `showExplicit` flag is not set, perform a new random search
      randomSearch();
    } else {
      // Set the displayed song and format the genre
      setDisplayedSong(tracks.items[0]);
      let formattedGenre = formatGenre(randomGenre);
      setDisplayedGenre(formattedGenre);
    }
  }

  // /* ---------------------------- ALBUM SEARCH ----------------------------*/

  // /**
  //  * Performs a search for an album with the specified query, offset, and genre.
  //  *
  //  * @param {string} query - The search query.
  //  * @param {number} [offset=0] - The offset of the search results.
  //  * @param {string} [genre=''] - The genre of the song.
  //  * @return {Promise<Object>} - A promise that resolves to the search results.
  //  */
  // async function albumSearch(query, offset = 0, genre = '', hipster = false) {
  //   // Construct the search URL
  //   const searchUrl = `https://api.spotify.com/v1/search?q=${query}&type=album&offset=${offset}`;

  //   var searchParameters = {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer ' + accessToken
  //     }
  //   }

  //   // Perform the search and handle the response
  //   var albumsResult = await fetch(searchUrl, searchParameters)
  //     .then(response => {
  //       if (response.ok) {
  //         return response.json();
  //       } else {
  //         setError(true);
  //         throw Error(`${response.status} - ${response.statusText}`);
  //       }
  //     })
  //     .then(data => {
  //       // Return the search results
  //       console.log(data);
  //       return data.albums;
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     })

  //   // Return the search results
  //   return albumsResult;
  // }

  // async function getAlbumTracks(albumId) {
  //   var searchParameters = {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer ' + accessToken
  //     }
  //   }
  //   var tracksResult = await fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks`, searchParameters)
  //     .then(response => {
  //       if (response.ok) {
  //         return response.json();
  //       } else {
  //         setError(true);
  //         throw Error(`${response.status} - ${response.statusText}`);
  //       }
  //     })
  //     .then(data => {
  //       // console.log(data.tracks);
  //       return data.tracks;
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });
  //   return tracksResult;
  // }

  // async function randomSearchFromAlbum() {
  //   // Get the list of genres if it is empty, otherwise use the cached list
  //   let genres = genresList.length === 0 ? await getGenreList() : genresList;
    
  //   // Update the list of genres
  //   setGenresList(genres);

  //   // Select a random genre from the list
  //   let randomGenre = selectedGenre.length === 0
  //     ? genres[Math.floor(Math.random() * genres.length)]
  //     : selectedGenre;

  //   // Generate a random offset
  //   let randomOffset = Math.floor(Math.random() * 1000);

  //   // Perform the search with the specified query, offset, and genre
  //   let albums = await albumSearch(generateRandomQuery(), randomOffset, randomGenre);

  //   // Check if the search returned a valid album
  //   if (!albums || !albums.items[0]) {
  //     // If the album is not valid, perform a new random search
  //     console.log("Album not found");
  //     // randomSearchFromAlbum();
  //   } else {
  //     // Set the displayed album and format the genre
  //     let randomAlbum = albums.items[0];
  //     let formattedGenre = formatGenre(randomGenre);
  //     setDisplayedGenre(formattedGenre);
      
  //     // Use the album's id to call getAlbumTracks()
  //     let tracks = await getAlbumTracks(randomAlbum.id);
      
  //     // Return a random track from the list of tracks
  //     let randomTrack = tracks.items[Math.floor(Math.random() * tracks.items.length)];

  //     // Check if the search returned a valid track or if the track is explicit
  //     // if (!randomTrack || (randomTrack.explicit && !showExplicit)) {
  //     //   // If the track is not valid, perform a new random search
  //     //   randomSearchFromAlbum();
  //     // }

  //     setDisplayedSong(randomTrack);
  //   }
  // }



  function formatGenre(genre) {
    return genre.toLowerCase().split('-').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1) + ' ';
    }).join('').trim();
  }

  // const handleAutoplay = () => {
  //   setAutoplayQueue(!autoplayQueue);
  // }

  const handleRandomize = () => {
    randomSearch();
    document.getElementById("random").disabled = true;
    setTimeout(() => {
      document.getElementById("random").disabled = false;
    }, 1000);
    // setAutoplay(autoplayQueue);
  }

  function toggleExplicit() {
    setShowExplicit(!showExplicit);
  }

  const onGenreSelect = (event) => {
    setSelectedGenre(event.target.value);
  }

  return (
    <div className={displayType}>
      {!isMobile ? (
        <div className='header'>
          <img src={BannerLogo} style={{ height: '60px' }} />
        </div>
      ) : (
        <img src={BannerLogo} style={{ width: '90%', margin: '.5em 0em' }} />
      )}
      <div className={!isMobile ? 'controlContainer' : 'controlContainerMobile'}>
        {!isMobile && (
          <select id='genreSelect' onChange={onGenreSelect} >
            <option value=''>Any Genre</option>
            {genresList.map((genre, index) => (
              <option key={index} value={genre}>{
                genre.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
              }</option>
            ))}
          </select>
        )}
        {!isMobile ? (
          <button id='random' type='button' className='rand-button' onClick={handleRandomize}>
            <img src={DiceLogo} style={{ width: '30px', height: '30px', verticalAlign: 'middle', marginRight: '5px', marginTop: '2px', paddingBottom: '5px' }} />
            Randomize
          </button>
        ) : (
          <button id='random' type='button' className='rand-button-mobile' onClick={handleRandomize} style={{ borderRadius: '50%', padding: '3px 6px', justifyItems: 'center' }}>
            <img src={DiceLogo} style={{ width: '15vw', height: '15vw' }} />
          </button>
        )}
        <PreviewPlayer src={displayedSong ? displayedSong.preview_url : ''} active={true} />
          <label className='checkContainer checkContainerMobile'>{!isMobile ? 'Show Explicit Content' : 'Explicit'}
            <input value="autoplay" type='checkbox' onChange={toggleExplicit} checked={showExplicit} className='checkbox' />
            <span className='checkmark'></span>
          </label>
        {isMobile &&
          (
            <div>
              <select id='genreSelect' onChange={onGenreSelect}>
                <option value=''>Any Genre</option>
                {genresList.map((genre, index) => (
                  <option key={index} value={genre}>{
                    genre.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
                  }</option>
                ))}
              </select>
            </div>
          )}
        {/* <button type='button' className='rand-button' onClick={requestAuthorization}>
          Log In
        </button> */}


      </div>
      {displayedSong && (
        <div>
          <InfoDisplay displayedSong={displayedSong} displayedGenre={displayedGenre} />
          {/* {isLoggedIn ? (
            <div>
              <SpotifyWebPlayer token={accessToken} showSaveIcon uris={displayedSong ? [displayedSong.uri] : []}
                  styles={{bgColor: '#191414', color: '#ffffff', loaderColor: '#ffffff', sliderHandleColor: '#ffffff', sliderColor: '#1db954',
                  trackNameColor: '#ffffff', trackArtistColor: '#a0a0a0', sliderTrackColor: '#a0a0a0'}} 
                  hideCoverArt='true' hideAttribution='true' autoplay={autoplay}
                />
            </div>
          ) : (
            
          )} */}
        </div>
      )
      }
      <About />
      {error && (
        <div className='errorContainer'>
          <p>Unable to connect to Spotify web services. We apologies for the inconvenience. Please try again later.</p>
        </div>
      )}
    </div>
  );
}

export default Home;
