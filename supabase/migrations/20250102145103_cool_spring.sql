/*
  # Add updated_at column to newsletters table

  1. Changes
    - Add `updated_at` column to `newsletters` table
    - Set default value to `now()`
    - Update existing rows to set `updated_at = created_at`
    - Create trigger to automatically update `updated_at` on row updates

  2. Notes
    - Uses existing trigger function from user_settings table
    - Safe migration that won't affect existing data
*/

-- Add updated_at column with default value
ALTER TABLE newsletters ADD COLUMN updated_at timestamptz DEFAULT now();

-- Update existing rows to set updated_at = created_at
UPDATE newsletters SET updated_at = created_at;

-- Create the trigger
CREATE TRIGGER update_newsletters_updated_at
  BEFORE UPDATE ON newsletters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();