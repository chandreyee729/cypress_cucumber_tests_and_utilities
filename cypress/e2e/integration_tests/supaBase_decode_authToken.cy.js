import { jwtDecode } from 'jwt-decode';
import SupaBase from '../../pages/supabase';
const supabase = new SupaBase();

describe('Fetch JWT of a Supabase user from stored Local Storage', () => {
  const email = Cypress.env('supaBase_auth_userEmail');
  const password = Cypress.env('supaBase_userPassword');

  beforeEach(() => {
    cy.supaBase_logInAndStoreSessionData(email, password);
    //cy.visit(`${Cypress.env('supaBase_ui_url')}dashboard/sign-in`)
    //cy.intercept('POST', '**/auth/v1/token?grant_type=password').as('loginRequest')
  })

  it('Login to session and store tokens', () => {
    console.log('email is:', email)
    cy.supaBase_logInAndStoreSessionData(email, password);
    cy.then(() => {
      const stored = window.localStorage.getItem('supabase.dashboard.auth.token');
      expect(stored).to.not.be.null;
      const tokenData = JSON.parse(stored);
      expect(tokenData.currentSession.access_token).to.exist;
    });
  });

  it('Decode SessionData from Local Storage and validate User Info in access token', () => {
    console.log('email is:', email)
    cy.supaBase_logInAndStoreSessionData(email, password);
    cy.then(() => {
      const tokenData = JSON.parse(window.localStorage.getItem('supabase.dashboard.auth.token'));
      const decoded = jwtDecode(tokenData.currentSession.access_token);

      cy.log(`Decoded Token: ${JSON.stringify(decoded, null, 2)}`);
      expect(decoded.email).to.eq(Cypress.env('supaBase_auth_userEmail'));
      expect(decoded.role).to.exist;
    });
  });

  it('Fetch Access Token Data', () => {
    cy.get_supaBase_AccessToken().then(token => {
      cy.log('token: ', JSON.stringify(token));
    })
  })

  it.skip('Login from UI and fetch token', () => {
    supabase.getEmail().type(Cypress.env('supaBase_ui_userEmail'));
    supabase.getPassword().type(Cypress.env('supaBase_userPassword'));
    supabase.getSignIn().click();
    // This doesn't work successfully, because of captcha 
    cy.wait('@loginRequest').then(request => {
      expect(request.response.statusCode).to.eq(200)
      expect(request.response.body).to.have.property('access_token')
    })
  })
})