-- SQL Script to Seed Maa Sukriti Pharmaceuticals Database
-- Run this directly in your MySQL / TiDB query editor

-- 1. Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  composition VARCHAR(255) NOT NULL,
  packaging VARCHAR(255) NOT NULL,
  featured VARCHAR(10) DEFAULT 'false',
  status VARCHAR(50) DEFAULT 'active',
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  pdf_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create enquiries table
CREATE TABLE IF NOT EXISTS enquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(255),
  phone VARCHAR(30),
  city VARCHAR(255),
  state VARCHAR(255),
  company_name VARCHAR(255),
  products_json LONGTEXT,
  total_items INT,
  status VARCHAR(50) DEFAULT 'New',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password_hash TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Seed default admin (admin@mspbharat.com / password: admin123)
-- Password hash generated using bcrypt ($2a$10$7zV01yIeG0Q9u398rL4Zdu1oXzE9p8HhA9kE5vEpyCpx5L2qP/KqS)
INSERT IGNORE INTO admins (email, password_hash) 
VALUES ('admin@mspbharat.com', '$2a$10$7zV01yIeG0Q9u398rL4Zdu1oXzE9p8HhA9kE5vEpyCpx5L2qP/KqS');

-- 6. Seed default categories
INSERT IGNORE INTO categories (name, status) VALUES 
('Tablets', 'active'),
('Capsules', 'active'),
('Syrups', 'active'),
('Injections', 'active'),
('Ayurvedic', 'active'),
('Veterinary', 'active');

-- 7. Seed default products if empty
-- Note: Run this block to insert default formulations
INSERT INTO products (name, category, composition, packaging, featured, status, description, image_url, pdf_url)
SELECT * FROM (
  SELECT 'Paracetamol 650mg Tablets' AS name, 'Tablets' AS category, 'Paracetamol IP 650mg' AS composition, '10 x 10 Blister Pack' AS packaging, 'true' AS featured, 'active' AS status, 'Effective antipyretic and analgesic formulation. Indicated for fast relief from high fever, body pain, headache, and minor muscular aches.' AS description, '' AS image_url, '' AS pdf_url
  UNION ALL
  SELECT 'Amoxicillin 500mg Capsules', 'Capsules', 'Amoxicillin Trihydrate IP 500mg', '10 x 10 Blister Pack', 'true', 'active', 'Broad-spectrum penicillin antibiotic used to treat bacterial infections of the ear, nose, throat, urinary tract, and respiratory tract.', '', ''
  UNION ALL
  SELECT 'Pantoprazole 40mg Tablets', 'Tablets', 'Pantoprazole Sodium IP 40mg', '10 x 10 Alu-Alu Pack', 'true', 'active', 'Proton pump inhibitor (PPI) that decreases the amount of acid produced in the stomach. Prescribed for GERD, acid reflux, and peptic ulcers.', '', ''
  UNION ALL
  SELECT 'Cough & Cold Liquid Oral', 'Syrups', 'Dextromethorphan HBr 10mg + Phenylephrine HCl 5mg + Chlorpheniramine Maleate 2mg per 5ml', '100 ml Pet Bottle', 'false', 'active', 'Advanced non-drowsy formulation for quick symptomatic relief from dry cough, nasal congestion, throat irritation, and sneezing.', '', ''
  UNION ALL
  SELECT 'Multivitamin & Antioxidant Softgels', 'Capsules', 'Ginseng + Ginkgo Biloba + Green Tea Extract + Multivitamins + Minerals', '3 x 10 Blister Pack', 'true', 'active', 'Premium daily health supplement designed to boost immunity, improve cognitive performance, and reduce oxidative stress.', '', ''
  UNION ALL
  SELECT 'Ceftriaxone 1g Injection', 'Injections', 'Ceftriaxone Sodium IP 1g', 'Single Vial with WFI (Water for Injection)', 'true', 'active', 'Sterile cephalosporin antibiotic injection. Prescribed for severe bacterial infections including meningitis, sepsis, and surgical prophylaxis.', '', ''
  UNION ALL
  SELECT 'B-Complex with L-Lysine Syrup', 'Syrups', 'Thiamine 2mg + Riboflavin 2mg + Niacinamide 15mg + L-Lysine 100mg per 5ml', '200 ml Bottle', 'true', 'active', 'Essential vitamin B formulation enriched with amino acids. Promotes metabolic health, increases appetite, and treats nutritional deficiencies.', '', ''
  UNION ALL
  SELECT 'Pure Ashwagandha Extract Capsules', 'Ayurvedic', 'Withania Somnifera (Ashwagandha) Root Extract 500mg', '60 Veggie Capsules Bottle', 'false', 'active', 'Natural adaptogenic supplement. Helps reduce stress and anxiety, enhances muscle strength, boosts cognitive focus, and improves general energy.', '', ''
  UNION ALL
  SELECT 'Tulsi & Honey Herbal Cough Remedy', 'Ayurvedic', 'Ocimum Sanctum (Tulsi) + Adhatoda Vasica (Vasaka) + Honey base', '100 ml Pet Bottle', 'true', 'active', 'Pure Ayurvedic cough syrup. Relieves chest congestion, liquefies sputum, and soothes dry throat without drowsiness side effects.', '', ''
) AS tmp
WHERE NOT EXISTS (
    SELECT 1 FROM products LIMIT 1
);
