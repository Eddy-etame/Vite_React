// NIVEAU 4 : FORMULAIRE DE CONTACT
// Difficulté : Expert | Temps : 30 min | Bugs à trouver : 10+
// 
// CONSIGNE :
// Ce formulaire de contact devrait permettre d'envoyer un message
// après validation des champs. Il y a de NOMBREUX bugs à corriger.
// Soyez méthodique et testez chaque fonctionnalité !

import { useState } from 'react';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) {
      errors.name = 'Le nom est requis';
    }
    
    if (!formData.email.includes('@')) {
      errors.email = 'Email invalide';
    }
    
    if (formData.message.length < 10) {
      newErrors.message = 'Message trop court (min 10 caractères)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    
    setIsSubmitting(true);
    
    if (validateForm()) {
      console.log('Formulaire valide:', formData);
      
      // Simuler appel API
      setTimeout(() => {
        alert('Message envoyé avec succès !');
        setSubmitSuccess(true);
        
        formData.name = '';
        formData.email = '';
        formData.message = '';
        setFormData(formData); 
        
        setIsSubmitting(false);
        setErrors({});
      }, 1000);
    } else {
         }
  };
  
  const handleChange = (e) => {
    formData[e.target.name] = e.target.value; 
    setFormData(formData); 
    

    if (errors[e.target.name]) {
     
      delete errors[e.target.name]; 
      setErrors(errors);  
    }
  };
   
  return (
    <div className="contact-form">
      <h2>Contactez-nous</h2>
      
      {submitSuccess && (
        <div className="success-message">
          Message envoyé avec succès !
        </div>
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
          />
          {errors.name && (
            <span className="error">{errors.name}</span>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <span style="color: red; font-size: 12px">{errors.email}</span>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="5"
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
  );
}

export default ContactForm;
