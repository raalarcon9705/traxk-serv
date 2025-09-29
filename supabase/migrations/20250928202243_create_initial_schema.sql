-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Service Providers table
CREATE TABLE service_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    business_name TEXT,
    commission_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clients table
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID REFERENCES service_providers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment Periods table
CREATE TABLE payment_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID REFERENCES service_providers(id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE,
    total_amount DECIMAL(10,2) DEFAULT 0.00,
    total_commission DECIMAL(10,2) DEFAULT 0.00,
    total_net_amount DECIMAL(10,2) DEFAULT 0.00,
    is_closed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_service_providers_user_id ON service_providers(user_id);
CREATE INDEX idx_clients_provider_id ON clients(provider_id);
CREATE INDEX idx_payment_periods_provider_id ON payment_periods(provider_id);
CREATE INDEX idx_payment_periods_is_closed ON payment_periods(is_closed);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_service_providers_updated_at 
    BEFORE UPDATE ON service_providers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at 
    BEFORE UPDATE ON clients 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_periods_updated_at 
    BEFORE UPDATE ON payment_periods 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- Row Level Security (RLS) policies
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_periods ENABLE ROW LEVEL SECURITY;

-- Service Providers policies
CREATE POLICY "Users can view their own service provider profile" ON service_providers
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own service provider profile" ON service_providers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own service provider profile" ON service_providers
    FOR UPDATE USING (auth.uid() = user_id);

-- Clients policies
CREATE POLICY "Users can view clients of their service provider" ON clients
    FOR SELECT USING (
        provider_id IN (
            SELECT id FROM service_providers WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert clients for their service provider" ON clients
    FOR INSERT WITH CHECK (
        provider_id IN (
            SELECT id FROM service_providers WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update clients of their service provider" ON clients
    FOR UPDATE USING (
        provider_id IN (
            SELECT id FROM service_providers WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete clients of their service provider" ON clients
    FOR DELETE USING (
        provider_id IN (
            SELECT id FROM service_providers WHERE user_id = auth.uid()
        )
    );

-- Payment Periods policies
CREATE POLICY "Users can view payment periods of their service provider" ON payment_periods
    FOR SELECT USING (
        provider_id IN (
            SELECT id FROM service_providers WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert payment periods for their service provider" ON payment_periods
    FOR INSERT WITH CHECK (
        provider_id IN (
            SELECT id FROM service_providers WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update payment periods of their service provider" ON payment_periods
    FOR UPDATE USING (
        provider_id IN (
            SELECT id FROM service_providers WHERE user_id = auth.uid()
        )
    );


-- Function to calculate payment period totals based on manual input
CREATE OR REPLACE FUNCTION update_payment_period_totals(
    p_period_id UUID,
    p_total_amount DECIMAL(10,2),
    p_commission_rate DECIMAL(5,2)
)
RETURNS VOID AS $$
DECLARE
    commission_amount DECIMAL(10,2);
    net_amount DECIMAL(10,2);
BEGIN
    -- Calculate commission amount
    commission_amount := p_total_amount * (p_commission_rate / 100);
    
    -- Calculate net amount (total - commission)
    net_amount := p_total_amount - commission_amount;
    
    -- Update the payment period totals
    UPDATE payment_periods 
    SET 
        total_amount = p_total_amount,
        total_commission = commission_amount,
        total_net_amount = net_amount,
        updated_at = NOW()
    WHERE id = p_period_id;
END;
$$ language 'plpgsql';
