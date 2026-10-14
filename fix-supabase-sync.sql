-- ============================================================================
-- COLOMBO LAW SOCIETY — SUPABASE DATABASE SYNC & RLS FIX SCRIPT
-- Execute this script once in your Supabase Dashboard:
-- SQL Editor -> New Query -> Paste this script -> Click "Run" (Ctrl+Enter)
-- ============================================================================

-- STEP 1: Enable Full Read/Write Access on All Application Tables
-- This ensures that Deletions, Additions, and Updates from the Admin Panel
-- are immediately written to Supabase without being blocked by RLS policies.

ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE event_gallery DISABLE ROW LEVEL SECURITY;
ALTER TABLE committee_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE past_presidents DISABLE ROW LEVEL SECURITY;
ALTER TABLE society_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE broadcast_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE members DISABLE ROW LEVEL SECURITY;

-- If RLS is ever re-enabled in the future, these policies guarantee full access:
DROP POLICY IF EXISTS "Allow All For Anon Events" ON events;
CREATE POLICY "Allow All For Anon Events" ON events FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow All For Anon Gallery" ON event_gallery;
CREATE POLICY "Allow All For Anon Gallery" ON event_gallery FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow All For Anon Committee" ON committee_members;
CREATE POLICY "Allow All For Anon Committee" ON committee_members FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow All For Anon Past Presidents" ON past_presidents;
CREATE POLICY "Allow All For Anon Past Presidents" ON past_presidents FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow All For Anon Settings" ON society_settings;
CREATE POLICY "Allow All For Anon Settings" ON society_settings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow All For Anon Broadcast" ON broadcast_logs;
CREATE POLICY "Allow All For Anon Broadcast" ON broadcast_logs FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow All For Anon Members" ON members;
CREATE POLICY "Allow All For Anon Members" ON members FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);


-- STEP 2: Insert or Update the Executive Administrator in the 'members' table
INSERT INTO members (
  sc_en,
  ba_en,
  name,
  email,
  mobile,
  nic,
  gender,
  city,
  practice_area,
  expertise,
  membership_tier,
  status,
  registered_date,
  membership_start_date,
  membership_end_date,
  avatar_url,
  notes
) VALUES (
  'SC/ADMIN/001',
  'BASL/ADMIN/001',
  'Chambers Executive Administrator',
  'admin@cls.com',
  '+94 71 192 3531',
  '198000000000',
  'Male',
  'Colombo 12 (Hulftsdorp / Superior Courts)',
  'Judicial Administration & Bar Governance',
  ARRAY['Bar Governance', 'Court Administration', 'Supreme Court Registry'],
  'Life',
  'Active',
  CURRENT_DATE,
  CURRENT_DATE,
  '2125-12-31',
  '/images/branding/cls-crest-gold.png',
  'Primary System Administrator'
) ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  sc_en = EXCLUDED.sc_en,
  membership_tier = 'Life',
  status = 'Active';


-- STEP 3: Seed Initial Advocates into 'members' Table
INSERT INTO members (sc_en, ba_en, name, email, mobile, nic, gender, city, practice_area, expertise, membership_tier, status, registered_date, membership_start_date, membership_end_date, avatar_url)
VALUES
('SC/EN/2012/1042', 'BASL/8492', 'Dr. Asoka De Silva, PC', 'asoka.desilva@lawchambers.lk', '+94 77 123 4567', '196812403921', 'Male', 'Colombo 07', 'Constitutional & Fundamental Rights', ARRAY['Appellate Advocacy', 'Judicial Review', 'Administrative Law'], 'Life', 'Active', '2015-01-12', '2015-01-12', '2114-01-12', '/images/branding/cls-crest-gold.png'),
('SC/EN/2018/2210', 'BASL/11204', 'Mr. Naveen Shanaka', 'naveen.shanaka@colombolaw.org', '+94 71 892 3341', '198829104422', 'Male', 'Colombo 03', 'Commercial & Corporate Law', ARRAY['Cross-Border Mergers', 'Commercial Arbitration', 'Banking Litigation'], 'Ordinary', 'Active', '2019-03-18', '2026-01-01', '2026-12-31', '/images/team/naveen-shanaka.jpg'),
('SC/EN/2021/3491', 'BASL/14981', 'Ms. Wardani Karunaratne', 'wardani.k@chambers.lk', '+94 76 591 7189', '199468201944', 'Female', 'Nugegoda', 'Intellectual Property & IT Law', ARRAY['Copyright Law', 'Fintech Regulation', 'Cybercrime Defense'], 'Ordinary', 'Active', '2022-05-04', '2025-04-15', '2026-04-14', '/images/team/wardani-karunaratne.jpg'),
('SC/EN/2023/4102', 'BASL/16290', 'Mr. Kunchana Samarakoon', 'kunchana.samarakoon@gmail.com', '+94 70 334 1189', '199718402219', 'Male', 'Dehiwala', 'Criminal Defense & Trial Advocacy', ARRAY['White Collar Crimes', 'High Court Trials', 'Forensic Evidence'], 'None', 'Inactive', '2025-10-10', NULL, NULL, '/images/team/kunchana-samarakoon.jpg')
ON CONFLICT (email) DO NOTHING;


-- STEP 4: Confirm admin@cls.com in Supabase auth.users table
UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = 'admin@cls.com';
