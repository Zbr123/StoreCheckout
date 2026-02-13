Feature: Store checkout
  As a customer
  I want to complete a purchase from the store
  So that I can receive my order


  # Scenario: Checkout process with single credit card
  #   Given I am on the store password page
  #   When I wait "5" seconds
  #   When I click enter using password
  #   And I enter password "paycro" and submit
  #   And I click the first product on the dashboard
  #   And I click add to cart
  #   When I wait "10" seconds
  #   And I click checkout
  #   And I enter email "test@example.com"
  #   And I select delivery option "Ship"
  #   And I enter first name "John"
  #   And I enter last name "Doe"
  #   And I enter address "test address"
  #   And I enter apartment "Apt 4"
  #   And I enter city "New York"
  #   And I select state "New York"
  #   And I enter zip code "10001"
  #   And I enter phone number "19492649628"
  #   And I select shipping method "Standard"
  #   When I wait "5" seconds
  #   And I provide payment information
  #     | cardNumber       | cardName  | expiryDate | cvv |
  #     | 4242424242424242 | Test User | 12/26      | 123 |
  #   And I click pay now
  #   Then I should see the order confirmed message


  # Scenario: Checkout process with single credit card and small vairant
  #   Given I am on the store password page
  #   When I wait "5" seconds
  #   When I click enter using password
  #   And I enter password "paycro" and submit
  #   And I click the first product on the dashboard
  #   And I select size variant "Small"
  #   And I click add to cart
  #   When I wait "10" seconds
  #   And I click checkout
  #   And I enter email "test@example.com"
  #   And I select delivery option "Ship"
  #   And I enter first name "John"
  #   And I enter last name "Doe"
  #   And I enter address "test address"
  #   And I enter apartment "Apt 4"
  #   And I enter city "New York"
  #   And I select state "New York"
  #   And I enter zip code "10001"
  #   And I enter phone number "19492649628"
  #   And I select shipping method "Standard"
  #   When I wait "5" seconds
  #   And I provide payment information
  #     | cardNumber       | cardName  | expiryDate | cvv |
  #     | 4242424242424242 | Test User | 12/26      | 123 |
  #   And I click pay now
  #   Then I should see the order confirmed message

  Scenario: Checkout process with single credit card and Medium variant
    Given I am on the store password page
    When I wait "5" seconds
    When I click enter using password
    And I enter password "paycro" and submit
    And I click the first product on the dashboard
    And I select size variant "Medium"
    And I click add to cart
    When I wait "10" seconds
    And I click checkout
    And I enter email "test@example.com"
    And I select delivery option "Ship"
    And I enter first name "John"
    And I enter last name "Doe"
    And I enter address "test address"
    And I enter apartment "Apt 4"
    And I enter city "New York"
    And I select state "New York"
    And I enter zip code "10001"
    And I enter phone number "19492649628"
    And I select shipping method "Standard"
    When I wait "5" seconds
    And I provide payment information
      | cardNumber       | cardName  | expiryDate | cvv |
      | 4242424242424242 | Test User | 12/26      | 123 |
    And I click pay now
    Then I should see the order confirmed message

  Scenario: Checkout process with single credit card and Large variant
    Given I am on the store password page
    When I wait "5" seconds
    When I click enter using password
    And I enter password "paycro" and submit
    And I click the first product on the dashboard
    And I select size variant "Large"
    And I click add to cart
    When I wait "10" seconds
    And I click checkout
    And I enter email "test@example.com"
    And I select delivery option "Ship"
    And I enter first name "John"
    And I enter last name "Doe"
    And I enter address "test address"
    And I enter apartment "Apt 4"
    And I enter city "New York"
    And I select state "New York"
    And I enter zip code "10001"
    And I enter phone number "19492649628"
    And I select shipping method "Standard"
    When I wait "5" seconds
    And I provide payment information
      | cardNumber       | cardName  | expiryDate | cvv |
      | 4242424242424242 | Test User | 12/26      | 123 |
    And I click pay now
    Then I should see the order confirmed message

  # Scenario: Checkout process with single credit card and single discount code
  #   Given I am on the store password page
  #   When I wait "5" seconds
  #   When I click enter using password
  #   And I enter password "paycro" and submit
  #   And I click the first product on the dashboard
  #   And I select size variant "Medium"
  #   And I click add to cart
  #   When I wait "10" seconds
  #   And I click checkout
  #   And I enter email "test@example.com"
  #   And I select delivery option "Ship"
  #   And I enter first name "John"
  #   And I enter last name "Doe"
  #   And I enter address "test address"
  #   And I enter apartment "Apt 4"
  #   And I enter city "New York"
  #   And I select state "New York"
  #   And I enter zip code "10001"
  #   And I enter phone number "19492649628"
  #   And I select shipping method "Standard"
  #   When I wait "5" seconds
  #   And I provide payment information
  #     | cardNumber       | cardName  | expiryDate | cvv |
  #     | 4242424242424242 | Test User | 12/26      | 123 |
  #   When I enter gift or discount code "test123 discount code"
  #   And I click the "Apply" button
  #   When I wait "5" seconds
  #   And I click pay now
  #   Then I should see the order confirmed message

  # Scenario: Checkout process with single credit card and single gift card
  #   Given I am on the store password page
  #   When I wait "5" seconds
  #   When I click enter using password
  #   And I enter password "paycro" and submit
  #   And I click the first product on the dashboard
  #   And I select size variant "Medium"
  #   And I click add to cart
  #   When I wait "10" seconds
  #   And I click checkout
  #   And I enter email "test@example.com"
  #   And I select delivery option "Ship"
  #   And I enter first name "John"
  #   And I enter last name "Doe"
  #   And I enter address "test address"
  #   And I enter apartment "Apt 4"
  #   And I enter city "New York"
  #   And I select state "New York"
  #   And I enter zip code "10001"
  #   And I enter phone number "19492649628"
  #   And I select shipping method "Standard"
  #   When I wait "5" seconds
  #   And I provide payment information
  #     | cardNumber       | cardName  | expiryDate | cvv |
  #     | 4242424242424242 | Test User | 12/26      | 123 |
  #   When I enter gift or discount code "test123 gift code"
  #   And I click the "Apply" button
  #   When I wait "5" seconds
  #   And I click pay now
  #   Then I should see the order confirmed message

  Scenario: Checkout process with single credit card and multiple gift cards
    Given I am on the store password page
    When I wait "5" seconds
    When I click enter using password
    And I enter password "paycro" and submit
    And I click the first product on the dashboard
    And I select size variant "Medium"
    And I click add to cart
    When I wait "10" seconds
    And I click checkout
    And I enter email "test@example.com"
    And I select delivery option "Ship"
    And I enter first name "John"
    And I enter last name "Doe"
    And I enter address "test address"
    And I enter apartment "Apt 4"
    And I enter city "New York"
    And I select state "New York"
    And I enter zip code "10001"
    And I enter phone number "19492649628"
    And I select shipping method "Standard"
    When I wait "5" seconds
    And I provide payment information
      | cardNumber       | cardName  | expiryDate | cvv |
      | 4242424242424242 | Test User | 12/26      | 123 |
    When I enter gift or discount code "test123 gift code"
    And I click the "Apply" button
    When I wait "5" seconds
    When I enter gift or discount code "test123 gift code 2"
    And I click the "Apply" button
    When I wait "5" seconds
    And I click pay now
    Then I should see the order confirmed message

# Scenario: Checkout process with single credit card and multiple discount codes
#   Given I am on the store password page
#   When I wait "5" seconds
#   When I click enter using password
#   And I enter password "paycro" and submit
#   And I click the first product on the dashboard
#   And I select size variant "Medium"
#   And I click add to cart
#   When I wait "10" seconds
#   And I click checkout
#   And I enter email "test@example.com"
#   And I select delivery option "Ship"
#   And I enter first name "John"
#   And I enter last name "Doe"
#   And I enter address "test address"
#   And I enter apartment "Apt 4"
#   And I enter city "New York"
#   And I select state "New York"
#   And I enter zip code "10001"
#   And I enter phone number "19492649628"
#   And I select shipping method "Standard"
#   When I wait "5" seconds
#   And I provide payment information
#     | cardNumber       | cardName  | expiryDate | cvv |
#     | 4242424242424242 | Test User | 12/26      | 123 |
#   When I enter gift or discount code "test123 discount code"
#   And I click the "Apply" button
#   When I wait "5" seconds
#   When I enter gift or discount code "test123 discount code 2"
#   And I click the "Apply" button
#   When I wait "5" seconds
#   And I click pay now
#   Then I should see the order confirmed message