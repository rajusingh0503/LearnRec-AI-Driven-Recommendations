-- =============================================================================
-- Migration: V4__create_recommendation_analytics.sql
-- Description: Recommendation Analytics and CTR Telemetry Table
-- =============================================================================

CREATE TABLE IF NOT EXISTS recommendation_analytics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    metric_date DATE NOT NULL UNIQUE,
    total_recommendations_served INT NOT NULL DEFAULT 0,
    total_clicks INT NOT NULL DEFAULT 0,
    total_likes INT NOT NULL DEFAULT 0,
    total_dislikes INT NOT NULL DEFAULT 0,
    ctr_percentage DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    active_users_count INT NOT NULL DEFAULT 0,
    top_category_id BIGINT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_rec_analytics_category FOREIGN KEY (top_category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_rec_analytics_date (metric_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed baseline initial analytic metrics for the current week
INSERT INTO recommendation_analytics 
(metric_date, total_recommendations_served, total_clicks, total_likes, total_dislikes, ctr_percentage, active_users_count, top_category_id)
VALUES
(CURRENT_DATE(), 120, 48, 35, 4, 40.00, 15, 1)
ON DUPLICATE KEY UPDATE total_recommendations_served=VALUES(total_recommendations_served);
