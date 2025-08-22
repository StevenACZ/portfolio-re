import React, { useActionState, startTransition } from 'react';

// Future contact action - ready for server actions or API integration
async function submitContactForm(prevState, formData) {
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');
  
  // Simulate network delay for demo purposes
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Basic validation
  if (!name || name.length < 2) {
    return {
      success: false,
      message: 'Name must be at least 2 characters long.',
      timestamp: Date.now()
    };
  }
  
  if (!email || !email.includes('@')) {
    return {
      success: false,
      message: 'Please enter a valid email address.',
      timestamp: Date.now()
    };
  }
  
  if (!message || message.length < 10) {
    return {
      success: false,
      message: 'Message must be at least 10 characters long.',
      timestamp: Date.now()
    };
  }
  
  // Success case - in the future, this would send to email service
  console.log('Contact form submission:', { name, email, message });
  
  return {
    success: true,
    message: 'Thank you for your message! I\'ll get back to you soon.',
    timestamp: Date.now()
  };
}

const ContactForm = ({ onClose }) => {
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    null // Initial state
  );

  const handleFormSubmit = async (formData) => {
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="contact-form-overlay" onClick={onClose}>
      <div 
        className="contact-form-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="contact-form-header">
          <h3>Let's Connect!</h3>
          <button 
            onClick={onClose}
            className="contact-form-close"
            aria-label="Close contact form"
          >
            ×
          </button>
        </div>
        
        <form action={handleFormSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="contact-name">
              Your Name *
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              disabled={isPending}
              aria-describedby={state?.success === false ? "form-error" : undefined}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="contact-email">
              Your Email *
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              disabled={isPending}
              aria-describedby={state?.success === false ? "form-error" : undefined}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="contact-message">
              Your Message *
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows="4"
              required
              disabled={isPending}
              aria-describedby={state?.success === false ? "form-error" : undefined}
            />
          </div>
          
          {/* React 19 useActionState feedback */}
          {state && (
            <div 
              id="form-error"
              className={`form-feedback ${state.success ? 'success' : 'error'}`}
              role={state.success ? "status" : "alert"}
              aria-live="polite"
            >
              {state.message}
            </div>
          )}
          
          <div className="form-actions">
            <button 
              type="submit" 
              disabled={isPending}
              className="contact-form-submit"
            >
              {isPending ? 'Sending...' : 'Send Message'}
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className="contact-form-cancel"
            >
              Cancel
            </button>
          </div>
        </form>
        
        <div className="contact-form-footer">
          <p>
            <small>
              Or reach out directly at{' '}
              <a href="mailto:scoaila@proton.me">scoaila@proton.me</a>
            </small>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;