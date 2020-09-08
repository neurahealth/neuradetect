const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Logging } = require('@google-cloud/logging');
const { PubSub } = require(`@google-cloud/pubsub`);

const projectId = ['Project ID']
const topicName = ['Topic Name']
const topicName1 = ['Topic Name 1']
const subscriptionName = ['subscriptionName'];
const subscriptionName1 = ['subscriptionName1'];
// ---------For Development Environment
const logging = new Logging({ projectId: projectId});
const serviceAccount = require("./service_key.json"); // provide file path of credential file e.g. './serviceKey.json'
const pubsub = new PubSub({ projectId: projectId});

let Promise = require('promise');
const stripe = require('stripe')(functions.config().stripe.secret);
const currency = functions.config().stripe.currency || 'USD';

const timeout = 60;
let messageCount = 0;

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

exports.addFileDetailsAndCreatePubsub = functions.firestore.document('/stripe_customers/{userId}/files/{fileId}').onCreate(async (snap, context) => {
 console.log('Inside addFileDetailsAndCreatePubsub');
  const val = snap.data();
  console.log('val - ',val);
  const filesNames = val.fileNames
  const fileLength = val.fileLength
  const url = val.url
  const email = val.email
  console.log('filesNames - ',filesNames);
  console.log('fileLength - ',fileLength);
  console.log('val.time - ',val.time);
  console.log('val.currentTime - ',val.currentTime);
  console.log('val.date - ',val.date);
  console.log('url - ',url);
  console.log('email - ',email);
  console.log('userId - ',context.params.userId);
  if (val === null){
    return null;
  }

  try {
    const data = JSON.stringify({
      userId: context.params.userId,
      bucket: val.bucket,
      fileName: filesNames,
      url: val.fullPaths,
      currentTime: val.currentTime,
      time: val.time,
      date: val.date,
      path: val.path
    });
    console.log('data - ',data);
    const dataBuffer = Buffer.from(data);
  if (fileLength === 4){
    console.log('Inside publish message');
    await pubsub
    .topic(topicName)
    .publish(dataBuffer)
    .then(messageId => {
      console.log(`Message ${messageId} published.`);
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
    console.log('Before Save');
    await db.collection('stripe_customers').doc(context.params.userId).set({resultId: val.currentTime}, { merge: true });
    console.log('After Save');
  }
  } catch (error) {
    console.log('addFileDetailsAndCreatePubsub error - ',error);
    await snap.ref.set({error: userFacingMessage(error)}, { merge:true });
    await snap.ref.set({status: 'Error'}, { merge: true });
    return reportError(error, {user: context.params.userId});
  }
});

// [START chargecustomer]
// Charge the Stripe customer whenever an amount is created in Cloud Firestore
exports.createStripeCharge = functions.firestore.document('stripe_customers/{userId}/charges/{id}').onCreate(async (snap, context) => {
    console.log('Inside createStripeCharge');
      const val = snap.data();
      console.log('createStripeCharge snap - ',snap);
      console.log('createStripeCharge context - ',context);
      console.log('createStripeCharge val - ',val);
      console.log('createStripeCharge context.params.userId - ',context.params.userId);
      try {
        // Look up the Stripe customer id written in createStripeCustomer
        const snapshot = await admin.firestore().collection(`stripe_customers`).doc(context.params.userId).get();
        console.log('createStripeCharge snapshot - ',snapshot);
        const snapval = snapshot.data();
        console.log('createStripeCharge snapval - ',snapval);
        // const customer = snapval.customer_id
        // Create a charge using the pushId as the idempotency key
        // protecting against double charges
        const amount = val.amount;
        const token = val.token;
        const idempotencyKey = context.params.id;
       
        const response = await stripe.charges.create({
          amount: amount * 100,
          currency: 'usd',
          source: token,
          description: 'Breast Density Detection Charges'
        });

        console.log('response :', response)
        // If the result is successful, write it back to the database
        await snap.ref.set({status: 'succeeded'}, { merge: true });
        return snap.ref.set(response, { merge: true });
      } catch(error) {
        // We want to capture errors and render them in a user-friendly way, while
        // still logging an exception with StackDriver
        console.log('createStripeCharge error - ',error);
        await snap.ref.set({error: userFacingMessage(error)}, { merge: true });
        await snap.ref.set({status: 'error'}, { merge: true });
        return reportError(error, {user: context.params.userId});
      }
    });
// [END chargecustomer]

exports.displayPubSubResults = functions.firestore.document('/stripe_customers/{userId}/results/{resultId}').onCreate(async (snap, context) => {
 console.log('Inside displayPubSubResults');
  const val = snap.data();
  console.log('val - ',val);
  const snapshot = await db.collection('stripe_customers').doc(context.params.userId).get();
  console.log('displayPubSubResults snapshot.data - ',snapshot.data());
  
});

exports.readPubSubMessage = functions.pubsub.topic(topicName1).onPublish(async(message, context) => {
  
    const userId = message.attributes.userId
    const results = message.data ? Buffer.from(message.data, 'base64').toString('ascii') : null;
    console.log(`Received results: ${results}`);
   
});

// When a user is created, register them with Stripe
exports.createStripeCustomer = functions.auth.user().onCreate(async (user) => {
	console.log('Inside createStripeCustomer', user.email);
  const customer = await stripe.customers.create({email: user.email});
  return admin.firestore().collection('stripe_customers').doc(user.uid).set({customer_id: customer.id});
});

// When a user deletes their account, clean up after them
exports.cleanupUser = functions.auth.user().onDelete(async (user) => {
  console.log('Inside cleanupUser');
  
  const snapshot = await admin.firestore().collection('stripe_customers').doc(user.uid).get();
  console.log("cleanupUser snapshot", snapshot)
  const customer = snapshot.data();
  console.log("cleanupUser customer", customer)
  await stripe.customers.del(customer.customer_id);
  return admin.firestore().collection('stripe_customers').doc(user.uid).delete();
});

// To keep on top of errors, we should raise a verbose error report with Stackdriver rather
// than simply relying on console.error. This will calculate users affected + send you email
// alerts, if you've opted into receiving them.
// [START reporterror]
function reportError(err, context = {}) {
  // This is the name of the StackDriver log stream that will receive the log
  // entry. This name can be any valid log stream name, but must contain "err"
  // in order for the error to be picked up by StackDriver Error Reporting.
  const logName = 'errors';
  const log = logging.log(logName);

  // https://cloud.google.com/logging/docs/api/ref_v2beta1/rest/v2beta1/MonitoredResource
  const metadata = {
    resource: {
      type: 'cloud_function',
      labels: {function_name: process.env.FUNCTION_NAME},
    },
  };

  // https://cloud.google.com/error-reporting/reference/rest/v1beta1/ErrorEvent
  const errorEvent = {
    message: err.stack,
    serviceContext: {
      service: process.env.FUNCTION_NAME,
      resourceType: 'cloud_function',
    },
    context: context,
  };

  // Write the error log entry
  return new Promise((resolve, reject) => {
    log.write(log.entry(metadata, errorEvent), (error) => {
      if (error) {
       return reject(error);
      }
      return resolve();
    });
  });
}
// [END reporterror]

function userFacingMessage(error) {
  return error.type ? error.message : 'An error occurred, developers have been alerted';
}
