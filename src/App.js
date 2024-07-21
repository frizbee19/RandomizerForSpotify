import './App.css';
import './Mobile.css';
import { useState, useEffect } from 'react';
import { Buffer } from 'buffer';

import Home from './Pages/Home';
import { MobileProvider, useMobile } from './Components/MobileProvider';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;

const REDIRECT_URI = "http://127.0.0.1:3000/index.html/"
const AUTHORIZE = "https://accounts.spotify.com/authorize"
const TOKEN = "https://accounts.spotify.com/api/token"


function App() {
  // const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(false);

  // var genresList = [];

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
        .then(result => {
          if (result.ok) {
            return result.json();
          } else {
            setError(true);
            throw Error(`${result.status} - ${result.statusText}`)
          }
        })
        .then(data => {
          setAccessToken(data.access_token);
        })
        .catch(error => {
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
          setError(true);
          throw new Error(`HTTP error! status: ${result.status}`);
        }
        return result.json();
      })
      .then(data => {
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


  return (
    <MobileProvider>
      <Home accessToken={accessToken} error={error}/>
    </MobileProvider>
  );
}

export default App;
