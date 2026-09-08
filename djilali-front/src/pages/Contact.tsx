import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { client } from '../sanity/client';
import { useLanguage } from '../contexts/LanguageProvider';

const Contact: React.FC = () => {
    const [accessKey, setAccessKey] = useState<string | null>(null);
    const [status, setStatus] = useState<string>(''); // 'sending', 'success', 'error', ''
    const { lang } = useLanguage();
    
    useEffect(() => {
        // Fetch the web3Forms access key from Sanity
        client.fetch(`*[_type == "siteSettings"][0].web3FormsAccessKey`)
            .then((key) => setAccessKey(key))
            .catch(console.error);
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!accessKey) {
            setStatus('no_key');
            return;
        }

        setStatus('sending');
        
        const form = e.currentTarget;
        const formData = new FormData(form);
        formData.append("access_key", accessKey);

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                setStatus('success');
                form.reset();
            } else {
                console.error("Error", data);
                setStatus('error');
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <main>
            <section className="section" style={{ paddingTop: '60px', paddingBottom: '80px' }}>
                <div className="container" style={{ maxWidth: '700px', margin: '0 auto' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="contact-header text-center"
                        style={{ marginBottom: '40px' }}
                    >
                        <h1 style={{ fontFamily: lang === 'ar' ? 'var(--font-ar)' : 'var(--font-serif)', color: 'var(--primary-color)', fontSize: '3rem', marginBottom: '15px' }}>
                            {lang === 'ar' ? 'اتصل' : 'Contact'}
                        </h1>
                        <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
                            {lang === 'ar' ? 'هل لديك سؤال أو رغبة في التواصل؟ املأ النموذج أدناه.' : 'Vous avez une question ou souhaitez me contacter ? Remplissez le formulaire ci-dessous.'}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="contact-card"
                    >
                        {status === 'success' ? (
                            <div className="contact-success">
                                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '10px' }}>✅</span>
                                <h2>{lang === 'ar' ? 'شكراً على رسالتك!' : 'Merci pour votre message !'}</h2>
                                <p>{lang === 'ar' ? 'تم إرسال رسالتك بنجاح وسأرد عليك في أقرب وقت ممكن.' : 'Il a bien été envoyé et je vous répondrai dans les plus brefs délais.'}</p>
                                <button onClick={() => setStatus('')} className="btn-primary" style={{ marginTop: '20px' }}>
                                    {lang === 'ar' ? 'إرسال رسالة أخرى' : 'Envoyer un autre message'}
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="contact-form">
                                {status === 'no_key' && (
                                    <div className="alert-error" style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '8px' }}>
                                        <strong>{lang === 'ar' ? 'تنبيه:' : 'Attention:'}</strong> {lang === 'ar' ? 'نموذج الاتصال غير مُكوّن بعد. يجب على المسؤول إضافة مفتاح Web3Forms في Sanity.' : "Le formulaire de contact n'est pas encore configuré. L'administrateur doit ajouter sa clé Web3Forms dans Sanity."}
                                    </div>
                                )}
                                {status === 'error' && (
                                    <div className="alert-error" style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '8px' }}>
                                        <strong>{lang === 'ar' ? 'خطأ:' : 'Erreur:'}</strong> {lang === 'ar' ? 'حدث خطأ أثناء إرسال الرسالة. الرجاء المحاولة مرة أخرى لاحقًا.' : 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer plus tard.'}
                                    </div>
                                )}
                                
                                <div className="form-group">
                                    <label htmlFor="name">{lang === 'ar' ? 'الاسم الكامل' : 'Nom complet'}</label>
                                    <input type="text" id="name" name="name" required placeholder={lang === 'ar' ? 'اسمك' : 'Votre nom'} disabled={status === 'sending'} />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="email">{lang === 'ar' ? 'البريد الإلكتروني' : 'Adresse email'}</label>
                                    <input type="email" id="email" name="email" required placeholder={lang === 'ar' ? 'example@domain.com' : 'votre@email.com'} disabled={status === 'sending'} />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="subject">{lang === 'ar' ? 'الموضوع' : 'Sujet'}</label>
                                    <input type="text" id="subject" name="subject" required placeholder={lang === 'ar' ? 'موضوع رسالتك' : 'Sujet de votre message'} disabled={status === 'sending'} />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="message">{lang === 'ar' ? 'رسالة' : 'Message'}</label>
                                    <textarea id="message" name="message" required placeholder={lang === 'ar' ? 'رسالتك...' : 'Votre message...'} rows={6} disabled={status === 'sending'}></textarea>
                                </div>
                                
                                <button type="submit" className="btn-primary contact-submit" disabled={status === 'sending'}>
                                    {status === 'sending' ? (lang === 'ar' ? 'جاري الإرسال...' : 'Envoi en cours...') : (lang === 'ar' ? 'إرسال الرسالة' : 'Envoyer le message')}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </section>
        </main>
    );
};

export default Contact;
