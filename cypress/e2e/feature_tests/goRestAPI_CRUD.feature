Feature: Cucumber - User CRUD Operations with GoRest APIs

    Scenario Outline: Verify successful update of User name and status using GoRest network requests
        Given a "male" and "inactive" user "<username>" is created
        When the User Name is updated to "<updatedUsername>" using user id
        Then the User's "name" is changed successfully to "<updatedUsername>"
        When the User Status is updated to "<updatedUserStatus>" using user id
        Then the User's "status" is changed successfully to "<updatedUserStatus>"

        Examples:
            | username | updatedUsername | updatedUserStatus |
            | Alice    | Alice GoRest    | active            |
            | Newton   | GoRest Newton   | active            |

    Scenario Outline: Verify user can create comments on a new post using GoRest network requests
        Given a "male" and "inactive" user "<username>" is created
        When a new post stating "<postStatement>" is created using user id
        Then user can fetch the post with "<postStatement>" using user id
        When a new comment "<commentStatement>" is added using post id
        Then user can fetch comment with "<commentStatement>" from post using post id


        Examples:
            | username | postStatement  | commentStatement                 |
            | Marcella | This is a post | This is a comment about Marcella |