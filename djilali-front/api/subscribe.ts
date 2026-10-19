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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getSanityClient() {
  const projectId = process.env.SANITY_PROJECT_ID || 'i1a7e64v';
  const dataset = process.env.SANITY_DATASET || 'production';
  const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN;

  return {
    client: createClient({
      projectId,
      dataset,
      token,
      useCdn: false,
      apiVersion: '2023-05-03',
    }),
    token,
  };
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  // Allow only POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, language = 'fr' } = req.body || {};

  // Validate email
  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({ error: 'invalid_email' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanLang = language === 'ar' ? 'ar' : 'fr';

  const { client: sanity, token } = getSanityClient();

  if (!token) {
    console.error('Missing SANITY_API_WRITE_TOKEN in environment variables.');
    return res.status(500).json({ 
      error: 'server_configuration_error',
      message: 'SANITY_API_WRITE_TOKEN is not configured in Vercel environment variables.' 
    });
  }

  try {
    // 1. Check if subscriber already exists
    const existing = await sanity.fetch(
      `*[_type == "subscriber" && lower(email) == $email][0]`,
      { email: cleanEmail }
    );

    if (existing) {
      if (existing.status === 'active') {
        return res.status(200).json({ 
          success: true, 
          status: 'already_subscribed',
          message: 'Email is already subscribed' 
        });
      } else {
        // Reactivate subscriber if they were previously unsubscribed
        await sanity
          .patch(existing._id)
          .set({ 
            status: 'active', 
            language: cleanLang,
            subscribedAt: new Date().toISOString() 
          })
          .commit();

        return res.status(200).json({ 
          success: true, 
          status: 'reactivated',
          message: 'Subscription reactivated' 
        });
      }
    }

    // 2. Create new subscriber
    await sanity.create({
      _type: 'subscriber',
      email: cleanEmail,
      language: cleanLang,
      subscribedAt: new Date().toISOString(),
      status: 'active',
    });

    return res.status(200).json({ 
      success: true, 
      status: 'success',
      message: 'Subscribed successfully' 
    });
  } catch (error: any) {
    console.error('Error saving subscriber to Sanity:', error);
    return res.status(500).json({ 
      error: 'sanity_error', 
      message: error?.message || 'Failed to save subscriber' 
    });
  }
}
