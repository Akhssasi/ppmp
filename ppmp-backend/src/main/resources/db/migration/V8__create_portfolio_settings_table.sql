CREATE TABLE portfolio_settings (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL UNIQUE REFERENCES users (id) ON DELETE CASCADE,
    headline            VARCHAR(255),
    about_text          TEXT,
    theme               VARCHAR(50) DEFAULT 'default',
    show_github_stats   BOOLEAN NOT NULL DEFAULT TRUE,
    show_contact_form   BOOLEAN NOT NULL DEFAULT TRUE,
    custom_links        JSONB,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
