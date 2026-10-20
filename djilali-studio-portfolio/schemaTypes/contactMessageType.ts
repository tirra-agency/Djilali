import {defineField, defineType} from 'sanity'

export const contactMessageType = defineType({
  name: 'contactMessage',
  title: 'Messages de Contact / رسائل التواصل',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom complet / الاسم الكامل',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'email',
      title: 'Adresse Email / البريد الإلكتروني',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'subject',
      title: 'Sujet / الموضوع',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'message',
      title: 'Message / الرسالة',
      type: 'text',
      rows: 6,
      readOnly: true,
    }),
    defineField({
      name: 'receivedAt',
      title: 'Date de réception / تاريخ الاستلام',
      type: 'datetime',
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'isRead',
      title: 'Statut de lecture / حالة القراءة',
      type: 'boolean',
      description: 'Cochez pour marquer le message comme lu.',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      name: 'name',
      email: 'email',
      subject: 'subject',
      receivedAt: 'receivedAt',
      isRead: 'isRead',
    },
    prepare({name, email, subject, receivedAt, isRead}) {
      const dateStr = receivedAt ? new Date(receivedAt).toLocaleDateString('fr-FR') : ''
      const icon = isRead ? '✓ Lu' : '🔴 Nouveau'
      return {
        title: `${name || 'Sans nom'} : ${subject || 'Sans sujet'}`,
        subtitle: `${icon} • ${email || ''} ${dateStr ? `• ${dateStr}` : ''}`,
      }
    },
  },
  orderings: [
    {
      title: 'Plus récents en premier',
      name: 'receivedAtDesc',
      by: [{field: 'receivedAt', direction: 'desc'}],
    },
  ],
})
