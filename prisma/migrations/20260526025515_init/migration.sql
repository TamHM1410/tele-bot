-- CreateTable
CREATE TABLE `test_model` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `external_raw_msg` LONGTEXT NULL,
    `converted_raw_msg` LONGTEXT NULL,
    `evn_type` VARCHAR(255) NULL,
    `msg_id` VARCHAR(255) NULL,
    `external_user_id` TEXT NULL,
    `external_episode_id` TEXT NULL,
    `status` TEXT NULL,
    `replay` BOOLEAN NOT NULL DEFAULT false,
    `fail_attempts` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `test_model_msg_id_key`(`msg_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
