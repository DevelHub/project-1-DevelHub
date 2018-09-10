import * as React from 'react'
import { environment } from '../../../environment';
import { DateConverter } from '../date-converter';
import { AppNav } from '../../nav/nav.component';

export class ManagerRequestsAll extends React.Component<any, any> {

    public constructor (props: any) {
        super(props);
        this.state = {
            authenticated: false,
            extraDetails: [],
            fromDate: '',
            name: '',
            reimbursements: [],
            reimbursementsSave:[],
            showDefault: false,
            showExtra: false,
            showTable: false,
            toDate: '',
            unauthorized: false,
            valid: false
        }
    }

    public componentDidMount() {
        fetch(environment.context + 'reimbursements/retrieve-all', {
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
                if(resp.status === 403) {
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
                    });
                    throw new Error('No reimbursements to display');
                }
                else if(resp.status === 500) {
                    this.setState({
                        ...this.state,
                        authenticated: true,
                        showDefault: true
                    });
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
                    reimbursementsSave: reimbursements,
                    // showDefault: false,
                    // showExtra: false,
                    showTable: true,
                    valid: false
                });
            })
            .catch(err => {
                console.log(err);
            })
        }

    public setDetails(e: any) {
        const read = this.state.reimbursements;
        const rowKey = e;
        read.forEach((reimbursement: any) => {
            if(reimbursement.reimb_id === rowKey) {
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
        const resolved = date.toLocaleString();
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
                        showTable: true,
                        valid: false
                    });
                    this.componentDidMount();
                    return;
                }
                this.setState({
                    ...this.state,
                    showExtra: false,
                    showTable: true,
                    valid: false
                });
                this.componentDidMount();
                throw new Error('Failed to update reimbursement at this time');
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

    public filterStatus = (e: any) => {
        const read = this.state.reimbursementsSave;
        const selectedValue = e.target.value;
        const temp:any = [];
        if(selectedValue !== 'all') {
            read.forEach((reimbursement: any) => {
                if(reimbursement.reimb_status === selectedValue) {
                    temp.push(reimbursement);
                }
            });
            this.setState({
                ...this.state,
                reimbursements: temp
            })
        }
        else {
            this.setState({
                ...this.state,
                reimbursements: read
            })
        }
    }

    public filterName = (e: any) => {
        const read = this.state.reimbursementsSave;
        const nameValue = e.target.value;
        const temp:any = [];
        if(nameValue) {
            read.forEach((reimbursement: any) => {
                if(reimbursement.full_name.includes(nameValue)) {
                    temp.push(reimbursement);
                }
            });
            this.setState({
                ...this.state,
                name: nameValue,
                reimbursements: temp
            })
        }
        else {
            this.setState({
                ...this.state,
                name: nameValue,
                reimbursements: read
            })
        }
    }
    
    public filterDate = (e: any) => {
        const targetName = e.target.name;
        const from = this.state.fromDate;
        const to = this.state.toDate;
        let read = this.state.reimbursementsSave;
        const temp:any = [];
        let splitSpace;
        let splitSlash;
        if(from && targetName === 'to') {
            read.forEach((reimbursement: any) => {
                splitSpace = reimbursement.reimb_submitted.split(' ');
                splitSlash = splitSpace[0].split('/');
                const year = splitSlash[2];
                const targetYear = from.split('-')[0];
                if(year > targetYear) {
                    temp.push(reimbursement);
                }
                else if(year === targetYear) {
                    splitSpace = reimbursement.reimb_submitted.split(' ');
                    splitSlash = splitSpace[0].split('/');
                    const month = splitSlash[0];
                    const targetMonth = from.split('-')[1];
                    if(month > targetMonth) {
                        temp.push(reimbursement);
                    }
                    else if(month === targetMonth) {
                        splitSpace = reimbursement.reimb_submitted.split(' ');
                        splitSlash = splitSpace[0].split('/');
                        const day = splitSlash[1];
                        const targetDay = from.split('-')[2];
                        if(day >= targetDay) {
                            temp.push(reimbursement);
                        }
                    }
                }
            });
            read = [];
            temp.forEach((reimbursement: any) => {
                splitSpace = reimbursement.reimb_submitted.split(' ');
                splitSlash = splitSpace[0].split('/');
                const year = splitSlash[2];
                const targetYear = e.target.value.split('-')[0];
                if(year < targetYear) {
                    read.push(reimbursement);
                }
                else if(year === targetYear) {
                    splitSpace = reimbursement.reimb_submitted.split(' ');
                    splitSlash = splitSpace[0].split('/');
                    const month = splitSlash[0];
                    const targetMonth = e.target.value.split('-')[1];
                    if(month < targetMonth) {
                        read.push(reimbursement);
                    }
                    else if(month === targetMonth) {
                        splitSpace = reimbursement.reimb_submitted.split(' ');
                        splitSlash = splitSpace[0].split('/');
                        const day = splitSlash[1];
                        const targetDay = e.target.value.split('-')[2];
                        if(day <= targetDay) {
                            read.push(reimbursement);
                        }
                    }
                }
                this.setState({
                    ...this.state,
                    reimbursements: read,
                    toDate: e.target.value
                })
            });
        }
        else if(to && targetName === 'from') {
            read.forEach((reimbursement: any) => {
                splitSpace = reimbursement.reimb_submitted.split(' ');
                splitSlash = splitSpace[0].split('/');
                const year = splitSlash[2];
                const targetYear = to.split('-')[0];
                if(year < targetYear) {
                    temp.push(reimbursement);
                }
                else if(year === targetYear) {
                    splitSpace = reimbursement.reimb_submitted.split(' ');
                    splitSlash = splitSpace[0].split('/');
                    const month = splitSlash[0];
                    const targetMonth = to.split('-')[1];
                    if(month < targetMonth) {
                        temp.push(reimbursement);
                    }
                    else if(month === targetMonth) {
                        splitSpace = reimbursement.reimb_submitted.split(' ');
                        splitSlash = splitSpace[0].split('/');
                        const day = splitSlash[1];
                        const targetDay = to.split('-')[2];
                        if(day <= targetDay) {
                            temp.push(reimbursement);
                        }
                    }
                }
            });
            read = [];
            temp.forEach((reimbursement: any) => {
                splitSpace = reimbursement.reimb_submitted.split(' ');
                splitSlash = splitSpace[0].split('/');
                const year = splitSlash[2];
                const targetYear = e.target.value.split('-')[0];
                if(year > targetYear) {
                    read.push(reimbursement);
                }
                else if(year === targetYear) {
                    splitSpace = reimbursement.reimb_submitted.split(' ');
                    splitSlash = splitSpace[0].split('/');
                    const month = splitSlash[0];
                    const targetMonth = e.target.value.split('-')[1];
                    if(month > targetMonth) {
                        read.push(reimbursement);
                    }
                    else if(month === targetMonth) {
                        splitSpace = reimbursement.reimb_submitted.split(' ');
                        splitSlash = splitSpace[0].split('/');
                        const day = splitSlash[1];
                        const targetDay = e.target.value.split('-')[2];
                        if(day >= targetDay) {
                            read.push(reimbursement);
                        }
                    }
                }
                this.setState({
                    ...this.state,
                    fromDate: e.target.value,
                    reimbursements: read
                })
            });
        }
        else if(targetName === 'from') {
            read.forEach((reimbursement: any) => {
                splitSpace = reimbursement.reimb_submitted.split(' ');
                splitSlash = splitSpace[0].split('/');
                const year = splitSlash[2];
                const targetYear = e.target.value.split('-')[0];
                if(year > targetYear) {
                    temp.push(reimbursement);
                }
                else if(year === targetYear) {
                    splitSpace = reimbursement.reimb_submitted.split(' ');
                    splitSlash = splitSpace[0].split('/');
                    const month = splitSlash[0];
                    const targetMonth = e.target.value.split('-')[1];
                    if(month > targetMonth) {
                        temp.push(reimbursement);
                    }
                    else if(month === targetMonth) {
                        splitSpace = reimbursement.reimb_submitted.split(' ');
                        splitSlash = splitSpace[0].split('/');
                        const day = splitSlash[1];
                        const targetDay = e.target.value.split('-')[2];
                        if(day >= targetDay) {
                            temp.push(reimbursement);
                        }
                    }
                }
                this.setState({
                    ...this.state,
                    fromDate: e.target.value,
                    reimbursements: temp
                })
            });
        }
        else if(targetName === 'to') {
            read.forEach((reimbursement: any) => {
                splitSpace = reimbursement.reimb_submitted.split(' ');
                splitSlash = splitSpace[0].split('/');
                const year = splitSlash[2];
                const targetYear = e.target.value.split('-')[0];
                if(year < targetYear) {
                    temp.push(reimbursement);
                }
                else if(year === targetYear) {
                    splitSpace = reimbursement.reimb_submitted.split(' ');
                    splitSlash = splitSpace[0].split('/');
                    const month = splitSlash[0];
                    const targetMonth = e.target.value.split('-')[1];
                    if(month < targetMonth) {
                        temp.push(reimbursement);
                    }
                    else if(month === targetMonth) {
                        splitSpace = reimbursement.reimb_submitted.split(' ');
                        splitSlash = splitSpace[0].split('/');
                        const day = splitSlash[1];
                        const targetDay = e.target.value.split('-')[2];
                        if(day <= targetDay) {
                            temp.push(reimbursement);
                        }
                    }
                }
                this.setState({
                    ...this.state,
                    reimbursements: temp,
                    toDate: e.target.value
                })
            });
        }
    }

    public render() {
        const { authenticated, showTable, showDefault, showExtra, unauthorized } = this.state;

        if(authenticated) {
            return (
                <div>
                    {/* Navigation  */}
                    <AppNav />
                    
                    <div id="managerPage">
                        {
                            (showTable) &&
                        <table id="managerTables" className="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col" >
                                    <label>Filter Name</label> <br />
                                    <input type="text" onChange={this.filterName} value={this.state.name}/> <br /></th>
                                    <th scope="col"> 
                                        <label> From </label > <br />
                                        <input type="Date" name="from" onChange={this.filterDate}></input> <br />
                                        <label> To </label> <br />
                                        <input type="Date" name="to" onChange={this.filterDate}/></th>
                                    <th scope="col">
                                    <label>Filter Status</label> <br />
                                    <select onChange={this.filterStatus}>
                                        <option value="all">All</option>
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="denied">Denied</option>
                                    </select> <br /></th>
                                </tr>
                                <tr> 
                                </tr>
                                <tr className="managerHeadLastRowTable">
                                    <th scope="col">Submitted By</th>
                                    <th scope="col">Date Submitted</th>
                                    <th scope="col">Status</th>
                                </tr>
                            </thead>
                            <tbody className="managerBodyTable">
                                {
                                    this.state.reimbursements.map((ers: any) => (
                                        <tr key={ers.reimb_id} className="managerHoverRow">              
                                            <td>{ers.full_name}</td>
                                            <td>{ers.reimb_submitted}</td>
                                            <td className="managerClickColumn" onClick={() => {this.setDetails(ers.reimb_id)}}>{ers.reimb_status}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        }
                        
                        {
                            (showExtra) &&
                            
                            <div>
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                    <label>First Name</label>
                                    <input type="text" className="form-control form-control-plaintext" readOnly id="inputEmail4" value={this.state.extraDetails.full_name.split(' ')[1]}/>
                                    </div>
                                    <div className="form-group col-md-6">
                                    <label>Last Name</label>
                                    <input type="text" className="form-control form-control-plaintext" readOnly id="inputPassword4" value={this.state.extraDetails.full_name.split(' ')[0]} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" className="form-control form-control-plaintext" readOnly id="inputAddress" value={this.state.extraDetails.user_email} />
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                    <label>Amount</label>
                                    <input type="text" className="form-control form-control-plaintext" readOnly id="inputAddress2" value={`$${this.state.extraDetails.reimb_amount}`} />
                                    </div>
                                    <div className="form-group col-md-6">
                                    <label>Type</label>
                                    <input type="text" className="form-control form-control-plaintext" readOnly id="inputAddress2" value={this.state.extraDetails.reimb_type} />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                    <label>Description</label>
                                        <textarea
                                            value={this.state.extraDetails.reimb_description}
                                            className="form-control form-control-plaintext" readOnly
                                            id="exampleFormControlTextarea1"
                                            rows={3}
                                            cols={50}
                                            ></textarea>
                                    </div>
                                    <div className="form-group col-md-3">
                                    <label>Resolver</label>
                                    <input type="text form-control-plaintext" readOnly className="form-control" id="inputZip" value={this.state.extraDetails.resolver_name} />
                                    </div>
                                    <div className="form-group col-md-3">
                                    <label>Date Resolved</label>
                                    <input type="text form-control-plaintext" readOnly className="form-control" id="inputZip" value={this.state.extraDetails.reimb_resolved} />
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

                    {
                        (showDefault) &&
                        <table className="table table-hover userView">
                            <thead>
                                <tr>
                                    <th scope="col">Submited Reimbursemnets Are shown Here</th>
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
                                    <th scope="col">This Page is Restricted: Managers Only</th>
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