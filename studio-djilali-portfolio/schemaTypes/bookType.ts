import {defineField, defineType} from 'sanity'

export const bookType = defineType({
  name: 'book',
  title: 'Book',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedYear',
      type: 'number',
    }),
    defineField({
      name: 'publicationDate',
      title: 'Exact Publication Date',
      type: 'date',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
    }),
    defineField({
      name: 'description',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'pdf',
      title: 'Book PDF',
      type: 'file',
      options: {
        accept: 'application/pdf'
      }
    }),
    defineField({
      name: 'link',
      title: 'Purchase Link',
      type: 'url',
    }),
  ],
})
