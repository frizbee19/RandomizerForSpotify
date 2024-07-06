import React, { Component, useState } from "react";
import { Buffer } from "buffer";

function RandomSearch() {
  var client_id = process.env.CLIENT_ID;
  var client_secret = process.env.CLIENT_SECRET;

  // const [query, setQuery] = useState("");

  async function accessSpotifyAPI() {
    const request = require('request')

    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Authorization': 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
      },
      form: {
        grant_type: 'client_credentials'
      },
      json: true
    };

    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const token = body.access_token;
      }
    })
  }

  // const handleChange = (e) => setQuery(e)
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   this.accessSpotifyAPI(query)
  //   this.setQuery("")
  // }

  // async function getToken() {
  //   const response = await fetch('https://accounts.spotify.com/api/token', {
  //     method: 'POST',
  //     body: new URLSearchParams({
  //       'grant_type': 'client_credentials',
  //     }),
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //       'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
  //     },
  //   });
  
  //   return await response.json();
  // }
  
  // async function getTrackInfo(access_token) {
  //   const response = await fetch("https://api.spotify.com/v1/tracks/4cOdK2wGLETKBW3PvgPWqT", {
  //     method: 'GET',
  //     headers: { 'Authorization': 'Bearer ' + access_token },
  //   });
  
  //   return await response.json();
  // }
  
  // getToken().then(response => {
  //   getTrackInfo(response.access_token).then(profile => {
  //     console.log(profile)
  //   })
  // });



  return (
    <div>
      <h2>SEARCH FOR A SONG</h2>
    </div>
  )





}

export default RandomSearch;