export const ABOUTS_QUERY = '*[_type == "abouts"] | order(_createdAt asc)';
export const WORKS_QUERY = '*[_type == "works"] | order(_createdAt desc)';
export const SKILLS_QUERY = '*[_type == "skills"] | order(_createdAt asc)';
export const EXPERIENCES_QUERY = '*[_type == "experiences"] | order(year desc)';
export const TESTIMONIALS_QUERY = '*[_type == "testimonials"]';
export const BRANDS_QUERY = '*[_type == "brands"]';
