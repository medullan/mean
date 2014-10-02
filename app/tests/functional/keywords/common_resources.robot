*** Settings ***
Documentation     A resource file with reusable keywords and variables.
...
...               The system specific keywords created here form our own
...               domain specific language. They utilize keywords provided
...               by the imported Selenium2Library.
Library           Selenium2Library
Library           Collections
Library           SauceLabs

*** Variables ***
${REMOTE_URL}
${DESIRED_CAPABILITIES}
${TEST_NAME}
${TEST_TAGS}
${BROWSER}  phantomjs
${HOST}  http://localhost:3000
${URL}  ${HOST}/\#!

${DELAY}  1

*** Keywords ***
Open Test Browser
    [Documentation]    Open Browser ${URL} ${BROWSER}
    Open Browser    ${URL}    ${BROWSER}
    ...  remote_url=${REMOTE_URL}
    ...  desired_capabilities=${DESIRED_CAPABILITIES}
    Maximize Browser Window
    Set Selenium Speed    ${DELAY}

Close Test Browser
    Go To  ${URL}/api/robot/coverage
    Run keyword if  '${REMOTE_URL}' != ''
    ...  Report Sauce status
    ...  ${SUITE_NAME} | ${TEST_NAME}
    ...  ${SUITE_STATUS}  ${TEST_TAGS}  ${REMOTE_URL}
    Sleep  3
    Close all browsers

Home Page Should Be Open
    Page Should Contain Element   //div[@class='jumbotron text-center']
