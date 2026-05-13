import React from 'react'

export default function Mute({isMuted, setIsMuted}) {
  return (
    <button onClick={() => setIsMuted(!isMuted)} style={{position: 'absolute', top: '10px', left: '10px', backgroundColor: 'transparent', color: 'white', fontWeight: 'bold', fontSize: '22px', width: '48px', height: '48px', borderRadius: '50%', zIndex: 1000, cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{isMuted ? '🔇' : '🔊'}</button>
  )
}
