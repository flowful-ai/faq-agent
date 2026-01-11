"use server";

import { readFileSync } from "fs";
import { join } from "path";
import Firecrawl from "@mendable/firecrawl-js";
import { z } from "zod";

// JSON Schema for Firecrawl /agent extraction
const faqJsonSchema = {
  type: "object",
  properties: {
    faqs: {
      type: "array",
      description: "List of frequently asked questions and answers generated from the website",
      items: {
        type: "object",
        properties: {
          question: {
            type: "string",
            description: "A natural question that users might ask about this website"
          },
          answer: {
            type: "string",
            description: "A comprehensive answer based on content gathered from the website"
          },
        },
        required: ["question", "answer"],
      },
    },
  },
  required: ["faqs"],
};

// Zod schema for validation
const faqZodSchema = z.object({
  faqs: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    })
  ),
});

export type FAQItem = { question: string; answer: string };

// Load prompt from external file for easy editing
const AGENT_PROMPT = readFileSync(join(process.cwd(), "prompt.md"), "utf-8");

/**
 * Server Action that uses Firecrawl /agent to generate FAQs.
 */
export async function generateFAQ(url: string): Promise<FAQItem[]> {
  if (!url) throw new Error("No URL provided.");
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) throw new Error("FIRECRAWL_API_KEY is not set.");

  const app = new Firecrawl({ apiKey });

  let result: { success: boolean; data?: unknown; error?: string };
  try {
    // Use the /agent endpoint for intelligent webpage analysis
    result = await app.agent({
      urls: [url],
      prompt: AGENT_PROMPT,
      schema: faqJsonSchema,
    });
  } catch (err) {
    throw new Error("Failed to connect to Firecrawl /agent API.");
  }

  if (!result.success) {
    throw new Error(result.error || "Firecrawl agent extraction failed.");
  }

  // Agent returns data in the 'data' property
  const extractData = result.data;
  if (!extractData || typeof extractData !== "object") {
    throw new Error("No FAQ data could be extracted from this page.");
  }

  const parsed = faqZodSchema.safeParse(extractData);
  if (!parsed.success) {
    throw new Error("Invalid data format returned from Firecrawl agent.");
  }

  if (parsed.data.faqs.length === 0) {
    throw new Error("No FAQs could be generated for this page.");
  }

  return parsed.data.faqs;
} 