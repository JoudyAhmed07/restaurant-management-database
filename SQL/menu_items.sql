-- 1. Create the MenuItems Table
CREATE TABLE MenuItems (
    ItemID INT AUTO_INCREMENT PRIMARY KEY,
    ItemName VARCHAR(100),
    Price DECIMAL(10,2),
    Description VARCHAR(255),
    MenuID INT,
    FOREIGN KEY (MenuID) REFERENCES Menu(MenuID)
);

-- 2. Insert the Food Items
INSERT INTO MenuItems (ItemName, Price, Description, MenuID) VALUES
    -- Breakfast Items (MenuID 1)
    ('Classic Pancakes', 12.00, 'Stack of 3 fluffy pancakes with syrup', 1),
    ('Eggs Benedict', 15.50, 'Poached eggs on english muffin', 1),
    ('Avocado Toast', 10.00, 'Sourdough bread with fresh avocado', 1),

    -- Lunch Items (MenuID 2)
    ('Cheeseburger', 18.00, 'Angus beef with cheddar and fries', 2),
    ('Caesar Salad', 14.00, 'Romaine lettuce with parmesan', 2),
    ('Spicy Chicken Wrap', 16.50, 'Grilled chicken with spicy mayo', 2),

    -- Dinner Items (MenuID 3)
    ('Ribeye Steak', 35.00, '12oz steak with mashed potatoes', 3),
    ('Grilled Salmon', 28.00, 'Fresh salmon with asparagus', 3),
    ('Truffle Pasta', 24.00, 'Creamy mushroom pasta with truffle oil', 3);