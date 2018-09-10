import * as React from 'react';
import { Link } from 'react-router-dom';
// import RevLogo from '../../assets/rev-logo.png';
export const AppNav: React.StatelessComponent<{}> = () => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
              <div className="container">
                <Link to="/home" className="navbar-brand">SBG</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarResponsive">
                  <ul className="navbar-nav ml-auto">
                    <li className="nav-item active">
                      <Link to="/home" className="unset-anchor nav-link">Home</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/request" className="nav-link">Request</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/retrieve" className="nav-link">Retrieve</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/retrieve-all" className="nav-link">Retrieve All</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/logout" className="nav-link">Logout</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
      {/* <nav className="navbar navbar-toggleable-md navbar-expand-lg navbar-light bg-light display-front nav-pad">
        <div className="navbar-header c-pointer shift-left">
          <Link to="/home" className="unset-anchor">
            <img className="img-adjust-position rev-logo" src={RevLogo} alt="revature" />
          </Link>
        </div>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExample04" aria-controls="navbarsExample04" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarsExample04">
          <ul className="navbar-nav ml-auto margin-nav">
            <li className="nav-item active">
              <Link to="/home" className="unset-anchor nav-link">Home</Link>
            </li>
            <li className="nav-item active">
              <Link to="/login" className="unset-anchor nav-link">Login</Link>
            </li>
            <li className="nav-item active">
              <Link to="/employee" className="unset-anchor nav-link">Employee</Link>
            </li>
            <li className="nav-item active">
              <Link to="/second" className="unset-anchor nav-link">Second</Link>
            </li>
            <li className="nav-item active">
              <Link to="/clicker" className="unset-anchor nav-link">Clicker</Link>
            </li>
            <li className="nav-item active dropdown">
              <a className="nav-link dropdown-toggle pointer" id="examples-dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Examples</a>
              <div className="dropdown-menu" aria-labelledby="examples-dropdown">
                <div className="dropdown-item"><Link to="/movies" className="unset-anchor nav-link active">Movies</Link></div>
                <div className="dropdown-item"><Link to="/clicker" className="unset-anchor nav-link active">Clicker Game</Link></div>
                <div className="dropdown-item"><Link to="/tic-tac-toe" className="unset-anchor nav-link active">Tic Tac Toe Game</Link></div>
                <div className="dropdown-item"><Link to="/chuck-norris" className="unset-anchor nav-link active">Chuck Norris Jokes</Link></div>
                <div className="dropdown-item"><Link to="/pokemon" className="unset-anchor nav-link active">Pokemon</Link></div>
              </div>
            </li>
            <li className="nav-item active">
              <Link to="/nested" className="unset-anchor nav-link">Nested</Link>
            </li>
          </ul>
        </div>
      </nav> */}
    </div >
  );
}