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
    const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A2:D?key=${apiKey}`
    console.log('Fetching from:', sheetsUrl)
    
    const response = await fetch(sheetsUrl)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Sheets API error:', errorText)
      throw new Error('Failed to fetch sheet data: ' + errorText)
    }

    const data = await response.json()
    console.log('Raw sheet data:', JSON.stringify(data, null, 2))
    
    const rows = data.values || []
    
    // Transform rows into news items
    const items = rows.map((row, index) => {
      console.log(`Processing row ${index}:`, row)
      
      // Ensure we have all columns, even if empty
      const [title = '', description = '', source = '', url = ''] = row
      
      console.log('Extracted URL:', url)
      
      return {
        title,
        description,
        source,
        url: url.trim(), // Trim any whitespace
        selected: false,
      }
    })

    console.log('Final processed items:', JSON.stringify(items, null, 2))

    return new Response(
      JSON.stringify(items),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in parse-sheet function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})