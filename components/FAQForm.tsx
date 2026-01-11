"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { generateFAQ, type FAQItem } from "../app/actions/generateFAQ";
import { LoaderButton } from "@/components/ui/LoaderButton";
import { Input } from "@/components/ui/input";
import { Globe, Sparkles, Copy, Check, ChevronDown } from "lucide-react";

type FAQFormProps = {
  apiKeyMissing?: boolean;
};

export default function FAQForm({ apiKeyMissing }: FAQFormProps) {
  const [url, setUrl] = useState("");
  const [faqs, setFaqs] = useState<FAQItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analyzedUrl, setAnalyzedUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Convert the FAQ array to Markdown
  const toMarkdown = (items: FAQItem[]) =>
    items
      .map((item) => `## ${item.question}\n\n${item.answer}`)
      .join("\n\n");

  // Copy to clipboard
  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Toggle accordion
  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Normalize URL by adding https:// if missing
  const normalizeUrl = (input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return "";
    if (!/^https?:\/\//i.test(trimmed)) {
      return `https://${trimmed}`;
    }
    return trimmed;
  };

  // Validate URL
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // When the form is submitted, call our server action
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedUrl = normalizeUrl(url);
    if (!normalizedUrl || !isValidUrl(normalizedUrl)) {
      setError("Please enter a valid URL.");
      return;
    }

    setLoading(true);
    setError("");
    setFaqs(null);

    try {
      const data = await generateFAQ(normalizedUrl);
      setFaqs(data);
      setAnalyzedUrl(normalizedUrl);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* API Key Missing Error */}
      {apiKeyMissing && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Configuration Error</p>
          <p className="text-sm">FIRECRAWL_API_KEY is not set. Please add it to your environment variables.</p>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="relative">
          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="url"
            placeholder="Enter a website URL (e.g., stripe.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-14 text-lg pl-12 pr-4 rounded-xl border-gray-200 focus:border-orange-300 focus:ring-orange-200"
          />
        </div>
        <LoaderButton
          type="submit"
          isLoading={loading}
          disabled={apiKeyMissing}
          className="w-full h-14 text-base font-semibold rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-200 transition-all duration-200"
        >
          {!loading && (
            <span className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Generate FAQs
            </span>
          )}
        </LoaderButton>
      </form>

      {/* Loading State */}
      {loading && (
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-center">
          <p className="text-orange-700 text-sm">
            The AI agent is navigating and analyzing the webpage. This may take a moment...
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Display FAQ if we have data */}
      {faqs && faqs.length > 0 && (
        <div className="mt-8 space-y-6">
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-2xl text-gray-900">Generated FAQs</h2>
              <p className="text-sm text-gray-500 mt-1">
                {faqs.length} questions extracted from {new URL(analyzedUrl).hostname}
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(toMarkdown(faqs))}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Markdown
                </>
              )}
            </button>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-7 h-7 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </span>
                    <h3 className="font-semibold text-gray-900 leading-snug pr-4">
                      {faq.question}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                      openIndex === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-200 ${
                    openIndex === idx ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-4 pt-0 pl-16 prose prose-sm prose-gray max-w-none">
                      <ReactMarkdown>
                        {faq.answer}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom spacing */}
          <div className="pb-12" />
        </div>
      )}
    </div>
  );
} 