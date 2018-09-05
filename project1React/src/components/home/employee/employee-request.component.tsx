import * as React from 'react'

export class EmployeeRequest extends React.Component<any, any> {

    public constructor (props: any) {
        super(props);
        this.state = {
            amount: 0.00,
            description: '',
            type: 1
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

    public addReimbursement = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const date = new Date();
        const amount = this.state.amount;
        const submitted = date.toUTCString();
        const description = this.state.description;
        const typeId = this.state.type;
    
        const reimbursement = { amount, submitted, description, typeId };
        fetch('http://localhost:4000/reimbursements/insert', {
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
                else {
                    // document.getElementById('error-message').innerText = 'Failed to Login';
                    // alert('Failed to add Remibursment');
                }
                // throw 'Failed to add Remibursments';
            })
            .then(resp => {
                this.props.history.push('/retrieve');
            })
            .catch(err => {
                console.log(err);
            })
    }
    public render() {
        const { amount, description} = this.state;
        return (

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
        </form>
        );
    }
}