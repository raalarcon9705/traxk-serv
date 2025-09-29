-- Seed data for development
-- This file will be executed when running `supabase db reset`

-- Insert a test service provider (this will be created when a user signs up)
-- Note: In a real scenario, this would be created through the application
-- when a user completes their profile setup

-- Example data for testing (commented out as it requires a real user_id)
/*
-- Example service provider
INSERT INTO service_providers (user_id, business_name, commission_rate) 
VALUES (
    '00000000-0000-0000-0000-000000000000', -- Replace with actual user_id
    'Barbería El Estilo',
    15.00
);

-- Example clients
INSERT INTO clients (provider_id, name, phone, email) VALUES
(
    (SELECT id FROM service_providers LIMIT 1),
    'Juan Pérez',
    '+1234567890',
    'juan@email.com'
),
(
    (SELECT id FROM service_providers LIMIT 1),
    'María García',
    '+1234567891',
    'maria@email.com'
),
(
    (SELECT id FROM service_providers LIMIT 1),
    'Carlos López',
    '+1234567892',
    'carlos@email.com'
);

-- Example payment period
INSERT INTO payment_periods (
    provider_id, 
    period_start, 
    period_end, 
    total_amount, 
    total_commission, 
    total_net_amount, 
    is_closed
) VALUES
(
    (SELECT id FROM service_providers LIMIT 1),
    '2024-01-01',
    '2024-01-31',
    80.00,  -- Total amount for the period
    12.00,  -- Commission (15% of 80)
    68.00,  -- Net amount (80 - 12)
    FALSE
);
*/
