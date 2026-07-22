// ============================================================
// Author registry. Bylines resolve to these records by exact name (the
// `authors: [...]` array on each paper). Add contributors here.
// ============================================================

export type Author = {
  slug: string;
  name: string;
  title: string; // role / masthead line
  org: string;
  linkedin?: string;
  bio?: string;
};

export const authors: Author[] = [
  {
    slug: 'paul-maxwell',
    name: 'Paul Maxwell',
    title: 'Solutions Architecture',
    org: 'RevOps HQ',
    linkedin: 'https://www.linkedin.com/in/paulcmaxwell/',
    bio: 'Builds and audits revenue systems and integrations for RevOps HQ.',
  },
  {
    slug: 'james-bond',
    name: 'James Bond',
    title: 'Revenue',
    org: 'RevOps HQ',
    linkedin: 'https://www.linkedin.com/in/james-bond-advantage/',
    bio: 'Leads revenue and go-to-market at RevOps HQ.',
  },
];

export const authorByName = (name: string): Author | undefined =>
  authors.find((a) => a.name === name);
