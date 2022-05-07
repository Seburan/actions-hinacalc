/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const { conversation } = require('@assistant/conversation');
const functions = require('firebase-functions');

const app = conversation({ debug: true });

// make quiz
app.handle('makeQuiz', (conv) => {
  // update round #
  if (conv.session.params.round === null || conv.session.params.round === undefined) {
    conv.session.params.round = 0;
  }
  // console.log('round before increment = ', conv.session.params.round);
  conv.session.params.round = parseInt(conv.session.params.round) + 1;
  // console.log('round after increment =', conv.session.params.round);

  // reset retryCount
  conv.session.params.retryCount = 0;

  // reset answerIsCorrect
  conv.session.params.answerIsCorrect = false;

  // make quiz : logic differs based on operation
  const operation = conv.session.params.operation;
  const difficulty = conv.session.params.difficulty;
  let expectedAnswer = 0;
  let operand1 = 0;
  let operand2 = 0;
  let quiz = '';
  switch (operation) {
    case 'addition':
      // make an addition where expected answer is lower or equal to selected difficulty
      expectedAnswer = Math.floor(Math.random() * Math.floor(difficulty)) + 1;
      // first operand will be between 0 and expectedAnswer - 1
      operand1 = Math.floor(Math.random() * Math.floor(expectedAnswer));
      // second operand will be the difference between expectedAnswer and operand1
      operand2 = expectedAnswer - operand1;
      // save quiz as string
      quiz = operand1 + ' + ' + operand2 + ' = ';
      break;
    case 'subtraction':
      break;
    case 'multiplication':
      // make a multiplication where operand is between 1 and "difficulty"
      operand1 = Math.floor(Math.random() * Math.floor(difficulty)) + 1;
      // second operand will be random number between 1 and 10
      operand2 = Math.floor(Math.random() * 10) + 1;
      // first operand will be between 0 and expectedAnswer - 1
      expectedAnswer = Math.floor(operand1 * operand2);
      // save quiz as string
      quiz = operand1 + ' × ' + operand2 + ' = ';
      break;
    case 'division':
      break;
  }

  // save quiz in session
  conv.session.params.quiz = quiz;
  // save expected answer in sessionm
  conv.session.params.expectedAnswer = expectedAnswer;

  // DO NOT ADD Conversation in the code as we need to handle I18N in Actions Builder
});


// reviewAnswer validates user's answer correctness and handle scoring rule
// we only return if answ
app.handle('reviewAnswer', (conv) => {
  const answer = conv.session.params.answer;
  const expectedAnswer = conv.session.params.expectedAnswer;
  const operation = conv.session.params.operation;

  let answerIsCorrect = false;

  // validates answer for Addition, Subtraction, Multiplication
  if (operation == 'addition' || operation == 'subtraction' || operation == 'multiplication') {
    if (answer == expectedAnswer) {
      answerIsCorrect = true;
    }
    // validates answer for Division
  } else if (operation == 'division') {

    // TODO
  }

  // assigns answer review result value back to session to context
  conv.session.params.answerIsCorrect = answerIsCorrect;

  // if answer is not correct increments retry counter
  if (answerIsCorrect == false) {
    conv.session.params.retryCount = parseInt(conv.session.params.retryCount) + 1;
  }

  // if answer is correct, calculates score and increment it
  // first try : 10 points
  // second try : 5 points
  // third try : 3 points
  // else : 1 point
  if (answerIsCorrect == true) {
    let score = 0;
    const retryCount = conv.session.params.retryCount;

    // update session user score
    if (conv.session.params.score === null || conv.session.params.score === undefined) {
      conv.session.params.score = 0;
    }

    if (retryCount == 0) { // 1st attempt
      score = 10;
    } else if (retryCount == 1) {
      score = 5;
    } else if (retryCount == 2) {
      score = 3;
    } else { // retryCount >= 3 (4th attempt)
      score = 1;
    }
    console.log('score before increment = ', conv.session.params.score);
    conv.session.params.score = parseInt(conv.session.params.score) + score;
    console.log('score after increment = ', conv.session.params.score);

    // update global user score
    if (conv.user.params.score === null || conv.user.params.score === undefined) {
      conv.user.params.score = 0;
    }
    console.log('user score before increment = ', conv.user.params.score);
    conv.user.params.score = parseInt(conv.user.params.score) + score;
    console.log('user score after increment = ', conv.user.params.score);
  }
});

/*
app.handle('menu', (conv) => {
  const counter = conv.user.params.counter;
  const favoriteNum = conv.session.params.favoriteNum;
  let message = 'You can save data in the user storage via several ways. Through slots and of course through your webhook.';
  if (favoriteNum) {
    message = message + ` I remember that your favorite number is ${favoriteNum}.`;
  }
  if (counter) {
    message = message + ` I remember that the counter is at ${counter}.`;
  }
  conv.add(message);
  conv.add(new Suggestion({ title: 'slots' }));
  conv.add(new Suggestion({ title: 'webhook' }));
});

app.handle('counter', (conv) => {
  if (!conv.user.params.counter) {
    conv.user.params.counter = 0;
  }
  conv.user.params.counter = parseInt(conv.user.params.counter) + 1;
  conv.add(`The counter is currently: ${conv.user.params.counter}. You can increase or go back to the main menu.`);
  conv.add(new Suggestion({ title: 'increase' }));
  conv.add(new Suggestion({ title: 'menu' }));
});
*/

exports.ActionsOnGoogleFulfillment = functions.https.onRequest(app);
