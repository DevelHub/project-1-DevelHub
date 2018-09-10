import * as React from 'react';
import './App.css';
import './include/bootstrap'

import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { EmployeeRequest } from './components/home/employee/employee-request.component';
import { EmployeeRetrieve } from './components/home/employee/employee-retrieve.component';
import { ManagerRequestsAll } from './components/home/manager/manager-request-all.component';
import { LogoutComponent } from './components/logout/logout.component';
import { CompleteRegistration } from './components/register/complete-registration.component';

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

      // fetch(environment.context + 'emp', {
      //   credentials: 'include'
      // })
      //     .then(resp => {
      //         console.log(resp.status);
      //         if (resp.status === 401) {
      //             this.setState({
      //               allowAll: false,
      //               allowEmployee: false,
      //               ...this.state
      //             });
      //         }
      //         else if (resp.status === 200) {
      //             this.setState({
      //               ...this.state,
      //               allowAll: true,
      //               allowEmployee: true,
      //             });
      //             return;
      //         }
      //         else {
      //             this.setState({
      //               allowAll: false,
      //               allowEmployee: false,
      //               ...this.state
      //             });
      //         }
      //         throw new Error('Failed to retrieve page');
      //     })
      //     .catch(err => {
      //         console.log(err);
      //     });
      // if(!this.state.allowEmployee) {
      //   fetch(environment.context + 'man', {
      //     credentials: 'include'
      //   })
      //       .then(resp => {
      //           console.log(resp.status);
      //           if (resp.status === 401) {
      //               this.setState({
      //                 allowAll: false,
      //                 allowManger: false,
      //                 ...this.state
      //               });
      //           }
      //           else if (resp.status === 200) {
      //               this.setState({
      //                 ...this.state,
      //                 allowAll: true,
      //                 allowManger: true
      //               });
      //               return;
      //           }
      //           else {
      //               this.setState({
      //                 allowAll: false,
      //                 allowManger: false,
      //                 ...this.state
      //               });
      //           }
      //           throw new Error('Failed to retrieve page');
      //       })
      //       .catch(err => {
      //           console.log(err);
      //       });
      // }
  }
  
  public render() {
    // const { allowAll, allowEmployee, allowManger } = this.state;
    return (
      <BrowserRouter>
        <div>
          {/* {(allowAll) && <AppNav /> } */}
              <Switch>

                {/* {(allowAll) && */}
                <Route path="/home" component={HomeComponent} /> 

                {/* {(allowEmployee) && */}
                <Route path="/request" component={EmployeeRequest} /> 

                {/* {(allowEmployee) && */}
                <Route path="/retrieve" component={EmployeeRetrieve} /> 

                {/* {(allowManger) && */}
                <Route path="/retrieve-all" component={ManagerRequestsAll} /> 
                
                <Route path="/logout" component={LogoutComponent} />

                <Route path="/login" component={LoginComponent} />

                <Route path="/register" component={CompleteRegistration} />
                
                <Route component={LoginComponent} /> 
                
                {/* {(!allowAll) &&
                <table className="table table-hover">
                  <thead>
                      <tr>
                          <th scope="col">404: Page Not Found</th>
                      </tr>
                  </thead>
                </table> }
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
                </table> } */}
              </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
