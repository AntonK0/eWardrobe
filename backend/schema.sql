-- eWardrobe Database Schema (PostgreSQL)
-- This schema handles users, clothing items, outfits, and weekly planning
-- Authentication is handled by Auth0

-- ============================================
-- USERS TABLE
-- ============================================
-- Stores user profile data; authentication is handled by Auth0
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    auth0_id VARCHAR(255) UNIQUE NOT NULL,   -- Auth0 user ID (sub claim)
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,                          -- Profile picture from Auth0
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_auth0_id ON users(auth0_id);
CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- CATEGORIES TABLE
-- ============================================
-- Predefined clothing categories
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    display_order INTEGER DEFAULT 0
);

-- Insert default categories
INSERT INTO categories (name, display_order) VALUES 
    ('Tops', 1),
    ('Bottoms', 2),
    ('Dresses', 3),
    ('Outerwear', 4),
    ('Shoes', 5),
    ('Accessories', 6)
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- CLOTHING ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS clothing_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    category_id INTEGER NOT NULL,
    image_url TEXT,                          -- URL/path to the stored image
    image_filename VARCHAR(255),             -- Original filename for reference
    color VARCHAR(50),                       -- Primary color (for future filtering)
    brand VARCHAR(100),                      -- Optional brand name
    notes TEXT,                              -- User notes about the item
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_clothing_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_clothing_category FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE INDEX idx_clothing_user ON clothing_items(user_id);
CREATE INDEX idx_clothing_category ON clothing_items(category_id);

-- ============================================
-- OUTFITS TABLE
-- ============================================
-- Saved outfit combinations
CREATE TABLE IF NOT EXISTS outfits (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_outfit_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_outfits_user ON outfits(user_id);

-- ============================================
-- OUTFIT ITEMS (Junction Table)
-- ============================================
-- Links clothing items to outfits (many-to-many)
CREATE TABLE IF NOT EXISTS outfit_items (
    id SERIAL PRIMARY KEY,
    outfit_id INTEGER NOT NULL,
    clothing_item_id INTEGER NOT NULL,
    position INTEGER DEFAULT 0,              -- Order of items in the outfit display
    
    CONSTRAINT fk_outfit_items_outfit FOREIGN KEY (outfit_id) REFERENCES outfits(id) ON DELETE CASCADE,
    CONSTRAINT fk_outfit_items_clothing FOREIGN KEY (clothing_item_id) REFERENCES clothing_items(id) ON DELETE CASCADE,
    
    UNIQUE(outfit_id, clothing_item_id)      -- Prevent duplicates
);

CREATE INDEX idx_outfit_items_outfit ON outfit_items(outfit_id);
CREATE INDEX idx_outfit_items_clothing ON outfit_items(clothing_item_id);

-- ============================================
-- PLANNED OUTFITS (Weekly Calendar)
-- ============================================
-- Schedule outfits for specific dates
CREATE TABLE IF NOT EXISTS planned_outfits (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    outfit_id INTEGER NOT NULL,
    planned_date DATE NOT NULL,              -- The date this outfit is planned for
    notes TEXT,                              -- Optional notes (e.g., "Meeting with client")
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_planned_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_planned_outfit FOREIGN KEY (outfit_id) REFERENCES outfits(id) ON DELETE CASCADE,
    
    UNIQUE(user_id, planned_date)            -- One outfit per day per user
);

CREATE INDEX idx_planned_user_date ON planned_outfits(user_id, planned_date);

-- ============================================
-- OUTFIT SUGGESTIONS (Optional - for AI/suggestion features)
-- ============================================
-- Store suggested outfits from the suggestion engine
CREATE TABLE IF NOT EXISTS outfit_suggestions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    suggestion_data JSONB NOT NULL,          -- JSON with suggested item IDs
    reason TEXT,                             -- Why this was suggested (weather, occasion, etc.)
    is_accepted BOOLEAN DEFAULT FALSE,       -- Track if user saved this suggestion
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_suggestion_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_suggestions_user ON outfit_suggestions(user_id);

-- ============================================
-- USER PREFERENCES (Settings)
-- ============================================
CREATE TABLE IF NOT EXISTS user_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,
    theme VARCHAR(20) DEFAULT 'system',      -- 'light', 'dark', 'system'
    default_view VARCHAR(20) DEFAULT 'grid', -- 'grid', 'list'
    notifications_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_preferences_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- TAGS (Optional - for flexible categorization)
-- ============================================
CREATE TABLE IF NOT EXISTS tags (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(20) DEFAULT '#6B7280',     -- Tag color for UI display
    
    CONSTRAINT fk_tag_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, name)                    -- User can't have duplicate tag names
);

CREATE TABLE IF NOT EXISTS clothing_tags (
    clothing_item_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    
    CONSTRAINT fk_clothing_tags_clothing FOREIGN KEY (clothing_item_id) REFERENCES clothing_items(id) ON DELETE CASCADE,
    CONSTRAINT fk_clothing_tags_tag FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    
    PRIMARY KEY (clothing_item_id, tag_id)
);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at for users
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at for clothing_items
DROP TRIGGER IF EXISTS update_clothing_items_updated_at ON clothing_items;
CREATE TRIGGER update_clothing_items_updated_at
    BEFORE UPDATE ON clothing_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at for outfits
DROP TRIGGER IF EXISTS update_outfits_updated_at ON outfits;
CREATE TRIGGER update_outfits_updated_at
    BEFORE UPDATE ON outfits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at for user_preferences
DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON user_preferences;
CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VIEWS (Helpful queries)
-- ============================================

-- View: Clothing items with category names
CREATE OR REPLACE VIEW v_clothing_with_category AS
SELECT 
    ci.id,
    ci.user_id,
    ci.name,
    c.name AS category,
    ci.image_url,
    ci.color,
    ci.brand,
    ci.is_favorite,
    ci.created_at
FROM clothing_items ci
JOIN categories c ON ci.category_id = c.id;

-- View: Outfits with item count
CREATE OR REPLACE VIEW v_outfits_summary AS
SELECT 
    o.id,
    o.user_id,
    o.name,
    o.description,
    o.is_favorite,
    o.created_at,
    COUNT(oi.id) AS item_count
FROM outfits o
LEFT JOIN outfit_items oi ON o.id = oi.outfit_id
GROUP BY o.id;

-- View: Weekly planned outfits
CREATE OR REPLACE VIEW v_weekly_plan AS
SELECT 
    po.id,
    po.user_id,
    po.planned_date,
    EXTRACT(DOW FROM po.planned_date) AS day_of_week,
    o.name AS outfit_name,
    po.notes
FROM planned_outfits po
JOIN outfits o ON po.outfit_id = o.id;
