import {defineField, defineType} from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Article / Écrit',
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
      name: 'slug',
      title: 'Slug (Identifiant URL)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Date de publication',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image de couverture',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'categories',
      title: 'Catégories / التصنيفات',
      description: 'Sélectionnez les catégories. Les noms en arabe sont configurés directement dans les documents de catégories Sanity.',
      type: 'array',
      of: [{type: 'reference', to: {type: 'category'}}],
    }),
    defineField({
      name: 'body',
      title: 'Contenu (Français)',
      type: 'array',
      of: [{type: 'block'}],
    }),

    // --- Arabic (Optional) Content ---
    defineField({
      name: 'title_ar',
      title: 'العنوان بالعربية (Optionnel)',
      type: 'string',
      description: 'إذا تُرك فارغاً، فلن يظهر المقال عندما يكون الموقع باللغة العربية.',
      fieldset: 'arabic',
    }),
    defineField({
      name: 'body_ar',
      title: 'المحتوى بالعربية (Optionnel)',
      type: 'array',
      of: [{type: 'block'}],
      description: 'محتوى المقال باللغة العربية (اختياري)',
      fieldset: 'arabic',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      title_ar: 'title_ar',
      media: 'image',
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
