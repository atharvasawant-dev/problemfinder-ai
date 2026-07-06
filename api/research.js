const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

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

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
    const geminiRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await geminiRes.json().catch(() => ({}));
    if (!geminiRes.ok) {
      return res.status(geminiRes.status).json({
        error: data.error?.message || `Gemini API error ${geminiRes.status}`
      });
    }

    const text = (data.candidates?.[0]?.content?.parts || [])
      .map((part) => part.text || "")
      .join("\n");
    const result = robustParse(text);

    if (!result) {
      return res.status(502).json({
        error: "Gemini returned malformed JSON.",
        raw: text.slice(0, 1200)
      });
    }

    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Research request failed." });
  }
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
