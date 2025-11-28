-- Create materials table and assignment_materials relation
CREATE TABLE IF NOT EXISTS materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  url text,
  storage_path text,
  uploader_id uuid NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Optional linking table if assignments reference materials
CREATE TABLE IF NOT EXISTS assignment_materials (
  assignment_id uuid NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  material_id uuid NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  PRIMARY KEY (assignment_id, material_id)
);
