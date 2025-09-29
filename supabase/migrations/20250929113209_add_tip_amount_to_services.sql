-- Add tip_amount column to services table
ALTER TABLE services ADD COLUMN tip_amount DECIMAL(10,2) DEFAULT 0.00;

-- Update the calculate_service_amounts function to include tips
CREATE OR REPLACE FUNCTION calculate_service_amounts()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate commission amount (only on service amount, not tips)
    NEW.commission_amount = NEW.amount * (NEW.commission_rate / 100);
    
    -- Calculate net amount (service amount - commission + tip)
    NEW.net_amount = (NEW.amount - NEW.commission_amount) + COALESCE(NEW.tip_amount, 0);
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Update the payment period totals function to include tips
CREATE OR REPLACE FUNCTION update_payment_period_from_services()
RETURNS TRIGGER AS $$
DECLARE
    period_id UUID;
BEGIN
    -- Get the payment period ID from the service
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        period_id := NEW.payment_period_id;
    ELSE
        period_id := OLD.payment_period_id;
    END IF;
    
    -- Update the payment period totals from services (including tips)
    UPDATE payment_periods 
    SET 
        total_amount = (
            SELECT COALESCE(SUM(amount + COALESCE(tip_amount, 0)), 0) 
            FROM services 
            WHERE payment_period_id = period_id
        ),
        total_commission = (
            SELECT COALESCE(SUM(commission_amount), 0) 
            FROM services 
            WHERE payment_period_id = period_id
        ),
        total_net_amount = (
            SELECT COALESCE(SUM(net_amount), 0) 
            FROM services 
            WHERE payment_period_id = period_id
        ),
        updated_at = NOW()
    WHERE id = period_id;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Create index for tip_amount column
CREATE INDEX idx_services_tip_amount ON services(tip_amount);
