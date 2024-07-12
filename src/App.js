import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import { Buffer } from 'buffer';
import SpotifyWebPlayer from 'react-spotify-web-playback';
import InfoDisplay from './Components/InfoDisplay';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;

const REDIRECT_URI = "http://127.0.0.1:3000/index.html/"
const AUTHORIZE = "https://accounts.spotify.com/authorize"
const TOKEN = "https://accounts.spotify.com/api/token"


function App() {
  // const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [displayedSong, setDisplayedSong] = useState();
  const [displayedGenre, setDisplayedGenre] = useState("");
  const [genresList, setGenresList] = useState([]);
  const [autoplay, setAutoplay] = useState(false);
  const [autoplayQueue, setAutoplayQueue] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // var genresList = [];

  const isMobile = false;

  useEffect(() => {
    if (window.location.search.length > 0) {
      console.log("handle redirect");
      handleRedirect();
    }
    else {
      console.log("client credentials");
      var authOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
      }
      fetch(TOKEN, authOptions)
        .then(result => result.json())
        .then(data => {
          console.log(data);
          setAccessToken(data.access_token);
        })
    }
  }, [])




  function handleRedirect() {
    console.log("logged in")
    let code = getCode();
    let body = "grant_type=authorization_code";
    body += "&code=" + code;
    body += "&redirect_uri=" + REDIRECT_URI;
    body += "&client_id=" + CLIENT_ID;
    body += "&client_secret" + CLIENT_SECRET;

    var authOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
      },
      body: body
    }
    fetch(TOKEN, authOptions)
      .then(result => {
        if (!result.ok) {
          throw new Error(`HTTP error! status: ${result.status}`);
        }
        return result.json();
      })
      .then(data => {
        console.log(data);
        setAccessToken(data.access_token);
        setRefreshToken(data.refresh_token);
        setIsLoggedIn(true)
      })
      .catch(error => {
        console.log('Fetch error:', error);
      })

  }

  function getCode() {
    let code = null;
    const queryString = window.location.search;
    if (queryString.length > 0) {
      const urlParams = new URLSearchParams(queryString);
      code = urlParams.get('code');
    }
    return code;
  }

  function requestAuthorization() {
    let url = AUTHORIZE;
    url += "?client_id=" + CLIENT_ID;
    url += "&response_type=code";
    url += "&redirect_uri=" + REDIRECT_URI;
    url += "&show_dialog=true";
    url += "&scope=streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state user-library-read user-library-modify";
    window.location.href = url;
  }

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
      .then(response => response.json())
      .then(data => {
        // console.log(data.genres);
        return data.genres;
      });
    return genresResult;
  }

  async function search(query, offset = 0, genre = '') {
    // console.log("Search for " + searchInput)


    var searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }
    var tracksResult = await fetch('https://api.spotify.com/v1/search?q=' + query + '%20genre%3A' + genre + '&type=track' + '&offset=' + offset, searchParameters)
      .then(response => response.json())
      .then(data => {
        // console.log(data);
        return data.tracks;
      })
    // setDisplayedSong(trackResult)
    return tracksResult;
  }

  async function randomSearch() {
    console.log(accessToken);
    var genres = [];
    if (genresList.length === 0) {
      console.log('Getting genres...');
      genres = await getGenreList();
      setGenresList(genres);
    }
    else {
      genres = genresList;
    }
    let randomGenre = '' + genres[Math.floor(Math.random() * genres.length)];
    console.log("genre: " + randomGenre);
    let randomOffset = 0;
    randomOffset = Math.floor(Math.random() * 1000);
    // console.log(randomOffset)
    let tracks = await search(generateRandomQuery(), randomOffset, randomGenre);
    if (!tracks || !tracks.items[0]) {
      console.log("retrying search");
      randomSearch();
    }
    else {
      setDisplayedSong(tracks.items[0]);
      console.log(tracks.items[0]);
      let genre = () => {
        let result = "";
        for (const word of randomGenre.split('-')) {
          result += word[0].toUpperCase() + word.substring(1) + " ";
        }
        return result.trim();
      }
      setDisplayedGenre(genre);
    }
  }

  const handleAutoplay = () => {
    setAutoplayQueue(!autoplayQueue);
  }

  const handleRandomize = () => {
    randomSearch();
    setAutoplay(autoplayQueue);
  }

  return (
    <div className='App-main'>
      <div style={{ padding: '10px', margin: '10px' }}>
        <button type='button' className='rand-button' onClick={handleRandomize}>
          Randomize
        </button>
        {/* <button type='button' className='rand-button' onClick={requestAuthorization}>
          Log In
        </button> */}
        <label className='checkContainer'>Autoplay
          <input value="autoplay" type='checkbox' onChange={handleAutoplay} checked={autoplayQueue} className='checkbox' />
          <span className='checkmark'></span>
        </label>

      </div>
      {displayedSong ? (
        <div>
          <InfoDisplay displayedSong={displayedSong} displayedGenre={displayedGenre} isMobile={isMobile} />
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
          <div>
            <p className='type' style={{ fontSize: '0.5em' }}>Preview</p>
            <audio controls src={displayedSong.preview_url} autoPlay={autoplay}>

            </audio>

          </div>
        </div>
      ) : (
        <div></div>
      )
      }
    </div>
  );
}

export default App;
