/* Niveau 5 — code tel que dans l’énoncé TP (race condition possible). */
import { useState, useEffect } from 'react'

function UserProfile({ userId }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data)
        setLoading(false)
      })
  }, [userId])

  if (loading) return <div>Chargement...</div>
  if (!user) return <div>Aucun utilisateur</div>

  return (
    <div>
      <h2>{user.name}</h2>
    </div>
  )
}

export default UserProfile
