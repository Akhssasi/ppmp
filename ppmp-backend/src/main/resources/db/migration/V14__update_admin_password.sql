-- Update SUPER_ADMIN password to "Admin1234!"
-- The password hash below is a BCrypt hash of "Admin1234!".
UPDATE users
SET password_hash = '$2a$12$dnHrAZCUvKlBQC7.gvyluuO9PYoooMNOA1WArYYy0GtDXHHtTcx0i'
WHERE username = 'admin'
  AND role = 'SUPER_ADMIN';
