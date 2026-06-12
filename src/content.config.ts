import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const branchEnum = z.enum(['data', 'mobile', 'ai']);

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    branch: branchEnum,
    stack: z.array(z.string()),
    date: z.date(),
    order: z.number(),
    repo: z.string().url().optional(),
    pkg: z.string().url().optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    branch: branchEnum,
    date: z.date(),
  }),
});

export const collections = { projects, blog };
