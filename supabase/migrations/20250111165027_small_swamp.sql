/*
  # Add selected column to content_sources table

  1. Changes
    - Add `selected` boolean column to `content_sources` table
    - Add policy for authenticated users to update the selected status of content

  2. Security
    - Add policy for authenticated users to update their selections
*/

-- Add selected column
ALTER TABLE content_sources 
ADD COLUMN selected boolean DEFAULT false;

-- Allow authenticated users to update selected status
CREATE POLICY "Allow authenticated users to update selected status"
  ON content_sources
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);