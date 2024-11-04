
import { useState } from 'react';

export default function useProgress() {
  const getProgress = () => {
    const progress = localStorage.getItem('progress');
    return progress ? progress : false;
  };
  const [creds, setProgress] = useState(getProgress());

  const saveProgress = progress => {
    localStorage.setItem('progress', progress);
    setProgress(progress);
  };

  return {
    setProgress: saveProgress,
    creds
  }
}