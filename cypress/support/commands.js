// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
const project_ref = Cypress.env('SUPABASE_PROJECT_REFERENCE');

Cypress.Commands.add('supaBase_loginViaAPI', (email, password) => {
    cy.request({
        method: 'POST',
        url: `https://${project_ref}.supabase.co/auth/v1/token?grant_type=password`,
        headers: {
            apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpoYWd3eHR2bXJhc2tzb2Z2ZHNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMjUzODcsImV4cCI6MjA2NDcwMTM4N30.rQ5gzsm6Q9MsgFZLh3B_sjostUu5wXG9J3o2ONUcmpI',
            'Content-Type': 'application/json',
        },
        failOnStatusCode: false,
        body: {
            email: email,
            password: password
        },
    }).then(response => {
        expect(response.status).to.eq(200);
        return response;
    })
});

Cypress.Commands.add('supaBase_logInAndStoreSessionData', (email, password) => {
    cy.supaBase_loginViaAPI(email, password).then(response => {
        const { access_token, refresh_token, user } = response.body;
        const sessionData = {
            currentSession: {
                access_token,
                refresh_token,
            },
            user,
        };
        // ✅ Save session to localStorage
        window.localStorage.setItem(
            'supabase.dashboard.auth.token',
            JSON.stringify(sessionData)
        );
    })
});

Cypress.Commands.add('get_supaBase_AccessToken', () => {
    const storedSessionData = window.localStorage.getItem('supabase.dashboard.auth.token');
    const tokenData = JSON.parse(storedSessionData).currentSession.access_token;
    return tokenData;
});

//*********************** GORestAPI ***********************//
Cypress.Commands.add('createUserGoRest', (token, email, name, gender, status) => {
    //GoRest url resolves from cypress.config.js since the baseurl is defined with GoRest.
    cy.request({
        method: 'POST',
        url: '/public/v2/users',
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: {
            email: email,
            name: name,
            gender: gender,
            status: status
        }
    }).then(response => {
        expect(response.status).to.eq(201);
        cy.log(`User created with id: ${response.body.id}`)
        return cy.wrap(response.body);
    })
})

Cypress.Commands.add('getUserGoRest', (token, userId) => {
    cy.request({
        method: 'GET',
        url: `/public/v2/users/${userId}`,
        headers: {
            authorization: `Bearer ${token}`
        },
        failOnStatusCode: false
    }).then((userDetails) => {
        return cy.wrap(userDetails)
    })
})

Cypress.Commands.add('getUserPostsGoRest', (token, userId) => {
    cy.request({
        method: 'GET',
        url: `/public/v2/users/${userId}/posts`,
        headers: {
            authorization: `Bearer ${token}`
        },
        failOnStatusCode: false
    }).then((userPosts) => {
        return cy.wrap(userPosts)
    })
})
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })