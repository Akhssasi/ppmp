CREATE TABLE milestones (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id    UUID NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
    title         VARCHAR(200) NOT NULL,
    description   TEXT,
    target_date   DATE,
    is_completed  BOOLEAN     NOT NULL DEFAULT FALSE,
    completed_at  TIMESTAMP,
    created_at    TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_milestones_project ON milestones (project_id);
