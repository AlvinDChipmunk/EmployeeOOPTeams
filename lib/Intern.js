/* 
child class Intern will also have:
	school 
	getSchool() 
	getRole() needs to return 'Intern' 
*/

const Employee = require("./Employee");

class Intern extends Employee {
    constructor(name, id, email, school) {

        this.role = "Intern";
        this.school = school;

        super(name, id, email);
    }

    getSchool() { return this.school; }

}

module.exports = Intern;