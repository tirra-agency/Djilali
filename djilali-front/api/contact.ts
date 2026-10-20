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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body || {};

  if (!email || !message) {
    return res.status(400).json({ error: 'missing_fields', message: 'Email and message are required' });
  }

  const { client: sanity, token } = getSanityClient();

  if (!token) {
    console.error('Missing SANITY_API_WRITE_TOKEN in environment variables.');
    return res.status(500).json({
      error: 'server_configuration_error',
      message: 'SANITY_API_WRITE_TOKEN is missing',
    });
  }

  try {
    const doc = await sanity.create({
      _type: 'contactMessage',
      name: (name || 'Non spécifié').trim(),
      email: email.trim().toLowerCase(),
      subject: (subject || 'Sans sujet').trim(),
      message: message.trim(),
      receivedAt: new Date().toISOString(),
      isRead: false,
    });

    return res.status(200).json({
      success: true,
      messageId: doc._id,
      message: 'Message stored in Sanity successfully',
    });
  } catch (error: any) {
    console.error('Error saving contact message to Sanity:', error);
    return res.status(500).json({
      error: 'sanity_error',
      message: error?.message || 'Failed to save message',
    });
  }
}
