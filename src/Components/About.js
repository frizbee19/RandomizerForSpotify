import '../Mobile.css';
import '../App.css';
import DiceLogo from '../Icons/DiceLogoWhite.svg';

import { useMobile } from './MobileProvider';

function About() {
  const isMobile = useMobile();

  return (
    <div className={!isMobile ? 'infoContainer' : 'infoContainerMobile'} style={{padding: isMobile && '0% 11% 5%'}}>
      <div style={{ margin: !isMobile ? '0% 8% 2%' : '1%', textAlign: 'start'}}>
        <h1 className='subtitle'>About</h1>
        <p style={{lineHeight: '1.6'}}>
          Discover new music at random, or see if you truly do listen to all kinds of music. You might even find some hidden gems.
        </p>
        <p style={{lineHeight: '1.6'}}>
          Click on the Randomize button <span>
          <img style={{width: '24px'}} src={DiceLogo}/>
          </span> to generate a new song. Click on the play button to preview a 30 second snippet of it.
        </p>
      </div>
    </div>
  )
}

export default About;