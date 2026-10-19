import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageProvider';
import { t } from '../utils/i18n';

interface NewsletterProps {
  className?: string;
}

const Newsletter: React.FC<NewsletterProps> = ({ className = '' }) => {
  const { lang } = useLanguage();
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'already' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Spam protection check
    if (honeypot) {
      setStatus('success');
      return;
    }

    if (!email || !email.includes('@')) {
      setStatus('error');
      setErrorMessage(t('invalid_email', lang));
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          language: lang,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        if (data.status === 'already_subscribed') {
          setStatus('already');
        } else {
          setStatus('success');
          setEmail('');
        }
      } else {
        setStatus('error');
        setErrorMessage(data.message || t('subscribe_error', lang));
      }
    } catch (err) {
      console.error('Subscription error:', err);
      setStatus('error');
      setErrorMessage(t('subscribe_error', lang));
    }
  };

  return (
    <section className={`section newsletter ${className}`}>
      <div className="container text-center">
        <h2 className="newsletter-title">{t('newsletter_title', lang)}</h2>
        <p className="newsletter-subtitle">{t('newsletter_subtitle', lang)}</p>

        <form className="newsletter-form" onSubmit={handleSubmit} noValidate>
          {/* Honeypot field for bot protection */}
          <input
            type="text"
            name="hp_website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            style={{ display: 'none' }}
            tabIndex={-1}
            autoComplete="off"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status !== 'idle' && status !== 'loading') setStatus('idle');
            }}
            placeholder={t('email_placeholder', lang)}
            required
            disabled={status === 'loading'}
            aria-label={t('email_placeholder', lang)}
          />

          <button
            type="submit"
            className="btn-submit"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? t('subscribing', lang) : t('subscribe', lang)}
          </button>
        </form>

        {status === 'success' && (
          <div className="newsletter-message success" role="alert">
            ✓ {t('subscribed_success', lang)}
          </div>
        )}

        {status === 'already' && (
          <div className="newsletter-message info" role="alert">
            ℹ {t('subscribed_already', lang)}
          </div>
        )}

        {status === 'error' && (
          <div className="newsletter-message error" role="alert">
            ⚠ {errorMessage || t('subscribe_error', lang)}
          </div>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
