import { jwtDecode } from 'jwt-decode';
import SupaBase from '../../pages/supabase';
const supabase = new SupaBase();

describe('Test Utility Method to Fetch JWT of a Supabase user from stored Local Storage ', () => {
  const email = Cypress.env('SUPABASE_AUTH_USEREMAIL');
  const password = Cypress.env('SUPABASE_USERPASSWORD');

  beforeEach(() => {
    cy.supaBase_logInAndStoreSessionData(email, password);
    //cy.visit(`${Cypress.env('SUPABASE_UI_URL')}dashboard/sign-in`)
    //cy.intercept('POST', '**/auth/v1/token?grant_type=password').as('loginRequest')
  })

  it('Should login to session and be able to store tokens', () => {
    console.log('email is:', email)
    cy.supaBase_logInAndStoreSessionData(email, password);
    cy.then(() => {
      const stored = window.localStorage.getItem('supabase.dashboard.auth.token');
      expect(stored).to.not.be.null;
      const tokenData = JSON.parse(stored);
      expect(tokenData.currentSession.access_token).to.exist;
    });
  });

  it('Should decode SessionData from Local Storage and validate User Info in access token', () => {
    console.log('email is:', email)
    cy.supaBase_logInAndStoreSessionData(email, password);
    cy.then(() => {
      const tokenData = JSON.parse(window.localStorage.getItem('supabase.dashboard.auth.token'));
      const decoded = jwtDecode(tokenData.currentSession.access_token);

      cy.log(`Decoded Token: ${JSON.stringify(decoded, null, 2)}`);
      expect(decoded.email).to.eq(Cypress.env('SUPABASE_AUTH_USEREMAIL'));
      expect(decoded.role).to.exist;
    });
  });

  it('Should successfully fetch Access Token Data', () => {
    cy.get_supaBase_AccessToken().then(token => {
      cy.log('token: ', JSON.stringify(token));
    })
  })

  it.skip('Login from UI and fetch token', () => {
    supabase.getEmail().type(Cypress.env('SUPABASE_UI_USEREMAIL'));
    supabase.getPassword().type(Cypress.env('SUPABASE_USERPASSWORD'));
    supabase.getSignIn().click();
    // This doesn't work successfully, because of captcha 
    cy.wait('@loginRequest').then(request => {
      expect(request.response.statusCode).to.eq(200)
      expect(request.response.body).to.have.property('access_token')
    })
  })
})