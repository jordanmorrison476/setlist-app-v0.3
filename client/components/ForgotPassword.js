import React, { Component } from 'react';
import { connect }      from 'react-redux';
import setlistLogo from '../setlist_logo_name.svg'


class ForgotPassword extends Component {
  /** Render the user's info */
  render() {
    return (
      <div className="login_block d-flex flex-wrap justify-content-center position-absolute w-100 h-100 align-items-center align-content-center">
        <div className="login">
            <div className ="setlist-logo">

              <a dangerouslySetInnerHTML={{__html: setlistLogo}}></a>

            </div>
            {/* <div className="row">
            <h3 className="reset-heading" >Please enter your email address</h3>
            </div> */}
            <div className="row justify-content-center">
                
                <div className="col-12 justify-content-center">
                {/* <input type="text" className="form-control mb-2" placeholder="Email" required autofocus/>
                <input type="password" className="form-control mb-2" placeholder="Password" required/>
                <button className="btn btn-lg btn-primary btn-block mb-1">Sign Up</button>
                <div className="login_component justify-content-center">
                    <a href="/#/forgot-password" >Forgot Password?</a>
                </div>
                <div className="login_component justify-content-center">
                    <span>Already have an account?<a href="/#/login"> Login</a></span>
                </div> */}
                    {/* <div className="forgot_password_block ">
                        <h3 className=" ">Please enter your email address to request a password reset</h3>
                        <div className="formGroup  ">
                            <input type="text" classname="form-control mb-2" placeholder="Email" required autofocus/>
                        </div>
                    </div>
                    <div>
                        <button className="btn btn-lg btn-primary btn-block mb-1" >Reset Password</button>
                    </div>
                    <div class="redirectToLogin ">
                        <span>Go back to?<a href="/#/login">Log In</a></span>
                    </div> */}
                    
                    <input type="text" className="form-control mb-2" placeholder="Email" required autofocus/>
                    <button className="btn btn-lg btn-primary btn-block mb-1">Reset Password</button>
                    <div className="login_component justify-content-center">
                        <span>Already have an account?<a href="/#/login"> Login</a></span>
                    </div>
                </div>
              </div>
        </div>
      </div>
    );
  }
  }

export default connect(state => state)(ForgotPassword);
