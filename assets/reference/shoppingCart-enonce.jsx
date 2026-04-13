/* Niveau 3 — code tel que dans l’énoncé TP (bugué). */
import { useState, useEffect } from 'react'

function ShoppingCart({ items }) {
  const [cart, setCart] = useState([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    let sum = 0
    cart.forEach((item) => (sum += item.price * item.quantity))
    setTotal(sum)
  })

  const addItem = (item) => {
    const existing = cart.find((i) => i.id === item.id)
    if (existing) {
      existing.quantity++
      setCart(cart)
    } else {
      setCart([...cart, { ...item, quantity: 1 }])
    }
  }

  const updateQuantity = (id, qty) => {
    const item = cart.find((i) => i.id === id)
    item.quantity = qty
    setCart(cart)
  }

  return (
    <div>
      <h2>Panier</h2>
      {items.map((item) => (
        <div>
          <span>{item.name}</span>
          <button onClick={() => addItem(item)}>+</button>
        </div>
      ))}
      <h3>Articles</h3>
      {cart.map((item, i) => (
        <div key={i}>
          {item.name}
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => updateQuantity(item.id, e.target.value)}
          />
        </div>
      ))}
      <div>Total: {total}€</div>
    </div>
  )
}

export default ShoppingCart
