# Sugar Plum Bakery Database Diagram

```mermaid
erDiagram
    users {
        string id PK
        string name
        string email UK
        string password
        boolean is_admin
        string avatar
        string phone
        json address
        json favorite_items
        json dietary_restrictions
        json notifications
        datetime last_login
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    products {
        string id PK
        string name
        text description
        decimal price
        enum category
        string image
        boolean in_stock
        int stock_quantity
        json ingredients
        json allergens
        json nutritional_info
        boolean is_featured
        decimal rating
        int num_reviews
        datetime created_at
        datetime updated_at
    }

    orders {
        string id PK
        string user_id FK
        json shipping_address
        enum payment_method
        json payment_result
        decimal tax_price
        decimal shipping_price
        decimal total_price
        enum status
        datetime delivered_at
        string order_number UK
        text notes
        datetime created_at
        datetime updated_at
    }

    order_items {
        string id PK
        string order_id FK
        string product_id FK
        string name
        int quantity
        decimal price
    }

    product_reviews {
        string id PK
        string product_id FK
        string user_id FK
        int rating
        text comment
        datetime created_at
    }

    shopping_cart {
        string id PK
        string user_id FK
        string product_id FK
        int quantity
        datetime added_at
    }

    coupons {
        string id PK
        string code UK
        string description
        enum discount_type
        decimal discount_value
        decimal minimum_order
        int usage_limit
        int used_count
        datetime valid_from
        datetime valid_until
        boolean is_active
        datetime created_at
    }

    order_coupons {
        string id PK
        string order_id FK
        string coupon_id FK
    }

    delivery_zones {
        string id PK
        string name
        json zip_codes
        decimal delivery_fee
        decimal minimum_order
        string estimated_delivery_time
        boolean is_active
    }

    store_locations {
        string id PK
        string name
        string address
        string city
        string state
        string zip_code
        string phone
        string email
        json hours
        boolean is_active
    }

    users ||--o{ orders : places
    users ||--o{ product_reviews : writes
    users ||--o{ shopping_cart : has

    products ||--o{ order_items : included_in
    products ||--o{ product_reviews : receives
    products ||--o{ shopping_cart : added_to

    orders ||--|{ order_items : contains
    orders ||--o{ order_coupons : uses

    coupons ||--o{ order_coupons : applied_to
```

## Database Relationships Explanation

### Core Entities

1. **Users**: Customer accounts with authentication and preferences
2. **Products**: Bakery items with pricing, inventory, and details
3. **Orders**: Customer purchases with shipping and payment info
4. **Order Items**: Individual products within an order

### Supporting Entities

5. **Product Reviews**: Customer feedback on products
6. **Shopping Cart**: Persistent cart storage for logged-in users
7. **Coupons**: Discount codes and promotions
8. **Order Coupons**: Junction table for coupon usage
9. **Delivery Zones**: Geographic delivery areas and fees
10. **Store Locations**: Physical bakery locations

### Key Relationships

- **Users → Orders**: One-to-many (customers place multiple orders)
- **Orders → Order Items**: One-to-many (orders contain multiple items)
- **Products → Order Items**: One-to-many (products appear in multiple orders)
- **Users → Product Reviews**: One-to-many (customers write multiple reviews)
- **Products → Product Reviews**: One-to-many (products receive multiple reviews)
- **Users → Shopping Cart**: One-to-many (customers have multiple cart items)
- **Products → Shopping Cart**: One-to-many (products can be in multiple carts)
- **Orders → Coupons**: Many-to-many (orders can use multiple coupons)

### Data Flow

1. **Registration/Login**: User creates account → stored in users table
2. **Browsing**: Products displayed from products table
3. **Cart Management**: Items added to shopping_cart table
4. **Checkout**: Order created in orders table, items moved to order_items
5. **Payment**: Payment details stored in orders.payment_result
6. **Fulfillment**: Order status updated, delivery tracking added
7. **Reviews**: Customers can review products they've purchased

### Indexing Strategy

- Primary keys on all tables
- Foreign key indexes for performance
- Unique constraints on email, order_number, coupon codes
- Full-text search index on product name/description
- Composite indexes for common query patterns

### Data Integrity

- Foreign key constraints ensure referential integrity
- Check constraints on numeric values (prices, quantities, ratings)
- Enum constraints on status fields and categories
- Unique constraints prevent duplicate data where appropriate