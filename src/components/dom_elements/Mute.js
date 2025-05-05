import React from 'react'

export default function Mute({isMuted, setIsMuted}) {
  return (
    <button onClick={() => setIsMuted(!isMuted)} style={{position: 'absolute', top: '10px', left: '10px', backgroundColor: 'pink', color: 'brown', fontWeight: 'bold', padding: '20px 10px', borderRadius: '10px', zIndex: 1000, cursor: 'pointer', border: 'none'}}>Mute</button>
  )
}
