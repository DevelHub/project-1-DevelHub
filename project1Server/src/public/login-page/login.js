function login(event) {
    event.preventDefault();
    let username = document.getElementById('inputUsername').value;
    let password = document.getElementById('inputPassword').value;

    const credentials = { username, password };
    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials)
    })
        .then(resp => {
            console.log(resp.status);
            if(resp.status === 401) {
                document.getElementById('error-message').innerText = 'Invalid Credentials';
            }
            else if(resp.status === 200) {
                return resp.json();
            }
            else {
                document.getElementById('error-message').innerText = 'Failed to Login';
            }
            throw 'Failed to login';
        })
        // .then(resp => resp.json())
        // .then(resp => {
        //     console.log(resp.ers_users_id);
        // })
        .then(resp => {
            alert(resp.user_role);
            let role = resp.user_role;
            let id = resp.ers_users_id;
            if(role.includes('employee'))
                window.location = 'http://localhost:3000/employee/home.html';
            else
                window.location = 'http://localhost:3000/manager/home.html';
            localStorage.setItem('user', id);
            // window.location = 'http://localhost:3000/home/home.html';
        })
        .catch(err => {
            console.log(err);
        })
}