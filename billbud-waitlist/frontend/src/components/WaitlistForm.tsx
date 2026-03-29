import { useState } from 'react';

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [clientError, setClientError] = useState('');

  const validateEmail = (val: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientError('');

    if (!email.trim() || !validateEmail(email)) {
      setClientError('Please enter a valid email.');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/waitlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (response.status === 201) {
        setStatus('success');
      } else if (response.status === 409) {
        setClientError('Email is already on the waitlist!');
        setStatus('idle');
      } else {
        setClientError('Something went wrong. Please try again.');
        setStatus('idle');
      }
    } catch (err) {
      console.error(err);
      setClientError('Network error. Please try again later.');
      setStatus('idle');
    }
  };

  return (
    <div className="waitlist-container">
      <form onSubmit={handleSubmit} className="waitlist-form" noValidate>
        <div className="input-wrapper">
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setClientError(''); }}
            disabled={status === 'loading' || status === 'success'}
            placeholder="Enter your email address"
            className={`email-input ${clientError ? 'input-error' : ''}`}
          />
          {clientError && <span className="error-text">{clientError}</span>}
        </div>
        <button 
          type="submit" 
          disabled={status === 'loading' || status === 'success'} 
          className={`submit-button ${status === 'success' ? 'success' : ''}`}
        >
          {status === 'loading' && <div className="spinner" />}
          {status === 'success' && '✓ Joined Waitlist'}
          {status === 'idle' && 'Join the Waitlist'}
          {status === 'error' && 'Join the Waitlist'}
        </button>
      </form>
      <p className="reassurance-text">No spam. We only email you when we launch.</p>
    </div>
  );
}
