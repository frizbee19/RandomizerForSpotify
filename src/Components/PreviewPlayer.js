import '../App.css';
import PlayPreview from '../Icons/PlayPreview.svg';
import Play from '../Icons/play.svg';
import Pause from '../Icons/pause.svg';
import Stop from '../Icons/stop-sharp.svg';
import Mute from '../Icons/volume-mute.svg';
import Unmute from '../Icons/volume-high.svg';


import { useState } from 'react';

function PreviewPlayer(props) {

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  var src = props.src;
  var active = props.active && src.length > 0;
  var previewAudio = document.getElementById("preview");

  previewAudio.addEventListener("ended", onEnded);

  function togglePlay() {
    isPlaying ? stop() : play();
  }

  function play() {
    if (active) {
      previewAudio.play();
      setIsPlaying(true);
    }
  }

  function pause() {
    if (active) {
      previewAudio.pause();
      setIsPlaying(false);
    }
  }

  function stop() {
    if (active) {
      previewAudio.currentTime = 0;
      pause();
    }
  }

  function onEnded() {
    previewAudio.currentTime = 0;
    pause();
  }

  function toggleMute() {
    setIsMuted(!isMuted);
  }


  return (
    <span>
      <audio id="preview" src={src} autoPlay={isPlaying} muted={isMuted} />
      <button type='button' className='rand-button' onClick={togglePlay} style={{ borderRadius: '50%', padding: '3px 6px', justifyItems: 'center' }}>
        {isPlaying ? (
          <img src={Stop} style={{ width: '50px', height: '50px' }} />
        ) : (
          <img src={PlayPreview} style={{ width: '50px', height: '50px' }} />
        )}
      </button>
      <span>
      <label className='checkContainer'>Mute
          <input value="autoplay" type='checkbox' onChange={toggleMute} checked={isMuted} className='checkbox' />
          <span className='checkmark'></span>
        </label>
      </span>
    </span>
  );
}

export default PreviewPlayer;