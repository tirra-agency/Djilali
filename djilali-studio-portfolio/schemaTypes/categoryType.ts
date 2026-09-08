import {defineField, defineType} from 'sanity'

export const categoryType = defineType({
  name: 'category',
  title: 'Catégorie',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre (Français)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title_ar',
      title: 'الاسم بالعربية (Optionnel)',
      type: 'string',
      description: 'الاسم الذي سيظهر في الموقع عند التبديل إلى اللغة العربية',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description (Français)',
      type: 'text',
    }),
    defineField({
      name: 'description_ar',
      title: 'الوصف بالعربية (Optionnel)',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      title_ar: 'title_ar',
    },
    prepare({title, title_ar}) {
      return {
        title: title_ar ? `${title || 'Sans titre'} (${title_ar})` : (title || 'Sans titre'),
        subtitle: title_ar ? `الاسم بالعربية: ${title_ar}` : 'Pas de traduction arabe',
      }
    },
  },
})
