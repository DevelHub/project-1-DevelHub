import * as React from 'react';
import '../../App.css';
import '../../include/bootstrap'
interface IState {
    credentials: {
        password: string,
        username: string
    },
    errorMessage: string
}

// export class SignInComponent extends React.Component<RouteComponentProps<{}>, IState> {
export class LoginComponent extends React.Component<IState, any> {

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

        fetch('http://ec2-34-210-54-222.us-west-2.compute.amazonaws.com:4000/login', {
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
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
            });
    }

    public render() {
        const { errorMessage, credentials } = this.state;
    
        return (
            <body className="LoginComponent">
            <form className="form-login" onSubmit={this.submit}>
              <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
      
              <label htmlFor="inputUsername" className="sr-only">Username</label>
              <input
                onChange={this.usernameChange}
                value= {credentials.username}
                type="text"
                id="inputUsername"
                className="form-control"
                placeholder="Username"
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
              {errorMessage && <p id="error-message">{errorMessage}</p>}
            </form>
            </body>
        );
    }
}