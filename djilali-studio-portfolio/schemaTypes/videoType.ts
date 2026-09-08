import {defineField, defineType} from 'sanity'

export const videoType = defineType({
  name: 'video',
  title: 'Vidéo',
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
      name: 'videoUrl',
      title: 'Lien vidéo (YouTube / Vimeo)',
      type: 'url',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Date de publication',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'description',
      title: 'Description (Français)',
      type: 'text',
    }),

    // --- Arabic (Optional) Content ---
    defineField({
      name: 'title_ar',
      title: 'عنوان الفيديو بالعربية (Optionnel)',
      type: 'string',
      description: 'إذا تُرك فارغاً، فلن يظهر الفيديو عندما يكون الموقع باللغة العربية.',
      fieldset: 'arabic',
    }),
    defineField({
      name: 'description_ar',
      title: 'وصف الفيديو بالعربية (Optionnel)',
      type: 'text',
      description: 'ملخص أو وصف الفيديو باللغة العربية',
      fieldset: 'arabic',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      title_ar: 'title_ar',
    },
    prepare({title, title_ar}) {
      return {
        title: title || 'Sans titre',
        subtitle: title_ar ? `AR: ${title_ar}` : 'Pas de traduction arabe',
      }
    },
  },
})
