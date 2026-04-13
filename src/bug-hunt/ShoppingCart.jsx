import { useState, useMemo } from 'react'
import { DEMO_SHOP_ITEMS } from './demoItems.js'

export default function ShoppingCart() {
  const items = DEMO_SHOP_ITEMS
  const [cart, setCart] = useState([])

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  )

  const addItem = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const updateQuantity = (id, rawQty) => {
    const qty = Number(rawQty)
    if (Number.isNaN(qty) || qty < 0) return
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
    )
  }

  return (
    <div>
      <h2>Catalogue</h2>
      {items.map((item) => (
        <div key={item.id} style={{ marginBottom: '0.5rem' }}>
          <span>
            {item.name} — {item.price.toFixed(2)} €
          </span>{' '}
          <button type="button" onClick={() => addItem(item)}>
            +
          </button>
        </div>
      ))}

      <h3>Panier</h3>
      {cart.length === 0 && <p>Panier vide.</p>}
      {cart.map((item) => (
        <div key={item.id} style={{ marginBottom: '0.5rem' }}>
          {item.name}
          <input
            type="number"
            min={0}
            value={item.quantity}
            onChange={(e) => updateQuantity(item.id, e.target.value)}
            style={{ marginLeft: '0.5rem', width: '4rem' }}
          />
        </div>
      ))}

      <p>
        <strong>Total:</strong> {total.toFixed(2)} €
      </p>
    </div>
  )
}
