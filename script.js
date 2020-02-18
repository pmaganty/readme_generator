const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile);

function promptUser() {
  return inquirer.prompt([
    {
      type: "input", //input, number, confirm, list, rawlist, expand, checkbox, password, editor
      name: "user_name",
      message: "What is your GitHub username?" //</user_will_provide_github_username>
    },
    {
      type: "input",
      name: "proj_name",
      message: "What is your project's name?"
    },
    {
      type: "input",
      name: "proj_description",
      message: "Please write a short description of your project."
    },
    {
      type: "input",
      name: "license_type",
      message: "What kind of license should your project have?" //User can choose from list of items
    },
    {
      type: "input",
      name: "dependency_command",
      message: "What command should be run to install dependencies?" //(default to "npm i" if user doesn't respond)
    },
    {
      type: "input",
      name: "run_test_command",
      message: "What command should be run to run tests?" //(default to "npm test" if user doesn't respond)
    },
    {
    type: "input",
    name: "usage_info",
    message: "What does the user need to know about using the repo?" 
    },
    {
    type: "input",
    name: "contribution_info",
    message: "What does the user need to know about contributing to the repo?" 
    }
  ]);
}

function generate_readme(answers) {
    var header = generateHeader(answers);
    return `
    ${header}
    ${answers.license_type}
    ${answers.dependency_command}
    ${answers.run_test_command}
    ${answers.usage_info}
    ${answers.contribution_info}
    `;
}

function generateHeader(answers) {
    return `
## Project: ${answers.proj_name}
## Author (github user): ${answers.user_name}
### Description: ${answers.proj_description}
    `
}
  
promptUser()
    .then(function(answers) {
        const readme_text = generate_readme(answers);

        return writeFileAsync("README.md", readme_text);
    })
    .then(function() {
        console.log("Successfully wrote to README.md");
    })
    .catch(function(err) {
        console.log(err);
    });