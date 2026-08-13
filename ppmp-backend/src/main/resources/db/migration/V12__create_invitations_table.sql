CREATE TABLE invitations (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token         VARCHAR(100) NOT NULL UNIQUE,
    project_id    UUID NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
    inviter_id    UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    email         VARCHAR(100) NOT NULL,
    member_role   VARCHAR(20) NOT NULL DEFAULT 'CONTRIBUTOR',
    status        VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    expires_at    TIMESTAMP NOT NULL,
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_invitations_token ON invitations (token);
CREATE INDEX idx_invitations_email ON invitations (email);
