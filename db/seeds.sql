INSERT INTO
    departments (name)
VALUES
    ("Sales"),
    ("Engineering"),
    ("Finance"),
    ("Marketing"),
    ("Software"),
    ("HR");

INSERT INTO
    roles (title, salary, department_id)
VALUES
    ("Sales Rep", 80000, 001),
    ("Lead Engineer", 150000, 002),
    ("Software Developer", 100000, 005),
    ("Electrical Engineer", 100000, 002),
    ("Mechanical Engineer", 120000, 002),
    ("Accountant", 80000, 003),
    ("Account Manager", 90000, 003),
    ("Product Design", 95000, 004),
    ("HR Rep", 75000, 006);

INSERT INTO
    employees (first_name, last_name, role_id, manager_id)
VALUES
    ("Jim", "Smith", 002, NULL),
    ("Clark", "Kent", 005, 1),
    ("Emily", "Baily", 001, 1),
    ("Mikaela", "Moore", 008, 1),
    ("Anna", "Kollmorgen", 008, 1);

