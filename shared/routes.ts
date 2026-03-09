import { z } from 'zod';
import { resolveRequestSchema, videoMetadataSchema, batchRequestSchema, downloads } from './schema.js';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  badGateway: z.object({
    message: z.string(),
  })
};

export const api = {
  resolve: {
    method: 'POST' as const,
    path: '/api/resolve',
    input: resolveRequestSchema,
    responses: {
      200: videoMetadataSchema,
      400: errorSchemas.validation,
      502: errorSchemas.badGateway,
    },
  },
  downloadBatch: {
    method: 'POST' as const,
    path: '/api/batch/zip',
    input: batchRequestSchema,
    responses: {
      200: z.any(),
      400: errorSchemas.validation,
      500: errorSchemas.internal,
    },
  },
  history: {
    method: 'GET' as const,
    path: '/api/history',
    responses: {
      200: z.array(z.custom<typeof downloads.$inferSelect>()),
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
