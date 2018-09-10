import * as React from 'react';
import { AppNav } from '../nav/nav.component';
import { environment } from '../../environment';
// import { varify } from '../test';

export class HomeComponent extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
          authenticated: false,
        }
    }

    public componentDidMount() {
      fetch(environment.context + 'emp/man', {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
      })
          .then(resp => {
              console.log(resp.status);
              if(resp.status === 200) {
                  this.setState({
                      authenticated: true,
                  })
                  return resp.json();
              }
              this.props.history.push('/login');
              throw new Error('Unauthorized');
          })
          .catch(err => {
              console.log(err);
          })
    }

    public render() {

      if(this.state.authenticated) {
          return (
            <div id="homePage">
                  
              {/* Navigation  */}
              <AppNav />

              {/* Sliders  */}
              <header>
                <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                  <ol className="carousel-indicators">
                    <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                  </ol>
                  <div className="carousel-inner" role="listbox">
                    {/* <!-- Slide One - Set the background image for this slide in the line below --> */}
                    <div className="carousel-item active" style={{backgroundImage: `url('https://web2.hirez.com/smite-media//wp-content/uploads/2018/03/Achilles-Revenant-3840x2160.jpg')`}}>
                      <div className="carousel-caption d-none d-md-block">
                        <h3>Warrior Class</h3>
                        <p>Defend or Attack</p>
                      </div>
                    </div>
                    {/* <!-- Slide Two - Set the background image for this slide in the line below --> */}
                    <div className="carousel-item" style={{backgroundImage: `url('https://web2.hirez.com/smite-media//wp-content/uploads/2017/11/421PSG-B.jpg')`}}>
                      <div className="carousel-caption d-none d-md-block">
                        <h3>Gardian Class</h3>
                        <p>Defend the Titan</p>
                      </div>
                    </div>
                    {/* <!-- Slide Three - Set the background image for this slide in the line below --> */}
                    <div className="carousel-item" style={{backgroundImage: `url('https://web2.hirez.com/smite-media//wp-content/uploads/2017/10/Mummified-Izanami-3840x2160.jpg')`}}>
                      <div className="carousel-caption d-none d-md-block">
                        <h3>Hunter Class</h3>
                        <p>Just Auto-Attack and Build Critical</p>
                      </div>
                    </div>
                  </div>
                  <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="sr-only">Previous</span>
                  </a>
                  <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="sr-only">Next</span>
                  </a>
                </div>
              </header>

              {/* Page Content  */}
              <section className="py-5">
                <div className="container">
                  <h1>Smite Battle Grounds</h1>
                  <p>Smite is a free-to-play, third-person multiplayer online battle arena video game developed
                        and published by Hi-Rez Studios for Microsoft Windows, macOS, PlayStation 4 and Xbox One.</p>
                </div>
              </section> 

              {/* // Footer */}
              <footer className="py-5 bg-dark">
                <div className="container">
                  <p className="m-0 text-center text-white">Copyright &copy; SBG Portal 2018</p>
                </div>
              </footer>

            </div>
          );
        }
        else {
          return null;
        }
    }
}