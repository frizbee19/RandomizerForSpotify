function InfoDisplay(props) {
  let displayedSong = props.displayedSong;
  let displayedGenre = props.displayedGenre;
  let isMobile = props.isMobile;


  function getLength() {
    let totalSeconds = Math.round(displayedSong.duration_ms / 1000);
    let minutes = "" + Math.floor(totalSeconds / 60);
    let seconds = "" + (totalSeconds % 60);
    if (seconds.length <= 1) {
      seconds = "0" + seconds;
    }
    return "" + minutes + ":" + seconds;
  }

  // const openSpotifyApp = (uri) => {
  //   const appLink = uri;
  //   const webLink = `https://open.spotify.com/artist/${uri.split(':')[2]}`;
    
  //   // Attempt to open the app link
  //   window.location.href = appLink;

  //   // Fallback to web link
  //   setTimeout(() => {
  //     window.open(webLink, '_blank');
  //   }, 500);
  // };


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

      </div>
    </div>
  );
}

export default InfoDisplay;