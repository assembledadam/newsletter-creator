/*
  # Add content sources table

  1. New Types
    - `content_source_type` enum for different content sources
      - aif_guidance_update
      - cird_update
      - agent_update
      - rdcf_update
      - google
      - linkedin_search
      - linkedin_newsletter

  2. New Tables
    - `content_sources`
      - `id` (uuid, primary key)
      - `content_date` (timestamptz)
      - `source` (content_source_type)
      - `title` (text)
      - `description` (text)
      - `author` (text)
      - `url` (text)
      - `metadata` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  3. Security
    - Enable RLS on `content_sources` table
    - Add policies for authenticated users to read all content
    - Add policies for service role to manage content
*/

-- Create enum for content sources
CREATE TYPE content_source_type AS ENUM (
  'aif_guidance_update',
  'cird_update',
  'agent_update',
  'rdcf_update',
  'google',
  'linkedin_search',
  'linkedin_newsletter'
);

-- Create content sources table
CREATE TABLE IF NOT EXISTS content_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_date timestamptz NOT NULL,
  source content_source_type NOT NULL,
  title text NOT NULL,
  description text,
  author text,
  url text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE content_sources ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger
CREATE TRIGGER update_content_sources_updated_at
  BEFORE UPDATE ON content_sources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
-- Allow all authenticated users to read content
CREATE POLICY "Allow authenticated users to read content"
  ON content_sources
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow service role to manage content
CREATE POLICY "Allow service role to manage content"
  ON content_sources
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create indexes for common queries
CREATE INDEX idx_content_sources_content_date ON content_sources (content_date DESC);
CREATE INDEX idx_content_sources_source ON content_sources (source);
CREATE INDEX idx_content_sources_created_at ON content_sources (created_at DESC);