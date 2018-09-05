function start() {
    let obj = document.getElementById('display');
    obj.innerHTML = 
    `Welcome Employee
    <button onclick = "viewPastTickets()"> View Past Tickets </button>
    <button onclick = "reimbursementRequest()"> Add Reimbursement </button>
    `;
}

function viewPastTickets() {
    console.log('welcome1');
    let obj = document.getElementById('display');
    obj.innerHTML = 
    `<table class="table table-striped table-dark col"">
      <thead>
        <tr>
          <th scope = "col">Type</th>
          <th scope = "col">Description</th>
          <th scope = "col">Amount</th>
          <th scope = "col">Date Submitted</th>
          <th scope = "col">Status</th>
          <th scope = "col">Resolver</th>
          <th scope = "col">Date Resolved</th>
        </tr>
      </thead>
      <tbody id="table-body">
      </tbody>
    </table>
    `;
    let id = localStorage.user;
    
    fetch(`http://localhost:3000/reimbursements/retrieve/${id}`)
        .then(resp => {
            if(resp.status === 412) {
                throw 'No reimbursements to display'
            }
            else if(resp.status === 500)
                throw 'Faild to get reimbursements to display'
            return resp.json();
        })
        .then(resp => {
            resp => resp.json();
            resp.forEach(reimbursement => {
                addDataToTableBody(reimbursement);
            });
        })
        .catch(err => {
            console.log(err);
        })
}

function addDataToTableBody(reimbursement) {
    let obj = document.getElementById('table-body');
    obj.innerHTML +=
    `<tr>
        <td>${reimbursement.reimb_type}</td>
        <td>${reimbursement.reimb_description}</td>
        <td>$${reimbursement.reimb_amount}</td>
        <td>${reimbursement.reimb_submitted}</td>
        <td>${reimbursement.reimb_status}</td>
        <td>${reimbursement.full_name}</td>
        <td>${reimbursement.reimb_resolved}</td>
    </tr>
    `;
}

function reimbursementRequest() {
    console.log('welcome2');
    let obj = document.getElementById('display');
    obj.innerHTML =
    `<form onsubmit = "addReimbursement(event)">
        <label> Amount </label> <br /> <input id = "inputAmount" type = "number" min = "1.00" step="0.01" required/> <br />
        <label> Description </label> <br /> <textarea id = "inputDescription" rows="4" cols="50"></textarea> <br />
        <label> Type </label> 
        <select id = "inputType">
            <option value="1">Lodging</option>
            <option value="2">Travel</option>
            <option value="3">Food</option>
            <option value="4">Other</option>
      </select>
      <button type = "submit"> Submit </button>
        `;
}

function addReimbursement(event) {
    event.preventDefault();
    let date = new Date();
    let amount = document.getElementById('inputAmount').value;
    let submitted = date.toUTCString();
    let description = document.getElementById('inputDescription').value;
    let authorId = localStorage.user; 
    let typeId = document.getElementById('inputType').value;

    const reimbursement = { amount, submitted, description, authorId, typeId };
    fetch('http://localhost:3000/reimbursements/insert', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(reimbursement)
    })
        .then(resp => {
            console.log(resp.status);
            if(resp.status !== 201) {
                throw 'Failed to add Remibursments';
            }
            else {
                // document.getElementById('error-message').innerText = 'Failed to Login';
                // alert('Failed to add Remibursment');
            }
            // throw 'Failed to add Remibursments';
        })
        .then(resp => {
            window.location = 'http://localhost:3000/employee/home.html';
        })
        .catch(err => {
            console.log(err);
        })
}