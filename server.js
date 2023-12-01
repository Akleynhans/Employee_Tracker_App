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



const updateEmployeeQs = [
    {
        type: 'list',
        name: 'employeeSelect',
        message: 'Select employee you would like to update:',
        choices: [],
    },
    {
        type: 'list',
        name: 'employeeNewRole',
        message: 'Select employee role',
        choices: [],
    },
]

// function to check answer
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
        db.query('SELECT * FROM roles', function (err, results) {
            console.table(results);
        });
        init();
    }
    if (answer.toDo === 'view all employees') {
        // Query database
        db.query('SELECT * FROM employees', function (err, results) {
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

        inquirer
            .prompt(updateEmployeeQs)
            .then((answers) => {


            });

        init();

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




// Function call to initialize app
init();
