const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "dist");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// Array to hold employees generated
const employees = [];

// Array of questions for user to answer to generate employee profiles
const employeeQuestions = () => {
    inquirer.prompt([
        {
            // Employee name 
            type: 'input',
            name: 'name',
            message: 'What is the name of the employee you would like to add? (Required)',
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log('You must enter an employee name to continue');
                    return false;
                }
            }
        },
        {
            // Employee ID
            type: 'input',
            name: 'id',
            message: 'Provide the employee ID for the employee you would like to add (Required)',
            validate: idInput => {
                if (idInput) {
                    return true;
                } else {
                    console.log('You must enter an employee ID to continue');
                    return false;
                }
            }
        },
        {
            // Employee email
            type: 'input',
            name: 'email',
            message: 'Provide the email address of the employee you would like to add (Required)',
            validate: emailInput => {
                if (emailInput) {
                    return true;
                } else {
                    console.log('You must enter an email address to continue');
                    return false;
                }
            }
        },
        {
            // Role
            type: 'list',
            name: 'role',
            message: 'Select the employee role that applies to the employee you would like to add (Required).',
            choices: ['Intern', 'Engineer', 'Manager']
        }
    ])
    .then(function(employeeData) {
        switch(employeeData.role) {
            case 'Intern': internQuestions(employeeData);
            break;
            case 'Engineer': engineerQuestions(employeeData);
            break;
            case 'Manager': managerQuestions(employeeData);
            break;
        }
    })
};

// Continue questionaire with Intern specific questions
function internQuestions(employee) {
    inquirer.prompt([
        {
            // Intern's school
            type: 'input',
            name: 'school',
            message: 'What is the name of the school the intern attends? (Required)',
            validate: schoolInput => {
                if (schoolInput) {
                    return true;
                } else {
                    console.log('You must enter a school to continue');
                    return false;
                }
            }
        }
    ])
    .then(function(internData) {
        let addIntern = new Intern(employee.name, employee.id, employee.email, internData.school)
        employees.push(addIntern);
        init();
    })
};

// Continue questionaire with Engineer specific questions
function engineerQuestions(employee) {
    inquirer.prompt([
        {
            // Engineer's GitHub username
            type: 'input',
            name: 'github',
            message: "What is the Engineer's GitHub username? (Required)",
            validate: githubInput => {
                if (githubInput) {
                    return true;
                } else {
                    console.log('You must enter a GitHub username to continue');
                    return false;
                }
            }
        }
    ])
    .then(function(engineerData) {
        let addEngineer = new Engineer(employee.name, employee.id, employee.email, engineerData.github)
        employees.push(addEngineer);
        init();
    })
};

// Continue questionaire with Manager specific questions
function managerQuestions(employee) {
    inquirer.prompt([
        {
            // Manager's office number
            type: 'input',
            name: 'officeNumber',
            message: "What is the Manager's office number? (Required)",
            validate: officeNumberInput => {
                if (officeNumberInput) {
                    return true;
                } else {
                    console.log('You must enter an office number to continue');
                    return false;
                }
            }
        }
    ])
    .then(function(managerData) {
        let addManager = new Manager(employee.name, employee.id, employee.email, managerData.officeNumber)
        employees.push(addManager);
        init();
    })
}

function init() {
    inquirer.prompt([
        {
            // Continue or finish adding employees 
            type: 'input',
            name: 'done',
            message: "Would you like to add another employee? (Please enter YES or NO)",
            validate: doneInput => {
                if (doneInput) {
                    return true;
                } else {
                    console.log('You must enter YES or NO to continue');
                    return false;
                }
            }
        }
    ])
    .then(function(doneInput) {
        switch (doneInput.done) {
            case 'YES':
                employeeQuestions();
                break;
            case 'NO':
                const HTMLdata = render(employees);
                fs.writeFileSync(outputPath, HTMLdata, function(err) {
                    if (err) throw err;
                })
        }
    })
}

employeeQuestions();
