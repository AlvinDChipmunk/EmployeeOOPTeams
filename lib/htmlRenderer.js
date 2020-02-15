const fs = require("fs");
const inquirer = require("inquirer");
const util = require("util");
const Employee = require("./Employee");
const Intern = require("./Intern");
const Engineer = require("./Engineer");
const Manager = require("./Manager");

// global variables for team functions 

let whichNewMemberType = "Start";

let arrEmpTeam_01 = new Array();
let arrTakenEmpIds = new Array();

let blankResponse = "";
let aResponse = "";
let memberType = "";

let tmpEmp;
let tmpName;
let origTmpName;
let tmpID;
let tmpEmail;
let tmpRole;
let tmpOfficeNumber;
let tmpGitHub;
let tmpSchool;

let tmpHTMLfilename;
let sourceFilename;
let tmpFileContents;
let specialRoleString;
let lookForRoleString;
let specialRoleHTMLString;
let tmpEmpRow;
let tmpEmailLink;
let tmpIndexFile;

let tmpManager; let mgrName; let mgrId; let mgrEmail; let mgrOffNum;
let tmpEngineer; let engName; let engId; let engEmail; let engGitHub;
let tmpIntern; let intName; let intId; let intEmail; let intSchool;

let tmpWhatRole;

let empTableStart = "";
empTableStart += "						<table class='table' id='projectTeamTable'>\n";
empTableStart += "							<thead>\n";
empTableStart += "								<tr>\n";
empTableStart += "									<th>Employee Name</th>\n";
empTableStart += "									<th>Emp. ID</th>\n";
empTableStart += "									<th>E - Mail</th>\n";
empTableStart += "									<th>Role</th>\n";
empTableStart += "									<th>Special Info</th>\n";
empTableStart += "								</tr>\n";
empTableStart += "							</thead>\n";
empTableStart += "							<tbody class = 'teamMemberRows'>\n";


let empRowTemplate = "";
empRowTemplate += "								<tr>";
empRowTemplate += "									<td>!!name!!</td>";
empRowTemplate += "									<td>!!id!!</td>";
empRowTemplate += "									<td>!!email!!</td>";
empRowTemplate += "									<td>!!role!!</td>";
empRowTemplate += "									<td>!!special - info!!</td>";
empRowTemplate += "								</tr>";

let empTableContents = "";

let empTableEnd = "";
empTableEnd += "							</tbody>";
empTableEnd += "						</table>";

let empTableAll = "";

function pausedUntilAnyKeyPress() {
    inquirer.prompt({
        type: "input",
        message: "Press the Enter or Return key to continue.",
        name: "blankResponse"
    })
    return blankResponse;
}

function startInput() {
    console.log("Now starting a new work project team roster.");
    aResponse = pausedUntilAnyKeyPress();
}

function createNewManager() {
    // first get info for new manager 
    inquirer.prompt(
        [{ // Team Manager name section 
                type: "input",
                name: "mgrName",
                message: "Team Manager's Name?",
                validate: answer => {
                    return (
                        (answer !== "") ?
                        (true) :
                        ("Please enter at least one character for the manager's name.")
                    );
                }
            },
            { // Team Manager ID input section 
                type: "input",
                name: "mgrId",
                message: "Team Manager's ID? (Must be a unique numerical positive value.)",
                validate: answer => {
                    const isValidMgrID = answer.match(/^[1-9]\d*$/);
                    return (
                        (pass) ?
                        (true) :
                        ("Please enter a number greater than zero for the manager's ID.")
                    );
                }
            },
            { // Team Manager email input section 
                type: "input",
                name: "mgrEmail",
                message: "Team manager's email address?",
                validate: answer => {
                    const isValidMgrEmail = answer.match(/\S+@\S+\.\S+/);
                    return (
                        (isValidMgrEmail) ?
                        (true) :
                        ("Please enter a valid email address for the manager.")
                    );
                }
            },
            { // Team Manager email input section 
                type: "input",
                name: "mgrOffNum",
                message: "Team Manager's Office #?",
                validate: answer => {
                    const isValidMgrOffNum = answer.match(/^[1-9]\d*$/);
                    return (
                        (isValidMgrOffNum) ?
                        (true) :
                        ("Please enter a number greater than zero for the manager's office number.")
                    );
                }
            }
        ]
    ).then(answers => {
        // now formally add the manager to the database 
        tmpManager = new Manager(
            answers.mgrName,
            answers.mgrId,
            answers.mgrEmail,
            answers.mgrOffNum
        );

        arrEmpTeam_01.push(tmpManager);
        arrTakenEmpIds.push(answers.mgrId);
    });

    console.log("New manager created.");
    aResponse = pausedUntilAnyKeyPress();
}

function decideOnNewTeamMember() {
    // for choosing either new member type or quitting team member input 
    inquirer.prompt(
        [{
            type: "list",
            name: "whichNewMemberType",
            message: "Choose a team member type or quit to stop adding team members.(up & down arrows to move selector, enter to select)",
            choices: ["Engineer", "Intern", "Quit"]
        }]
    );

    return whichNewMemberType;
}

function createNewEngineer() {
    // first get info for new engineer 
    inquirer.prompt(
        [{ // New engineer's name
                type: "input",
                name: "engName",
                message: "New engineer's Name?",
                validate: answer => {
                    return (
                        (answer !== "") ?
                        (true) :
                        ("Please enter at least one character for the engineer's name.")
                    );
                }
            },
            { // New engineer's unique ID 
                type: "input",
                name: "engId",
                message: "New engineer's ID? (Must be a unique numerical positive value.)",
                validate: answer => {
                    const isValidEngID = answer.match(/^[1-9]\d*$/);

                    if (isValidEngID) {
                        if (arrTakenEmpIds.includes(answer)) {
                            return "This ID is already taken. Please enter a different number.";
                        } else { return true; }
                    } else { return "Please enter a positive number greater than zero."; };
                }
            },
            { // New engineer's email address 
                type: "input",
                message: "New engineer's email address?",
                name: "engEmail",
                validate: answer => {
                    const isValidEngEmail = answer.match(/\S+@\S+\.\S+/);

                    if (isValidEngEmail) { return true; } else { return "Please enter a valid email address for the engineer."; };
                }
            },
            { // New engineer's GitHub ID 
                type: "input",
                name: "engGitHub",
                message: "New engineer's GitHub ID?",
                validate: answer => {
                    return (
                        (answer !== "") ?
                        (true) :
                        ("Please enter at least one character for the engineer's GitHub ID.")
                    );
                }
            },
        ]
    ).then(answers => {
            // now formally add the engineer's information to the database 
            tmpEngineer = new Engineer(
                answers.engName,
                answers.engId,
                answers.engEmail,
                answers.engGitHub
            );

            // teamMembers.push(manager);
            arrEmpTeam_01.push(tmpManager);

            // have a mechanism in place where IDs are unique
            arrTakenEmpIds.push(answers.engId);

            console.log("New engineer created.");
            aResponse = pausedUntilAnyKeyPress();

        }
    );

    function createNewIntern() {
        // first get info for new intern 
        inquirer.prompt(
            [{ // New intern's name 
                    type: "input",
                    name: "intName",
                    message: "New intern's Name?",
                    validate: answer => {
                        if ( answer !== "" ) { return true; }
                        else { return "Please enter at least one character for the intern's name."; }
                    }
                },
                { // New intern's ID
                    type: "input",
                    name: "intId",
                    message: "New intern's ID?",
                    validate: answer => {
                        const isValidIntID = answer.match(/^[1-9]\d*$/);

                        if ( isValidIntID ) {
                            if ( arrTakenEmpIds.includes(answer) ) { return "This ID is already taken. Please enter a different number for the intern."; } 
                            else { return true; }
                        } 
                        else { return "Please enter a positive number greater than zero for the intern's ID number."; }
                    }
                },
                { // New intern's email address 
                    type: "input",
                    message: "New intern's email address?",
                    name: "intEmail",
                    validate: answer => {
                        const isValidIntEmail = answer.match(/\S+@\S+\.\S+/);

                        if ( isValidIntEmail ) { return true; } 
                        else { return "Please enter a valid email address for the intern."; }
                    }
                },
                { // New intern's school 
                    type: "input",
                    name: "intSchool",
                    message: "New intern's school?",
                    validate: answer => {
                        if ( answer !== "" ) { return true; } 
                        else { return "Please enter at least one character for the intern's school."; }
                    }
                }
            ]
        ).then(answers => {
            tmpIntern = new Intern(
                answers.intName,
                answers.intId,
                answers.intEmail,
                answers.intSchool
            );

            arrEmpTeam_01.push(tmpIntern);
            arrTakenEmpIds.push(answers.intId);
        });

        console.log("New intern created.");
        aResponse = pausedUntilAnyKeyPress();
    }

    function quitInput() {
        console.log("Now starting processing of team members.");
        aResponse = pausedUntilAnyKeyPress();
        whichNewMemberType = "Quit";
    }

    function getNewTeamMembers(whichNewMemberType) {
        while (whichNewMemberType != "Quit") {
            switch (whichNewMemberType) {
                case "Engineer":
                    createNewEngineer();
                    break;
                case "Intern":
                    createNewIntern();
                    break;
                case "Quit":
                    quitInput();
                    break;
                default:
                    quitInput();
                    break;
            }

            whichNewMemberType = decideOnNewTeamMember();
        }
    }

    startInput();
    createNewManager();
    memberType = decideOnNewTeamMember();
    getNewTeamMembers(memberType);

    arrEmpTeam_01.forEach(function(element) {

        tmpName = element.getName();
        tmpID = element.getId();
        tmpEmail = element.getEmail();
        tmpRole = element.getRole();

        switch (tmpRole) {
            case ("Manager"):
                {
                    tmpOfficeNumber = element.getOfficeNumber();
                    tmpHTMLfilename = "_Mgr.html";
                    sourceFilename = "manager.html";
                    specialRoleString = tmpOfficeNumber;
                    lookForRoleString = "/!! officeNumber !!/gi";
                    specialRoleHTMLString = "Office #: " + tmpOfficeNumber;
                }
                break;
            case ("Engineer"):
                {
                    tmpGitHub = element.getGithub();
                    tmpHTMLfilename = "_Eng.html";
                    sourceFilename = "engineer.html";
                    specialRoleString = tmpGitHub;
                    lookForRoleString = "/!! github !!/gi";
                    specialRoleHTMLString = "GitHub ID: " + tmpGitHub;
                }
                break;
            case ("Intern"):
                {
                    tmpSchool = element.getSchool();
                    tmpHTMLfilename = "_Int.html";
                    sourceFilename = "intern.html";
                    specialRoleString = tmpSchool;
                    lookForRoleString = "/!! school !!/gi";
                    specialRoleHTMLString = "School: " + tmpSchool;
                }
                break;
            default:
                {
                    tmpHTMLfilename = "_Emp.html";
                    sourceFilename = "employee.html";
                    specialRoleString = "";
                    lookForRoleString = "";
                    specialRoleHTMLString = "";
                }
                break;
        }

        fs.readFile(("../templates/" + sourceFilename), "utf8", function(err, data) {
            if (err) { return console.log(err); }
            tmpFileContents = data;
        });

        // in this section, we write the individual custom employee html file 
        origTmpName = tmpName;
        tmpName = tmpName.replace(/\s+/gi, '');
        tmpHTMLfilename = tmpName + tmpHTMLfilename;

        tmpFileContents = tmpFileContents.replace('/!! name !!/gi', origTmpName);
        tmpFileContents = tmpFileContents.replace('/!! id !!/gi', tmpID);

        // need to create an email link, not just do a simple text replacement
        tmpEmailLink = "Email: <a href=\"mailto:" + tmpEmail + "\">" + tmpEmail + "</a>"; 
        tmpFileContents = tmpFileContents.replace('/!! email !!/gi', tmpEmailLink);

        tmpFileContents = tmpFileContents.replace('/!! role !!/gi', tmpRole);
        tmpFileContents = tmpFileContents.replace(lookForRoleString, specialRoleString);

        fs.writeFile(("../" + tmpHTMLfilename), tmpFileContents, function(err) {
            if (err) { return console.log(err); }
            console.log("Success!");
        });

        // in this section, we create the html for the !! team !! location
        tmpEmpRow = empRowTemplate; // this resets tmpEmpRow for every entry in the array 
        tmpEmpRow = tmpEmpRow.replace('/!! name !!/gi', origTmpName);
        tmpEmpRow = tmpEmpRow.replace('/!! id !!/gi', tmpID);
        tmpEmpRow = tmpEmpRow.replace('/!! email !!/gi', tmpEmailLink);
        tmpEmpRow = tmpEmpRow.replace('/!! role !!/gi', tmpRole);
        tmpEmpRow = tmpEmpRow.replace('/!! special-info !!/gi', specialRoleHTMLString);

        empTableContents += tmpEmpRow;
    });

    // build the html table to insert
    empTableAll = empTableStart + empTableContents + empTableEnd;

    // start creating the index file by reading the source file
    fs.readFile("../templates/main.html", "utf8", function(err, data) {
        if (err) { return console.log(err); }
        tmpIndexFile = data;
    });

    // replace the placeholder with the actual data
    tmpIndexFile = tmpIndexFile.replace('/!! team !!/gi', empTableAll);

    // now write the new index file
    fs.writeFile("../index.html", tmpIndexFile, function(err) {
        if (err) { return console.log(err); }
        console.log("Success!");
    });

    console.log("Index and individual employees' html files now created.");
    aResponse = pausedUntilAnyKeyPress();
}
