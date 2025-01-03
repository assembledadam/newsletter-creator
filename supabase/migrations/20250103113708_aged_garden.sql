-- Add default_newsletter_title column to user_settings
ALTER TABLE user_settings 
ADD COLUMN default_newsletter_title text NOT NULL 
DEFAULT 'The Week In R&D Tax';

-- Update existing rows to set default_newsletter_title
UPDATE user_settings 
SET default_newsletter_title = 'The Week In R&D Tax' 
WHERE default_newsletter_title IS NULL;