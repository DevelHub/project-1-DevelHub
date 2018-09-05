function start() {
    let obj = document.getElementById('display');
    obj.innerHTML = 
    `Welcome Manager
    <button onclick = "viewAllreimbursements()"> View All Tickets </button>
    `;
}

function viewAllreimbursements() {
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
    // document.getElementById("myP").style.cursor = "pointer";
    // document.getElementById("myP").style.color = "blue";
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