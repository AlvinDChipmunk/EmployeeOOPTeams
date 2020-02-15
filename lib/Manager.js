/* 
child class Manager will also have: 
	officeNumber 
	getRole() needs to return 'Manager' 
*/

const Employee = require("./Employee");

class Manager extends Employee {
    constructor(name, id, email, officeNumber) {

        this.role = "Manager";
        this.officeNumber = officeNumber;

        super(name, id, email);
    }

    getOfficeNumber() { return this.officeNumber; }
}

module.exports = Manager;