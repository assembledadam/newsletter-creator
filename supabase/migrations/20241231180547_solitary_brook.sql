/*
  # Create newsletters table

  1. New Tables
    - `newsletters`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `title` (text)
      - `content` (text)
      - `source_url` (text)
      - `items` (jsonb)
      - `user_id` (uuid, foreign key to auth.users)
  
  2. Security
    - Enable RLS on `newsletters` table
    - Add policies for authenticated users to manage their own newsletters
*/

CREATE TABLE newsletters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  title text NOT NULL,
  content text NOT NULL,
  source_url text,
  items jsonb,
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own newsletters"
  ON newsletters
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own newsletters"
  ON newsletters
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own newsletters"
  ON newsletters
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own newsletters"
  ON newsletters
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);