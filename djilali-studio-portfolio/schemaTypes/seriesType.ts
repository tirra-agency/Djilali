import {defineField, defineType} from 'sanity'

export const seriesType = defineType({
  name: 'series',
  title: 'Série d’articles / سلسلة مقالات',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre de la série (Français)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title_ar',
      title: 'عنوان السلسلة بالعربية (Optionnel)',
      type: 'string',
      description: 'عنوان السلسلة الذي يظهر في الموقع باللغة العربية',
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
      rows: 3,
    }),
    defineField({
      name: 'description_ar',
      title: 'وصف السلسلة بالعربية (Optionnel)',
      type: 'text',
      rows: 3,
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
        subtitle: title_ar ? `العنوان بالعربية: ${title_ar}` : 'Série d’articles',
      }
    },
  },
})
