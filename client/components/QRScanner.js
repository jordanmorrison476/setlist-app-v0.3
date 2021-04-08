import React, { Component } from 'react';
import { connect }      from 'react-redux';
import setlistLogo from '../setlist_logo.svg';



class QRScanner extends Component {
  /** Render the user's info */
  constructor(props){
    super(props);
    const setRef = webcam => {
      this.webcam = webcam;
    };

    const capture = () => {
      const imageSrc = this.webcam.getScreenshot();
  // alert(imageSrc);
    };
  }

  render() {
    const videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: "user"
    };
    return (
      <div className="session d-flex flex-wrap justify-content-center position-absolute w-100 h-100 align-items-center align-content-center">

      <div className="center-block text-center">
        <Webcam audio={false}
          height={350}
          ref={this.setRef}
          screenshotFormat="image/jpeg"
          width={350}
          videoConstraints={videoConstraints} />
      </div>

      </div>
    );
   }
  }

export default connect(state => state)(QRScanner);
