import {defineField, defineType} from 'sanity'

export const biographyType = defineType({
  name: 'biography',
  title: 'Biographie',
  type: 'document',
  fieldsets: [
    {
      name: 'arabic',
      title: 'النسخة العربية (Arabic Content - Optionnel)',
      options: {collapsible: true, collapsed: false},
    },
  ],
  fields: [
    // --- French (Primary) Content ---
    defineField({
      name: 'title',
      title: 'Titre (Français)',
      type: 'string',
    }),
    defineField({
      name: 'profileImage',
      title: 'Photo de profil',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'content',
      title: 'Contenu de la biographie (Français)',
      type: 'array',
      of: [{type: 'block'}],
    }),

    // --- Arabic (Optional) Content ---
    defineField({
      name: 'title_ar',
      title: 'العنوان بالعربية (Optionnel)',
      type: 'string',
      fieldset: 'arabic',
    }),
    defineField({
      name: 'content_ar',
      title: 'محتوى السيرة بالعربية (Optionnel)',
      type: 'array',
      of: [{type: 'block'}],
      description: 'نص السيرة الذاتية باللغة العربية (اختياري)',
      fieldset: 'arabic',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      title_ar: 'title_ar',
      media: 'profileImage',
    },
    prepare({title, title_ar, media}) {
      return {
        title: title || 'Biographie',
        subtitle: title_ar ? `AR: ${title_ar}` : 'Pas de traduction arabe',
        media,
      }
    },
  },
})
