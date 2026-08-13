CREATE TABLE refresh_tokens (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    token         VARCHAR(500) NOT NULL UNIQUE,
    expiry_date   TIMESTAMP NOT NULL,
    created_date  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    revoked       BOOLEAN NOT NULL DEFAULT FALSE,
    device_info   VARCHAR(255)
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens (user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens (token);
