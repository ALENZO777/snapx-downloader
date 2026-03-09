import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const downloads = pgTable("downloads", {
  id: serial("id").primaryKey(),
  originalUrl: text("original_url").notNull(),
  title: text("title"),
  videoUrl: text("video_url"),
  source: text("source"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDownloadSchema = createInsertSchema(downloads).omit({ 
  id: true, 
  createdAt: true 
});

export type Download = typeof downloads.$inferSelect;
export type InsertDownload = z.infer<typeof insertDownloadSchema>;

export const resolveRequestSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

export const videoMetadataSchema = z.object({
  originalUrl: z.string(),
  title: z.string(),
  videoUrl: z.string(),
  thumbnail: z.string().optional(),
  source: z.string().optional(),
  success: z.boolean(),
  error: z.string().optional(),
});

export const batchRequestSchema = z.object({
  videos: z.array(videoMetadataSchema),
});

export type ResolveRequest = z.infer<typeof resolveRequestSchema>;
export type VideoMetadata = z.infer<typeof videoMetadataSchema>;
export type BatchRequest = z.infer<typeof batchRequestSchema>;
