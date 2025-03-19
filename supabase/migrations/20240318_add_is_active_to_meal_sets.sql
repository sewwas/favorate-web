-- Add is_active column to meal_sets table
ALTER TABLE meal_sets ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

-- Create index for is_active column
CREATE INDEX IF NOT EXISTS idx_meal_sets_active ON meal_sets(is_active);

-- Update existing rows to have is_active = true
UPDATE meal_sets SET is_active = true WHERE is_active IS NULL; 