import { db } from "./db.js";
import {
  downloads,
  type InsertDownload,
  type Download
} from "../shared/schema.js";

export interface IStorage {
  logDownload(download: InsertDownload): Promise<Download>;
  getRecentDownloads(limit?: number): Promise<Download[]>;
}

export class DatabaseStorage implements IStorage {
  async logDownload(insertDownload: InsertDownload): Promise<Download> {
    const [download] = await db
      .insert(downloads)
      .values(insertDownload)
      .returning();
    return download;
  }

  async getRecentDownloads(limit = 10): Promise<Download[]> {
    return await db
      .select()
      .from(downloads)
      .limit(limit)
      .orderBy(downloads.createdAt); // Should descend, but simple for now
  }
}

export const storage = new DatabaseStorage();
