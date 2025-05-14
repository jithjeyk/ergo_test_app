import { useRef } from 'react';

export const useModalSubmitConnection = () => {
  const childSubmitRef = useRef<() => void | Promise<void> | null>(null);
  
  const registerSubmitHandler = (handler: () => void | Promise<void>) => {
    childSubmitRef.current = handler;
  };
  
  const triggerSubmit = async () => {
    if (childSubmitRef.current) {
      return await childSubmitRef.current();
    }
  };
  
  return {
    registerSubmitHandler,
    triggerSubmit
  };
};