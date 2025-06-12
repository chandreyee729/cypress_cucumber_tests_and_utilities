export default class SupaBase {
    login_webLocators = {
        email : '#email',
        password: '#password',
        submit: 'button[type=submit]',
        skip_captcha: '.button-submit button[title="Skip Challenge"]'
    }

    getEmail(){
        return cy.get(this.login_webLocators.email)
    }

    getPassword(){
        return cy.get(this.login_webLocators.password)
    }

    getSignIn(){
        return cy.get(this.login_webLocators.submit)
    }

    skipCaptcha(){
        cy.get(this.login_webLocators.skip_captcha).click()
    }

}