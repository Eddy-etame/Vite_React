/* Niveau 2 — code tel que dans l’énoncé TP (bugué). */
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  const increment = () => {
    setCount(count + 1)
    setCount(count + 1)
    setCount(count + 1)
    console.log('Nouveau count:', count)
  }

  const reset = () => {
    count = 0
    setCount(count)
  }

  return (
    <div>
      <h1>Compteur: {count}</h1>
      <button onClick={increment}>+3</button>
      <button onClick={reset}>Reset</button>
      {count > 10 && <p style={color: 'red'}>Trop grand!</p>}
    </div>
  )
}

export default Counter
