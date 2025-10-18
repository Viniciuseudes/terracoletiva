-- Seed common agricultural products

INSERT INTO products (name, category, unit, description) VALUES
('Fertilizante NPK 10-10-10', 'Fertilizantes', 'kg', 'Fertilizante completo para uso geral'),
('Fertilizante NPK 20-05-20', 'Fertilizantes', 'kg', 'Fertilizante para frutíferas'),
('Calcário Dolomítico', 'Corretivos', 'ton', 'Correção de acidez do solo'),
('Ureia', 'Fertilizantes', 'kg', 'Fertilizante nitrogenado'),
('Superfosfato Simples', 'Fertilizantes', 'kg', 'Fonte de fósforo'),
('Cloreto de Potássio', 'Fertilizantes', 'kg', 'Fonte de potássio'),
('Herbicida Glifosato', 'Defensivos', 'L', 'Herbicida não seletivo'),
('Inseticida Deltametrina', 'Defensivos', 'L', 'Inseticida piretróide'),
('Fungicida Mancozeb', 'Defensivos', 'kg', 'Fungicida de contato'),
('Sementes de Milho', 'Sementes', 'kg', 'Sementes híbridas'),
('Sementes de Feijão', 'Sementes', 'kg', 'Sementes certificadas'),
('Ração para Gado', 'Ração', 'kg', 'Ração balanceada'),
('Sal Mineral', 'Suplementos', 'kg', 'Suplemento mineral para bovinos'),
('Adubo Orgânico', 'Fertilizantes', 'kg', 'Composto orgânico'),
('Lona para Estufa', 'Equipamentos', 'm²', 'Lona plástica para cobertura')
ON CONFLICT DO NOTHING;
