const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const axios = require("axios");

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
      type: "list",
      name: "license_type",
      message: "What kind of license should your project have?", //User can choose from list of items
      choices: ['Apache 2.0','BSD 3-clause', 'BSD 2-clause']
    },
    {
      type: "input",
      name: "dependency_command",
      message: "What command should be run to install dependencies?", //(default to "npm i" if user doesn't respond)
      default: "npm i"
    },
    {
      type: "input",
      name: "run_test_command",
      message: "What command should be run to run tests?", //(default to "npm test" if user doesn't respond)
      default: "npm test"
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
    return `
## Project Title: ${answers.proj_name}
## Author (github user): ${answers.user_name}
### Description: ${answers.proj_description}
### Table of Contents:
    Installation.........................<pg#>
    Usage................................<pg#>
    License..............................<pg#>
    Contributing.........................<pg#>
    Tests................................<pg#>

### Installation:
Please use the following command to install dependencies --> **${answers.dependency_command}**
### Usage:
Refer to the information below before using this repo: \n
${answers.usage_info}
### Licenses:
You need the following licenses for this project: \n
${answers.license_type}
### Contributing:
Refere to the information below before contributing to this repo: \n
${answers.contribution_info}
### Tests: 
Please use the following command to run tests --> **${answers.run_test_command}**
### Questions:
    `;
}


promptUser()
    .then(function(answers) {
        const readme_text = generate_readme(answers);

        axios.get('https://api.github.com/users/' + answers.user_name)
        .then(function (response) {
            console.log("SUCCESS GRABBED RESPONSE");
            console.log(response.data.avatar_url);

            var img_url = response.data.avatar_url;
            var user_img = `![image info](${img_url})`;
            var license_badge;
            if(answers.license_type == 'Apache 2.0') {
                license_badge = `[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)`;
            } else if (answers.license_type == 'BSD 3-clause') {
                license_badge= `[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)`;
            } else if (answers.license_type == 'BSD 2-clause') {
                license_badge = `[![License](https://img.shields.io/badge/License-BSD%202--Clause-orange.svg)](https://opensource.org/licenses/BSD-2-Clause)`;
            }
    
            return writeFileAsync("generated_readme.md", license_badge + readme_text + "\n" + user_img);
        })
        .then(function() {
            console.log("Successfully wrote to generated_readme.md");
        })
        .catch(function(err) {
            console.log(err);
        });
    })
