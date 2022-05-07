# Developer's Notes
This conversational action has not been designed as an end-user product. This is a sample app to demonstrate capabilities of Google Assistant.
If you are going to build a Google Assistant conversational action product, feel free to use this as a reference.

The idea came to my head as I was helping my daughter to memorize basic arithmetic learned at elementary school.

# Sprints

Quickly develop each use case and validate with UX my daughter.

## Use Case #1 : MVP
1. User select an operation (addition), a level of difficulty.
2. Assistant propose an quiz
3. User answers
4. if answer is correct, propose a new quiz. If answer is incorrect, tell user to try again.
5. stop game when user says "stop here"

## Todo

- [x] Add Fullfilment to generate a random quiz
- [x] Add Fullfilment to review answer
- [x] Add Game loop
- [x] Add Global Intent to stop game

## Use Case #2 : MVP
1. Add i18n : french
2. Add scenario where user does not know answer




# Roadmap

* Webhooks deployed on Cloud Functions allow unauthenicated requests. Setup authentication between Assistant Actions project and Webhook deployed on Cloud Function
* Add score
* Add visual feedbacks
* Add test framework
* Add i18n to addition
* Release on alpha channel
* AJouter je ne sais pas , ou trop difficile

# Educational References
+ [Elementary Arithmetic](https://en.wikipedia.org/wiki/Elementary_arithmetic)
