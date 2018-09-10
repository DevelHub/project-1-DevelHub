import * as React from 'react';
import { environment } from '../../environment';

export class CompleteRegistration extends React.Component<any, any> {
  
    constructor(props: any) {
        super(props);
        this.state = {
            credentials: {
                firstname: '',
                lastname: '',
                password: '',
                privateCode: '',
                username: ''
            },
            errorMessege: ''
        }
    }
    
    public handleRegisterChange = (e: any) => {
        const targetName = e.target.name;
        const targetValue = e.target.value;
        switch(targetName) {
            case 'firstname':
                this.setState({
                    ...this.state,
                    credentials: {
                        ...this.state.credentials,
                        firstname: targetValue
                    }
                }); break;
            case 'lastname':
                this.setState({
                    ...this.state,
                    credentials: {
                        ...this.state.credentials,
                        lastname: targetValue
                    }
                }); break;
            case 'password':
                this.setState({
                    ...this.state,
                    credentials: {
                        ...this.state.credentials,
                        password: targetValue
                    }
                }); break;
            case 'privateCode':
                this.setState({
                    ...this.state,
                    credentials: {
                        ...this.state.credentials,
                        privateCode: targetValue
                    }
                }); break;
            case 'username':
                this.setState({
                    ...this.state,
                    credentials: {
                        ...this.state.credentials,
                        username: targetValue
                    }
                }); break;
        }
    }

    public submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        fetch(environment.context + 'registration/new', {
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
                if (resp.status === 400) {
                    this.setState({
                        ...this.state,
                        errorMessage: 'Invalid Member Code'
                    });
                    throw new Error('Invalid Code');
                }
                else if (resp.status === 200) {
                    return resp.json();
                }
                else {
                    this.setState({
                        ...this.state,
                        errorMessage: 'Failed to Register'
                    });
                }
                throw new Error('Failed to Register');
            })
            .then(resp => {
                this.props.history.push('/home');
            })
            .catch(err => {
                console.log(err);
            });
    }

    public render() {
        const { firstname, lastname, password, privateCode, username } = this.state.credentials;

        return (
            <form onSubmit={this.submit}>
                <div className="input-group">
                    <div className="jumbotron">
                        <h1 className="display-4">Hello New Clan Member!</h1>
                        <p className="lead">Please fill out the information below to begin your endless battles. Note: Feeders are not allowed!</p>
                        <hr className="my-4"/>
                        <p>You are not here by mistake...But click the big blue button if you feel discouraged to join us.</p>
                        <p className="lead">
                            <a className="btn btn-primary btn-lg" href="http://pbskids.org/" role="button">Recall</a>
                        </p>
                    </div>
                </div>
                <div className="input-group mb-3">
                    <input type="text" className="form-control" name="privateCode" placeholder="Member Code" onChange={this.handleRegisterChange} value={privateCode}/>
                </div>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="">First and last name</span>
                    </div>
                    <input type="text" className="form-control" name="firstname" onChange={this.handleRegisterChange} value={firstname}/>
                    <input type="text" className="form-control" name="lastname" onChange={this.handleRegisterChange} value={lastname}/>
                </div>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1">Eternal</span>
                    </div>
                    <input type="text" className="form-control" name="username" 
                            placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" onChange={this.handleRegisterChange} value={username}/>
                </div>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1">Hidden</span>
                    </div>
                    <input type="password" className="form-control" name="password" placeholder="Password" onChange={this.handleRegisterChange} value={password}/>
                </div>
                <div className="input-group mb-3">
                    <small id="emailHelp" className="form-text text-muted">We'll never share your information with anyone else.</small>
                </div>
                <div className="input-group mb-3">
                    <button type="submit" className="btn btn-secondary btn-lg" role="button">Submit</button>
              {this.state.errorMessage && <p id="error-message">{this.state.errorMessage}</p>}
                </div>
            </form>
        )
    }
}