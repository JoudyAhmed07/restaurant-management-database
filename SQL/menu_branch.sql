CREATE TABLE Menu (
  MenuID INT PRIMARY KEY,
  menu_type VARCHAR(50),
  menu_image VARCHAR(255)
);
CREATE TABLE Branch (
  BranchID INT PRIMARY KEY,
  name VARCHAR(100),
  location VARCHAR(255),
  phone_number VARCHAR(20),
  MenuID INT,
  FOREIGN KEY (MenuID) REFERENCES Menu(MenuID)
);
INSERT INTO Menu VALUES
(1, 'Breakfast', 'breakfast_menu.jpg'),
(2, 'Lunch', 'lunch_menu.jpg'),
(3, 'Dinner', 'dinner_menu.jpg');
INSERT INTO Branch VALUES
(1, 'Downtown Branch', '123 Nile St, Cairo', '01012345678', 1),
(2, 'Mall Branch', 'Mall of Egypt, 6th October', '01198765432', 2),
(3, 'Airport Branch', 'Cairo International Airport', '01234567890', 3),
(4, 'Alexandria Branch', 'Corniche Road, Alexandria', '01098765432', 2);
SELECT 
  Branch.name AS Branch_Name, 
  Branch.location AS Location, 
  Branch.phone_number AS Phone_Number, 
  Menu.menu_type AS Menu_Type
FROM Branch
JOIN Menu ON Branch.MenuID = Menu.MenuID;
SELECT 
  Menu.menu_type AS Menu_Type,
  COUNT(Branch.BranchID) AS Total_Branches
FROM Menu
JOIN Branch ON Menu.MenuID = Branch.MenuID
GROUP BY Menu.menu_type;
SELECT 
  Branch.name AS Branch_Name, 
  Branch.location AS Location
FROM Branch
JOIN Menu ON Branch.MenuID = Menu.MenuID
WHERE Menu.menu_type = 'Lunch';