import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const memories = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/memories" }),
  schema: z.object({
    title: z.string(),
    date: z.string().optional(),
    cover: z.string().optional(),
    tags: z.array(z.string()).optional().default([]),
    location: z.string().optional(),
    emoji: z.string().optional().default('✨'),
    hiddenNote: z.string().optional(),
    gallery: z.array(z.string()).optional().default([]),
    order: z.number().optional().default(0),
  }),
});

const letters = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/letters" }),
  schema: z.object({
    title: z.string(),
    trigger: z.string(),
    icon: z.string().optional().default('💌'),
    color: z.string().optional().default('rose'),
    unlockMessage: z.string().optional(),
    order: z.number().optional().default(0),
  }),
});

const dreams = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/dreams" }),
  schema: z.object({
    title: z.string(),
    category: z.enum(['lugares', 'construir', 'locos']),
    icon: z.string().optional().default('✨'),
    order: z.number().optional().default(0),
  }),
});

export const collections = { memories, letters, dreams };
