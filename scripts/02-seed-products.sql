-- Seed common agricultural products

-- Seed de produtos focado nos itens essenciais

INSERT INTO products (name, category, unit, description) VALUES
('Milho (em grão)', 'Grãos', 'kg', 'Milho em grãos para ração'),
('Soja (em grão)', 'Grãos', 'kg', 'Soja em grãos para ração'),
('Torta de Algodão', 'Ração', 'kg', 'Suplemento proteico para ração animal'),
('Silagem de Milho', 'Volumosos', 'kg', 'Silagem de milho para alimentação de bovinos'),
('Sal Mineral', 'Suplementos', 'kg', 'Suplemento mineral para bovinos'),
('Ração para Tilápia', 'Ração', 'kg', 'Ração extrusada para tilápias em crescimento')
ON CONFLICT DO NOTHING;


