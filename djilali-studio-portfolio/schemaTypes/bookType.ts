import {defineField, defineType} from 'sanity'

export const bookType = defineType({
  name: 'book',
  title: 'Livre / Ouvrage',
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
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Auteur',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedYear',
      title: 'Année de publication',
      type: 'number',
    }),
    defineField({
      name: 'publicationDate',
      title: 'Date exacte de publication',
      type: 'date',
    }),
    defineField({
      name: 'coverImage',
      title: 'Image de couverture',
      type: 'image',
    }),
    defineField({
      name: 'description',
      title: 'Description (Français)',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'pdf',
      title: 'Fichier PDF du livre',
      type: 'file',
      options: {
        accept: 'application/pdf',
      },
    }),
    defineField({
      name: 'link',
      title: 'Lien d\'achat ou de consultation',
      type: 'url',
    }),

    // --- Arabic (Optional) Content ---
    defineField({
      name: 'title_ar',
      title: 'عنوان الكتاب بالعربية (Optionnel)',
      type: 'string',
      description: 'إذا تُرك فارغاً، فلن يظهر الكتاب عندما يكون الموقع باللغة العربية.',
      fieldset: 'arabic',
    }),
    defineField({
      name: 'author_ar',
      title: 'اسم المؤلف بالعربية (Optionnel)',
      type: 'string',
      fieldset: 'arabic',
    }),
    defineField({
      name: 'description_ar',
      title: 'وصف الكتاب بالعربية (Optionnel)',
      type: 'array',
      of: [{type: 'block'}],
      description: 'نبذة أو ملخص عن الكتاب باللغة العربية',
      fieldset: 'arabic',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      title_ar: 'title_ar',
      media: 'coverImage',
    },
    prepare({title, title_ar, media}) {
      return {
        title: title || 'Sans titre',
        subtitle: title_ar ? `AR: ${title_ar}` : 'Pas de traduction arabe',
        media,
      }
    },
  },
})
