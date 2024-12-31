import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { url } = await req.json()
    
    // Extract sheet ID from URL
    const sheetId = url.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)?.[1]
    if (!sheetId) {
      throw new Error('Invalid Google Sheets URL')
    }

    // Get the API key from environment variable
    const apiKey = Deno.env.get('GOOGLE_API_KEY')
    if (!apiKey) {
      throw new Error('Google API key not configured')
    }

    // Fetch sheet data directly using the API
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A2:C?key=${apiKey}`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch sheet data')
    }

    const data = await response.json()
    const rows = data.values || []
    
    // Transform rows into news items
    const items = rows.map(([title, description, source]) => ({
      title,
      description,
      source,
      selected: false,
    }))

    return new Response(
      JSON.stringify(items),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})