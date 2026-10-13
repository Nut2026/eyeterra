
CREATE TABLE click_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id text NOT NULL,
  page_url text NOT NULL,
  x_coord numeric NOT NULL,
  y_coord numeric NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE click_events ENABLE ROW LEVEL SECURITY;

-- Anyone can insert clicks (anonymous tracking)
CREATE POLICY "anyone can insert clicks"
  ON click_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Anyone can read clicks (for heatmap)
CREATE POLICY "anyone can read clicks"
  ON click_events FOR SELECT
  TO anon, authenticated
  USING (true);

-- Index for fast page-level queries
CREATE INDEX idx_click_events_page_url ON click_events (page_url, created_at DESC);