const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL_CANDIDATES = [
  process.env.GEMINI_MODEL,
  "gemini-flash-latest",
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-3.1-flash-lite"
].filter(Boolean);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({
      error: "Server is missing GEMINI_API_KEY. Add it in your hosting environment variables."
    });
  }

  try {
    const { system, prompt, depth = "deep", useGrounding = true } = req.body || {};
    if (!system || !prompt) {
      return res.status(400).json({ error: "Missing system or prompt." });
    }

    const payload = {
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.35,
        maxOutputTokens: depth === "fast" ? 2200 : 3600,
        responseMimeType: "application/json"
      }
    };

    if (useGrounding) {
      payload.tools = [{ google_search: {} }];
    }

    const { data, model, errors } = await callGeminiWithFallback(payload);

    const text = (data.candidates?.[0]?.content?.parts || [])
      .map((part) => part.text || "")
      .join("\n");
    const result = robustParse(text);

    if (!result) {
      return res.status(502).json({
        error: "Gemini returned malformed JSON.",
        model,
        raw: text.slice(0, 1200)
      });
    }

    return res.status(200).json({ result, model, fallbackErrors: errors });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Research request failed." });
  }
}

async function callGeminiWithFallback(payload) {
  const errors = [];

  for (const model of MODEL_CANDIDATES) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
    const geminiRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await geminiRes.json().catch(() => ({}));
    if (geminiRes.ok) {
      return { data, model, errors };
    }

    errors.push({
      model,
      status: geminiRes.status,
      message: data.error?.message || `Gemini API error ${geminiRes.status}`
    });
  }

  const last = errors[errors.length - 1];
  const detail = errors.map((item) => `${item.model}: ${item.message}`).join(" | ");
  const error = new Error(detail || "Gemini request failed.");
  error.status = last?.status || 500;
  throw error;
}

function robustParse(raw) {
  if (!raw) return null;
  const cleaned = String(raw).trim().replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  const direct = tryParse(cleaned);
  if (direct) return direct;
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  const slice = cleaned.slice(start, end + 1);
  return tryParse(slice) || tryParse(slice.replace(/,\s*([}\]])/g, "$1"));
}

function tryParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
