CREATE TABLE projects (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id            UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    title               VARCHAR(150) NOT NULL,
    short_description   VARCHAR(500),
    full_description    TEXT,
    status              VARCHAR(20)  NOT NULL DEFAULT 'PLANNING',
    visibility          VARCHAR(20)  NOT NULL DEFAULT 'PRIVATE',
    start_date          DATE,
    end_date            DATE,
    progress_percentage INTEGER      NOT NULL DEFAULT 0,
    repo_url            VARCHAR(500),
    live_demo_url       VARCHAR(500),
    video_demo_url      VARCHAR(500),
    thumbnail_url       VARCHAR(500),
    is_featured         BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_progress CHECK (progress_percentage BETWEEN 0 AND 100)
);

CREATE INDEX idx_projects_owner ON projects (owner_id);
CREATE INDEX idx_projects_status ON projects (status);
CREATE INDEX idx_projects_visibility ON projects (visibility);
CREATE INDEX idx_projects_featured ON projects (is_featured) WHERE is_featured = TRUE;
