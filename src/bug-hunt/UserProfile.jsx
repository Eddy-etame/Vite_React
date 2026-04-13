import { useState, useEffect, startTransition } from 'react'

/**
 * Démo Niveau 5 : données via JSONPlaceholder (users 1–10).
 * Annulation des réponses obsolètes avec AbortController.
 */
export default function UserProfile({ userId }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const ac = new AbortController()
    let active = true
    startTransition(() => {
      setLoading(true)
      setError(null)
      setUser(null)
    })

    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
      signal: ac.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error('Utilisateur introuvable')
        return res.json()
      })
      .then((data) => {
        if (active) setUser(data)
      })
      .catch((e) => {
        if (e.name === 'AbortError') return
        if (active) setError(e.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
      ac.abort()
    }
  }, [userId])

  if (loading) return <div>Chargement...</div>
  if (error) return <div>Erreur : {error}</div>
  if (!user) return <div>Aucun utilisateur</div>

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  )
}
