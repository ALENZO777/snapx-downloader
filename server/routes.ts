import type { Express } from "express";
import type { Server } from "http";
import { api } from "../shared/routes.js";
import { z } from "zod";
import axios from "axios";
import archiver from "archiver";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Resolve URL Endpoint
  app.post(api.resolve.path, async (req, res) => {
    try {
      const { url } = api.resolve.input.parse(req.body);

      // Call external API (batgpt as per user script)
      // https://batgpt.vercel.app/api/alldl?url={encoded_url}
      try {
        const response = await axios.get(`https://batgpt.vercel.app/api/alldl`, {
          params: { url },
          timeout: 60000 // 60s timeout for resolution
        });

        const data = response.data;

        if (!data.success || !data.mediaInfo) {
          return res.status(400).json({
            success: false,
            originalUrl: url,
            title: "Failed to resolve",
            videoUrl: "",
            error: "Could not resolve video URL. The link might be private or unsupported."
          });
        }

        const info = data.mediaInfo;

        const metadata = {
          success: true,
          originalUrl: url,
          title: info.title || "video",
          videoUrl: info.videoUrl,
          thumbnail: info.thumbnail,
          source: info.source || "unknown"
        };

        // Client-side history (localStorage) - no server logging needed
        return res.json(metadata);

      } catch (externalErr) {
        console.error("External API Error:", externalErr);
        return res.status(502).json({
          message: "Failed to connect to resolution service"
        });
      }

    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Batch ZIP Endpoint
  app.post(api.downloadBatch.path, async (req, res) => {
    try {
      const { videos } = api.downloadBatch.input.parse(req.body);

      if (videos.length === 0) {
        return res.status(400).json({ message: "No videos provided" });
      }

      // Set headers for zip download
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `videos_${timestamp}.zip`;

      res.attachment(filename);

      const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
      });

      // Good practice to handle warnings (ie stat failures and other non-blocking errors)
      archive.on('warning', function (err: any) {
        if (err.code === 'ENOENT') {
          console.warn(err);
        } else {
          // throw error
          console.error(err);
        }
      });

      // good practice to catch this error explicitly
      archive.on('error', function (err: any) {
        console.error("Archiver Error:", err);
        if (!res.headersSent) {
          res.status(500).send({ message: "Compression failed" });
        }
      });

      // Pipe archive data to the response
      archive.pipe(res);

      // Process downloads sequentially or in small batches to avoid memory issues on Vercel
      for (const video of videos) {
        if (!video.success || !video.videoUrl) continue;

        try {
          const videoResponse = await axios.get(video.videoUrl, {
            responseType: 'stream',
            timeout: 30000
          });

          let safeTitle = (video.title || `video_${Math.random().toString(36).slice(2, 7)}`)
            .replace(/[^a-z0-9]/gi, '_')
            .substring(0, 100);
          const fileName = `${safeTitle}.mp4`;

          archive.append(videoResponse.data, { name: fileName });
        } catch (err) {
          console.error(`Failed to download ${video.title}:`, err);
          archive.append(Buffer.from(`Failed to download: ${video.originalUrl}`), { name: `error_${Math.random().toString(36).slice(2, 7)}.txt` });
        }
      }

      // Finalize the archive (ie we are done appending files but streams might still be open)
      await archive.finalize();

    } catch (err) {
      if (!res.headersSent) {
        res.status(500).json({ message: "Batch processing failed" });
      }
    }
  });

  // No history endpoint needed - history is now client-side (localStorage)

  return httpServer;
}
