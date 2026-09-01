import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'i1a7e64v',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-05-03',
});

async function run() {
  try {
    const query = `*[_type == "post"] | order(publishedAt desc){
            ...,
            categories[]->{title, slug}
        }`;
    const data = await client.fetch(query);
    console.log("ALL QUERY DATA LENGTH:", data.length);
    console.log(data);
  } catch (err) {
    console.error("ERROR:", err);
  }
}

run();
