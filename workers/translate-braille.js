/**
 * Cloudflare Worker for LLM-based Braille translation
 * This acts as a secure proxy between the client and the LLM API
 */

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return handleCORS(request);
    }

    // Only allow POST requests
    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405, request);
    }

    try {
      // Parse request body
      const { text, direction } = await request.json();

      // Validate input
      if (!text || typeof text !== "string") {
        return jsonResponse({ error: "Invalid text parameter" }, 400, request);
      }

      if (!direction || !["toBraille", "toText"].includes(direction)) {
        return jsonResponse(
          { error: "Invalid direction parameter" },
          400,
          request,
        );
      }

      // Rate limiting check (optional but recommended)
      const rateLimitResult = await checkRateLimit(request, env);
      if (!rateLimitResult.allowed) {
        return jsonResponse(
          { error: "Rate limit exceeded. Please try again later." },
          429,
          request,
        );
      }

      // Prepare LLM prompt based on direction
      const systemPrompt =
        direction === "toBraille"
          ? "You are a precise English Braille Grade 2 translator. Convert text to Braille Unicode characters using proper Grade 2 rules, including proper marking of numbers, capital letters and symbols, also use proper grade 2 contractions. Output ONLY the Braille characters with no explanation, formatting, or extra text."
          : "You are a precise English Braille Grade 2 translator. Convert Braille Unicode characters to plain English text. The text you are provided may contain capital letters, numbers, symbols and contractions. The text you are translating back to English, should make grammatical sense. Output ONLY the translated text with no explanation, formatting, or extra text.";

      const userPrompt =
        direction === "toBraille"
          ? `Translate this text to Braille Grade 2: ${text}`
          : `Translate this Braille to plain text: ${text}`;

      // Call OpenAI API
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      try {
        const llmResponse = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
              model: "gpt-5.2",
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
              ],
              temperature: 0.1,
              max_completion_tokens: 500, 
            }),
            signal: controller.signal,
          },
        );

        clearTimeout(timeoutId);

        if (!llmResponse.ok) {
          const errorData = await llmResponse.json();
          console.error("LLM API error:", errorData);
          return jsonResponse(
            { error: "Translation service temporarily unavailable" },
            503,
            request,
          );
        }

        const llmData = await llmResponse.json();

        // ✅ Validate response structure
        if (
          !llmData.choices ||
          !llmData.choices[0] ||
          !llmData.choices[0].message
        ) {
          console.error("Invalid LLM response structure:", llmData);
          return jsonResponse(
            { error: "Invalid response from translation service" },
            500,
            request,
          );
        }

        const translatedText = llmData.choices[0].message.content?.trim() || "";

        // ✅ Check for empty result
        if (!translatedText) {
          console.error("Empty translation result for input:", text);
          return jsonResponse(
            { error: "Translation returned empty result" },
            500,
            request,
          );
        }

        // ✅ Detailed logging
        console.log("Translation success:", {
          inputLength: text.length,
          outputLength: translatedText.length,
          finishReason: llmData.choices[0].finish_reason,
          tokens: llmData.usage.total_tokens,
        });

        return jsonResponse(
          {
            result: translatedText,
            usage: {
              promptTokens: llmData.usage.prompt_tokens,
              completionTokens: llmData.usage.completion_tokens,
              totalTokens: llmData.usage.total_tokens,
            },
          },
          200,
          request,
        );
      } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === "AbortError") {
          console.error("Request timeout");
          return jsonResponse(
            {
              error:
                "Translation request timed out. Please try a shorter text.",
            },
            504,
            request,
          );
        }
        throw error;
      }
    } catch (error) {
      console.error("Worker error:", error);
      return jsonResponse(
        {
          error: "Internal server error",
          message: error.message,
        },
        500,
        request,
      );
    }
  },
};

/**
 * Simple rate limiting using Cloudflare KV (optional)
 * You can remove this if you don't need rate limiting
 */
async function checkRateLimit(request, env) {
  // Skip rate limiting if KV namespace not configured
  if (!env.RATE_LIMIT) {
    return { allowed: true };
  }

  const clientIP = request.headers.get("CF-Connecting-IP") || "unknown";
  const rateLimitKey = `rate_limit:${clientIP}`;

  const currentCount = await env.RATE_LIMIT.get(rateLimitKey);
  const count = currentCount ? parseInt(currentCount) : 0;

  // Allow 20 requests per minute
  const LIMIT = 20;

  if (count >= LIMIT) {
    return { allowed: false };
  }

  // Increment counter with 60 second expiration
  await env.RATE_LIMIT.put(rateLimitKey, (count + 1).toString(), {
    expirationTtl: 60,
  });

  return { allowed: true };
}

/**
 * Get allowed origin based on request
 */
function getAllowedOrigin(request) {
  const origin = request.headers.get("Origin");
  const allowedOrigins = [
    "https://pagan404.github.io",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
  ];

  return allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
}

/**
 * Handle CORS preflight requests
 */
function handleCORS(request) {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": getAllowedOrigin(request),
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}

/**
 * Helper function to create JSON responses with CORS headers
 */
function jsonResponse(data, status = 200, request) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": getAllowedOrigin(request),
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
