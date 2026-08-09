-- Made with consideration of Mysql, don't know if this code will run with postgres

CREATE DATABASE IF NOT EXISTS transpiler;
USE transpiler;

CREATE TABLE IF NOT EXISTS programs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    source_code TEXT NOT NULL,
    assembly_output TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS compile_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    program_id INT,
    success BOOLEAN,
    error_message TEXT,
    compiled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE
);
