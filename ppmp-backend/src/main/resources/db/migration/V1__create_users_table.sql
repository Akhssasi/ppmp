CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username            VARCHAR(50)  NOT NULL UNIQUE,
    email               VARCHAR(100) NOT NULL UNIQUE,
    password_hash       VARCHAR(255) NOT NULL,
    full_name           VARCHAR(100) NOT NULL,
    bio                 TEXT,
    avatar_url          VARCHAR(500),
    portfolio_slug      VARCHAR(100) UNIQUE,
    role                VARCHAR(20)  NOT NULL DEFAULT 'USER',
    is_active           BOOLEAN      NOT NULL DEFAULT TRUE,
    is_email_verified   BOOLEAN      NOT NULL DEFAULT FALSE,
    oauth_provider      VARCHAR(20),
    oauth_provider_id   VARCHAR(100),
    failed_login_attempts INTEGER    NOT NULL DEFAULT 0,
    locked_until        TIMESTAMP,
    password_reset_token VARCHAR(100),
    password_reset_token_expiry TIMESTAMP,
    email_verification_token VARCHAR(100),
    created_at          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_username ON users (username);
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_portfolio_slug ON users (portfolio_slug);
