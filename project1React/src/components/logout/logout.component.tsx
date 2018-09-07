import * as React from 'react';

export class LogoutComponent extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
    }

    public render() {

        return (
          <div>
            <header>
              <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                <ol className="carousel-indicators">
                  <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
                  <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                  <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                </ol>
                <div className="carousel-inner" role="listbox">
                  {/* <!-- Slide One - Set the background image for this slide in the line below --> */}
                  <div className="carousel-item active" style={{backgroundImage: `url('https://images6.alphacoders.com/346/346778.jpg')`}}>
                    <div className="carousel-caption d-none d-md-block">
                      <h3>First Slide</h3>
                      <p>This is a description for the first slide.</p>
                    </div>
                  </div>
                  {/* <!-- Slide Two - Set the background image for this slide in the line below --> */}
                  <div className="carousel-item" style={{backgroundImage: `url('https://lockgamer.files.wordpress.com/2013/09/assassins-creed-iii-liberation-hd-x360-ps3-pc.jpg')`}}>
                    <div className="carousel-caption d-none d-md-block">
                      <h3>Second Slide</h3>
                      <p>This is a description for the second slide.</p>
                    </div>
                  </div>
                  {/* <!-- Slide Three - Set the background image for this slide in the line below --> */}
                  <div className="carousel-item" style={{backgroundImage: `url('https://wallpaper.wiki/wp-content/uploads/2017/05/Fancy-Game-Wallpaper.jpg')`}}>
                    <div className="carousel-caption d-none d-md-block">
                      <h3>Third Slide</h3>
                      <p>This is a description for the third slide.</p>
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
                <h1>Half Slider by Start Bootstrap</h1>
                <p>The background images for the slider are set directly in the HTML using inline CSS. The rest of the styles for this template are contained within the
                  <code>half-slider.css</code>
                  file.</p>
              </div>
            </section> 

            {/* // Footer */}
            <footer className="py-5 bg-dark">
              <div className="container">
                <p className="m-0 text-center text-white">Copyright &copy; GAMELAB 2018</p>
              </div>
            </footer>

          </div>



        );
    }
}