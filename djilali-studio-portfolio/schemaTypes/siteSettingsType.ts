import {defineField, defineType} from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Paramètres du site',
  type: 'document',
  fields: [
    defineField({
      name: 'twitterUrl',
      title: 'Lien X (Twitter)',
      type: 'url',
      description: 'Le lien complet vers votre profil X (ex: https://twitter.com/votrecompte)',
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Lien Facebook',
      type: 'url',
      description: 'Le lien complet vers votre page Facebook',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'Lien YouTube',
      type: 'url',
      description: 'Le lien complet vers votre chaîne YouTube',
    }),
    defineField({
      name: 'web3FormsAccessKey',
      title: 'Clé d\'accès Web3Forms (Formulaire de Contact)',
      type: 'string',
      description: 'Inscrivez-vous sur web3forms.com avec votre email, et collez ici la clé d\'accès (Access Key) reçue par email. Cela permet de recevoir les messages du formulaire de contact.',
    }),
  ],
})
