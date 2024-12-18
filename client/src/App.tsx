import React, { useEffect, useState } from 'react'

const API_URL = 'http://localhost:8080'

function App() {
  const [data, setData] = useState<string>()
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    getData()
    setMessage('')
  }, [])

  const getData = async () => {
    const response = await fetch(API_URL)
    const { data } = await response?.json()
    setData(data)
  }

  const updateData = async () => {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ data }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    const { message } = await response?.json()
    setMessage(message)

    await getData()
  }

  const verifyData = async () => {
    const response = await fetch(`${API_URL}/verify`, {
      method: 'POST',
      body: JSON.stringify({ data }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    const result = await response?.json()
    if (result?.valid) {
      setMessage('Data is intact')
    } else {
      setMessage('Data has been tampered with')
    }
  }

  const recoverData = async () => {
    const response = await fetch(`${API_URL}/recover`, { method: 'POST' })
    const result = await response?.json()
    setMessage(result.message)
    await getData()
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        position: 'absolute',
        padding: 0,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '20px',
        fontSize: '30px',
      }}
    >
      <div>Saved Data</div>
      <input
        style={{ fontSize: '30px' }}
        type='text'
        value={data}
        onChange={(e) => setData(e.target.value)}
      />

      <div style={{ display: 'flex', gap: '10px' }}>
        <button style={{ fontSize: '20px' }} onClick={updateData}>
          Update Data
        </button>
        <button style={{ fontSize: '20px' }} onClick={verifyData}>
          Verify Data
        </button>
        <button style={{ fontSize: '20px' }} onClick={recoverData}>
          Recover Data
        </button>
      </div>

      <div style={{ fontSize: '20px', color: 'red' }}>{message}</div>
    </div>
  )
}

export default App
