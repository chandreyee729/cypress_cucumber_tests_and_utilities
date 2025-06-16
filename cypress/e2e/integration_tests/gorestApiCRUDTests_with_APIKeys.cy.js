describe('GoRest API Resource CRUD Tests', () => {
    const token = Cypress.env('goRest_primary_token');
    let email;
    const name = 'goRest User';
    const gender = "female";
    const status = "active";
    const post_title = Math.random().toString(36).substring(2, 8);
    let no_of_posts = 9

    beforeEach(() => {
        email = `cypress.gorest${Date.now()}@mailinator.com`;
        cy.createUserGoRest(token, email, name, gender, status).as('newUser');
        //cy.visit('/')
    })

    it('Should create a new user successfully', () => {
        cy.get('@newUser').then((user) => {
            cy.request({
                method: 'GET',
                url: `/public/v2/users/${user.id}`,
                headers: {
                    authorization: `Bearer ${token}`
                }
            }).then((userDetails) => {
                expect(userDetails.status).to.eq(200);
                expect(userDetails.body.email).to.eq(email);
            })
        })
    })

    it('Should update name and status of a user successfully when user id is known', () => {
        const updatedUserName = 'goRest Tester'
        cy.get('@newUser').then((user) => {
            cy.log(`Username during creation: ${user.name}`)
            cy.request({
                method: 'PUT',
                url: `/public/v2/users/${user.id}`,
                headers: {
                    authorization: `Bearer ${token}`
                },
                body: {
                    name: updatedUserName,
                    status: 'inactive'
                }
            }).then(response => {
                expect(response.status).to.eq(200);
                cy.log(`Username "${user.name}" updated to "${response.body.name}"`)
                cy.log(`Username "${user.status}" updated to "${response.body.status}"`)
                expect(response.body.name).to.eq(updatedUserName);
            })
        })
    })

    it('Should return error when updating user with unavailable id', () => {
        const randomUserId = '150a776'
        cy.get('@newUser').then((user) => {
            cy.log(`User_id during creation: ${user.id}`)
            cy.log(`But Requesting URL: /public/v2/users/${randomUserId}`)
            cy.request({
                method: 'PUT',
                url: `/public/v2/users/${randomUserId}`,
                headers: {
                    authorization: `Bearer ${token}`
                },
                body: {
                    name: 'Just a name',
                    status: 'inactive'
                },
            failOnStatusCode: false
            }).then(response => {
                expect(response.status).to.eq(404);
                cy.log(`Could not be updated because "${response.body.message}"`)
            })
        })
    })

    it('Should successfully delete user when user id is known', () => {
        cy.get('@newUser').then((user) => {
            const userId = user.id
            cy.request({
                method: 'DELETE',
                url: `/public/v2/users/${userId}`,
                headers: {
                    authorization: `Bearer ${token}`
                },
            }).then(response => {
                expect(response.status).to.eq(204);
            })
            cy.getUserGoRest(token, userId).then(response => {
                expect(response.status).to.eq(404);
            })
        })
    })

    it(`Should create ${no_of_posts} user posts successfully when user id is known`, () => {
        cy.get('@newUser').then(user => {
            const userId = user.id
            for (let post = 1; post <= no_of_posts; post++) {
                cy.request({
                    method: 'POST',
                    url: `/public/v2/users/${userId}/posts`,
                    headers: {
                        authorization: `Bearer ${token}`
                    },
                    body: {
                        title: post_title,
                        body: `This is a new post about ${post_title} that is created everytime this request is executed`
                    }
                }).then(response => {
                    expect(response.status).to.eq(201)
                })
            }
            cy.getUserPostsGoRest(token, userId).then(posts => {
                expect(posts.body.length).to.eq(no_of_posts);
            })
        })
    })
})

//****************************END**************************    


describe('GoRest API Resource Property Tests', () => {

    const token = Cypress.env('goRest_primary_token');
    
    it('Should get all users and validate their properties - id, email, name, gender and status', () => {
        cy.request('/public/v2/users').then(response => {
            expect(response.status).to.eq(200);
            response.body.forEach((user, index) => {
                expect(user).to.have.property('id').and.not.be.null;
                expect(user).to.have.property('email').and.not.be.null;
                expect(user).to.have.property('name').and.not.be.null;
                expect(user).to.have.property('gender').and.not.be.null;
                expect(user).to.have.property('status').and.not.be.null;
                //can also use below chai assertion
                //cy.wrap(user).should('have.property' , 'status').and('not.be.null');
                const formattedUser = JSON.stringify(user, null, 2);
                console.log(` User[${index}] is ${formattedUser}`);
            })
        })
    })

    it('Should prevent user creation with incorrect email format', () => {
        cy.log('Creating user with email abc.com')
        cy.request({
            method: 'POST',
            url: '/public/v2/users',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: {
                email: 'abc.com',
                name: 'ABC',
                gender: 'male',
                status: 'active'
            },
            failOnStatusCode: false
        }).then(response => {
            expect(response.status).to.eq(422);
            cy.log(`User could not be created because ${JSON.stringify(response.body)}`)
            return cy.wrap(response.body);
        })
    })
})