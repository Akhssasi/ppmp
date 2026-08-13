CREATE TABLE tasks (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id    UUID NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
    assigned_to   UUID REFERENCES users (id) ON DELETE SET NULL,
    title         VARCHAR(200) NOT NULL,
    description   TEXT,
    status        VARCHAR(20) NOT NULL DEFAULT 'TODO',
    priority      VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    due_date      DATE,
    created_at    TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_project ON tasks (project_id);
CREATE INDEX idx_tasks_assigned ON tasks (assigned_to);
CREATE INDEX idx_tasks_status ON tasks (status);
