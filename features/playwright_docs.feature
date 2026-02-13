Feature: Playwright documentation site
  As a developer
  I want to navigate the Playwright docs
  So that I can learn how to use Playwright

  Scenario: User can open the homepage and navigate to Get Started
    Given I am on the Playwright homepage
    When I click "Get Started"
    Then I should be on the documentation page
    And the page title should contain "Installation"
