import { useEffect, useState } from "react";

export const Sender = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
//   const [pc, setPC] = useState<RTCPeerConnection | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    setSocket(socket);
    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "sender",
        })
      );
    };
  }, []);

  const initiateConn = async () => {
    if(!socket) return;
    const pc = new RTCPeerConnection();
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    pc.onicecandidate = (event)=>{
        if(event.candidate){
            socket.send(
              JSON.stringify({
                type: "iceCandidate",
                sdp: event.candidate,
              })
            );
        }

    }

    socket.send(
      JSON.stringify({
        type: "sender",
        sdp:pc.localDescription
      })
    );

    socket.onmessage = (event)=>{
        const data = JSON.parse(event.data);
        if(data.type === 'createAnswer'){
            pc.setRemoteDescription(data.stp)
        }
    }

  };

//   const getCameraStreamAndSend = (pc: RTCPeerConnection) => {
//     navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
//       const video = document.createElement("video");
//       video.srcObject = stream;
//       video.play();
//       // this is wrong, should propogate via a component
//       document.body.appendChild(video);
//       stream.getTracks().forEach((track) => {
//         pc?.addTrack(track);
//       });
//     });
//   };

  return (
    <div>
      Sender
      <button onClick={initiateConn}> Send data </button>
    </div>
  );
};
