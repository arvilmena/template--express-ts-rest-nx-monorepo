import slug from 'slug';
slug.defaults.mode = 'rfc3986';
slug.extend({ ':': '-' });
export function slugify(str: string) {
  return slug(str);
}
