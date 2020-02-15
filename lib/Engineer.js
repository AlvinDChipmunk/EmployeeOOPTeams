/* 
child class Engineer will also have: 
	github // GitHub username 
	getGithub() 
	getRole() needs to return 'Engineer' 
*/

const Employee = require("./Employee");

class Engineer extends Employee {
    constructor(name, id, email, github) {

        this.role = "Engineer";
        this.github = github;

        super(name, id, email);
    }

    getGithub() { return this.github; }

}

module.exports = Engineer;