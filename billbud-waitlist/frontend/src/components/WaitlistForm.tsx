import { useState } from 'react';

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'conflict' | 'error'>('idle');
  const [clientError, setClientError] = useState('');

  const validateEmail = (val: string) => {
    // simple email regex
    const re = /\S+@\S+\.\S+/;
    return re.test(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientError('');

    if (!email.trim()) {
      setClientError('Please enter a valid email.');
      return;
    }

    if (!validateEmail(email)) {
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
        setStatus('conflict');
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="waitlist-container">
        <div className="status-message success">
          🎉 You're on the list! We'll be in touch soon.
        </div>
      </div>
    );
  }

  if (status === 'conflict') {
    return (
      <div className="waitlist-container">
        <div className="status-message conflict">
          Looks like you're already on the list!
        </div>
      </div>
    );
  }

  return (
    <div className="waitlist-container">
      <form onSubmit={handleSubmit} className="waitlist-form">
        <div className="input-wrapper">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
            placeholder="Enter your email address"
            className="email-input"
          />
          {clientError && <span className="error-text">{clientError}</span>}
          {status === 'error' && (
            <span className="error-text">Something went wrong. Please try again.</span>
          )}
        </div>
        <button type="submit" disabled={status === 'loading'} className="submit-button">
          {status === 'loading' ? <div className="spinner" /> : 'Join the Waitlist'}
        </button>
      </form>
    </div>
  );
}
