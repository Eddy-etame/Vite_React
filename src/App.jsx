import { useState } from 'react'
import TodoList from './bug-hunt/TodoList.jsx'
import Counter from './bug-hunt/Counter.jsx'
import ShoppingCart from './bug-hunt/ShoppingCart.jsx'
import ContactForm from './bug-hunt/ContactForm.jsx'
import UserProfile from './bug-hunt/UserProfile.jsx'

const TABS = [
  { id: 'n1', label: 'Niveau 1 — TodoList', Component: TodoList },
  { id: 'n2', label: 'Niveau 2 — Compteur', Component: Counter },
  { id: 'n3', label: 'Niveau 3 — Panier', Component: ShoppingCart },
  { id: 'n4', label: 'Niveau 4 — Formulaire', Component: ContactForm },
  { id: 'n5', label: 'Niveau 5 — Profil (API)', Component: UserProfileDemo },
]

function UserProfileDemo() {
  const [id, setId] = useState(1)
  return (
    <div>
      <p>
        <label htmlFor="uid">userId (1–10) : </label>
        <input
          id="uid"
          type="number"
          min={1}
          max={10}
          value={id}
          onChange={(e) => setId(Number(e.target.value) || 1)}
          style={{ width: '4rem' }}
        />
      </p>
      <UserProfile userId={id} />
    </div>
  )
}

export default function App() {
  const [active, setActive] = useState('n1')
  const tab = TABS.find((t) => t.id === active) ?? TABS[0]
  const Panel = tab.Component

  return (
    <>
      <h1>TP Bug Hunt — composants corrigés</h1>
      <p style={{ fontSize: '0.9rem', color: '#555' }}>
        Onglets : chaque niveau correspond à un exercice du TP. Les explications
        et le QCM sont dans le README du projet ; le code corrigé est dans{' '}
        <code>src/bug-hunt/</code>.
      </p>
      <div className="tab-bar" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active === t.id}
            className={active === t.id ? 'active' : ''}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="panel" role="tabpanel">
        <Panel />
      </div>
    </>
  )
}
