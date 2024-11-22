
import { useState } from 'react';

export default function useToken() {
  const getToken = () => {
    const creds = localStorage.getItem('creds');
    const userCredentials = JSON.parse(creds);
    return userCredentials
  };
  const [creds, setToken] = useState(getToken());

  const saveToken = userCredentials => {
    localStorage.setItem('creds', JSON.stringify(userCredentials));
    setToken(userCredentials);
  };

  return {
    setToken: saveToken,
    creds
  }
}