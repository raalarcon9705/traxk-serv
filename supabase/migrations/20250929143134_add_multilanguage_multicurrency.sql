-- Add language and currency support to service_providers table
ALTER TABLE service_providers 
ADD COLUMN language_code VARCHAR(5) DEFAULT 'pt' NOT NULL,
ADD COLUMN currency_code VARCHAR(3) DEFAULT 'BRL' NOT NULL;

-- Create indexes for better performance
CREATE INDEX idx_service_providers_language ON service_providers(language_code);
CREATE INDEX idx_service_providers_currency ON service_providers(currency_code);

-- Update the updated_at trigger to include the new columns
-- (The existing trigger will automatically handle these new columns)
