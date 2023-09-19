INSERT INTO
    departments (name, id)
VALUES
    ("Sales", 001),
    ("Engineering", 002),
    ("Finance", 003),
    ("Marketing", 004),
    ("Software", 005),
    ("HR", 006);

INSERT INTO roles (id, title, salary, department_id)
VALUES
    (001, "Sales Rep", 80000, 001),
    (002, "Lead Engineer", 150000, 002),
    (003, "Software Developer", 100000, 005),
    (004, "Electrical Engineer", 100000, 002),
    (005, "Mechanical Engineer", 120000, 002),
    (006, "Accountant", 80000, 003),
    (007, "Account Manager", 90000, 003),
    (008, "Product Design", 95000, 004),
    (009, "HR Rep", 75000, 006);

INSERT INTO employees (id, first_name, last_name, role_id)
VALUES
(001, "Jim", "Smith", 002),
(002, "Clark", "Kent", 005),
(003, "Emily", "Baily", 001),
(004, "Mikaela", "Moore", 008),
(005, "Anna", "Kollmorgen", 008),
(006, "Paige", "Husa", 005),
(007, "Deon", "Williams", 007),
(008, "Jane", "Shane", 009),
