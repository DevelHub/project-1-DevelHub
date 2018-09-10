import * as React from 'react';
import { environment } from '../../environment';

export const LogoutComponent: React.StatelessComponent<any> = (props) => {
  fetch(environment.context + 'getout', {
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(resp => {
        if (resp.status !== 200) {
          throw new Error('Unable to logout at this time');
        }
        props.history.push('/login');
        window.location.reload();
    })
    .catch(err => {
        console.log(err);
    });
  return (
      <table className="table table-hover userView">
          <thead>
              <tr>
                  <th scope="col">404: Page Not Found</th>
              </tr>
          </thead>
      </table>
  )
}