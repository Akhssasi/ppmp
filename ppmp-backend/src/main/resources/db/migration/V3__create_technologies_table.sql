CREATE TABLE technologies (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100) NOT NULL UNIQUE,
    category    VARCHAR(20)  NOT NULL DEFAULT 'OTHER',
    icon_url    VARCHAR(500),
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project_technologies (
    project_id      UUID NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
    technology_id   UUID NOT NULL REFERENCES technologies (id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, technology_id)
);

CREATE INDEX idx_project_tech_technology ON project_technologies (technology_id);
