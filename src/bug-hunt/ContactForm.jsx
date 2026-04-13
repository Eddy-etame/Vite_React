import { useState, useRef, useEffect } from 'react'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const submitTimerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (submitTimerRef.current) clearTimeout(submitTimerRef.current)
    }
  }, [])

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis'
    }
    const email = formData.email.trim()
    if (!email) {
      newErrors.email = "L'email est requis"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email invalide'
    }
    if (formData.message.trim().length < 10) {
      newErrors.message = 'Message trop court (min 10 caractères)'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitSuccess(false)
    if (!validateForm()) {
      setIsSubmitting(false)
      return
    }
    setIsSubmitting(true)
    if (submitTimerRef.current) clearTimeout(submitTimerRef.current)
    submitTimerRef.current = setTimeout(() => {
      alert('Message envoyé avec succès !')
      setSubmitSuccess(true)
      setFormData({ name: '', email: '', message: '' })
      setIsSubmitting(false)
      setErrors({})
      submitTimerRef.current = null
    }, 1000)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => {
      if (!prev[name]) return prev
      const next = { ...prev }
      delete next[name]
      return next
    })
  }

  return (
    <div className="contact-form">
      <h2>Contactez-nous</h2>

      {submitSuccess && (
        <div className="success-message">Message envoyé avec succès !</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nom complet:</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
          />
          {errors.email && (
            <span className="error" style={{ color: 'red', fontSize: 12 }}>
              {errors.email}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
          />
          {errors.message && (
            <span className="error">{errors.message}</span>
          )}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
        </button>
      </form>
    </div>
  )
}
