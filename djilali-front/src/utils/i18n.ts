const translations: Record<string, {fr: string; ar: string}> = {
  home: {fr: 'ACCUEIL', ar: 'الرئيسية'},
  biography: {fr: 'BIOGRAPHIE', ar: 'السيرة'},
  writings: {fr: 'ÉCRITS', ar: 'المقالات'},
  writings_all: {fr: 'Tous les Écrits', ar: 'جميع المقالات'},
  videos: {fr: 'VIDÉOS', ar: 'فيديوهات'},
  videos_section: {fr: 'Vidéos', ar: 'فيديوهات'},
  books: {fr: 'LIVRES', ar: 'كتب'},
  books_section: {fr: 'Ouvrages', ar: 'مؤلفات'},
  library: {fr: 'Bibliothèque', ar: 'المكتبة'},
  contact: {fr: 'CONTACT', ar: 'اتصل'},
  a_la_une: {fr: "À LA UNE", ar: 'في الواجهة'},
  featured_article: {fr: "À LA UNE", ar: 'في الواجهة'},
  read_more: {fr: "Lire l'analyse complète", ar: 'اقرأ المقال الكامل'},
  see_all_writings: {fr: 'Voir tous les écrits', ar: 'عرض جميع المقالات'},
  see_all_videos: {fr: 'Voir toutes les vidéos', ar: 'عرض جميع الفيديوهات'},
  loading: {fr: 'Chargement en cours...', ar: 'جارٍ التحميل...'},
  no_publications: {fr: 'Aucune publication trouvée pour ce thème.', ar: 'لم يُعثر على أي منشورات لهذا الموضوع.'},
  newsletter_title: {fr: 'Restez informé', ar: 'ابقَ على اطلاع'},
  newsletter_subtitle: {fr: 'Recevez les nouvelles publications par email', ar: 'تلقي المنشورات الجديدة عبر البريد الإلكتروني'},
  email_placeholder: {fr: 'Votre adresse email', ar: 'عنوان بريدك الإلكتروني'},
  subscribe: {fr: "S'inscrire", ar: 'اشترك'},
  back_to_writings: {fr: 'Retour aux articles', ar: 'العودة إلى المقالات'},
  back_to_books: {fr: 'Retour aux livres', ar: 'العودة إلى الكتب'},
  back_to_videos: {fr: 'Retour aux vidéos', ar: 'العودة إلى الفيديوهات'},
  publication_date: {fr: 'DATE DE PUBLICATION :', ar: 'تاريخ النشر :'},
  author_prefix: {fr: 'Par', ar: 'تأليف'},
  download_pdf: {fr: 'Télécharger le PDF', ar: 'تحميل الكتاب بصيغة PDF'},
  all_categories: {fr: 'Tous', ar: 'الكل'},
  no_arabic_content: {fr: "Ce contenu n'est pas disponible en arabe pour le moment.", ar: 'هذا المحتوى غير متوفر باللغة العربية حالياً.'},
  no_arabic_articles: {fr: "Aucun article n'est disponible en arabe pour le moment.", ar: 'لا توجد مقالات متوفرة باللغة العربية حالياً.'},
  no_arabic_books: {fr: "Aucun ouvrage n'est disponible en arabe pour le moment.", ar: 'لا توجد مؤلفات متوفرة باللغة العربية حالياً.'},
  no_arabic_videos: {fr: "Aucune vidéo n'est disponible en arabe pour le moment.", ar: 'لا توجد فيديوهات متوفرة باللغة العربية حالياً.'},
  view_in_french: {fr: 'Consulter la version française', ar: 'قراءة النسخة الفرنسية'},
  quick_links: {fr: 'LIENS RAPIDES', ar: 'روابط سريعة'},
  follow_me: {fr: 'SUIVEZ-MOI', ar: 'تابعني'},
  footer_desc: {fr: "Réflexions sur l'Algérie contemporaine et les enjeux de la modernité.", ar: 'تأملات حول الجزائر المعاصرة وقضايا الحداثة.'},
  biography_unavailable: {
    fr: "Contenu de la biographie sera bientôt disponible. Veuillez l'ajouter depuis le tableau de bord Sanity.",
    ar: "محتوى السيرة الذاتية سيكون متاحاً قريباً. يمكنك إضافته من لوحة تحكم Sanity."
  },
}

export const t = (key: string, lang: 'fr' | 'ar') => {
  return translations[key]?.[lang] || translations[key]?.fr || ''
}

export default translations
