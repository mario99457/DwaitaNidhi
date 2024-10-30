export async function authenticate(credentials) {
    return fetch('https://dwaitanidhiapi.netlify.app/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then(async data => {
        if(data.ok)
        {
          let result = await data.json();
          return { username: credentials.username, token: result }
        }
        else{
          return data.json()
        }
      })
      .catch(e => { return e })
   }