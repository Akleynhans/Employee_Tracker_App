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

const addRoleQs = [
    {
        type: 'input',
        name: 'roleName',
        message: 'Enter name of role:',
    },
    {
        type: 'input',
        name: 'roleSalary',
        message: 'Enter salary of role:',
    },
    {
        type: 'list',
        name: 'roleDepartment',
        message: 'Select department of role:',
        choices: [],
    },
];

const addEmployeeQs = [
    {
        type: 'input',
        name: 'employeeFirstName',
        message: 'Enter employee first name:',
    },
    {
        type: 'input',
        name: 'employeeLastName',
        message: 'Enter employee last name:',
    },
    {
        type: 'list',
        name: 'employeeRole',
        message: 'Select employee role:',
        choices: [],
    },
    {
        type: 'list',
        name: 'employeeManager',
        message: 'Select employee manager:',
        choices: [],
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

                db.query(`INSERT INTO departments (id, name) VALUES (10, '${answers.departmentName}')`, function (err, result) {
                    if (err) throw err;
                    console.log('New department has been added.');

                    init();
                })
            });

            

    }
    if (answer.toDo === 'add a role') {

        inquirer
            .prompt(addRoleQs)
            .then((answers) => {


            });

            init();

    }
    if (answer.toDo === 'add an employee') {

        inquirer
            .prompt(addEmployeeQs)
            .then((answers) => {


            });

            init();

    }
    if (answer.toDo === 'update an employee role') {

        inquirer
            .prompt(updateEmployeeQs)
            .then((answers) => {


            });

            init();

    }
};

// TODO: Create a function to initialize app
function init() {
    inquirer
        .prompt(mainQ)
        .then((answer) => {
            checkanswer(answer);
        });


};


// Function call to initialize app
init();
