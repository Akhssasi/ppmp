CREATE TABLE project_members (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id    UUID NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
    user_id       UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    role          VARCHAR(20) NOT NULL DEFAULT 'VIEWER',
    invited_at    TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    joined_at     TIMESTAMP,
    status        VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    UNIQUE (project_id, user_id)
);

CREATE INDEX idx_members_user ON project_members (user_id);
CREATE INDEX idx_members_status ON project_members (status);
