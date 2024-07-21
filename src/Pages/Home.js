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
        // console.log(data.genres);
        return data.genres;
      })
      .catch(error => {
        console.error(error);
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
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          setError(true);
          throw Error(`${response.status} - ${response.statusText}`);
        }
      })
      .then(data => {
        // console.log(data);
        return data.tracks;
      })
      .catch(error => {
        console.log(error);
      })
    // setDisplayedSong(trackResult)
    return tracksResult;
  }

  async function randomSearch() {
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
        {!isMobile ? (
          <button id='random' type='button' className='rand-button' onClick={handleRandomize}>
            <img src={DiceLogo} style={{ width: '30px', height: '30px', verticalAlign: 'middle', marginRight: '5px', marginTop: '2px', paddingBottom: '5px' }} />
            Randomize
          </button>
        ) : (
          <button id='random' type='button' className='rand-button-mobile' onClick={handleRandomize} style={{ borderRadius: '50%', padding: '3px 6px', justifyItems: 'center' }}>
            <img src={DiceLogo} style={{ width: '15vw', height: '15vw'}}/>
          </button>
        )}
        <PreviewPlayer src={displayedSong ? displayedSong.preview_url : ''} active={true} />
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
      <About/>
      {error && (
        <div className='errorContainer'>
          <p>Unable to connect to Spotify web services. We apologies for the inconvenience. Please try again later.</p>
        </div>
      )}
    </div>
  );
}

export default Home;
