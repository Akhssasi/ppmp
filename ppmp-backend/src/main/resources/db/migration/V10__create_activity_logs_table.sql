CREATE TABLE activity_logs (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id    UUID NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
    user_id       UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    action        VARCHAR(100) NOT NULL,
    details       TEXT,
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_project ON activity_logs (project_id);
CREATE INDEX idx_activity_project_date ON activity_logs (project_id, created_at DESC);
