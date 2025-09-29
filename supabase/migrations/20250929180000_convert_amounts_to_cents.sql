-- Convert all monetary amounts from decimal to cents (integers)
-- This improves precision and avoids floating point errors

BEGIN;

-- First, convert existing data to cents (multiply by 100)
UPDATE services 
SET 
  amount = ROUND(amount * 100),
  commission_amount = ROUND(commission_amount * 100),
  net_amount = ROUND(net_amount * 100),
  tip_amount = ROUND(COALESCE(tip_amount, 0) * 100)
WHERE amount IS NOT NULL;

-- Update payment_periods amounts to cents
UPDATE payment_periods 
SET 
  total_amount = ROUND(total_amount * 100),
  total_commission = ROUND(total_commission * 100),
  total_net_amount = ROUND(total_net_amount * 100)
WHERE total_amount IS NOT NULL;

-- Now change the column types to BIGINT (for cents)
-- Services table
ALTER TABLE services 
  ALTER COLUMN amount TYPE BIGINT,
  ALTER COLUMN commission_amount TYPE BIGINT,
  ALTER COLUMN net_amount TYPE BIGINT,
  ALTER COLUMN tip_amount TYPE BIGINT;

-- Payment periods table  
ALTER TABLE payment_periods
  ALTER COLUMN total_amount TYPE BIGINT,
  ALTER COLUMN total_commission TYPE BIGINT,
  ALTER COLUMN total_net_amount TYPE BIGINT;

-- Update the commission_rate to be stored as a percentage (0-100) instead of decimal (0-1)
-- This makes it clearer and avoids confusion
UPDATE service_providers 
SET commission_rate = commission_rate * 100
WHERE commission_rate < 1; -- Only update if it's stored as decimal (0-1)

-- Add comments to document the new storage format
COMMENT ON COLUMN services.amount IS 'Amount in cents (e.g., 2500 = $25.00)';
COMMENT ON COLUMN services.commission_amount IS 'Commission amount in cents';
COMMENT ON COLUMN services.net_amount IS 'Net amount in cents';
COMMENT ON COLUMN services.tip_amount IS 'Tip amount in cents';
COMMENT ON COLUMN payment_periods.total_amount IS 'Total amount in cents';
COMMENT ON COLUMN payment_periods.total_commission IS 'Total commission in cents';
COMMENT ON COLUMN payment_periods.total_net_amount IS 'Total net amount in cents';
COMMENT ON COLUMN service_providers.commission_rate IS 'Commission rate as percentage (e.g., 15.5 = 15.5%)';

COMMIT;
