-- ============================================================================
-- COLOMBO LAW SOCIETY (EST. 1890 / BASL BRANCH 1975)
-- PRODUCTION SUPABASE / POSTGRESQL RELATIONAL SCHEMA & SEED DATA
-- ============================================================================

-- Enable UUID extension for robust distributed keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. SOCIETY GENERAL SETTINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS society_settings (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL DEFAULT 'Colombo Law Society',
    tagline TEXT DEFAULT 'Premier & Largest Branch Association of the Bar Association of Sri Lanka',
    established_year INT DEFAULT 1890,
    charter_year INT DEFAULT 1975,
    address TEXT DEFAULT '129, Hulftsdorp Street, Colombo 12, Sri Lanka',
    email VARCHAR(255) DEFAULT 'info@colombolawsociety.com',
    phone VARCHAR(50) DEFAULT '+94 71 192 3531',
    membership_fee_ordinary NUMERIC(10, 2) DEFAULT 2000.00,
    membership_fee_life NUMERIC(10, 2) DEFAULT 5000.00,
    total_members_count INT DEFAULT 1042,
    superior_court_enclave TEXT DEFAULT 'Supreme Court & Superior Courts Complex, Hulftsdorp',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 2. ADVOCATES & MEMBERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE,
    sc_en VARCHAR(100) NOT NULL UNIQUE, -- Supreme Court Enrolment Number (e.g., SC/EN/2018/2210)
    ba_en VARCHAR(100),                -- Bar Association of Sri Lanka Enrolment
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mobile VARCHAR(50) NOT NULL,
    nic VARCHAR(50),
    gender VARCHAR(20) DEFAULT 'Male',
    city VARCHAR(100) DEFAULT 'Colombo',
    practice_area VARCHAR(255) DEFAULT 'Commercial & Corporate Law',
    expertise TEXT[] DEFAULT ARRAY['Appellate Advocacy'],
    membership_tier VARCHAR(50) NOT NULL DEFAULT 'Ordinary' CHECK (membership_tier IN ('Ordinary', 'Life', 'None')),
    status VARCHAR(50) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Suspended')),
    avatar_url TEXT DEFAULT '/images/branding/cls-crest-gold.png',
    registered_date DATE DEFAULT CURRENT_DATE,
    membership_start_date DATE,
    membership_end_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_members_sc_en ON members(sc_en);
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);
CREATE INDEX IF NOT EXISTS idx_members_tier ON members(membership_tier);

-- ============================================================================
-- 3. CALENDAR EVENTS & MEETINGS TABLE (GOOGLE CALENDAR CAPABILITIES)
-- ============================================================================
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'Continuing Legal Education',
    venue VARCHAR(255) NOT NULL DEFAULT 'Main Auditorium, Superior Courts Complex',
    location VARCHAR(255) DEFAULT 'Hulftsdorp, Colombo 12',
    start_date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    price NUMERIC(10, 2) DEFAULT 0.00,
    status VARCHAR(50) NOT NULL DEFAULT 'Upcoming' CHECK (status IN ('Upcoming', 'Ongoing', 'Completed', 'Cancelled')),
    description TEXT,
    poster_url TEXT DEFAULT '/images/sri-lanka/hero-old-parliament.jpg',
    speakers TEXT[] DEFAULT ARRAY[]::TEXT[],
    attendee_count INT DEFAULT 0,
    is_meeting BOOLEAN DEFAULT FALSE,
    meeting_link TEXT,
    agenda TEXT[] DEFAULT ARRAY[]::TEXT[],
    color VARCHAR(20) DEFAULT '#C5A059',
    created_by VARCHAR(255) DEFAULT 'Secretariat',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_dates ON events(start_date_time, end_date_time);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);

-- ============================================================================
-- 4. EVENT IMAGE SHOWCASE & GALLERY TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS event_gallery (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'National Conference',
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    date VARCHAR(100) DEFAULT CURRENT_DATE::TEXT,
    venue VARCHAR(255) DEFAULT 'Superior Courts Complex, Hulftsdorp',
    description TEXT,
    featured BOOLEAN DEFAULT FALSE,
    photographer VARCHAR(255) DEFAULT 'CLS Secretariat Media',
    event_id INT REFERENCES events(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gallery_featured ON event_gallery(featured);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON event_gallery(category);
CREATE INDEX IF NOT EXISTS idx_gallery_event_id ON event_gallery(event_id);

-- ============================================================================
-- 5. EXECUTIVE COMMITTEE COUNCIL TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS committee_members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(100) NOT NULL, -- e.g. President, Secretary, Treasurer
    credentials VARCHAR(100) DEFAULT 'Attorney-at-Law',
    court VARCHAR(255) DEFAULT 'Supreme Court Bar & Hulftsdorp',
    image_url TEXT NOT NULL,
    bio TEXT,
    email VARCHAR(255),
    phone VARCHAR(50),
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 6. PAST PRESIDENTS ROLL OF HONOUR (1975 – PRESENT)
-- ============================================================================
CREATE TABLE IF NOT EXISTS past_presidents (
    id SERIAL PRIMARY KEY,
    year_period VARCHAR(50) NOT NULL, -- e.g. 1975-1976, 2024
    name VARCHAR(255) NOT NULL,
    credentials VARCHAR(100) DEFAULT 'Attorney-at-Law',
    tenure VARCHAR(100) NOT NULL,
    highlight TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 7. BROADCAST NOTIFICATIONS & DISPATCH LOGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS broadcast_logs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    channel VARCHAR(50) NOT NULL DEFAULT 'BOTH' CHECK (channel IN ('EMAIL', 'SMS', 'BOTH')),
    target_tier VARCHAR(100) DEFAULT 'All Members',
    recipients_count INT DEFAULT 1042,
    status VARCHAR(50) DEFAULT 'Delivered' CHECK (status IN ('Delivered', 'Queued', 'Failed')),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 8. AUTO-UPDATE TIMESTAMP FUNCTION & TRIGGERS
-- ============================================================================
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_members_updated_at ON members;
CREATE TRIGGER trigger_members_updated_at
BEFORE UPDATE ON members
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

DROP TRIGGER IF EXISTS trigger_events_updated_at ON events;
CREATE TRIGGER trigger_events_updated_at
BEFORE UPDATE ON events
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

DROP TRIGGER IF EXISTS trigger_gallery_updated_at ON event_gallery;
CREATE TRIGGER trigger_gallery_updated_at
BEFORE UPDATE ON event_gallery
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- ============================================================================
-- 9. SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE society_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE committee_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE past_presidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE broadcast_logs ENABLE ROW LEVEL SECURITY;

-- Public can read published society information, events, and gallery showcase
CREATE POLICY "Public Read Events" ON events FOR SELECT USING (true);
CREATE POLICY "Public Read Gallery" ON event_gallery FOR SELECT USING (true);
CREATE POLICY "Public Read Committee" ON committee_members FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Past Presidents" ON past_presidents FOR SELECT USING (true);
CREATE POLICY "Public Read Settings" ON society_settings FOR SELECT USING (true);

-- Authenticated admins can insert/update/delete everything
CREATE POLICY "Admin All Access Events" ON events FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Access Gallery" ON event_gallery FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Access Members" ON members FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Access Committee" ON committee_members FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Access Broadcast" ON broadcast_logs FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================
-- 10. AUTHENTIC INITIAL SEED DATA
-- ============================================================================

-- Society Settings
INSERT INTO society_settings (name, tagline, established_year, charter_year, address, email, phone, membership_fee_ordinary, membership_fee_life, total_members_count)
VALUES (
    'Colombo Law Society',
    'Premier & Largest Branch Association of the Bar Association of Sri Lanka',
    1890,
    1975,
    '129, Hulftsdorp Street, Colombo 12, Sri Lanka',
    'info@colombolawsociety.com',
    '+94 71 192 3531',
    2000.00,
    5000.00,
    1042
) ON CONFLICT DO NOTHING;

-- Executive Committee with Authentic Photos
INSERT INTO committee_members (name, title, credentials, court, image_url, bio, email, phone, order_index)
VALUES 
('Mr. Sandun Nagahawatta', 'President', 'Attorney-at-Law', 'Supreme Court Bar & Hulftsdorp', '/images/team/sandun-nagahawatta.jpg', 'Leading the Colombo Law Society with a vision of judicial modernization, advocate welfare, and constitutional independence.', 'president@colombolawsociety.com', '+94 77 123 4567', 1),
('Mr. Lahiru Welgama', 'Secretary', 'Attorney-at-Law, LL.B (Hons)', 'Superior Courts Complex', '/images/team/lahiru-walgama.jpg', 'Coordinating society administration, registrar liaisons, continuing legal education symposia, and Bar Association relations.', 'secretary@colombolawsociety.com', '+94 71 892 3341', 2),
('Ms. Gamali Amarathunga', 'Treasurer', 'Attorney-at-Law', 'Colombo Bar & Commercial Benches', '/images/team/gamali-amarathunga.jpg', 'Managing the Society''s fiscal governance, advocate benevolent trusts, member relief endowments, and annual subscriptions.', 'treasurer@colombolawsociety.com', '+94 77 443 2190', 3),
('Mr. Dilum Jayanath', 'Deputy President', 'Attorney-at-Law', 'Appellate & Commercial Courts', '/images/team/dilum-jayanath.jpg', 'Overseeing professional standards, courtroom infrastructure initiatives, and judicial service working committee dialogues.', 'deputy.president@colombolawsociety.com', '+94 76 554 8192', 4),
('Ms. Wardani Karunaratne', 'Assistant Secretary', 'Attorney-at-Law', 'Commercial High Court & IP Tribunals', '/images/team/wardani-karunaratne.jpg', 'Directing junior bar mentorship programs, publications, member communication bulletins, and legal research archives.', 'asst.secretary@colombolawsociety.com', '+94 77 912 3456', 5),
('Mr. Kunchana Samarakoon', 'Assistant Treasurer', 'Attorney-at-Law', 'Trial Advocacy & High Courts', '/images/team/kunchana-samarakoon.jpg', 'Administering member dues reconciliation, conference ticket logistics, and library acquisition endowments.', 'asst.treasurer@colombolawsociety.com', '+94 70 334 1189', 6),
('Ms. Vindika Subasinghe', 'Immediate Past President', 'Attorney-at-Law, LL.M', 'Supreme Court Bar', '/images/team/vindika-subasinghe.jpg', 'Distinguished past president providing senior counsel on constitutional governance, BASL liaison, and Bar welfare.', 'vindika.subasinghe@colombolawsociety.com', '+94 71 223 8899', 7),
('Mr. Naveen Shanaka', 'Past Secretary & Senior Council Member', 'Attorney-at-Law', 'Commercial High Court', '/images/team/naveen-shanaka.jpg', 'Former Secretary directing arbitration symposia, international dispute resolution sessions, and practitioner support.', 'naveen.shanaka@colombolawsociety.com', '+94 71 892 3341', 8);

-- Seed Events
INSERT INTO events (title, category, venue, location, start_date_time, end_date_time, price, status, description, poster_url, speakers, attendee_count, is_meeting, color)
VALUES
('Annual Law Conference 2026: The Digital Frontiers of Jurisprudence', 'Annual Symposium', 'Main Auditorium, Superior Courts Complex', 'Hulftsdorp, Colombo 12', '2026-11-20 09:00:00+05:30', '2026-11-20 17:30:00+05:30', 3500.00, 'Upcoming', 'The premier annual gathering of Sri Lanka''s supreme court bar examining artificial intelligence, cross-border evidence, and electronic courts.', '/images/events/cls-actual-event.jpg', ARRAY['Hon. Chief Justice of Sri Lanka', 'President of the Court of Appeal', 'Senior Counsel Panel'], 184, FALSE, '#C5A059'),
('Executive Council Statutory Monthly Meeting', 'Council Meeting', 'Chambers Boardroom, Superior Courts Complex', 'Hulftsdorp, Colombo 12', '2026-11-12 17:00:00+05:30', '2026-11-12 19:30:00+05:30', 0.00, 'Upcoming', 'Statutory monthly meeting of the Colombo Law Society Executive Council reviewing committee submissions and bar welfare allocations.', '/images/sri-lanka/hero-old-parliament.jpg', ARRAY['President Sandun Nagahawatta', 'Secretary Lahiru Welgama'], 22, TRUE, '#10B981'),
('Masterclass: Appellate Brief Crafting & Oral Argumentation', 'Continuing Legal Education', 'Law Society Auditorium', 'Hulftsdorp St, Colombo 12', '2026-11-05 14:00:00+05:30', '2026-11-05 18:00:00+05:30', 1500.00, 'Upcoming', 'Advanced appellate drafting seminar on crafting concise written submissions and bench dialogues.', '/images/sri-lanka/hero-old-parliament.jpg', ARRAY['President''s Counsel Faculty'], 96, FALSE, '#F59E0B'),
('Symposium on Fundamental Rights & Constitutional Justice', 'Continuing Legal Education', 'BMICH Committee Lounge', 'Bauddhaloka Mawatha, Colombo 07', '2026-10-28 09:30:00+05:30', '2026-10-28 16:00:00+05:30', 2500.00, 'Upcoming', 'Analyzing milestone Supreme Court rulings under Article 126 and public interest jurisprudence.', '/images/sri-lanka/independence-hall.jpg', ARRAY['Eminent Human Rights Jurists'], 140, FALSE, '#6366F1');

-- Seed Gallery Showcase Images
INSERT INTO event_gallery (title, category, image_url, date, venue, description, featured, photographer)
VALUES
('50th Golden Jubilee Commemoration & Law Conference', 'National Conference', '/images/events/cls-actual-event.jpg', '12 Oct, 2025', 'Main Auditorium, Superior Courts Complex, Hulftsdorp', 'Inaugural plenary session addressed by the Supreme Court bench and executive officers.', TRUE, 'Official Secretariat Media'),
('Opening of the Legal Year Ceremonial Assembly', 'Ceremonial Sittings', '/images/sri-lanka/hero-old-parliament.jpg', '15 Jan, 2026', 'Ceremonial Courtroom & Hulftsdorp Forecourt', 'Annual traditional procession of the Colombo Bar welcoming new practitioners.', TRUE, 'Chambers Archive'),
('Annual Law Dinner & Bar Excellence Awards Gala', 'Annual Law Dinner', '/images/sri-lanka/colombo-civic-palace.jpg', '28 Nov, 2025', 'The Grand Ballroom, Galle Face Hotel, Colombo', 'Gala evening celebrating bar milestones with judicial officers and international delegates.', TRUE, 'Colombo Society Media'),
('Constitution Day Colloquium & Public Law Review', 'CLE Masterclass', '/images/sri-lanka/independence-hall.jpg', '04 Feb, 2026', 'Independence Memorial Hall, Colombo 07', 'Symposium on constitutional guarantees and judicial independence.', FALSE, 'Constitutional Law Forum'),
('Junior Bar Robing & Professional Induction Seminar', 'CLE Masterclass', '/images/sri-lanka/colombo-colonnade.jpg', '22 Mar, 2026', 'Law Society Auditorium, Hulftsdorp', 'Intensive advocacy workshop for newly admitted Attorneys-at-Law.', FALSE, 'Junior Bar Committee'),
('Maritime & Commercial Arbitration International Forum', 'National Conference', '/images/sri-lanka/colombo-skyline.jpg', '18 May, 2026', 'Colombo International Financial Centre Auditorium', 'Deliberations on admiralty law enforcement and international commercial mediation rules.', TRUE, 'Commercial Bar Bureau');

-- Past Presidents (All 32 Presidents from 1975)
INSERT INTO past_presidents (year_period, name, credentials, tenure, highlight, image_url)
VALUES
('2024', 'Ms. Vindika Subasinghe', 'Attorney-at-Law', '2024', 'Digital transformation of the Colombo Law Society & 50th Anniversary initiatives.', '/images/team/vindika-subasinghe.jpg'),
('2022-2023', 'Mr. Sanjeewa Dasanayake', 'Attorney-at-Law', '2022 – 2023', 'Strengthening bar welfare endowments and court accessibility.', NULL),
('2020-2021', 'Mr. Vijaya Gamage', 'Attorney-at-Law', '2020 – 2021', 'Guided the Bar through pandemic court closures and remote hearings implementation.', NULL),
('2019', 'Mr. Tivanka Ekaratne', 'Attorney-at-Law', '2019', 'Championed junior bar training and appellate masterclasses.', NULL),
('2018', 'Mr. Jagath Wickramanayake', 'President''s Counsel', '2018', 'Eminent appellate advocate and constitutional law leader.', NULL),
('2017', 'Mr. Kaushalya Nawaratne', 'President''s Counsel', '2017', 'Later elected President of the Bar Association of Sri Lanka (BASL).', NULL),
('2015-2017', 'Mr. Athula Perera', 'Attorney-at-Law', '2015 – 2017', 'Two-term president leading Hulftsdorp court complex infrastructure improvements.', NULL),
('2013-2014', 'Mr. Amal Randeniya', 'Attorney-at-Law', '2013 – 2014', 'Expanded continuing legal education seminars for corporate practitioners.', NULL),
('2012', 'Mr. Binara Gunasekera', 'Attorney-at-Law', '2012', 'Reformed the Colombo Law Society Constitution and working committee structure.', NULL),
('2010-2011', 'Mr. Kamal Goonesinghe', 'Attorney-at-Law', '2010 – 2011', 'Established the annual National Law Symposium.', NULL),
('2008-2009', 'Mr. Janaprith Fernando', 'Attorney-at-Law', '2008 – 2009', 'Fostered international bar associations liaison and human rights awareness.', NULL),
('2007', 'Mr. Upul Jayasuriya', 'President''s Counsel', '2007', 'Prominent defender of the independence of the Judiciary and later BASL President.', NULL),
('2006', 'Mr. Mahinda B.K. Lokuge', 'Attorney-at-Law', '2006', 'Spearheaded advocate welfare funds and judicial service commission liaisons.', NULL),
('2005', 'Mr. K.S. Ratnavale', 'Attorney-at-Law', '2005', 'Eminent fundamental rights practitioner and civil liberties advocate.', NULL),
('2003-2004', 'Mr. Palitha Kumarasinghe', 'President''s Counsel', '2003 – 2004', 'Distinguished appellate jurist and legal scholar.', NULL),
('2002', 'Mr. Gamini Prematilleke', 'Attorney-at-Law', '2002', 'Strengthened Colombo Bar Library collections and research support.', NULL),
('2000-2001', 'Mr. S. Bagirathan', 'Attorney-at-Law', '2000 – 2001', 'Turn of the millennium legal reforms and electronic court reporting advocacy.', NULL),
('1998-1999', 'Mr. Nihal Pieris', 'Attorney-at-Law', '1998 – 1999', 'Pioneered early advocate computerization and court archive programs.', NULL),
('1997', 'Mrs. Anoma Goonetilleke', 'Attorney-at-Law', '1997', 'Eminent female bar leader championing gender equality in legal practice.', NULL),
('1996', 'Mr. K. Jayasekera', 'Attorney-at-Law', '1996', 'Advanced legal education and trial practice workshops.', NULL),
('1995', 'Mr. Ajantha Athukorale', 'Attorney-at-Law', '1995', 'Former Secretary and dedicated champion of practitioner welfare.', NULL),
('1993-1994', 'Mr. Gamani Jayasinghe', 'Attorney-at-Law', '1993 – 1994', 'Presided over the expansion of the Hulftsdorp Bar Library.', NULL),
('1991-1992', 'Mr. G.P. Mahinkanda', 'Attorney-at-Law', '1991 – 1992', 'Honoris Causa recipient and legendary Bar stalwart.', NULL),
('1989-1990', 'Mr. W. Dayaratne', 'President''s Counsel', '1989 – 1990', 'Eminent legal luminary and later BASL President.', NULL),
('1988', 'Mr. Palitha Mathew', 'Attorney-at-Law', '1988', 'Dedicated advocate for court administration reform.', NULL),
('1986-1987', 'Mrs. Lena Fernando', 'Attorney-at-Law', '1986 – 1987', 'Historic first female President of the Colombo Law Society.', NULL),
('1985', 'Mr. K. Balapatabendi', 'Attorney-at-Law', '1985', 'High Court trial practitioner and defender of civil justice.', NULL),
('1984', 'Mr. R.B. Seneviratne', 'Attorney-at-Law', '1984', 'Fortified the working committee framework of the Society.', NULL),
('1979-1983', 'Mr. Siva Rajaratnam', 'Attorney-at-Law', '1979 – 1983', 'Longest-serving early president across four vital formative years.', NULL),
('1977-1979', 'Mr. Hermon J.C. Perera', 'Attorney-at-Law', '1977 – 1979', 'Consolidated the Society''s membership across the Greater Colombo district.', NULL),
('1975-1976', 'Mr. Nimal Senanayake', 'President''s Counsel', '1975 – 1976', 'Founding President of the Colombo Law Society; titan of the Sri Lankan Bar.', NULL);

-- Seed Initial Advocates
INSERT INTO members (sc_en, ba_en, name, email, mobile, nic, gender, city, practice_area, expertise, membership_tier, status, registered_date, membership_start_date, membership_end_date, avatar_url)
VALUES
('SC/EN/2012/1042', 'BASL/8492', 'Dr. Asoka De Silva, PC', 'asoka.desilva@lawchambers.lk', '+94 77 123 4567', '196812403921', 'Male', 'Colombo 07', 'Constitutional & Fundamental Rights', ARRAY['Appellate Advocacy', 'Judicial Review', 'Administrative Law'], 'Life', 'Active', '2015-01-12', '2015-01-12', '2114-01-12', '/images/branding/cls-crest-gold.png'),
('SC/EN/2018/2210', 'BASL/11204', 'Mr. Naveen Shanaka', 'naveen.shanaka@colombolaw.org', '+94 71 892 3341', '198829104422', 'Male', 'Colombo 03', 'Commercial & Corporate Law', ARRAY['Cross-Border Mergers', 'Commercial Arbitration', 'Banking Litigation'], 'Ordinary', 'Active', '2019-03-18', '2026-01-01', '2026-12-31', '/images/team/naveen-shanaka.jpg'),
('SC/EN/2021/3491', 'BASL/14981', 'Ms. Wardani Karunaratne', 'wardani.k@chambers.lk', '+94 76 591 7189', '199468201944', 'Female', 'Nugegoda', 'Intellectual Property & IT Law', ARRAY['Copyright Law', 'Fintech Regulation', 'Cybercrime Defense'], 'Ordinary', 'Active', '2022-05-04', '2025-04-15', '2026-04-14', '/images/team/wardani-karunaratne.jpg'),
('SC/EN/2023/4102', 'BASL/16290', 'Mr. Kunchana Samarakoon', 'kunchana.samarakoon@gmail.com', '+94 70 334 1189', '199718402219', 'Male', 'Dehiwala', 'Criminal Defense & Trial Advocacy', ARRAY['White Collar Crimes', 'High Court Trials', 'Forensic Evidence'], 'None', 'Inactive', '2025-10-10', NULL, NULL, '/images/team/kunchana-samarakoon.jpg');
