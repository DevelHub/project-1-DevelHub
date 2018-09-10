import * as React from 'react'
import { environment } from '../../../environment';
import { DateConverter } from '../date-converter';
import { AppNav } from '../../nav/nav.component';

export class EmployeeRetrieve extends React.Component<any, any> {

    public constructor (props: any) {
        super(props);
        this.state = {
            authenticated: false,
            reimbursements: [],
            show: false,
            showDefault: false,
            unauthorized: false
        }
    }

    public componentDidMount() {
        fetch(environment.context + 'reimbursements/retrieve/0', {
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }
        })
            .then(resp => {
                console.log(resp.status);
                console.log('from employee retrieve')
                if(resp.status === 401) {
                    this.props.history.push('/login');
                    throw new Error('Unauthenticated');
                }
                else if(resp.status === 403) {
                    this.setState({
                        ...this.state,
                        authenticated: true,
                        unauthorized: true
                    })
                    throw new Error('Unauthorized');
                }
                if(resp.status === 412) {
                    this.setState({
                        ...this.state,
                        authenticated: true,
                        showDefault: true
                    })
                    throw new Error('No reimbursements to display');
                }
                else if(resp.status === 500) {
                    this.setState({
                        ...this.state,
                        authenticated: true,
                        showDefault: true
                    })
                    throw new Error('Failed to get reimbursements to display');
                }
                this.setState({
                    ...this.state,
                    authenticated: true
                })
                return resp.json();
            })
            .then(reimbursements => {
                reimbursements = DateConverter(reimbursements);
                this.setState({
                    reimbursements,
                    show: true
                });
            })
            .catch(err => {
                console.log(err);
            })
        }

    public render() {
        const { authenticated, show, showDefault, unauthorized } = this.state;
        
        if(authenticated) {
            return (
                <div>
                    {/* Navigation  */}
                    <AppNav />
                    <div id="employeeRetrievePage">
                        {/* Display reimbursements */}
                        {
                            (show) &&
                        <table className="table table-hover userView">
                            <thead>
                                <tr>
                                    <th scope="col">Type</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Amount</th>
                                    <th scope="col">Date Submitted</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Resolver</th>
                                    <th scope="col">Date Resolved</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.reimbursements.map((ers: any) => (
                                        <tr key={ers.reimb_id}>              
                                            <td>{ers.reimb_type}</td>
                                            <td>{ers.reimb_description}</td>
                                            <td>${ers.reimb_amount}</td>
                                            <td>{ers.reimb_submitted}</td>
                                            <td>{ers.reimb_status}</td>
                                            <td>{ers.full_name}</td>
                                            <td>{ers.reimb_resolved}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        }
                    </div>
                        {/* Display no reimbursements */}
                        {
                            (showDefault) &&
                            <table className="table table-hover userView">
                                <thead>
                                    <tr>
                                        <th scope="col">Submited Reimbursemnets Are Shown Here</th>
                                    </tr>
                                </thead>
                            </table>
                        }

                        {/* Ristricted Message */}
                        {
                            (unauthorized) &&
                            <table className="table table-hover userView">
                                <thead>
                                    <tr>
                                        <th scope="col">This Page is Restricted: Employees Only</th>
                                    </tr>
                                </thead>
                            </table>
                        }
                </div>
            )
        }
        else {
            return null;
        }
    }
}



{/* <tr>
<th scope="row">1</th>
<td>Mark</td>
<td>Otto</td>
<td>@mdo</td>
</tr>
<tr>
<th scope="row">2</th>
<td>Jacob</td>
<td>Thornton</td>
<td>@fat</td>
</tr>
<tr>
<th scope="row">3</th>
<td colSpan={2}>Larry the Bird</td>
<td>@twitter</td>
</tr> */}