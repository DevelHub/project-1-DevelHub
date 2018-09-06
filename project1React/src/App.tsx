import * as React from 'react';
import './App.css';
import './include/bootstrap'

import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { EmployeeRequest } from './components/home/employee/employee-request.component';
import { AppNav } from './components/nav/nav.component';
import { EmployeeRetrieve } from './components/home/employee/employee-retrieve.component';
import { ManagerRequestsAll } from './components/home/manager/manager-request-all.component';

export class App extends React.Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      allowAll: false,
      allowEmployee: false,
      allowManger: false
    }
  }

  public componentDidMount() {

      fetch('http://localhost:4000/emp', {
        credentials: 'include'
      })
          .then(resp => {
              console.log(resp.status);
              if (resp.status === 401) {
                  this.setState({
                    allowAll: false,
                    allowEmployee: false,
                    ...this.state
                  });
              }
              else if (resp.status === 200) {
                  this.setState({
                    ...this.state,
                    allowAll: true,
                    allowEmployee: true,
                  });
                  return;
              }
              else {
                  this.setState({
                    allowAll: false,
                    allowEmployee: false,
                    ...this.state
                  });
              }
              throw new Error('Failed to retrieve page');
          })
          .catch(err => {
              console.log(err);
          });
      if(!this.state.allowEmployee) {
        fetch('http://localhost:4000/man', {
          credentials: 'include'
        })
            .then(resp => {
                console.log(resp.status);
                if (resp.status === 401) {
                    this.setState({
                      allowAll: false,
                      allowManger: false,
                      ...this.state
                    });
                }
                else if (resp.status === 200) {
                    this.setState({
                      ...this.state,
                      allowAll: true,
                      allowManger: true
                    });
                    return;
                }
                else {
                    this.setState({
                      allowAll: false,
                      allowManger: false,
                      ...this.state
                    });
                }
                throw new Error('Failed to retrieve page');
            })
            .catch(err => {
                console.log(err);
            });
      }
  }
  public render() {
    const { allowAll, allowEmployee, allowManger } = this.state;
    return (
      <BrowserRouter>
        <div>
          {(allowAll) && <AppNav /> }
              <Switch>
                {(allowAll) &&
                <Route path="/home" component={HomeComponent} /> }

                {(allowEmployee) &&
                <Route path="/request" component={EmployeeRequest} /> }

                {(allowEmployee) &&
                <Route path="/retrieve" component={EmployeeRetrieve} /> }

                {(allowManger) &&
                <Route path="/retrieve-all" component={ManagerRequestsAll} /> }
                
                <Route path="/login" component={LoginComponent} />
                
                {(allowAll && !allowEmployee) &&
                <table className="table table-hover">
                  <thead>
                      <tr>
                          <th scope="col">This Page is Restricted: Employees Only</th>
                      </tr>
                  </thead>
                </table> }
                {(allowAll && !allowManger) &&
                <table className="table table-hover">
                  <thead>
                      <tr>
                          <th scope="col">This Page is Restricted: Managers Only</th>
                      </tr>
                  </thead>
                </table> }
                {/* <Route component={LoginComponent} /> */}
              </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
