import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

const token = Cypress.env('goRest_primary_token');
let email;

Given("a {string} and {string} user {string} is created", (gender, status, name) => {
    email = `cypress.${name}${Date.now()}@mailinator.com`;
    cy.createUserGoRest(token, email, name, gender, status).as('newUser');
    cy.log(`Created user... ${name} with with email: ${email}`);
});

When("the User Name is updated to {string} using user id", (updatedUserName) => {
    cy.get('@newUser').then((user) => {
        cy.log(`Original user name : ${user.name}`)
        cy.request({
            method: 'PUT',
            url: `/public/v2/users/${user.id}`,
            headers: {
                authorization: `Bearer ${token}`
            },
            body: {
                name: updatedUserName,
            }
        }).then(response => {
            cy.wrap(response).as('updatedUser');
            cy.log(`Now Username "${user.name}" updated to "${response.body.name}"`)
        })
    })
});

When("the User Status is updated to {string} using user id", (newStatus) => {
    cy.get('@newUser').then((user) => {
        cy.log(`Original user status : ${user.status}`)
        cy.request({
            method: 'PUT',
            url: `/public/v2/users/${user.id}`,
            headers: {
                authorization: `Bearer ${token}`
            },
            body: {
                status: newStatus,
            }
        }).then(response => {
            cy.wrap(response).as('updatedUser');
            cy.log(`Username "${user.status}" updated to "${response.body.status}"`)

        })
    })
})

Then("the User's {string} is changed successfully to {string}", (userDetails, update) => {
    cy.get('@updatedUser').then((updateResponse) => {
        expect(updateResponse.status).to.eq(200);
        if (userDetails === "name") {
            expect(updateResponse.body.name).to.eq(update);
        }
        else if (userDetails === "gender") {
            expect(updateResponse.body.gender).to.eq(update);
        }
        else if (userDetails === "status") {
            cy.log(`User status is ${update}`);
            expect(updateResponse.body.status).to.eq(update, `User status is ${update}`);
        }
        else { cy.log("Only name or gender or status can be updated") }
    })
})