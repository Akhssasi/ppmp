CREATE TABLE project_files (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id    UUID NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
    uploader_id   UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    file_name     VARCHAR(255) NOT NULL,
    file_url      VARCHAR(1000) NOT NULL,
    file_type     VARCHAR(20) NOT NULL DEFAULT 'OTHER',
    file_size     BIGINT NOT NULL DEFAULT 0,
    uploaded_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_files_project ON project_files (project_id);
