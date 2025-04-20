
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { emotion } = await req.json()
    if (!emotion) {
      throw new Error('No emotion data provided')
    }

    const prompt = `Suggest 3 specific Spotify songs that best fit the emotional mood: "${emotion}". 
    Return the response in this exact JSON format, and nothing else:
    {
      "suggested_songs": [
        { "title": "song title", "artist": "artist name", "url": "spotify url" }
      ]
    }
    Make sure each song has a real Spotify URL and is a good match for the emotion.`

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('GOOGLE_API_KEY')}`,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        }),
      }
    )

    const data = await response.json()
    const suggestions = JSON.parse(data.candidates[0].content.parts[0].text)

    return new Response(
      JSON.stringify(suggestions),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
