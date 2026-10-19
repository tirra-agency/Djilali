import {defineField, defineType} from 'sanity'

export const subscriberType = defineType({
  name: 'subscriber',
  title: 'Abonnés Newsletter / المشتركون',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Adresse Email / البريد الإلكتروني',
      type: 'string',
      validation: (rule) =>
        rule
          .required()
          .email()
          .error('Veuillez entrer une adresse email valide / يرجى إدخال بريد إلكتروني صالح'),
    }),
    defineField({
      name: 'language',
      title: 'Langue préférée / اللغة المفضلة',
      type: 'string',
      options: {
        list: [
          {title: 'Français (FR)', value: 'fr'},
          {title: 'العربية (AR)', value: 'ar'},
        ],
        layout: 'radio',
      },
      initialValue: 'fr',
    }),
    defineField({
      name: 'subscribedAt',
      title: "Date d'inscription / تاريخ الاشتراك",
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'status',
      title: 'Statut / الحالة',
      type: 'string',
      options: {
        list: [
          {title: 'Actif / نشط', value: 'active'},
          {title: 'Désabonné / ملغى', value: 'unsubscribed'},
        ],
        layout: 'radio',
      },
      initialValue: 'active',
    }),
  ],
  preview: {
    select: {
      email: 'email',
      language: 'language',
      status: 'status',
      subscribedAt: 'subscribedAt',
    },
    prepare({email, language, status, subscribedAt}) {
      const dateStr = subscribedAt ? new Date(subscribedAt).toLocaleDateString('fr-FR') : ''
      const langBadge = language === 'ar' ? 'العربية' : 'Français'
      const statusBadge = status === 'unsubscribed' ? '❌ Désabonné' : '✅ Actif'
      return {
        title: email || 'Sans email',
        subtitle: `${statusBadge} • ${langBadge} ${dateStr ? `• ${dateStr}` : ''}`,
      }
    },
  },
})
