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
    if (!emotion) throw new Error('No emotion data provided')

    const prompt = `Suggest 3 specific Spotify songs that fit the emotional mood: "${emotion}". 
Return a JSON array in the format: 
[
  { "title": "song title", "artist": "artist name", "url": "spotify track URL" },
  ...
] 
Make sure all Spotify URLs are valid.`

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/text-bison-001:generateText?key=' +
        Deno.env.get('GOOGLE_API_KEY'),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: { text: prompt }, temperature: 0.7 }),
      }
    )

    const data = await response.json()
    const text = data.candidates?.[0]?.output?.trim() || '[]'
    const songs = JSON.parse(text)

    return new Response(JSON.stringify({ suggested_songs: songs }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

