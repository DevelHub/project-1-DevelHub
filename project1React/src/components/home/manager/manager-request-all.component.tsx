import * as React from 'react'

export class ManagerRequestsAll extends React.Component<any, any> {

    public constructor (props: any) {
        super(props);
        this.state = {
            extraDetails: [],
            reimbursements: [],
            showDefault: false,
            showExtra: false,
            showTable: false,
            valid: false
        }
    }

    public componentDidMount() {
        fetch(`http://localhost:4000/reimbursements/retrieve-all`, {
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }
        })
            .then(resp => {
                console.log(resp.status);
                if(resp.status === 412) {
                    this.setState({
                        ...this.state,
                        showDefault: true
                    });
                    throw new Error('No reimbursements to display');
                }
                else if(resp.status === 500) {
                    this.setState({
                        ...this.state,
                        showDefault: true
                    });
                    throw new Error('Failed to get reimbursements to display');
                }
                return resp.json();
            })
            .then(reimbursements => {
                this.setState({
                    reimbursements,
                    showDefault: false,
                    showExtra: false,
                    showTable: true
                });
            })
            .catch(err => {
                console.log(err);
            })
        }

    public seeThis(e: any) {
        const read = this.state.reimbursements;
        read.forEach((reimbursement: any) => {
            if(reimbursement.reimb_id === e) {
                this.setState({
                    ...this.state,
                    extraDetails: reimbursement,
                    showExtra: true,
                    showTable: false
                })
                return;
            }
        });
    }

    public acceptDecline = (e: number) => {
        if (!this.state.valid) {
            alert('please confirm');
            return;
        }
        const reimbId = this.state.extraDetails.reimb_id;
        const date = new Date();
        const resolved = date.toUTCString();
        let statusId: number;
        if (!e) {
            statusId = 2;
        }
        else {
            statusId = 3;
        }
        const updateReimb = { reimbId, resolved, statusId }
        fetch(`http://localhost:4000/update/one`, {
            body: JSON.stringify(updateReimb),
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            method: 'POST'
        })
            .then(resp => {
                console.log(resp.status);
                if(resp.status === 201) {
                    this.setState({
                        ...this.state,
                        showExtra: false,
                        showTable: true
                    });
                    this.componentDidMount();
                    return;
                }
                throw new Error('Failed to update reimbursements at this time');
            })
            .catch(err => {
                console.log(err);
            })
    }
    
    public checkChange = (e: any) => {
        const preValid = !this.state.valid;
        this.setState({
            ...this.state,
            valid: preValid
        });
    }
    public render() {
        
        return (
            <div>
                {
                    (this.state.showTable) &&
                <table className="table table-hover userView">
                    <thead>
                        <tr>
                            <th scope="col">Submitted By</th>
                            <th scope="col">Date Submitted</th>
                            <th scope="col">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.reimbursements.map((ers: any) => (
                                <tr key={ers.reimb_id} onClick={() => {this.seeThis(ers.reimb_id)}}>              
                                    <td>{ers.full_name}</td>
                                    <td>{ers.reimb_submitted}</td>
                                    <td>{ers.reimb_status}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                }
                
                {
                    (this.state.showDefault) &&
                    <table className="table table-hover userView">
                        <thead>
                            <tr>
                                <th scope="col">Submited Reimbursemnets Are showTablen Here</th>
                            </tr>
                        </thead>
                    </table>
                }
                {
                    (this.state.showExtra) &&
                    
                    <div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                            <label>First Name</label>
                            <input type="text" className="form-control" id="inputEmail4" value={this.state.extraDetails.full_name.split(' ')[1]} disabled={true}/>
                            </div>
                            <div className="form-group col-md-6">
                            <label>Last Name</label>
                            <input type="text" className="form-control" id="inputPassword4" value={this.state.extraDetails.full_name.split(' ')[0]} disabled={true}/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" className="form-control" id="inputAddress" value={this.state.extraDetails.user_email} disabled={true}/>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                            <label>Amount</label>
                            <input type="text" className="form-control" id="inputAddress2" value={`$${this.state.extraDetails.reimb_amount}`} disabled={true}/>
                            </div>
                            <div className="form-group col-md-6">
                            <label>Type</label>
                            <input type="text" className="form-control" id="inputAddress2" value={this.state.extraDetails.reimb_type} disabled={true}/>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                            <label>Description</label>
                                <textarea
                                    value={this.state.extraDetails.reimb_description}
                                    className="form-control"
                                    id="exampleFormControlTextarea1"
                                    rows={3}
                                    cols={50}
                                    disabled={true}></textarea>
                            </div>
                            <div className="form-group col-md-3">
                            <label>Resolver</label>
                            <input type="text" className="form-control" id="inputZip" value={this.state.extraDetails.resolver_name} disabled={true}/>
                            </div>
                            <div className="form-group col-md-3">
                            <label>Date Resolved</label>
                            <input type="text" className="form-control" id="inputZip" value={this.state.extraDetails.reimb_resolved} disabled={true}/>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="gridCheck" onChange={this.checkChange}/>
                            <label className="form-check-label" htmlFor="gridCheck">
                                Check to Confirm
                            </label>
                            </div>
                        </div>
                        <button id="accept" className="btn-block btn btn-primary" onClick={(e) => {this.acceptDecline(1)}}>Approve</button>
                        <button id="decline" className="btn-block btn btn-primary" onClick={(e) => {this.acceptDecline(0)}}>Deny</button>
                    </div>
                }
            </div>
        )
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