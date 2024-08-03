import '../App.css';
import '../Mobile.css';
import PlayPreview from '../Icons/PlayPreview.svg';
import Stop from '../Icons/stop-sharp.svg';

import { useMobile } from './MobileProvider';

import { useState, useRef, useEffect } from 'react';

function PreviewPlayer(props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const previewAudioRef = useRef(null);

  var src = props.src || '';
  var active = props.active && src && src.length > 0;
  var isMobile = useMobile();

  useEffect(() => {
    const previewAudio = previewAudioRef.current;
    if (previewAudio) {
      previewAudio.addEventListener("ended", onEnded);
      return () => {
        previewAudio.removeEventListener("ended", onEnded);
      };
    }
  }, []);

  function togglePlay() {
    isPlaying ? stop() : play();
  }

  function play() {
    const previewAudio = previewAudioRef.current;
    if (active && previewAudio) {
      previewAudio.play();
      setIsPlaying(true);
    }
  }

  function pause() {
    const previewAudio = previewAudioRef.current;
    if (active && previewAudio) {
      previewAudio.pause();
      setIsPlaying(false);
    }
  }

  function stop() {
    const previewAudio = previewAudioRef.current;
    if (active && previewAudio) {
      previewAudio.currentTime = 0;
      pause();
    }
  }

  function onEnded() {
    const previewAudio = previewAudioRef.current;
    if (previewAudio) {
      previewAudio.currentTime = 0;
      pause();
    }
  }

  function toggleMute() {
    setIsMuted(!isMuted);
  }
  //
  return (
    <span>
      {!isMobile ? (
        <span>
          <audio id="preview" ref={previewAudioRef} src={src} autoPlay={isPlaying} muted={isMuted} />
          <button type='button' className='rand-button' onClick={togglePlay} style={{ borderRadius: '50%', padding: '3px 6px', justifyItems: 'center', marginRight: '1vw' }}>
            {isPlaying ? (
              <img src={Stop} style={{ width: '50px', height: '50px' }} />
            ) : (
              <img src={PlayPreview} style={{ width: '50px', height: '50px' }} />
            )}
          </button>
          {/* <span>
            <label className='checkContainer'>Mute
              <input value="autoplay" type='checkbox' onChange={toggleMute} checked={isMuted} className='checkbox' />
              <span className='checkmark'></span>
            </label>

          </span> */}
        </span>
      ) : (
        <span>
          <audio id="preview" ref={previewAudioRef} src={src} autoPlay={isPlaying} muted={isMuted} />
          <button type='button' className='rand-button-mobile' onClick={togglePlay} style={{ borderRadius: '50%', padding: '3px 6px', justifyItems: 'center' }}>
            {isPlaying ? (
              <img src={Stop} style={{ width: '15vw', height: '15vw' }} />
            ) : (
              <img src={PlayPreview} style={{ width: '15vw', height: '15vw' }} />
            )}
          </button>
          {/* <span>
            <label className='checkContainer checkContainerMobile'>Mute
              <input value="autoplay" type='checkbox' onChange={toggleMute} checked={isMuted} className='checkbox' />
              <span className='checkmark'></span>
            </label>

          </span> */}
        </span>
      )}
    </span>
  );
}

export default PreviewPlayer;
