-- Create database tables for the CMS system

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user', 'marketing')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pages table
CREATE TABLE IF NOT EXISTS pages (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    html_content TEXT,
    css_content TEXT,
    javascript_content TEXT,
    slug VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Snippets table
CREATE TABLE IF NOT EXISTS snippets (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    snippet_code VARCHAR(50) UNIQUE NOT NULL,
    html_content TEXT,
    css_content TEXT,
    javascript_content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Forms table
CREATE TABLE IF NOT EXISTS forms (
    id SERIAL PRIMARY KEY,
    form_name VARCHAR(100) NOT NULL,
    form_type VARCHAR(50) NOT NULL,
    fields_config JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Form submissions table
CREATE TABLE IF NOT EXISTS form_submissions (
    id SERIAL PRIMARY KEY,
    form_id INTEGER REFERENCES forms(id) ON DELETE CASCADE,
    submission_data JSON NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT
);

-- Packages table
CREATE TABLE IF NOT EXISTS packages (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    star_rating INTEGER CHECK (star_rating >= 1 AND star_rating <= 5),
    nights INTEGER NOT NULL,
    hotels JSON NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    redirect_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact information table
CREATE TABLE IF NOT EXISTS contact_info (
    id SERIAL PRIMARY KEY,
    address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    emails JSON NOT NULL,
    active_email VARCHAR(255) NOT NULL,
    map_location TEXT,
    form_fields JSON,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Header configuration table
CREATE TABLE IF NOT EXISTS header_config (
    id SERIAL PRIMARY KEY,
    logo_url VARCHAR(500),
    navigation_items JSON NOT NULL,
    mobile_config JSON,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Footer configuration table
CREATE TABLE IF NOT EXISTS footer_config (
    id SERIAL PRIMARY KEY,
    social_media_links JSON,
    footer_links JSON,
    copyright_text TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Flying partners table
CREATE TABLE IF NOT EXISTS flying_partners (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    images JSON NOT NULL,
    display_settings JSON,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics table for tracking
CREATE TABLE IF NOT EXISTS analytics (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    event_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user
INSERT INTO users (first_name, last_name, email, password_hash, role) 
VALUES ('Usman', 'Admin', 'usman@youronlineconversation.com', '$2b$10$hash_here', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert default contact information
INSERT INTO contact_info (address, phone, emails, active_email, map_location, form_fields)
VALUES (
    '84 Kingsley Road, Hounslow, Middlesex, London TW3 1QA',
    '020 3944 4671',
    '["info@hajiandumrah.co.uk", "sales@hajiandumrah.co.uk", "support@hajiandumrah.co.uk"]',
    'info@hajiandumrah.co.uk',
    '84 Kingsley Road, Hounslow, Middlesex, London TW3 1QA',
    '[{"id":"1","type":"text","label":"First Name","placeholder":"First Name","required":true}]'
)
ON CONFLICT DO NOTHING;
