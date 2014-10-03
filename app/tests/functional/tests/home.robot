*** Settings ***
Documentation     Testing the Home Page

# resource importation/extension
Resource       ../keywords/common_resources.robot

Suite Setup   Open Test Browser
Suite Teardown     Close Test Browser

*** Test Cases ***
Home Page should have meanjs
  [Tags]  coverage
  Given Home Page Should Be Open
