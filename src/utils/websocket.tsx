// this code is not working 
import { useState, useEffect, useRef } from 'react';

export const websocket = () => {
  
  const [ message, setMessage ] = useState<string>();
  
  // const ws = useRef<WebSocket | null>(null);
  // useEffect(() => {
  //   ws.current = new WebSocket('ws://localhost/ws/front');
  //   ws.current.onopen = (ev: Event) => {
  //     console.log(`onopen: ${ev}`);
  //     if (ws.current?.readyState !== WebSocket.OPEN) {
  //       console.log(`ws is not ready. state=${ws.current?.readyState}`);
  //       return;
  //     }
  //     ws.current?.send('로그인 처리');
  //   };
  //   ws.current.onclose = (ev: CloseEvent) => {
  //     console.log(`onclose: ${ev}`);
  //   };
  //   ws.current.onmessage = (ev: MessageEvent) => {
  //     setMessage(() => ev.data);
  //   };
  //   return () => {
  //     ws.current?.close();
  //   }
  // }, []);

  return (
    <div>
      {message}
    </div>
  );
};
