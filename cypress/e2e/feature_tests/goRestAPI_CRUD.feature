Feature: Test all user CRUD features of GoRest APIs
    Scenario Outline: Update User Details
        Given I have created a "male" and "inactive" user "<username>"
        When I update User Name to "<updatedUsername>"
        Then User "name" is updated successfully to "<updatedUsername>"
        When I update User Status to "<updatedUserStatus>"
        Then User "status" is updated successfully to "<updatedUserStatus>"

        Examples:
            | username | updatedUsername | updatedUserStatus |
            | Alice    | Alice GoRest    | active            |
