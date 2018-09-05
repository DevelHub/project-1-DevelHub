



export const varify = () => {
    let allow = null;
    fetch('http://localhost:4000/home', {
        credentials: 'include'
      })
          .then(resp => {
              console.log(resp.status);
              if (resp.status === 401) {
                  allow = false;
              }
              else if (resp.status === 200) {
                  allow = true;
                  return
              }
              else {
                  allow = false;
              }
              throw new Error('Failed to retrieve page');
          })
          .catch(err => {
              console.log(err);
          });
    return allow;
}