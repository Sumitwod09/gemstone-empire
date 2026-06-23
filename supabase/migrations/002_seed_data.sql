-- ============================================================
-- Gemstone Empire — Seed Data
-- Run this SECOND in Supabase SQL Editor after 001_schema.sql
-- ============================================================

-- ─── Categories ──────────────────────────────────────────────
insert into public.categories (name, slug, description, sort_order, is_active) values
  ('Diamond',     'diamond',     'Natural diamonds in round, cushion, pear, oval and fancy cuts', 1, true),
  ('Ruby',        'ruby',        'Natural rubies from Burma, Mozambique, and Sri Lanka', 2, true),
  ('Sapphire',    'sapphire',    'Blue, pink, and fancy sapphires from Ceylon and Kashmir', 3, true),
  ('Emerald',     'emerald',     'Colombian and Zambian emeralds', 4, true),
  ('Alexandrite', 'alexandrite',  'Color-change alexandrite from Brazil and Russia', 5, true),
  ('Tourmaline',  'tourmaline',  'Paraiba, rubellite, and chrome tourmalines', 6, true),
  ('Spinel',      'spinel',      'Burmese and Tanzanian spinels in vivid hues', 7, true)
on conflict (slug) do nothing;

-- ─── Products & Variants & Images ───────────────────────────
-- We use a DO block so we can reference category IDs by slug.

do $$
declare
  cat_diamond     uuid;
  cat_ruby        uuid;
  cat_sapphire    uuid;
  cat_emerald     uuid;
  cat_alexandrite uuid;
  cat_tourmaline  uuid;
  cat_spinel      uuid;
  pid uuid;
  vid uuid;
begin
  select id into cat_diamond     from public.categories where slug = 'diamond';
  select id into cat_ruby        from public.categories where slug = 'ruby';
  select id into cat_sapphire    from public.categories where slug = 'sapphire';
  select id into cat_emerald     from public.categories where slug = 'emerald';
  select id into cat_alexandrite from public.categories where slug = 'alexandrite';
  select id into cat_tourmaline  from public.categories where slug = 'tourmaline';
  select id into cat_spinel      from public.categories where slug = 'spinel';

  -- ══════ DIAMONDS ══════
  insert into public.products (name, slug, description, category_id, is_active, is_featured)
  values ('Round Brilliant Diamond', 'round-brilliant-diamond-1-52ct',
    'GIA-certified round brilliant cut diamond. D color, VVS1 clarity, triple-excellent cut grade. Maximum light performance and brilliance.',
    cat_diamond, true, true)
  returning id into pid;
  insert into public.gem_variants (product_id, sku, price, stock_qty, shape, carat_weight, color, color_grade, clarity, treatment, origin, cut_grade, length_mm, width_mm, depth_mm)
  values (pid, 'DIA-RD-152', 18500, 1, 'round', 1.52, 'D (Colorless)', 'D', 'VVS1', 'None', 'Botswana', 'Triple Excellent', 7.35, 7.38, 4.56)
  returning id into vid;
  insert into public.gem_images (variant_id, url, alt_text, is_primary) values (vid, '/images/diamond_round.png', 'Round Brilliant Diamond 1.52ct', true);

  insert into public.products (name, slug, description, category_id, is_active, is_featured)
  values ('Cushion Cut Diamond', 'cushion-cut-diamond-2-01ct',
    'Cushion modified brilliant diamond with soft rounded corners. E color, VS1 clarity, excellent symmetry.',
    cat_diamond, true, true)
  returning id into pid;
  insert into public.gem_variants (product_id, sku, price, stock_qty, shape, carat_weight, color, color_grade, clarity, treatment, origin, cut_grade, length_mm, width_mm, depth_mm)
  values (pid, 'DIA-CU-201', 22800, 1, 'cushion', 2.01, 'E (Colorless)', 'E', 'VS1', 'None', 'South Africa', 'Excellent', 7.12, 6.85, 4.68)
  returning id into vid;
  insert into public.gem_images (variant_id, url, alt_text, is_primary) values (vid, '/images/diamond_cushion.png', 'Cushion Cut Diamond 2.01ct', true);

  insert into public.products (name, slug, description, category_id, is_active, is_featured)
  values ('Emerald Cut Diamond', 'emerald-cut-diamond-2-33ct',
    'Sophisticated step-cut faceting creating a hall-of-mirrors effect. D color, IF clarity — museum-quality.',
    cat_diamond, true, false)
  returning id into pid;
  insert into public.gem_variants (product_id, sku, price, stock_qty, shape, carat_weight, color, color_grade, clarity, treatment, origin, cut_grade, length_mm, width_mm, depth_mm)
  values (pid, 'DIA-EM-233', 35600, 1, 'emerald', 2.33, 'D (Colorless)', 'D', 'IF', 'None', 'Botswana', 'Excellent', 8.72, 6.34, 4.25)
  returning id into vid;
  insert into public.gem_images (variant_id, url, alt_text, is_primary) values (vid, '/images/diamond_emerald_cut.png', 'Emerald Cut Diamond 2.33ct', true);

  -- ══════ RUBIES ══════
  insert into public.products (name, slug, description, category_id, is_active, is_featured)
  values ('Burmese Ruby', 'burmese-ruby-oval-2-35ct',
    'Unheated Burmese ruby displaying pigeon blood red color with exceptional saturation. Gübelin certified.',
    cat_ruby, true, true)
  returning id into pid;
  insert into public.gem_variants (product_id, sku, price, stock_qty, shape, carat_weight, color, clarity, treatment, origin, cut_grade, length_mm, width_mm, depth_mm)
  values (pid, 'RUB-OV-235', 4200, 1, 'oval', 2.35, 'Pigeon Blood Red', 'Eye-clean', 'Unheated', 'Burma', 'Excellent', 8.93, 7.05, 5.17)
  returning id into vid;
  insert into public.gem_images (variant_id, url, alt_text, is_primary) values (vid, '/images/gem_ruby.png', 'Burmese Ruby 2.35ct', true);

  insert into public.products (name, slug, description, category_id, is_active, is_featured)
  values ('Mozambique Ruby', 'mozambique-ruby-cushion-1-62ct',
    'Deep red Mozambique ruby with excellent transparency and strong fluorescence. Heat treated to industry standard.',
    cat_ruby, true, false)
  returning id into pid;
  insert into public.gem_variants (product_id, sku, price, stock_qty, shape, carat_weight, color, clarity, treatment, origin, cut_grade, length_mm, width_mm, depth_mm)
  values (pid, 'RUB-CU-162', 1950, 2, 'cushion', 1.62, 'Deep Red', 'Eye-clean', 'Heat', 'Mozambique', 'Very Good', 6.16, 4.86, 3.56)
  returning id into vid;
  insert into public.gem_images (variant_id, url, alt_text, is_primary) values (vid, '/images/gem_ruby.png', 'Mozambique Ruby 1.62ct', true);

  insert into public.products (name, slug, description, category_id, is_active, is_featured)
  values ('Sri Lankan Ruby', 'sri-lankan-ruby-round-1-10ct',
    'Bright pinkish-red Ceylon ruby with excellent clarity. Minor heat treatment enhances natural beauty.',
    cat_ruby, true, false)
  returning id into pid;
  insert into public.gem_variants (product_id, sku, price, stock_qty, shape, carat_weight, color, clarity, treatment, origin, cut_grade, length_mm, width_mm, depth_mm)
  values (pid, 'RUB-RD-110', 1450, 3, 'round', 1.10, 'Pinkish Red', 'VVS', 'Heat', 'Sri Lanka', 'Excellent', 5.80, 5.82, 3.90)
  returning id into vid;
  insert into public.gem_images (variant_id, url, alt_text, is_primary) values (vid, '/images/gem_ruby.png', 'Sri Lankan Ruby 1.10ct', true);

  -- ══════ SAPPHIRES ══════
  insert into public.products (name, slug, description, category_id, is_active, is_featured)
  values ('Ceylon Blue Sapphire', 'ceylon-blue-sapphire-cushion-3-12ct',
    'Royal blue Ceylon sapphire with outstanding transparency. Velvety blue hue characteristic of finest Sri Lankan material.',
    cat_sapphire, true, true)
  returning id into pid;
  insert into public.gem_variants (product_id, sku, price, stock_qty, shape, carat_weight, color, clarity, treatment, origin, cut_grade, length_mm, width_mm, depth_mm)
  values (pid, 'SAP-CU-312', 3800, 1, 'cushion', 3.12, 'Royal Blue', 'Eye-clean', 'Heat', 'Ceylon (Sri Lanka)', 'Excellent', 8.42, 7.10, 5.46)
  returning id into vid;
  insert into public.gem_images (variant_id, url, alt_text, is_primary) values (vid, '/images/gem_sapphire.png', 'Ceylon Blue Sapphire 3.12ct', true);

  insert into public.products (name, slug, description, category_id, is_active, is_featured)
  values ('Pink Sapphire', 'pink-sapphire-marquise-2-10ct',
    'Feminine hot pink sapphire from Sri Lanka with exceptional saturation. Marquise cut maximises colour yield.',
    cat_sapphire, true, false)
  returning id into pid;
  insert into public.gem_variants (product_id, sku, price, stock_qty, shape, carat_weight, color, clarity, treatment, origin, cut_grade, length_mm, width_mm, depth_mm)
  values (pid, 'SAP-MQ-210', 2200, 2, 'marquise', 2.10, 'Hot Pink', 'Eye-clean', 'Heat', 'Ceylon (Sri Lanka)', 'Very Good', 10.50, 5.80, 3.90)
  returning id into vid;
  insert into public.gem_images (variant_id, url, alt_text, is_primary) values (vid, '/images/gem_pink_sapphire.png', 'Pink Sapphire 2.10ct', true);

  insert into public.products (name, slug, description, category_id, is_active, is_featured)
  values ('Kashmir Sapphire', 'kashmir-sapphire-oval-1-05ct',
    'Exceptional cornflower blue Kashmir sapphire with famous velvety appearance. AGL certified. Museum quality.',
    cat_sapphire, true, false)
  returning id into pid;
  insert into public.gem_variants (product_id, sku, price, stock_qty, shape, carat_weight, color, clarity, treatment, origin, cut_grade, length_mm, width_mm, depth_mm)
  values (pid, 'SAP-OV-105K', 12500, 1, 'oval', 1.05, 'Cornflower Blue', 'VVS', 'Unheated', 'Kashmir', 'Excellent', 6.20, 5.10, 3.60)
  returning id into vid;
  insert into public.gem_images (variant_id, url, alt_text, is_primary) values (vid, '/images/gem_sapphire.png', 'Kashmir Sapphire 1.05ct', true);

  -- ══════ EMERALDS ══════
  insert into public.products (name, slug, description, category_id, is_active, is_featured)
  values ('Colombian Emerald', 'colombian-emerald-pear-1-85ct',
    'Vivid green Colombian emerald with characteristic warm green hue prized by collectors. Minor oil treatment.',
    cat_emerald, true, true)
  returning id into pid;
  insert into public.gem_variants (product_id, sku, price, stock_qty, shape, carat_weight, color, clarity, treatment, origin, cut_grade, length_mm, width_mm, depth_mm)
  values (pid, 'EME-PE-185', 2900, 1, 'pear', 1.85, 'Vivid Green', 'Eye-clean', 'Minor Oil', 'Colombia', 'Excellent', 9.20, 6.50, 4.10)
  returning id into vid;
  insert into public.gem_images (variant_id, url, alt_text, is_primary) values (vid, '/images/gem_emerald.png', 'Colombian Emerald 1.85ct', true);

  insert into public.products (name, slug, description, category_id, is_active, is_featured)
  values ('Zambian Emerald', 'zambian-emerald-octagon-2-40ct',
    'Deep bluish-green Zambian emerald with outstanding crystal clarity. Step-cut octagon shape.',
    cat_emerald, true, false)
  returning id into pid;
  insert into public.gem_variants (product_id, sku, price, stock_qty, shape, carat_weight, color, clarity, treatment, origin, cut_grade, length_mm, width_mm, depth_mm)
  values (pid, 'EME-OC-240', 3400, 1, 'octagon', 2.40, 'Bluish Green', 'Slightly Included', 'Minor Oil', 'Zambia', 'Very Good', 8.60, 6.80, 5.20)
  returning id into vid;
  insert into public.gem_images (variant_id, url, alt_text, is_primary) values (vid, '/images/gem_emerald.png', 'Zambian Emerald 2.40ct', true);

  insert into public.products (name, slug, description, category_id, is_active, is_featured)
  values ('Ethiopian Emerald', 'ethiopian-emerald-oval-1-20ct',
    'Bright vivid green Ethiopian emerald with exceptional transparency. A rising star in the emerald world.',
    cat_emerald, true, false)
  returning id into pid;
  insert into public.gem_variants (product_id, sku, price, stock_qty, shape, carat_weight, color, clarity, treatment, origin, cut_grade, length_mm, width_mm, depth_mm)
  values (pid, 'EME-OV-120', 1200, 3, 'oval', 1.20, 'Vivid Green', 'Eye-clean', 'None', 'Ethiopia', 'Good', 7.40, 5.60, 3.80)
  returning id into vid;
  insert into public.gem_images (variant_id, url, alt_text, is_primary) values (vid, '/images/gem_emerald.png', 'Ethiopian Emerald 1.20ct', true);

  -- ══════ ALEXANDRITE ══════
  insert into public.products (name, slug, description, category_id, is_active, is_featured)
  values ('Brazilian Alexandrite', 'brazilian-alexandrite-round-0-95ct',
    'Remarkable color-change alexandrite: teal green in daylight to purplish-red under incandescent. 70% color change.',
    cat_alexandrite, true, true)
  returning id into pid;
  insert into public.gem_variants (product_id, sku, price, stock_qty, shape, carat_weight, color, clarity, treatment, origin, cut_grade, length_mm, width_mm, depth_mm)
  values (pid, 'ALX-RD-095', 6200, 1, 'round', 0.95, 'Green / Purplish-Red', 'Eye-clean', 'Unheated', 'Brazil', 'Excellent', 5.50, 5.52, 3.60)
  returning id into vid;
  insert into public.gem_images (variant_id, url, alt_text, is_primary) values (vid, '/images/gem_alexandrite.png', 'Brazilian Alexandrite 0.95ct', true);

  insert into public.products (name, slug, description, category_id, is_active, is_featured)
  values ('Russian Alexandrite', 'russian-alexandrite-cushion-0-68ct',
    'Classic Ural Mountains alexandrite with strong blue-green to raspberry red change. Extremely rare origin.',
    cat_alexandrite, true, false)
  returning id into pid;
  insert into public.gem_variants (product_id, sku, price, stock_qty, shape, carat_weight, color, clarity, treatment, origin, cut_grade, length_mm, width_mm, depth_mm)
  values (pid, 'ALX-CU-068', 9800, 1, 'cushion', 0.68, 'Blue-Green / Raspberry', 'VVS', 'Unheated', 'Russia (Urals)', 'Very Good', 4.90, 4.40, 3.10)
  returning id into vid;
  insert into public.gem_images (variant_id, url, alt_text, is_primary) values (vid, '/images/gem_alexandrite.png', 'Russian Alexandrite 0.68ct', true);

  -- ══════ TOURMALINES ══════
  insert into public.products (name, slug, description, category_id, is_active, is_featured)
  values ('Paraiba Tourmaline', 'paraiba-tourmaline-oval-1-45ct',
    'Exceptional neon blue-green Paraiba from original Brazilian deposit. Copper-bearing. Extremely rare at this size.',
    cat_tourmaline, true, true)
  returning id into pid;
  insert into public.gem_variants (product_id, sku, price, stock_qty, shape, carat_weight, color, clarity, treatment, origin, cut_grade, length_mm, width_mm, depth_mm)
  values (pid, 'PAR-OV-145', 8500, 1, 'oval', 1.45, 'Neon Blue-Green', 'Eye-clean', 'Heat', 'Brazil (Paraiba)', 'Excellent', 7.80, 5.90, 4.10)
  returning id into vid;
  insert into public.gem_images (variant_id, url, alt_text, is_primary) values (vid, '/images/gem_paraiba.png', 'Paraiba Tourmaline 1.45ct', true);

  insert into public.products (name, slug, description, category_id, is_active, is_featured)
  values ('Rubellite Tourmaline', 'rubellite-tourmaline-trillion-1-88ct',
    'Intense pinkish-red rubellite from Mozambique. Trillion cut accentuates depth of colour.',
    cat_tourmaline, true, false)
  returning id into pid;
  insert into public.gem_variants (product_id, sku, price, stock_qty, shape, carat_weight, color, clarity, treatment, origin, cut_grade, length_mm, width_mm, depth_mm)
  values (pid, 'TOU-TR-188', 1100, 2, 'trillion', 1.88, 'Vivid Pinkish-Red', 'Eye-clean', 'Unheated', 'Mozambique', 'Very Good', 8.20, 8.18, 4.50)
  returning id into vid;
  insert into public.gem_images (variant_id, url, alt_text, is_primary) values (vid, '/images/gem_rubellite.png', 'Rubellite Tourmaline 1.88ct', true);

  insert into public.products (name, slug, description, category_id, is_active, is_featured)
  values ('Chrome Tourmaline', 'chrome-tourmaline-emerald-1-20ct',
    'Vivid grass-green chrome tourmaline from Tanzania. Coloured by chromium — same element that gives emeralds their green.',
    cat_tourmaline, true, false)
  returning id into pid;
  insert into public.gem_variants (product_id, sku, price, stock_qty, shape, carat_weight, color, clarity, treatment, origin, cut_grade, length_mm, width_mm, depth_mm)
  values (pid, 'TOU-EM-120', 780, 3, 'emerald', 1.20, 'Vivid Green', 'Eye-clean', 'Unheated', 'Tanzania', 'Good', 6.80, 5.10, 3.50)
  returning id into vid;
  insert into public.gem_images (variant_id, url, alt_text, is_primary) values (vid, '/images/gem_chrome_tourmaline.png', 'Chrome Tourmaline 1.20ct', true);

  -- ══════ SPINELS ══════
  insert into public.products (name, slug, description, category_id, is_active, is_featured)
  values ('Burmese Red Spinel', 'burmese-red-spinel-octagon-2-80ct',
    'Unheated red spinel from Mogok, Burma. Vivid red rivaling finest rubies. Increasingly sought by collectors.',
    cat_spinel, true, true)
  returning id into pid;
  insert into public.gem_variants (product_id, sku, price, stock_qty, shape, carat_weight, color, clarity, treatment, origin, cut_grade, length_mm, width_mm, depth_mm)
  values (pid, 'SPI-OC-280', 1800, 1, 'octagon', 2.80, 'Vivid Red', 'Eye-clean', 'Unheated', 'Burma (Mogok)', 'Excellent', 8.50, 7.20, 5.10)
  returning id into vid;
  insert into public.gem_images (variant_id, url, alt_text, is_primary) values (vid, '/images/gem_spinel.png', 'Burmese Red Spinel 2.80ct', true);

  insert into public.products (name, slug, description, category_id, is_active, is_featured)
  values ('Tanzanian Pink Spinel', 'tanzanian-pink-spinel-oval-1-95ct',
    'Vivid hot pink spinel from Mahenge, Tanzania. Electric neon saturation. One of the most desirable spinel colors.',
    cat_spinel, true, false)
  returning id into pid;
  insert into public.gem_variants (product_id, sku, price, stock_qty, shape, carat_weight, color, clarity, treatment, origin, cut_grade, length_mm, width_mm, depth_mm)
  values (pid, 'SPI-OV-195', 2400, 1, 'oval', 1.95, 'Hot Pink', 'Loupe-clean', 'Unheated', 'Tanzania (Mahenge)', 'Excellent', 8.10, 6.30, 4.40)
  returning id into vid;
  insert into public.gem_images (variant_id, url, alt_text, is_primary) values (vid, '/images/gem_spinel.png', 'Tanzanian Pink Spinel 1.95ct', true);

  insert into public.products (name, slug, description, category_id, is_active, is_featured)
  values ('Cobalt Blue Spinel', 'cobalt-blue-spinel-cushion-1-35ct',
    'Rare cobalt-bearing blue spinel from Sri Lanka. Intense vivid blue rivaling fine sapphires.',
    cat_spinel, true, false)
  returning id into pid;
  insert into public.gem_variants (product_id, sku, price, stock_qty, shape, carat_weight, color, clarity, treatment, origin, cut_grade, length_mm, width_mm, depth_mm)
  values (pid, 'SPI-CU-135', 5600, 1, 'cushion', 1.35, 'Vivid Blue', 'Eye-clean', 'Unheated', 'Sri Lanka', 'Excellent', 6.40, 5.80, 4.00)
  returning id into vid;
  insert into public.gem_images (variant_id, url, alt_text, is_primary) values (vid, '/images/gem_spinel.png', 'Cobalt Blue Spinel 1.35ct', true);

end;
$$;


-- ─── Sample Coupons ──────────────────────────────────────────
insert into public.coupons (code, discount_type, discount_value, min_order_value, max_uses, is_active, expires_at) values
  ('WELCOME10', 'percentage', 10.00, 100.00, 500, true, '2027-12-31T23:59:59Z'),
  ('FIRST50',   'flat',       50.00, 500.00, 200, true, '2027-12-31T23:59:59Z'),
  ('VIP20',     'percentage', 20.00, 2000.00, 50, true, '2027-06-30T23:59:59Z')
on conflict (code) do nothing;
