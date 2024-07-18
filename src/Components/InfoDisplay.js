
import SpotifyLogo from "../Icons/Spotify_Logo_RGB_White.png";
import '../Mobile.css';
import '../App.css';

import { useMobile } from "./MobileProvider";

function InfoDisplay(props) {
  let displayedSong = props.displayedSong;
  let displayedGenre = props.displayedGenre;
  let isMobile = useMobile();


  function getLength() {
    let totalSeconds = Math.round(displayedSong.duration_ms / 1000);
    let minutes = "" + Math.floor(totalSeconds / 60);
    let seconds = "" + (totalSeconds % 60);
    if (seconds.length <= 1) {
      seconds = "0" + seconds;
    }
    return "" + minutes + ":" + seconds;
  }


  function getArtists() {
    return displayedSong.artists.map((artist, index) => (
      <span key={artist.uri}>
        <a href={artist.uri} className='name'>
          {artist.name}
        </a>
        {index < displayedSong.artists.length - 1 && ', '}
      </span>
    ));
  }


  return (
    <div>
      {!isMobile ? (
        <div className="infoContainer">
          <a href="https://open.spotify.com">
            <img src={SpotifyLogo} className="spotifyLogo" />
          </a>
          <div style={{ width: '300px', height: '300px', margin: '2% 7.5%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <a href={displayedSong.uri} style={{ width: '100%', height: 'auto' }}>
              <img src={displayedSong.album.images[0].url} style={{ width: '100%', position: 'absolute', zIndex: '2' }} />
              <img src={displayedSong.album.images[0].url} style={{ width: '100%', filter: 'blur(200px)', position: 'static', zIndex: '1', opacity: '0.65' }} />
            </a>
          </div>
          <div style={
            {
              flexDirection: 'column', flex: '4', marginRight: '3em',
              alignItems: 'flex-start', textAlign: 'left', width: '50vw'
            }}>
            <div style={{ marginBottom: '50px', zIndex: '3', padding: '5px 0px 0px 0px' }}>
              <p className='type'>Title &#9; <a className='name' href={displayedSong.uri}>{displayedSong.name}</a> &nbsp;
                {displayedSong.explicit && <span className='explicit'>Explicit</span>}
              </p>
              <p className='type'>Artist &#9; {getArtists()} </p>
              <p className='type'>Album &#9; <a className='name' href={displayedSong.album.uri}>{displayedSong.album.name}</a></p>
              <p className='type'>Genre &#9; <span className='name'>{displayedGenre}</span></p>
              <p className='type'>Duration &#9; <span className='name'>{getLength()}</span></p>
            </div>

          </div>
        </div>
      ) : (
        <div className="infoContainerMobile">
          <a href="https://open.spotify.com">
            <img src={SpotifyLogo} className="spotifyLogoMobile" />
          </a>
          <div style={{ width: '60%', height: '60%', margin: '2%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <a href={displayedSong.uri} style={{ width: '100%', height: 'auto' }}>
              <img src={displayedSong.album.images[0].url} style={{ width: '100%', position: 'absolute', zIndex: '2' }} />
              <img src={displayedSong.album.images[0].url} style={{ width: '100%', filter: 'blur(200px)', position: 'static', zIndex: '1', opacity: '0.65' }} />
            </a>
          </div>
          <div style={
            {
              flexDirection: 'column',
              alignItems: 'flex-start', textAlign: 'left', width: '75%'
            }}>
            <div style={{ marginBottom: '50px', zIndex: '3' }}>
              <p className='type'>Title &#9; <a className='name' href={displayedSong.uri}>{displayedSong.name}</a> &nbsp;
                {displayedSong.explicit && <span className='explicit'>Explicit</span>}
              </p>
              <p className='type'>Artist &#9; {getArtists()} </p>
              <p className='type'>Album &#9; <a className='name' href={displayedSong.album.uri}>{displayedSong.album.name}</a></p>
              <p className='type'>Genre &#9; <span className='name'>{displayedGenre}</span></p>
              <p className='type'>Duration &#9; <span className='name'>{getLength()}</span></p>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default InfoDisplay;