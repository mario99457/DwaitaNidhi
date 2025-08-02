/// <reference types="vite/client" />

declare module 'raf' {
  function raf(callback: () => void): number;
  namespace raf {
    function cancel(id: number): void;
  }
  export = raf;
}
