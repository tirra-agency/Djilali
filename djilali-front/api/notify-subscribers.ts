import { createClient } from '@sanity/client';

type ApiRequest = {
  method?: string;
  body?: any;
  headers?: Record<string, string | string[] | undefined>;
  query?: Record<string, string | string[]>;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (data: any) => void;
};

function getSanityClient() {
  const projectId = process.env.SANITY_PROJECT_ID || 'i1a7e64v';
  const dataset = process.env.SANITY_DATASET || 'production';
  const sanityToken = process.env.SANITY_API_TOKEN || process.env.SANITY_API_WRITE_TOKEN;

  return createClient({
    projectId,
    dataset,
    token: sanityToken,
    useCdn: false,
    apiVersion: '2023-05-03',
  });
}

interface Subscriber {
  email: string;
  language: 'fr' | 'ar';
}

function generateEmailHtml({
  title,
  excerpt,
  linkUrl,
  typeLabel,
  lang,
  siteBaseUrl = 'https://soufianedjilali.com',
}: {
  title: string;
  excerpt?: string;
  linkUrl: string;
  typeLabel: string;
  lang: 'fr' | 'ar';
  siteBaseUrl?: string;
}) {
  const isArabic = lang === 'ar';
  const ctaText = isArabic ? 'اقرأ المقال كاملاً على الموقع' : "Consulter sur le site";
  const introText = isArabic 
    ? 'تم نشر محتوى جديد على الموقع الرسمي لسفيان جيلالي:' 
    : 'Une nouvelle publication est disponible sur le site officiel de Soufiane Djilali :';
  const footerText = isArabic
    ? 'تلقيت هذه الرسالة لأنك اشتركت في النشرة الإخبارية.'
    : 'Vous recevez cet email car vous êtes inscrit à la newsletter.';

  return `
<!DOCTYPE html>
<html lang="${lang}" dir="${isArabic ? 'rtl' : 'ltr'}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f7f7f8;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1a1a1a;
      line-height: 1.6;
    }
    .wrapper {
      max-width: 600px;
      margin: 30px auto;
      background: #ffffff;
      border: 1px solid #e5e5e7;
      border-radius: 8px;
      overflow: hidden;
    }
    .header {
      background-color: #1a1a1a;
      padding: 24px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      font-size: 20px;
      margin: 0;
      letter-spacing: 1px;
      font-weight: 600;
    }
    .content {
      padding: 36px 30px;
      ${isArabic ? 'text-align: right;' : 'text-align: left;'}
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      background-color: #f0f0f2;
      color: #555555;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      border-radius: 4px;
      margin-bottom: 16px;
    }
    .title {
      font-size: 22px;
      font-weight: 700;
      color: #111111;
      margin-top: 0;
      margin-bottom: 16px;
      line-height: 1.35;
    }
    .intro {
      font-size: 14px;
      color: #666666;
      margin-bottom: 16px;
    }
    .excerpt {
      font-size: 15px;
      color: #333333;
      margin-bottom: 28px;
      background-color: #fcfcfc;
      border-${isArabic ? 'right' : 'left'}: 3px solid #1a1a1a;
      padding: 12px 16px;
    }
    .btn-container {
      margin: 30px 0 20px;
      text-align: center;
    }
    .btn {
      display: inline-block;
      background-color: #1a1a1a;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 28px;
      font-size: 15px;
      font-weight: 600;
      border-radius: 4px;
    }
    .footer {
      background-color: #fafafa;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #888888;
      border-top: 1px solid #eeeeee;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>SOUFIANE DJILALI</h1>
    </div>
    <div class="content">
      <span class="badge">${typeLabel}</span>
      <p class="intro">${introText}</p>
      <h2 class="title">${title}</h2>
      ${excerpt ? `<div class="excerpt">${excerpt}</div>` : ''}
      <div class="btn-container">
        <a href="${linkUrl}" class="btn" target="_blank">${ctaText}</a>
      </div>
    </div>
    <div class="footer">
      <p style="margin: 0;">${footerText}</p>
      <p style="margin: 6px 0 0;"><a href="${siteBaseUrl}" style="color: #666666; text-decoration: underline;">soufianedjilali.com</a></p>
    </div>
  </div>
</body>
</html>
  `;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const doc = req.body;
  if (!doc || !doc._type) {
    return res.status(400).json({ error: 'invalid_payload', message: 'No document received' });
  }

  // Filter only published articles, videos, or books
  const supportedTypes = ['post', 'video', 'book'];
  if (!supportedTypes.includes(doc._type)) {
    return res.status(200).json({ message: `Ignored document of type ${doc._type}` });
  }

  // Check if draft
  if (doc._id && doc._id.startsWith('drafts.')) {
    return res.status(200).json({ message: 'Draft document ignored' });
  }

  const brevoApiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'contact@soufianedjilali.com';
  const senderName = process.env.BREVO_SENDER_NAME || 'Soufiane Djilali';
  const siteBaseUrl = process.env.SITE_URL || 'https://soufianedjilali.com';

  if (!brevoApiKey) {
    console.warn('BREVO_API_KEY is not defined. Email dispatch paused.');
    return res.status(200).json({
      success: false,
      reason: 'BREVO_API_KEY_NOT_CONFIGURED',
      message: 'Email ready to send, but BREVO_API_KEY is missing in environment variables.'
    });
  }

  try {
    const sanity = getSanityClient();

    // 1. Fetch active subscribers
    const subscribers: Subscriber[] = await sanity.fetch(
      `*[_type == "subscriber" && status == "active"]{ email, language }`
    );

    if (!subscribers || subscribers.length === 0) {
      return res.status(200).json({ message: 'No active subscribers found' });
    }

    // 2. Prepare content attributes
    const slugFr = doc.slug?.current || (typeof doc.slug === 'string' ? doc.slug : '');
    const slugAr = doc.slug_ar?.current || slugFr;

    let pathPrefix = 'writings';
    let typeNameFr = 'Nouvel Article';
    let typeNameAr = 'مقال جديد';

    if (doc._type === 'video') {
      pathPrefix = 'videos';
      typeNameFr = 'Nouvelle Vidéo';
      typeNameAr = 'فيديو جديد';
    } else if (doc._type === 'book') {
      pathPrefix = 'books';
      typeNameFr = 'Nouvel Ouvrage';
      typeNameAr = 'مؤلف جديد';
    }

    const titleFr = doc.title || 'Nouvelle publication';
    const titleAr = doc.title_ar || titleFr;
    const excerptFr = doc.excerpt || doc.description || '';
    const excerptAr = doc.excerpt_ar || doc.description_ar || excerptFr;

    const linkFr = `${siteBaseUrl}/fr/${pathPrefix}/${slugFr}`;
    const linkAr = `${siteBaseUrl}/ar/${pathPrefix}/${slugAr}`;

    // 3. Send emails
    const sendResults = await Promise.allSettled(
      subscribers.map(async (sub) => {
        const isAr = sub.language === 'ar';
        const title = isAr ? titleAr : titleFr;
        const excerpt = isAr ? excerptAr : excerptFr;
        const linkUrl = isAr ? linkAr : linkFr;
        const typeLabel = isAr ? typeNameAr : typeNameFr;
        const subject = isAr
          ? `${typeNameAr} : ${title}`
          : `${typeNameFr} : ${title}`;

        const html = generateEmailHtml({
          title,
          excerpt,
          linkUrl,
          typeLabel,
          lang: isAr ? 'ar' : 'fr',
          siteBaseUrl,
        });

        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': brevoApiKey,
            'Content-Type': 'application/json',
            'accept': 'application/json',
          },
          body: JSON.stringify({
            sender: {
              name: senderName,
              email: senderEmail,
            },
            to: [{ email: sub.email }],
            subject,
            htmlContent: html,
          }),
        });

        if (!response.ok) {
          const err = await response.text();
          throw new Error(`Brevo error: ${err}`);
        }

        return await response.json();
      })
    );

    const successful = sendResults.filter(r => r.status === 'fulfilled').length;
    const failed = sendResults.filter(r => r.status === 'rejected').length;

    return res.status(200).json({
      success: true,
      sentCount: successful,
      failedCount: failed,
      totalSubscribers: subscribers.length,
    });
  } catch (error: any) {
    console.error('Webhook execution failed:', error);
    return res.status(500).json({ error: error.message || 'Notification failed' });
  }
}
