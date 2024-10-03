
import { useState } from 'react';

export default function useProgress() {
  const getProgress = () => {
    const p = sessionStorage.getItem('progress') || "false";    
    return p
  };
  const [progress, setProgress] = useState(getProgress());

  const saveProgress = (i:string) => {
    sessionStorage.setItem('progress', i);
    setProgress(i);
  };

  return {
    setProgress: saveProgress,
    progress
  }
}