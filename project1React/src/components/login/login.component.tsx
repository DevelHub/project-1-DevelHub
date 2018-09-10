import * as React from 'react';
import '../../App.css';
import '../../include/bootstrap'
import { environment } from '../../environment';
// interface IState {
//     credentials: {
//         password: string,
//         username: string
//     },
//     errorMessage: string
// }

export class LoginComponent extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            credentials: {
                password: '',
                username: ''
            },
            errorMessage: '',
        }
    }

    public passwordChange = (e: any) => {
        this.setState({
            ...this.state,
            credentials: {
                ...this.state.credentials,
                password: e.target.value
            }
        });
    }

    public usernameChange = (e: any) => {
        this.setState({
            ...this.state,
            credentials: {
                ...this.state.credentials,
                username: e.target.value
            }
        });
    }

    public submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        fetch(environment.context + 'login', {
            body: JSON.stringify(this.state.credentials),
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            method: 'POST'
        })
            .then(resp => {
                console.log(resp.status);
                if (resp.status === 401) {
                    this.setState({
                        ...this.state,
                        errorMessage: 'Invalid Credentials'
                    });
                }
                else if (resp.status === 200) {
                    return resp.json();
                }
                else {
                    this.setState({
                        ...this.state,
                        errorMessage: 'Failed to Login'
                    });
                }
                throw new Error('Failed to login');
            })
            .then(resp => {
                this.props.history.push('/home');
                // window.location.reload();
            })
            .catch(err => {
                console.log(err);
            });
    }

    public requestLogin = (e: any) => {
        const email = this.state.credentials.username;
        if(!email || !email.includes('@')) {
            this.setState({
                ...this.state,
                errorMessage: 'Please Fill Email'
            })
        }
        else {
            const addressTo = { email };
            fetch(environment.context + 'registration', {
                body: JSON.stringify(addressTo),
                credentials: 'include',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                method: 'POST'
            })
              .then(resp => {
                  console.log(resp.status);
                  if (resp.status === 400 || resp.status === 500) {
                    throw new Error('Unable to send request at this time');
                  }
                  else if(resp.status === 401) {
                    this.setState({
                        ...this.state,
                        errorMessage: 'Incorrect Email'
                    })
                    throw new Error('Incorrect email');
                  }
                  else {
                    this.setState({
                        ...this.state,
                        errorMessage: 'Registration Code Sent'
                    })
                    return resp.json();
                  }
              })
              .catch(err => {
                  console.log(err);
              });
        }
    }

    public render() {
        const { errorMessage, credentials } = this.state;
    
        return (
            <body className="LoginComponent">
            <form className="form-login" onSubmit={this.submit}>
              {errorMessage && <p id="error-message">{errorMessage}</p>}
              <h1 id="loginPlease" className="h3 mb-3 font-weight-normal">CONQUEST AWAITS</h1>
      
              <label htmlFor="inputUsername" className="sr-only">Username</label>
              <input
                onChange={this.usernameChange}
                value= {credentials.username}
                type="text"
                id="inputUsername"
                className="form-control"
                placeholder="Email/Username"
                required />
      
              <label htmlFor="inputPassword" className="sr-only">Password</label>
              <input
                onChange={this.passwordChange}
                value={credentials.password}
                type="password"
                id="inputPassword"
                className="form-control"
                placeholder="Password"
                required />
      
              <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
              <br />
              <label id="loginRequest" onClick={this.requestLogin}>Request To Sign In</label>
            </form>
            </body>
        );
    }
}