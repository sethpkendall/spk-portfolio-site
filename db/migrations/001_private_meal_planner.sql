CREATE SCHEMA IF NOT EXISTS private_planner;
CREATE TABLE private_planner.plans (
  owner_id text PRIMARY KEY,
  revision bigint NOT NULL DEFAULT 0 CHECK (revision >= 0)
);
CREATE TABLE private_planner.foods (
  owner_id text NOT NULL REFERENCES private_planner.plans(owner_id),
  id uuid NOT NULL,
  title text NOT NULL,
  normalized_title text NOT NULL,
  PRIMARY KEY (owner_id, id),
  UNIQUE (owner_id, normalized_title)
);
CREATE TABLE private_planner.meals (
  owner_id text NOT NULL REFERENCES private_planner.plans(owner_id),
  id uuid NOT NULL,
  date date NOT NULL,
  type text NOT NULL CHECK (type IN ('breakfast', 'lunch', 'dinner')),
  title text NOT NULL,
  instructions text NOT NULL DEFAULT '',
  tags text[] NOT NULL DEFAULT '{}',
  PRIMARY KEY (owner_id, id),
  UNIQUE (owner_id, date, type)
);
CREATE TABLE private_planner.recipes (
  owner_id text NOT NULL,
  id uuid NOT NULL,
  meal_id uuid NOT NULL,
  food_id uuid NOT NULL,
  quantity double precision NOT NULL CHECK (quantity > 0 AND quantity <= 1000000),
  unit text NOT NULL,
  sort_order integer NOT NULL CHECK (sort_order >= 0),
  PRIMARY KEY (owner_id, id),
  FOREIGN KEY (owner_id, meal_id) REFERENCES private_planner.meals(owner_id, id),
  FOREIGN KEY (owner_id, food_id) REFERENCES private_planner.foods(owner_id, id),
  UNIQUE (owner_id, meal_id, sort_order)
);
CREATE TABLE private_planner.groceries (
  owner_id text NOT NULL REFERENCES private_planner.plans(owner_id),
  id uuid NOT NULL,
  week_start date NOT NULL CHECK (EXTRACT(DOW FROM week_start) = 0),
  source_key text,
  title text NOT NULL,
  quantity double precision CHECK (quantity > 0 AND quantity <= 1000000),
  unit text NOT NULL DEFAULT '',
  checked boolean NOT NULL DEFAULT false,
  removed boolean NOT NULL DEFAULT false,
  is_freeform boolean NOT NULL,
  PRIMARY KEY (owner_id, id),
  UNIQUE (owner_id, week_start, source_key),
  CHECK ((is_freeform AND source_key IS NULL) OR (NOT is_freeform AND source_key IS NOT NULL))
);
-- Only the server database role is granted access. Never expose these tables
-- through a browser Data API or use this credential on the client.
REVOKE ALL ON SCHEMA private_planner FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA private_planner FROM PUBLIC;
