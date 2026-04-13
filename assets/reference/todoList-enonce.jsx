/* Niveau 1 — code tel que dans l’énoncé TP (bugué). */
import { useState } from 'react'

function TodoList() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')

  const addTodo = () => {
    todos.push({ text: input, id: Date.now() })
    setTodos(todos)
    setInput('')
  }

  return (
    <div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={addTodo()}>Ajouter</button>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>{todo.text}</li>
        ))}
      </ul>
    </div>
  )
}

export default TodoList
