import { useState } from 'react'

export default function TodoList() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')

  const addTodo = () => {
    const text = input.trim()
    if (!text) return
    setTodos((prev) => [...prev, { text, id: crypto.randomUUID() }])
    setInput('')
  }

  return (
    <div>
      <p className="hint">Saisir une tâche puis cliquer Ajouter.</p>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Nouvelle tâche"
      />
      <button type="button" onClick={addTodo}>
        Ajouter
      </button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  )
}
