describe('GoRest API Resource CRUD Tests', () => {
    const token = Cypress.env('goRest_primary_token');
    let email;
    const name = 'goRest Tester';
    const gender = "female";
    const status = "active";
    const post_title = Math.random().toString(36).substring(2, 8);
    let no_of_posts = 9

    beforeEach(() => {
        email = `cypress.gorest${Date.now()}@mailinator.com`;
        cy.createUserGoRest(token, email, name, gender, status).as('newUser');
        //cy.visit('/')
    })

    it('Create a new user successfully', () => {
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

    it('Update details of a new user successfully', () => {
        const updatedUserName = 'goRest Updated'
        cy.get('@newUser').then((user) => {
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
                expect(response.body.name).to.eq(updatedUserName);
            })
        })

    })

    it('Delete user successfully', () => {
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

    it(`Create ${no_of_posts} user posts successfully`, () => {
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
    //****************************END**************************    
})


describe('GoRest API Resource Property Tests', () => {

    it('Get all users and validate their properties', () => {
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
})