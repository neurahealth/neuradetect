const test = require('firebase-functions-test')({
  databaseURL: 'https://demo.firebaseio.com',
  storageBucket: 'storageBucket',
  projectId: 'projectId',
}, '/service_Key.json');

test.mockConfig({ stripe: { key: 'sk_test_key'}});

const myFunctions = require('../index.js'); 

const wrapped = test.wrap(myFunctions.createStripeCustomer);