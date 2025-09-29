-- Services table to track individual services provided to clients
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID REFERENCES service_providers(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    payment_period_id UUID REFERENCES payment_periods(id) ON DELETE SET NULL,
    service_description TEXT NOT NULL,
    service_date DATE DEFAULT CURRENT_DATE,
    amount DECIMAL(10,2) NOT NULL,
    commission_rate DECIMAL(5,2) NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL,
    net_amount DECIMAL(10,2) NOT NULL,
    is_paid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_services_provider_id ON services(provider_id);
CREATE INDEX idx_services_client_id ON services(client_id);
CREATE INDEX idx_services_payment_period_id ON services(payment_period_id);
CREATE INDEX idx_services_date ON services(service_date);
CREATE INDEX idx_services_is_paid ON services(is_paid);

-- Create updated_at trigger for services
CREATE TRIGGER update_services_updated_at 
    BEFORE UPDATE ON services 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security for services
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Services policies
CREATE POLICY "Users can view services of their service provider" ON services
    FOR SELECT USING (
        provider_id IN (
            SELECT id FROM service_providers WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert services for their service provider" ON services
    FOR INSERT WITH CHECK (
        provider_id IN (
            SELECT id FROM service_providers WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update services of their service provider" ON services
    FOR UPDATE USING (
        provider_id IN (
            SELECT id FROM service_providers WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete services of their service provider" ON services
    FOR DELETE USING (
        provider_id IN (
            SELECT id FROM service_providers WHERE user_id = auth.uid()
        )
    );

-- Function to automatically calculate service amounts
CREATE OR REPLACE FUNCTION calculate_service_amounts()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate commission amount
    NEW.commission_amount = NEW.amount * (NEW.commission_rate / 100);
    
    -- Calculate net amount (amount - commission)
    NEW.net_amount = NEW.amount - NEW.commission_amount;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically calculate amounts for services
CREATE TRIGGER calculate_service_amounts_trigger
    BEFORE INSERT OR UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION calculate_service_amounts();

-- Function to update payment period totals when services change
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
    
    -- Update the payment period totals from services
    UPDATE payment_periods 
    SET 
        total_amount = (
            SELECT COALESCE(SUM(amount), 0) 
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

-- Trigger to update payment period totals from services
CREATE TRIGGER update_payment_period_from_services_trigger
    AFTER INSERT OR UPDATE OR DELETE ON services
    FOR EACH ROW EXECUTE FUNCTION update_payment_period_from_services();
