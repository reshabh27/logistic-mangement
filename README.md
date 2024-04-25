
# Todo

- add res.send method in auth catch 
- correct asyncerror handler for res sending because when we put wrong username it is not sending anything.








# Supply Data model


### Tables:

1. **User**
    - *Attributes:* UserID (PK), Username, Password, Role (Admin, Supplier, Customer, Warehouse Manager, Transport Manager), Email, ContactName, Phone , registrationDate
2. **Product**
    - *Attributes:* ProductID (PK), Name, Description, Category, Price, Weight
    - *Relationships:* Many-to-many with Supplier (through ProductSupplier), Many-to-many with Order (through OrderDetails)
3. **ProductSupplier**
    - *Attributes:* ProductSupplierID (PK), ProductID (FK), SupplierID (FK), SupplyPrice, LeadTime
    - *Relationships:* Many-to-one with Product, Many-to-one with Supplier
4. **Order**
    - *Attributes:* OrderID (PK), CustomerID (FK), OrderDate, DeliveryDate, Status
    - *Relationships:* Many-to-one with Customer, Many-to-many with Product (through OrderDetails), Many-to-many with Warehouse (through OrderWarehouse), One-to-many with users
5. **OrderDetails**
    - *Attributes:* OrderDetailsID (PK), OrderID (FK), ProductID (FK), Quantity, Price
    - *Relationships:* Many-to-one with Order, Many-to-one with Product
6. **Warehouse**
    - *Attributes:* WarehouseID (PK), Name, Location, Capacity
    - *Relationships:* Many-to-many with Product (through Inventory), Many-to-many with Order (through OrderWarehouse)
7. **Inventory**
    - *Attributes:* InventoryID (PK), WarehouseID (FK), ProductID (FK), Quantity, ReorderLevel
    - *Relationships:* Many-to-one with Warehouse, Many-to-one with Product
8. **OrderWarehouse**
    - *Attributes:* OrderWarehouseID (PK), OrderID (FK), WarehouseID (FK), DispatchDate, Quantity
    - *Relationships:* Many-to-one with Order, Many-to-one with Warehouse
9. **Transport**
    - *Attributes:* TransportID (PK), Type, Capacity, CostPerMile
    - *Relationships:* Many-to-many with Order (through OrderTransport)
10. **OrderTransport**
    - *Attributes:* OrderTransportID (PK), OrderID (FK), TransportID (FK), Distance, TotalCost
    - *Relationships:* Many-to-one with Order, Many-to-one with Transport

### Relationships:

- **User to Order**: This relationship allows customers to be linked to their orders.
- **User to Supplier**: This relationship allows suppliers to be linked to their user account.
- **Customer to User**: This relationship allows for the separation of customer information from user authentication and role management.

Role Based Access Details 

- **Admin**: Full access to all endpoints.
- **Supplier**: Access to endpoints related to products they supply and orders.
- **Customer**: Access to endpoints related to placing orders and viewing their order history.
- **Warehouse Manager**: Access to endpoints related to inventory and warehouse management.
- **Transport Manager**: Access to endpoints related to transport management.

## [Supply - UserMgmt]
    ### User Registration (Open to all)

- **POST /users/register**
    - **Description**: Register a new user.
    - **Request Body**: `{ "username": "john_doe", "password": "password123", "email": "john@example.com", "contactName": "John Doe", "phone": "1234567890" }`
    - **Response**: `{ "message": "User registered successfully", "user": { ... } }`

### User Login

- **POST /users/login**
    - **Description**: User login.
    - **Request Body**: `{ "username": "john_doe", "password": "password123" }`
    - **Response**: `{ "message": "Login successful", "token": "JWT_TOKEN" }`

### Get User Profile

- **GET /users/profile**
    - **Description**: Retrieve user profile information.
    - **Access**: Authenticated User
    - **Request Body**: None
    - **Response**: `{ "user": { ... } }`

### Update User Profile

- **PUT /users/profile**
    - **Description**: Update user profile information.
    - **Access**: Authenticated User
    - **Request Body**: `{ "email": "newemail@example.com", "contactName": "John D", "phone": "9876543210" }`
    - **Response**: `{ "message": "Profile updated successfully", "user": { ... } }`

### Update User Role (Admin only)

- **PUT /users/{userId}/role**
    - **Description**: Update the role of a user.
    - **Access**: Admin
    - **Request Body**: `{ "role": "warehouse_manager" }`
    - **Response**: `{ "message": "User role updated successfully", "user": { ... } }`

### List Users (Admin only)

- **GET /users**
    - **Description**: Retrieve a list of all users with optional filters and sorting based on all possible attributes.
    - **Access**: Admin
    - **Query Parameters**:
        - `role`: Filter users by their role (e.g., `customer`, `supplier`, `warehouse_manager`, `transport_manager`). Example: `/users?role=customer`
        - `username`: Filter users by their username. Supports partial matches. Example: `/users?username=john`
        - `sortBy`: Sort the results based on a specific field and order. Supported fields are `username`, `role`, `email`, `contactName`, and `phone`. Append `_asc` for ascending order or `_desc` for descending order. Example: `/users?sortBy=username_asc`
    - **Request Body**: None
    - **Response**: `{ "users": [ ... ] }`
    - **Note:** In this endpoint, the `role` and `username` filters allow you to narrow down the list of users based on specific criteria. The `sortBy` parameter enables you to sort the results based on a chosen field in either ascending or descending order. This provides flexibility in retrieving and organizing user data for administrative purposes.

### Delete User (Admin only)

- **DELETE /users/{userId}**
    - **Description**: Delete a user account.
    - **Access**: Admin
    - **Request Body**: None
    - **Response**: `{ "message": "User deleted successfully" }`



## [Supply - Product Mgmt]
### List Products

- **GET /products**
    - **Description**: Retrieve a list of all products with optional filters and sorting.
    - **Access**: Admin, Supplier, Customer
    - **Query Parameters**:
        - `name`: Filter by product name (e.g., `name=Widget`)
        - `category`: Filter by category (e.g., `category=Electronics`)
        - `price`: Filter by price range (e.g., `price=100-200`)
        - `weight`: Filter by weight range (e.g., `weight=1-5`)
        - `sortBy`: Sort by any attribute in ascending or descending order (e.g., `sortBy=price_asc`, `sortBy=name_desc`)
    - **Request Body**: None
    - **Response**: `{ "products": [ ... ] }`

### Get Product by ID

- **GET /products/{productId}**
    - **Description**: Retrieve a specific product's details.
    - **Access**: Admin, Supplier, Customer
    - **Request Body**: None
    - **Response**: `{ "product": { ... } }`

### Add Product (Supplier only)

- **POST /products**
    - **Description**: Add a new product.
    - **Access**: Supplier
    - **Request Body**: `{ "name": "New Widget", "description": "A new widget", "category": "Gadgets", "price": 150, "weight": 2 }`
    - **Response**: `{ "message": "Product added successfully", "product": { ... } }`

### Update Product (Supplier only)

- **PUT /products/{productId}**
    - **Description**: Update an existing product's details.
    - **Access**: Supplier
    - **Request Body**: `{ "name": "Updated Widget", "description": "An updated widget", "category": "Gadgets", "price": 160, "weight": 2.5 }`
    - **Response**: `{ "message": "Product updated successfully", "product": { ... } }`

### Delete Product (Supplier only)

- **DELETE /products/{productId}**
    - **Description**: Delete a product.
    - **Access**: Supplier
    - **Request Body**: None
    - **Response**: `{ "message": "Product deleted successfully" }`



## [Supply - OrderMgmt]
### List Orders

- **GET /orders**
    - **Description**: Retrieve a list of all orders with optional filters and sorting.
    - **Access**: Admin, Customer, Warehouse Manager
    - **Query Parameters**:
        - `customerId`: Filter by customer ID (e.g., `customerId=1`)
        - `orderDate`: Filter by order date (e.g., `orderDate=2024-03-15`)
        - `deliveryDate`: Filter by delivery date (e.g., `deliveryDate=2024-03-20`)
        - `status`: Filter by order status (e.g., `status=shipped`)
        - `sortBy`: Sort by any attribute in ascending or descending order (e.g., `sortBy=orderDate_asc`, `sortBy=deliveryDate_desc`)
    - **Request Body**: None
    - **Response**: `{ "orders": [ ... ] }`

### Get Order by ID

- **GET /orders/{orderId}**
    - **Description**: Retrieve a specific order's details.
    - **Access**: Admin, Customer (if their order), Warehouse Manager
    - **Request Body**: None
    - **Response**: `{ "order": { ... } }`

### Place Order (Customer only)

- **POST /orders**
    - **Description**: Place a new order.
    - **Access**: Customer
    - **Request Body**: `{ "customerId": 1, "orderDate": "2024-03-15", "deliveryDate": "2024-03-20", "products": [{ "productId": 1, "quantity": 2 }] }`
    - **Response**: `{ "message": "Order placed successfully", "order": { ... } }`

### Update Order Status (Admin, Warehouse Manager)

- **PUT /orders/{orderId}/status**
    - **Description**: Update the status of an order.
    - **Access**: Admin, Warehouse Manager
    - **Request Body**: `{ "status": "shipped" }`
    - **Response**: `{ "message": "Order status updated successfully", "order": { ... } }`

### Delete Order (Admin only)

- **DELETE /orders/{orderId}**
    - **Description**: Delete an order.
    - **Access**: Admin
    - **Request Body**: None
    - **Response**: `{ "message": "Order deleted successfully" }`


## [Supply - Warehouse Mgmt ]
    ### List Warehouses

- **GET /warehouses**
    - **Description**: Retrieve a list of all warehouses with optional filters and sorting.
    - **Access**: Admin, Warehouse Manager
    - **Query Parameters**:
        - `name`: Filter by warehouse name (e.g., `name=Central Warehouse`)
        - `location`: Filter by location (e.g., `location=New York`)
        - `capacity`: Filter by capacity range (e.g., `capacity=1000-5000`)
        - `sortBy`: Sort by any attribute in ascending or descending order (e.g., `sortBy=name_asc`, `sortBy=capacity_desc`)
    - **Request Body**: None
    - **Response**: `{ "warehouses": [ ... ] }`

### Get Warehouse by ID

- **GET /warehouses/{warehouseId}**
    - **Description**: Retrieve a specific warehouse's details.
    - **Access**: Admin, Warehouse Manager
    - **Request Body**: None
    - **Response**: `{ "warehouse": { ... } }`

### Add Warehouse (Admin only)

- **POST /warehouses**
    - **Description**: Add a new warehouse.
    - **Access**: Admin
    - **Request Body**: `{ "name": "New Warehouse", "location": "Chicago", "capacity": 3000 }`
    - **Response**: `{ "message": "Warehouse added successfully", "warehouse": { ... } }`

### Update Warehouse (Admin only)

- **PUT /warehouses/{warehouseId}**
    - **Description**: Update an existing warehouse's details.
    - **Access**: Admin
    - **Request Body**: `{ "name": "Updated Warehouse", "location": "Los Angeles", "capacity": 4000 }`
    - **Response**: `{ "message": "Warehouse updated successfully", "warehouse": { ... } }`

### Delete Warehouse (Admin only)

- **DELETE /warehouses/{warehouseId}**
    - **Description**: Delete a warehouse.
    - **Access**: Admin
    - **Request Body**: None
    - **Response**: `{ "message": "Warehouse deleted successfully" }`

### List Inventory in Warehouse

- **GET /warehouses/{warehouseId}/inventory**
    - **Description**: Retrieve a list of all inventory items in a specific warehouse.
    - **Access**: Admin, Warehouse Manager
    - **Request Body**: None
    - **Response**: `{ "inventory": [ ... ] }`

### Update Inventory in Warehouse (Warehouse Manager)

- **PUT /warehouses/{warehouseId}/inventory/{inventoryId}**
    - **Description**: Update the quantity of an inventory item in a warehouse.
    - **Access**: Warehouse Manager
    - **Request Body**: `{ "quantity": 500 }`
    - **Response**: `{ "message": "Inventory updated successfully", "inventory": { ... } }`

### Add Inventory Item (Warehouse Manager)

- **POST /inventory**
    - **Description**: Add a new inventory item to a warehouse.
    - **Access**: Warehouse Manager
    - **Request Body**: `{ "warehouseId": 1, "productId": 1, "quantity": 100, "reorderLevel": 20 }`
    - **Response**: `{ "message": "Inventory item added successfully", "inventory": { ... } }`

### Update Inventory Item (Warehouse Manager)

- **PUT /inventory/{inventoryId}**
    - **Description**: Update an existing inventory item's details.
    - **Access**: Warehouse Manager
    - **Request Body**: `{ "warehouseId": 1, "productId": 1, "quantity": 150, "reorderLevel": 30 }`
    - **Response**: `{ "message": "Inventory item updated successfully", "inventory": { ... } }`

### Delete Inventory Item (Warehouse Manager)

- **DELETE /inventory/{inventoryId}**
    - **Description**: Delete an inventory item from a warehouse.
    - **Access**: Warehouse Manager
    - **Request Body**: None
    - **Response**: `{ "message": "Inventory item deleted successfully" }`

### List Inventory by Product

- **GET /inventory/products/{productId}**
    - **Description**: Retrieve a list of all inventory items for a specific product across all warehouses.
    - **Access**: Admin, Warehouse Manager
    - **Request Body**: None
    - **Response**: `{ "inventory": [ ... ] }`


## [Supply - Transport Mgmt]

### List Transport Options

- **GET /transports**
    - **Description**: Retrieve a list of all transport options with optional filters and sorting.
    - **Access**: Admin, Transport Manager
    - **Query Parameters**:
        - `type`: Filter by transport type (e.g., `type=Truck`)
        - `capacity`: Filter by capacity range (e.g., `capacity=500-1000`)
        - `costPerMile`: Filter by cost per mile range (e.g., `costPerMile=1-2`)
        - `sortBy`: Sort by any attribute in ascending or descending order (e.g., `sortBy=type_asc`, `sortBy=capacity_desc`)
    - **Request Body**: None
    - **Response**: `{ "transports": [ ... ] }`

### Get Transport by ID

- **GET /transports/{transportId}**
    - **Description**: Retrieve a specific transport option's details.
    - **Access**: Admin, Transport Manager
    - **Request Body**: None
    - **Response**: `{ "transport": { ... } }`

### Add Transport Option (Admin only)

- **POST /transports**
    - **Description**: Add a new transport option.
    - **Access**: Admin
    - **Request Body**: `{ "type": "New Truck", "capacity": 800, "costPerMile": 1.5 }`
    - **Response**: `{ "message": "Transport option added successfully", "transport": { ... } }`

### Update Transport Option (Admin only)

- **PUT /transports/{transportId}**
    - **Description**: Update an existing transport option's details.
    - **Access**: Admin
    - **Request Body**: `{ "type": "Updated Truck", "capacity": 900, "costPerMile": 1.6 }`
    - **Response**: `{ "message": "Transport option updated successfully", "transport": { ... } }`

### Delete Transport Option (Admin only)

- **DELETE /transports/{transportId}**
    - **Description**: Delete a transport option.
    - **Access**: Admin
    - **Request Body**: None
    - **Response**: `{ "message": "Transport option deleted successfully" }`

### Assign Transport to Order (Transport Manager)

- **POST /orders/{orderId}/transport**
    - **Description**: Assign a transport option to an order.
    - **Access**: Transport Manager
    - **Request Body**: `{ "transportId": 1, "distance": 100 }`
    - **Response**: `{ "message": "Transport assigned to order successfully", "orderTransport": { ... } }`

### Update Transport Assignment (Transport Manager)

- **PUT /orders/{orderId}/transport/{orderTransportId}**
    - **Description**: Update the transport assignment for an order.
    - **Access**: Transport Manager
    - **Request Body**: `{ "transportId": 2, "distance": 120 }`
    - **Response**: `{ "message": "Transport assignment updated successfully", "orderTransport": { ... } }`

### Remove Transport from Order (Transport Manager)

- **DELETE /orders/{orderId}/transport/{orderTransportId}**
    - **Description**: Remove the transport assignment from an order.
    - **Access**: Transport Manager
    - **Request Body**: None
    - **Response**: `{ "message": "Transport removed from order successfully" }`




## [Supply - Dashboards]

### 1. User Management Dashboard (Admin)

- **Total Users**: Display the total number of users registered in the system.
- **Users by Role**: Show a breakdown of users by their roles (e.g., Admin, Supplier, Customer, etc.).
- **Recent Registrations**: List the most recent user registrations.
- **User Activity**: Graph showing user activity over time (e.g., login frequency).

### 2. Product Management Dashboard (Supplier)

- **Total Products**: Display the total number of products managed by the supplier.
- **Products by Category**: Show a breakdown of products by category.
- **Recent Additions**: List the most recently added products.
- **Top Selling Products**: Display the top-selling products based on order data.

### 3. Order Management Dashboard (Customer, Admin, Warehouse Manager)

- **Total Orders**: Display the total number of orders placed.
- **Orders by Status**: Show a breakdown of orders by their status (e.g., pending, shipped, delivered).
- **Recent Orders**: List the most recent orders placed.
- **Order Volume**: Graph showing order volume over time.

### 4. Warehouse Management Dashboard (Warehouse Manager, Admin)

- **Total Warehouses**: Display the total number of warehouses.
- **Inventory Levels**: Show current inventory levels in each warehouse.
- **Capacity Utilization**: Display the capacity utilization of each warehouse.
- **Reorder Alerts**: List items that are below the reorder level.

### 5. Inventory Management Dashboard (Warehouse Manager, Admin)

- **Total Inventory Items**: Display the total number of inventory items across all warehouses.
- **Stock by Product**: Show a breakdown of stock levels by product.
- **Low Stock Items**: List items that are low in stock.
- **Stock Movement**: Graph showing stock movement over time.

### 6. Transport Management Dashboard (Transport Manager, Admin)

- **Total Transport Options**: Display the total number of transport options available.
- **Transport Usage**: Show the usage of transport options for orders.
- **Cost Analysis**: Graph showing the cost of transport over time.
- **Transport Efficiency**: Display metrics related to transport efficiency (e.g., average delivery time, fuel consumption).

Note : 

Overall, most of the dashboard requirements can be met with the current data model. However, some requirements, such as User Activity, Recent Additions (for products), and Stock Movement, might require additional attributes or tables to track the necessary data over time.

### 1. User Management Dashboard

- **Total Users**: Can be achieved by counting entries in the User table.
- **Users by Role**: Can be achieved by grouping and counting entries in the User table based on the Role attribute.
- **Recent Registrations**: Can be achieved if there is a timestamp attribute (e.g., CreatedAt) in the User table to track registration time.
- **User Activity**: Can be achieved if there is a way to track user activity, such as login timestamps or activity logs.

### 2. Product Management Dashboard

- **Total Products**: Can be achieved by counting entries in the Product table.
- **Products by Category**: Can be achieved by grouping and counting entries in the Product table based on the Category attribute.
- **Recent Additions**: Can be achieved if there is a timestamp attribute (e.g., CreatedAt) in the Product table to track addition time.
- **Top Selling Products**: Can be achieved by analyzing the OrderDetails table to count the quantity of each product sold.

### 3. Order Management Dashboard

- **Total Orders**: Can be achieved by counting entries in the Order table.
- **Orders by Status**: Can be achieved by grouping and counting entries in the Order table based on the Status attribute.
- **Recent Orders**: Can be achieved if there is a timestamp attribute (e.g., OrderDate) in the Order table.
- **Order Volume**: Can be achieved by analyzing the Order table over time.

### 4. Warehouse Management Dashboard

- **Total Warehouses**: Can be achieved by counting entries in the Warehouse table.
- **Inventory Levels**: Can be achieved by analyzing the Inventory table for each warehouse.
- **Capacity Utilization**: Can be achieved by comparing the total capacity of each warehouse (Warehouse table) with the current inventory levels (Inventory table).
- **Reorder Alerts**: Can be achieved by analyzing the Inventory table for items below the reorder level.

### 5. Inventory Management Dashboard

- **Total Inventory Items**: Can be achieved by counting entries in the Inventory table.
- **Stock by Product**: Can be achieved by grouping and summing the quantity in the Inventory table based on the ProductID attribute.
- **Low Stock Items**: Can be achieved by filtering the Inventory table for items below a certain stock level.
- **Stock Movement**: Can be achieved if there is a way to track inventory changes over time, such as a transaction log.

### 6. Transport Management Dashboard

- **Total Transport Options**: Can be achieved by counting entries in the Transport table.
- **Transport Usage**: Can be achieved by analyzing the OrderTransport table to see how often each transport option is used.
- **Cost Analysis**: Can be achieved by analyzing the OrderTransport table for the total cost of each transport option over time.
- **Transport Efficiency**: Can be achieved if there are metrics available for each transport option, such as average delivery time or fuel consumption.

### 1. Simulating a Rollback

- Create an API endpoint that performs multiple database operations within a transaction.
- Intentionally introduce an error in one of the operations (e.g., trying to insert a duplicate value in a unique column).
- The transaction should automatically roll back due to the error, and none of the changes should be persisted in the database.

### 2. Demonstrating a Commit

- Create an API endpoint that performs multiple database operations within a transaction.
- Ensure all operations are successful.
- The transaction should commit, and all changes should be persisted in the database.

### 3. Showcasing Concurrency Control

- Create two API endpoints that modify the same piece of data simultaneously.
- Use different isolation levels for each transaction and observe the behavior (e.g., one transaction might see uncommitted changes made by the other, depending on the isolation level).

### 4. Implementing Locking

- Create an API endpoint that locks a row or table before performing an operation.
- While the first transaction is still open, try to access the locked row or table from another transaction. This second transaction should be blocked until the first one is completed.

### 5. Visualizing the Concepts

- Create a simple web interface or console output that shows the status of each operation, the transaction state (e.g., "Transaction started", "Rollback initiated", "Transaction committed"), and any errors that occur.
- This will help you visualize the flow of transactions and the effect of rollbacks, commits, and locks.