/*
  # Add archived column to content_sources table

  1. Changes
    - Add `archived` boolean column to `content_sources` table
    - Default value is false
    - Add index for efficient filtering
*/

-- Add archived column
ALTER TABLE content_sources 
ADD COLUMN archived boolean DEFAULT false;

-- Create index for efficient filtering
CREATE INDEX idx_content_sources_archived ON content_sources (archived); 