import * as React from 'react'
import { environment } from '../../../environment';
import { AppNav } from '../../nav/nav.component';

export class EmployeeRequest extends React.Component<any, any> {

    public constructor (props: any) {
        super(props);
        this.state = {
            amount: 0.00,
            authenticated: false,
            type: 1,
            unauthorized: false
        }
    }

    public amountChange = (e: any) => {
        this.setState({
            ...this.state,
            amount: e.target.value
        })
    }

    public descriptionChange = (e: any) => {
        this.setState({
            ...this.state,
            description: e.target.value
        })
    }

    public typeChange = (e: any) => {
        this.setState({
            ...this.state,
            type: e.target.value
        })
    }

    public componentDidMount() {
        fetch(environment.context + 'emp', {
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }
        })
            .then(resp => {
                console.log(resp.status);
                if(resp.status === 401) {
                    this.props.history.push('/login');
                    throw new Error('Unauthenticated');
                }
                else if(resp.status !== 200) {
                    this.setState({
                        ...this.state,
                        authenticated: true,
                        unauthorized: true
                    })
                    throw new Error('Unauthorized');
                }
                this.setState({
                    ...this.state,
                    authenticated: true,
                    unauthorized: false
                })
                return resp.json();
            })
            .catch(err => {
                console.log(err);
            })
    }

    public addReimbursement = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const date = new Date();
        const amount = this.state.amount;
        const submitted = date.toLocaleString();
        const description = this.state.description;
        const typeId = this.state.type;
    
        const reimbursement = { amount, submitted, description, typeId };
        fetch(environment.context + 'reimbursements/insert', {
            body: JSON.stringify(reimbursement),
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            method: 'POST'
        })
            .then(resp => {
                console.log(resp.status);
                if(resp.status !== 201) {
                    throw new Error('Failed to add Remibursments');
                }
            })
            .then(resp => {
                this.props.history.push('/retrieve');
            })
            .catch(err => {
                console.log(err);
            })
    }
    public render() {
        const { amount, description, authenticated, unauthorized } = this.state;

        if(authenticated) {
            return (
                <div>
                    {/* Navigation  */}
                    <AppNav />

                    {/* Restricted Message */}
                    {(unauthorized) &&
                    <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">This Page is Restricted: Employees Only</th>
                        </tr>
                    </thead>
                    </table> }
                    
                    {/* Request form */}
                    {(unauthorized) ||
                    <form onSubmit = {this.addReimbursement}>
                        <div className="form-group">
                            <label htmlFor="exampleFormControlInput1">Amount</label>
                            <input
                                onChange={this.amountChange}
                                value={amount}
                                type = "number"
                                min = {1.00} step={0.01}
                                className="form-control"
                                id="exampleFormControlInput1"
                                placeholder="$1.00"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleFormControlTextarea1">Description</label>
                            <textarea
                                onChange={this.descriptionChange}
                                value={description}
                                className="form-control"
                                id="exampleFormControlTextarea1"
                                rows={3}
                                cols={50}></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleFormControlSelect2">Type</label>
                            <select
                                multiple
                                className="form-control"
                                id="exampleFormControlSelect2"
                                onChange={this.typeChange}>
                            <option value="1">Lodging</option>
                            <option value="2">Travel</option>
                            <option value="3">Food</option>
                            <option value="4">Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                        <button className="btn btn-lg btn-primary btn-block" type="submit">Submit</button>
                        </div>
                    </form> }
                </div>
            );
        }
        else {
            return null;
        }
    }
}