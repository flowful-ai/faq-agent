import FAQForm from "@/components/FAQForm";

export default function Page() {
  const apiKeyMissing = !process.env.FIRECRAWL_API_KEY;

  return (
    <main className="flex justify-center items-start min-h-[calc(100vh-80px)] py-16 px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            Powered by Firecrawl /agent
          </div>
          <h1 className="text-4xl font-bold mb-3 tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            FAQ Generator
          </h1>
          <p className="text-gray-500 text-lg">
            Transform any webpage into structured FAQs for better AI visibility
          </p>
        </div>
        <FAQForm apiKeyMissing={apiKeyMissing} />
      </div>
    </main>
  );
}
