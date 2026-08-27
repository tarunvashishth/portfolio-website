import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = sanityClient({
  // projectId is not a secret: it appears in every request URL to the public
  // Sanity API. Inlined so the build does not depend on an untracked .env file.
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID || 'hcbvv03q',
  dataset: 'production',
  apiVersion: '2023-02-01',
  useCdn: true,
  // No token: the `production` dataset is public (aclMode: public) and this is a
  // browser bundle — any token shipped here is readable by every visitor.
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);