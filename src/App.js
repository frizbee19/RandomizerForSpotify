import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;


function App() {
  // const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [displayedSong, setDisplayedSong] = useState();
  const [displayedGenre, setDisplayedGenre] = useState("");
  const [genresList, setGenresList] = useState([]);
  const [autoplay, setAutoplay] = useState(false);
  const [autoplayQueue, setAutoplayQueue] = useState(false);

  // var genresList = [];

  const isMobile = false;

  useEffect(() => {
    var authOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }
    fetch('https://accounts.spotify.com/api/token', authOptions)
      .then(result => result.json())
      .then(data => {
        setAccessToken(data.access_token);
      })
  }, [])

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
    var genres = [];
    if (genresList.length == 0) {
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

  function getArtists() {
    return displayedSong.artists.map((artist, index) => (
      <span key={artist.uri}>
        <a href={artist.uri} target="_blank" rel="noopener noreferrer" className='name'>
          {artist.name}
        </a>
        {index < displayedSong.artists.length - 1 && ', '}
      </span>
    ));
  }

  function getLength() {
    let totalSeconds = Math.round(displayedSong.duration_ms / 1000);
    let minutes = "" + Math.floor(totalSeconds / 60);
    let seconds = "" + (totalSeconds % 60);
    if (seconds.length <= 1) {
      seconds = "0" + seconds;
    }
    return "" + minutes + ":" + seconds;
  }

  const handleAutoplay = () => {
    setAutoplayQueue(!autoplayQueue);
  }

  const handleRandomize = () => {
    randomSearch();
    setAutoplay(autoplayQueue);
  }

  return (
    <body>
      <div className='App-main'>
        {/* <FormControl
            placeholder='Search For Song'
            type='input'
            onChange={event => setSearchInput(event.target.value)}
          /> */}
        <div style={{ padding: '10px', margin: '10px' }}>
          <button type='button' className='rand-button' onClick={handleRandomize}>
            Randomize
          </button>
          <label className='checkContainer'>Autoplay
            <input value = "autoplay" type='checkbox' onChange={handleAutoplay} checked={autoplayQueue} className='checkbox'/>
            <span className='checkmark'></span>
          </label>
          
        </div>
        {displayedSong ? (

          <div style={{ flexDirection: !isMobile ? 'row' : 'column', marginBottom: '1.45em', display: 'flex', alignContent: 'flex-start', width: '60vw' }}>
            <div style={{ width: '300px', height: '300px', margin: '2% 7.5%', display: 'flex' }}>
              <a href={displayedSong.uri} style={{ width: '100%', height: 'auto' }}>
                <img src={displayedSong.album.images[0].url} style={{ width: '100%' }} />
              </a>
            </div>
            <div style={
              {
                flexDirection: 'column', flex: !isMobile ? 4 : '0 1 auto', marginRight: !isMobile ? '3em' : '0em',
                alignItems: 'flex-start', textAlign: 'left', width: '50vw'
              }}>
              <div style={{ marginBottom: '50px' }}>
                <p className='type'>Title &#9; <a className='name' href={displayedSong.uri}>{displayedSong.name}</a> &nbsp;
                  {displayedSong.explicit && <span className='explicit'>Explicit</span>}
                </p>
                <p className='type'>Artist &#9; {getArtists()} </p>
                <p className='type'>Album &#9; <a className='name' href={displayedSong.album.uri}>{displayedSong.album.name}</a></p>
                <p className='type'>Genre &#9; <span className='name'>{displayedGenre}</span></p>
                <p className='type'>Duration &#9; <span className='name'>{getLength()}</span></p>
              </div>
              <div>
                <p className='type' style={{fontSize: '0.5em'}}>Preview</p>
                <audio controls src={displayedSong.preview_url} autoPlay={autoplay}>

                </audio>
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )
        }
      </div>
    </body>
  );
}

export default App;
