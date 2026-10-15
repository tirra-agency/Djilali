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
    defineField({
      name: 'series',
      title: 'Série / سلسلة (Optionnel)',
      description: 'Associer cette vidéo à une série pour suggérer les autres épisodes aux spectateurs.',
      type: 'reference',
      to: [{type: 'series'}],
    }),
    defineField({
      name: 'episode',
      title: 'Numéro d’épisode / رقم الحلقة (Optionnel)',
      description: 'Ex: 1 pour Épisode 1, 2 pour Épisode 2, etc.',
      type: 'number',
      validation: (rule) => rule.integer().min(1),
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
      episode: 'episode',
      seriesTitle: 'series.title',
    },
    prepare({title, title_ar, episode, seriesTitle}) {
      const epPrefix = episode ? `[Ép. ${episode}] ` : ''
      const seriesSuffix = seriesTitle ? ` (${seriesTitle})` : ''
      return {
        title: `${epPrefix}${title || 'Sans titre'}${seriesSuffix}`,
        subtitle: title_ar ? `AR: ${title_ar}` : 'Pas de traduction arabe',
      }
    },
  },
})
