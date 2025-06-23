import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

const token = Cypress.env('GOREST_PRIMARY_TOKEN');
let email;
const uuid = Date.now();

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
            expect(response.status).to.eq(200);
            cy.wrap(response).as('updatedUser');
            cy.log(`Now Username "${user.name}" updated to "${response.body.name}"`);
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
            expect(response.status).to.eq(200);
            cy.wrap(response).as('updatedUser');
            cy.log(`Username "${user.status}" updated to "${response.body.status}"`);

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

When("a new post stating {string} is created using user id", (post) =>{
    cy.get('@newUser').then(user => {
        cy.log(`User id : ${user.id}`);
        cy.request({
            method: 'POST',
            url: `/public/v2/users/${user.id}/posts`,
            headers: {
                authorization: `Bearer ${token}`
            },
            body: {
                title: `${uuid}_${user.id}`,
                body: post
            }
        }).then(response => {
            expect(response.status).to.eq(201);
            cy.wrap(response).as('newUserPost');
            cy.log(`Now User "${user.name}" has a new post of id "${response.body.id}" stating "${response.body.body}"`);
        })
    })
})

Then("user can fetch the post with {string} using user id",(post) => {
    cy.get('@newUserPost').then(userPost => {
        cy.request({
            method: 'GET',
            url: `/public/v2/users/${userPost.body.user_id}/posts`,
            headers: {
                authorization: `Bearer ${token}`
            }
        }).then(response => {
            expect(response.status).to.eq(200);
            const hasPostId = response.body.some(comment => comment.post_id === userPost.post_id);
            expect(hasPostId).to.be.true;
            cy.wrap(response.body).as('newUserPosts');
        })
    })
})

When("a new comment {string} is added using post id", (comment) =>{
    email = `user_${Math.floor(Math.random() * 100000)}@commentor.com`;
    cy.get('@newUserPost').then(post => {
        cy.log(`User id : ${post.body.user_id}`);
        cy.log(`Post id : ${post.body.id}`);
            cy.request({
                method: 'POST',
                url: `/public/v2/posts/${post.body.id}/comments`,
                headers: {
                    authorization: `Bearer ${token}`
                },
                body: {
                    post: 'true'    ,
                    name: 'Commenter Stroganoff',
                    email: email,
                    body: comment
                }
            }).then(response => {
                expect(response.status).to.eq(201);
                cy.wrap(response.body).as('newPostComment');
                cy.log(`Now User Post of id "${response.body.post_id}" has a comment from "${response.body.name}" and "${response.body.email}"`);
        })
    })
})

Then("user can fetch comment with {string} from post using post id",(comment) => {
    cy.get('@newUserPost').then(post => {
        cy.log(`User id : ${post.body.user_id}`);
        cy.log(`Post id : ${post.body.id}`); 
        cy.request({
            method: 'GET',
            url: `/public/v2/posts/${post.body.id}/comments`,
            headers: {
                authorization: `Bearer ${token}`
            }
            }).then(response => {
                expect(response.status).to.eq(200);
                const hasCommentId = response.body.some(comment => comment.id === response.body[0].id);
                //later fetch the comment id from response of '@newPostComment'
                expect(hasCommentId).to.be.true;
                expect(response.body[0].body).eq(comment);  
        })
    })
})