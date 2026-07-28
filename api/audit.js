// Perplexity API Integration for Vercel / Netlify / Node.js Serverless Functions
const API_KEY = process.env.PERPLEXITY_API_KEY || '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';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { websiteUrl, targetLocation } = req.body || {};

    if (!websiteUrl || !targetLocation) {
        return res.status(400).json({ error: 'Website URL and Target Location are required.' });
    }

    try {
        const prompt = `Perform a concise, real-time SEO & Local Search diagnostic audit for the domain "${websiteUrl}" targeting potential customers in "${targetLocation}".
Return ONLY a valid JSON object (no markdown, no code blocks) with keys:
{
  "score": 75,
  "onPageStatus": "Short diagnostic snippet about title tags and meta descriptions",
  "speedStatus": "Short diagnostic snippet about page performance and mobile readiness",
  "geoStatus": "Short diagnostic snippet about LocalBusiness schema and target location alignment",
  "techStatus": "Short diagnostic snippet about SSL security and indexation",
  "recommendation": "HTML bullet points for Kristian Mesa's recommended action plan"
}`;

        const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'sonar',
                messages: [
                    { role: 'system', content: 'You are an expert Local SEO audit assistant. Output ONLY valid JSON.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.2
            })
        });

        const data = await response.json();
        const contentStr = data.choices?.[0]?.message?.content || '{}';
        const cleanJsonStr = contentStr.replace(/```json/g, '').replace(/```/g, '').trim();
        const auditData = JSON.parse(cleanJsonStr);

        return res.status(200).json(auditData);
    } catch (err) {
        console.error('Perplexity API Error:', err);
        return res.status(500).json({ error: 'Failed to fetch live Perplexity AI audit report.' });
    }
}
