import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  const increment = () => {
    setCount((c) => c + 3)
  }

  const reset = () => {
    setCount(0)
  }

  return (
    <div>
      <h2>Compteur: {count}</h2>
      <button type="button" onClick={increment}>
        +3
      </button>
      <button type="button" onClick={reset}>
        Reset
      </button>
      {count > 10 && <p style={{ color: 'red' }}>Trop grand!</p>}
    </div>
  )
}
