
CREATE TABLE category (
  id int NOT NULL ,
  name varchar(120) NOT NULL,
  description varchar(120) DEFAULT NULL,
  status tinyint(1) DEFAULT '1',
  create_at timestamp ,
  create_by varchar(255) DEFAULT NULL,
  parent_id int NOT NULL,
  PRIMARY KEY (id)
) 

CREATE TABLE customers (
  id int NOT NULL ,
  name varchar(120) NOT NULL,
  phone varchar(18) NOT NULL,
  email varchar(120) DEFAULT NULL,
  address varchar(120) DEFAULT NULL,
  description varchar(120) DEFAULT NULL,
  create_by varchar(120) DEFAULT NULL,
  create_at timestamp ,
  status tinyint(1) DEFAULT NULL,
  PRIMARY KEY (id)
) 

CREATE TABLE expenses (
  id int NOT NULL ,
  description varchar(255) DEFAULT NULL,
  amount decimal(10,2) NOT NULL DEFAULT '0.00',
  expense_date timestamp ,
  create_by varchar(120) DEFAULT NULL,
  create_at timestamp ,
  expense_type varchar(120) DEFAULT NULL,
  payment_method varchar(120) DEFAULT NULL,
  vendor_payee varchar(120) DEFAULT NULL,
  PRIMARY KEY (id)
)  

CREATE TABLE order_detail (
  id int NOT NULL ,
  order_id int DEFAULT NULL,
  product_id int DEFAULT NULL,
  qty int DEFAULT NULL,
  price decimal(7,2) DEFAULT NULL,
  discount decimal(7,2) DEFAULT NULL,
  total decimal(7,2) DEFAULT NULL,
  sugarLevel varchar(120) DEFAULT NULL,
  PRIMARY KEY (id),
  KEY order_id (order_id),
  KEY product_id (product_id),
  CONSTRAINT order_detail_ibfk_1 FOREIGN KEY (order_id) REFERENCES orders (id),
  CONSTRAINT order_detail_ibfk_2 FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) 

CREATE TABLE orders (
  id int NOT NULL ,
  order_no varchar(120) NOT NULL,
  customer_id int DEFAULT NULL,
  user_id int DEFAULT NULL,
  paid_amount decimal(7,2) NOT NULL DEFAULT '0.00',
  payment_method varchar(120) NOT NULL,
  remark varchar(50) DEFAULT '0',
  create_by varchar(120) DEFAULT NULL,
  create_at timestamp ,
  total_amount decimal(7,2) NOT NULL,
  PRIMARY KEY (id),
  KEY customer_id (customer_id),
  KEY user_id (user_id),
  CONSTRAINT orders_ibfk_1 FOREIGN KEY (customer_id) REFERENCES customers (id),
  CONSTRAINT orders_ibfk_2 FOREIGN KEY (user_id) REFERENCES users (id)
)  
CREATE TABLE payment_orders (
  id int NOT NULL ,
  order_id int NOT NULL,
  qr text COLLATE,
  md5 varchar(255) COLLATE DEFAULT NULL,
  expiration bigint DEFAULT NULL,
  status varchar(20) COLLATE DEFAULT 'pending',
  paid tinyint(1) DEFAULT '0',
  paidAt datetime DEFAULT NULL,
  created_at date,
  bakongHash varchar(255) COLLATE DEFAULT NULL,
  fromAccountId varchar(255) COLLATE DEFAULT NULL,
  toAccountId varchar(255) COLLATE DEFAULT NULL,
  currency varchar(10) COLLATE DEFAULT NULL,
  amount decimal(12,2) DEFAULT NULL,
  description text COLLATE,
  externalRef varchar(255) COLLATE DEFAULT NULL,
  createdDateMs bigint DEFAULT NULL,
  acknowledgedDateMs bigint DEFAULT NULL,  
  receiverBankAccount varchar(255) COLLATE DEFAULT NULL, 
  PRIMARY KEY (id),
  UNIQUE KEY uniq_order_id (order_id),
  CONSTRAINT payment_orders_ibfk_1 FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
) 
CREATE TABLE products (
  id int NOT NULL ,
  category_id int DEFAULT NULL,
  name varchar(120) NOT NULL,
  brand varchar(120) NOT NULL,
  description varchar(120) DEFAULT NULL,
  price decimal(7,2) NOT NULL DEFAULT '0.00',
  status tinyint(1) DEFAULT '1',
  image varchar(255) DEFAULT NULL,
  create_by varchar(120) DEFAULT NULL,
  create_at timestamp ,
  discount decimal(5,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (id),
  KEY category_id (category_id),
  CONSTRAINT products_ibfk_1 FOREIGN KEY (category_id) REFERENCES category (id)
) 
CREATE TABLE roles (
  id int NOT NULL ,
  name varchar(50) NOT NULL,
  permission json DEFAULT NULL,
  created_at timestamp ,
  updated_at timestamp ,
  PRIMARY KEY (id)
) 

CREATE TABLE stock_coffee (
  id int NOT NULL ,
  supplier_id int DEFAULT NULL,
  product_name varchar(120) DEFAULT NULL,
  qty int DEFAULT NULL,
  description varchar(120) DEFAULT NULL,
  status tinyint DEFAULT '1',
  create_at timestamp ,
  cost decimal(7,2) DEFAULT NULL,
  update_at date,
  categories varchar(120) DEFAULT NULL,
  PRIMARY KEY (id),
  KEY supplier_id (supplier_id),
  CONSTRAINT stock_coffee_ibfk_1 FOREIGN KEY (supplier_id) REFERENCES supplier (id)
) 
CREATE TABLE stock_product (
  id int NOT NULL ,
  name_product varchar(120) DEFAULT NULL,
  qty int NOT NULL,
  supplier_id int DEFAULT NULL,
  description varchar(120) DEFAULT NULL,
  status tinyint DEFAULT '1',
  create_at timestamp ,
  cost decimal(7,2) DEFAULT NULL,
  brand_name varchar(120) DEFAULT NULL,
  create_by varchar(120) DEFAULT NULL,
  PRIMARY KEY (id),
  KEY supplier_id (supplier_id),
  CONSTRAINT stock_product_ibfk_1 FOREIGN KEY (supplier_id) REFERENCES supplier (id)
)  
CREATE TABLE supplier (
  id int NOT NULL ,
  name varchar(120) NOT NULL,
  phone varchar(18) DEFAULT NULL,
  email varchar(120) DEFAULT NULL,
  supplier_address text,
  description varchar(120) DEFAULT NULL,
  created_at timestamp ,
  create_by varchar(120) DEFAULT NULL,
  status tinyint(1) DEFAULT '1',
  PRIMARY KEY (id)
) 

CREATE TABLE users (
  id int NOT NULL ,
  role_id int DEFAULT '2',
  name varchar(120) NOT NULL,
  username varchar(120) NOT NULL,
  password varchar(120) NOT NULL,
  is_active tinyint(1) DEFAULT '1',
  create_by varchar(120) DEFAULT NULL,
  create_at timestamp ,
  PRIMARY KEY (id),
  KEY role_id (role_id),
  CONSTRAINT users_ibfk_1 FOREIGN KEY (role_id) REFERENCES roles (id)
) 

CREATE TABLE expenses (
  id INT PRIMARY KEY AUTO_INCREMENT, 
  amount DECIMAL(10,2) NOT NULL DEFAULT '0.00', 
  category_id INT,                 -- link to category
  payment_method VARCHAR(120),
  supplier_id INT,                 -- link to supplier
  create_by INT,                   -- link to users
  create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
  description varchar(255) DEFAULT NULL, 
  expense_date timestamp ,  
  expense_type varchar(120) DEFAULT NULL, 
  vendor_payee varchar(120) DEFAULT NULL, 
);