export async function getResoudfsrceFromGit(credentials) {
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
   
   
export async function getResourceFromGit(url) {        
    let options = {
        method: 'GET'
    }; 
    fetch('http://localhost:3000/api/git/audio?resource=' + url, options)
        .then(async data => {
            if(data.ok)
            {
                return await data.json();         
            }
            else{
                data.json()
            }
            })
        .catch(e => { return e })
}