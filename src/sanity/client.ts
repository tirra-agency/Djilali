import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: 'i1a7e64v', // Find this at manage.sanity.io or in your sanity.cli.ts
  dataset: 'production', // this is from those question during 'sanity init'
  useCdn: false, // bypassed cache
  apiVersion: '2023-05-03', // use a UTC date string
});

// Setup the image builder
const builder = imageUrlBuilder(client);

// Helper function to easily extract the URL from Sanity image objects
export function urlFor(source: any) {
  return builder.image(source);
}
