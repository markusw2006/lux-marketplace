-- Insert service categories and services
INSERT INTO public.services (id, category_slug, title_en, title_es, description_en, description_es, fixed_base_price, fixed_duration_minutes) VALUES
-- Cleaning Services
('550e8400-e29b-41d4-a716-446655440001', 'cleaning', 'Basic Cleaning Service', 'Servicio de Limpieza Básica', 'Professional cleaning for your home or office', 'Limpieza profesional para tu hogar u oficina', 50000, 120),
('550e8400-e29b-41d4-a716-446655440002', 'cleaning', 'Deep Cleaning Service', 'Servicio de Limpieza Profunda', 'Thorough deep cleaning including hard-to-reach areas', 'Limpieza profunda incluyendo áreas difíciles de alcanzar', 85000, 240),
('550e8400-e29b-41d4-a716-446655440003', 'cleaning', 'Move-in/Move-out Cleaning', 'Limpieza de Mudanza', 'Complete cleaning for moving in or out', 'Limpieza completa para mudanzas', 120000, 300),

-- Plumbing Services
('550e8400-e29b-41d4-a716-446655440004', 'plumbing', 'Faucet Replacement', 'Reemplazo de Grifo', 'Professional faucet installation and replacement', 'Instalación y reemplazo profesional de grifos', 65000, 90),
('550e8400-e29b-41d4-a716-446655440005', 'plumbing', 'Drain Unclogging', 'Destapado de Drenajes', 'Clear blocked drains and pipes', 'Limpieza de drenajes y tuberías bloqueadas', 45000, 60),
('550e8400-e29b-41d4-a716-446655440006', 'plumbing', 'Pipe Repair', 'Reparación de Tuberías', 'Repair leaking or damaged pipes', 'Reparación de tuberías con fugas o dañadas', 80000, 120),

-- Electrical Services  
('550e8400-e29b-41d4-a716-446655440007', 'electrical', 'Light Installation', 'Instalación de Luces', 'Install ceiling lights, chandeliers, and fixtures', 'Instalación de luces de techo, candelabros y accesorios', 55000, 75),
('550e8400-e29b-41d4-a716-446655440008', 'electrical', 'TV Mounting', 'Montaje de TV', 'Professional TV mounting on wall', 'Montaje profesional de TV en pared', 60000, 90),
('550e8400-e29b-41d4-a716-446655440009', 'electrical', 'Electrical Repairs', 'Reparaciones Eléctricas', 'Fix electrical issues and wiring problems', 'Reparación de problemas eléctricos y de cableado', 75000, 120),

-- Assembly Services
('550e8400-e29b-41d4-a716-44665544000a', 'assembly', 'Furniture Assembly', 'Armado de Muebles', 'Assembly of furniture from major retailers', 'Armado de muebles de grandes tiendas', 40000, 90),
('550e8400-e29b-41d4-a716-44665544000b', 'assembly', 'IKEA Assembly', 'Armado IKEA', 'Specialized IKEA furniture assembly', 'Armado especializado de muebles IKEA', 35000, 75),
('550e8400-e29b-41d4-a716-44665544000c', 'assembly', 'Appliance Setup', 'Instalación de Electrodomésticos', 'Setup and installation of home appliances', 'Configuración e instalación de electrodomésticos', 70000, 105);

-- Insert service addons
INSERT INTO public.service_addons (service_id, name_en, name_es, price_delta) VALUES
-- Cleaning addons
('550e8400-e29b-41d4-a716-446655440001', 'Inside Oven Cleaning', 'Limpieza Interior del Horno', 15000),
('550e8400-e29b-41d4-a716-446655440001', 'Inside Refrigerator', 'Interior del Refrigerador', 12000),
('550e8400-e29b-41d4-a716-446655440001', 'Garage Cleaning', 'Limpieza de Garaje', 25000),
('550e8400-e29b-41d4-a716-446655440002', 'Window Cleaning (Interior)', 'Limpieza de Ventanas (Interior)', 20000),
('550e8400-e29b-41d4-a716-446655440002', 'Cabinet Deep Clean', 'Limpieza Profunda de Gabinetes', 18000),

-- Plumbing addons  
('550e8400-e29b-41d4-a716-446655440004', 'Premium Faucet (+$50)', 'Grifo Premium (+$50)', 5000),
('550e8400-e29b-41d4-a716-446655440005', 'Camera Inspection', 'Inspección con Cámara', 15000),
('550e8400-e29b-41d4-a716-446655440006', 'Emergency Service', 'Servicio de Emergencia', 20000),

-- Electrical addons
('550e8400-e29b-41d4-a716-446655440007', 'Smart Switch Installation', 'Instalación de Interruptor Inteligente', 10000),
('550e8400-e29b-41d4-a716-446655440008', 'Cable Management', 'Gestión de Cables', 8000),
('550e8400-e29b-41d4-a716-446655440009', 'Circuit Testing', 'Prueba de Circuitos', 12000),

-- Assembly addons
('550e8400-e29b-41d4-a716-44665544000a', 'Wall Mounting', 'Montaje en Pared', 15000),
('550e8400-e29b-41d4-a716-44665544000b', 'Extra Complex Item', 'Artículo Extra Complejo', 10000),
('550e8400-e29b-41d4-a716-44665544000c', 'Disposal of Packaging', 'Eliminación de Embalaje', 5000);