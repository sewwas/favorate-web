-- Drop existing policies
DROP POLICY IF EXISTS "Admin full access on items" ON items;
DROP POLICY IF EXISTS "Admin full access on meal_sets" ON meal_sets;
DROP POLICY IF EXISTS "Admin full access on meal_components" ON meal_components;
DROP POLICY IF EXISTS "Sales team can view items" ON items;
DROP POLICY IF EXISTS "Sales team can view meal_sets" ON meal_sets;
DROP POLICY IF EXISTS "Sales team can view meal_components" ON meal_components;
DROP POLICY IF EXISTS "Sales team can manage sales" ON sales;

-- Enable RLS on all tables
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Admin policies with full access (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Admin full access on items" 
ON items 
USING (auth.jwt() ->> 'role' = 'admin')
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access on meal_sets" 
ON meal_sets 
USING (auth.jwt() ->> 'role' = 'admin')
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access on meal_components" 
ON meal_components 
USING (auth.jwt() ->> 'role' = 'admin')
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Sales team policies (read-only for most tables, full access to sales)
CREATE POLICY "Sales team can view items" 
ON items FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Sales team can view meal_sets" 
ON meal_sets FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Sales team can view meal_components" 
ON meal_components FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Sales team can manage sales" 
ON sales 
USING (true)
WITH CHECK (true); 