use payment_db;
CREATE TABLE accounts1 (
    account_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    balance DECIMAL(10,2),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
    ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE account_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    account_id INT,
    action_type VARCHAR(10),  -- INSERT or UPDATE
    old_balance DECIMAL(10,2),
    new_balance DECIMAL(10,2),
    action_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Trigger for insert--
DELIMITER $$

CREATE TRIGGER after_account_insert
AFTER INSERT ON accounts1
FOR EACH ROW
BEGIN
    INSERT INTO account_logs(account_id, action_type, new_balance)
    VALUES (NEW.account_id, 'INSERT', NEW.balance);
END $$

DELIMITER ;

-- Trigger for update--
DELIMITER $$

CREATE TRIGGER after_account_update
AFTER UPDATE ON accounts1
FOR EACH ROW
BEGIN
    INSERT INTO account_logs(account_id, action_type, old_balance, new_balance)
    VALUES (OLD.account_id, 'UPDATE', OLD.balance, NEW.balance);
END $$

DELIMITER ;

-- Insert data--
INSERT INTO accounts1(name, balance) VALUES ('Aman', 1000);

-- Update data--
UPDATE accounts1 SET balance = 1500 WHERE account_id = 1;

-- Check logs--
SELECT * FROM account_logs;

-- Daily Activity Report--
CREATE VIEW daily_activity AS
SELECT 
    DATE(action_time) AS activity_date,
    COUNT(*) AS total_transactions,
    SUM(CASE WHEN action_type = 'INSERT' THEN 1 ELSE 0 END) AS total_inserts,
    SUM(CASE WHEN action_type = 'UPDATE' THEN 1 ELSE 0 END) AS total_updates
FROM account_logs
GROUP BY DATE(action_time);
SELECT * FROM daily_activity;
Select * from accounts1;

