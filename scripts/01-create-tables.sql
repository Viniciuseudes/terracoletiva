-- Terra Coletiva RN Database Schema

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('producer', 'seller')),
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT DEFAULT 'RN',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products catalog
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  unit TEXT NOT NULL,
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collective quotas created by producers
CREATE TABLE IF NOT EXISTS quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  producer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity DECIMAL(10, 2) NOT NULL,
  unit TEXT NOT NULL,
  target_price DECIMAL(10, 2) NOT NULL,
  delivery_location TEXT NOT NULL,
  delivery_latitude DECIMAL(10, 8),
  delivery_longitude DECIMAL(11, 8),
  delivery_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'completed', 'cancelled')),
  participants_count INTEGER DEFAULT 0,
  current_quantity DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bids from sellers
CREATE TABLE IF NOT EXISTS bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quota_id UUID NOT NULL REFERENCES quotas(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  price_per_unit DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  delivery_terms TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quota participants (producers joining a collective quota)
CREATE TABLE IF NOT EXISTS quota_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quota_id UUID NOT NULL REFERENCES quotas(id) ON DELETE CASCADE,
  producer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quantity DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(quota_id, producer_id)
);

-- Orders (when a bid is accepted)
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quota_id UUID NOT NULL REFERENCES quotas(id),
  bid_id UUID NOT NULL REFERENCES bids(id),
  seller_id UUID NOT NULL REFERENCES profiles(id),
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'delivered', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_quotas_producer ON quotas(producer_id);
CREATE INDEX IF NOT EXISTS idx_quotas_status ON quotas(status);
CREATE INDEX IF NOT EXISTS idx_bids_quota ON bids(quota_id);
CREATE INDEX IF NOT EXISTS idx_bids_seller ON bids(seller_id);
CREATE INDEX IF NOT EXISTS idx_quota_participants_quota ON quota_participants(quota_id);
CREATE INDEX IF NOT EXISTS idx_quota_participants_producer ON quota_participants(producer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller ON orders(seller_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE quota_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can view open quotas" ON quotas FOR SELECT USING (true);
CREATE POLICY "Producers can create quotas" ON quotas FOR INSERT WITH CHECK (auth.uid() = producer_id);
CREATE POLICY "Producers can update own quotas" ON quotas FOR UPDATE USING (auth.uid() = producer_id);

CREATE POLICY "Sellers can view bids on quotas" ON bids FOR SELECT USING (true);
CREATE POLICY "Sellers can create bids" ON bids FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Sellers can update own bids" ON bids FOR UPDATE USING (auth.uid() = seller_id);

CREATE POLICY "Anyone can view quota participants" ON quota_participants FOR SELECT USING (true);
CREATE POLICY "Producers can join quotas" ON quota_participants FOR INSERT WITH CHECK (auth.uid() = producer_id);
