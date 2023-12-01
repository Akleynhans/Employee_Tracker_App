// required packages
const fs = require('fs');
const inquirer = require('inquirer');
const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        //MySQL password here
        password: 'rootroot',
        database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
);

// var roles = [];
// var managers = [];

// user input questions
const mainQ = [
    {
        type: 'list',
        name: 'toDo',
        message: 'What would you like to do?',
        choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role'],
    },
];

const addDepartmentQs = [
    {
        type: 'input',
        name: 'departmentName',
        message: 'Enter name of department:',
    },
];



// function to check answer and call resulting functions
function checkanswer(answer) {
    if (answer.toDo === 'view all departments') {
        // Query database
        db.query('SELECT * FROM departments', function (err, results) {
            console.table(results);
        });

        init();

    }
    if (answer.toDo === 'view all roles') {
        // Query database
        db.query('SELECT roles.id, roles.title, roles.salary, departments.name FROM roles LEFT JOIN departments ON roles.department_id = departments.id', function (err, results) {
            console.table(results);
        });
        init();
    }
    if (answer.toDo === 'view all employees') {
        // Query database
        db.query('SELECT employees.id, employees.first_name, employees.last_name, employees.manager_id, roles.title, roles.salary, departments.name FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id', function (err, results) {
            console.table(results);
        });
        init();
    }
    if (answer.toDo === 'add a department') {

        inquirer
            .prompt(addDepartmentQs)
            .then((answers) => {

                db.query(`INSERT INTO departments (name) VALUES ('${answers.departmentName}')`, function (err, result) {
                    if (err) throw err;
                    console.log('New department has been added.');

                    init();
                })
            });



    }
    if (answer.toDo === 'add a role') {

        getDepartments();

    }
    if (answer.toDo === 'add an employee') {

        addEmployee();

    }
    if (answer.toDo === 'update an employee role') {

        updateEmployeeRole();

    }
};

//function to initialize app
function init() {
    inquirer
        .prompt(mainQ)
        .then((answer) => {
            checkanswer(answer);
        });


};

function addRole(departments) {
    inquirer
        .prompt(
            [
                {
                    type: 'input',
                    name: 'title',
                    message: 'Enter name of role:',
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'Enter salary of role:',
                },
                {
                    type: 'list',
                    name: 'department_id',
                    message: 'Select department of role:',
                    choices: departments,
                },
            ]
        )
        .then((answers) => {
            db.query("INSERT INTO roles SET ?", answers, (err, results) => {
                if (err) throw err;
                console.log('New role has been added.');

                init();
            })

        });


}

function addEmployee() {

    db.query("SELECT title AS value, id FROM roles", function (err, roles) {
        if (err) throw err;
        console.log(roles.title);
        db.query("SELECT last_name AS value, id FROM employees", (err, managers) => {
            if (err) {
                console.log(err)
            }

            console.log(roles);
            inquirer
                .prompt(
                    [
                        {
                            type: 'input',
                            name: 'first_name',
                            message: 'Enter employee first name:',
                        },
                        {
                            type: 'input',
                            name: 'last_name',
                            message: 'Enter employee last name:',
                        },
                        {
                            type: 'list',
                            name: 'role_id',
                            message: 'Select employee role:',
                            choices: roles,
                        },
                        {
                            type: 'list',
                            name: 'manager_id',
                            message: 'Select employee manager:',
                            choices: managers,
                        },
                    ]
                )
                .then((answers) => {
                    db.query("INSERT INTO employees SET ?", answers, (err, results) => {
                        if (err) throw err;
                        console.log('New employee has been added.');

                        init();
                    })

                });
        })
    })


}

function getDepartments() {
    const sql = "SELECT id AS value, name FROM departments";

    db.query(sql, (err, departments) => {
        if (err) {
            console.log(err)
        }

        addRole(departments);
    })
}

function updateEmployeeRole() {

    db.query('SELECT * FROM employees', (err, result) => {

        if (err) throw (err);
        inquirer.prompt([

            {
                type: 'list',
                name: 'employeeSelect',
                message: 'Select employee you would like to update:',
                choices: function () {
                    const employeeList = [];
                    result.forEach(({ last_name }) => {
                        employeeList.push(last_name);
                    });
                    return employeeList;
                }
            },
        ])

            .then(function (answer) {
                const name = answer.employeeSelect;

                // create list to select new role
                db.query("SELECT * FROM roles", function (err, res) {
                    inquirer
                        .prompt([
                            {
                                name: "role",
                                type: "list",
                                message: "Select new role:",
                                choices: function () {
                                    var roleList = [];
                                    res.forEach(res => {
                                        roleList.push(
                                            res.title)
                                    })
                                    return roleList;
                                }
                            }
                        ]).then(function (selectedRole) {
                            const role = selectedRole.role;
                            // pull data for new selected role
                            db.query('SELECT * FROM roles WHERE title = ?', [role], function (err, res) {
                                if (err) throw (err);
                                let roleId = res[0].id;
                                let values = [parseInt(roleId), name]

                                db.query('UPDATE employees SET role_Id = ? WHERE last_name = ?', values,
                                    function (err, res, fields) {
                                        console.log(`Successfully updated role`);
                                        init();
                                    })
                            })
                        })
                })




            })
    })
}

// Function call to initialize app
init();
