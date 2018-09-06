///////////////Things to npm install\\\\\\\\\\\\\
const express = require("express");
const fetch = require("isomorphic-fetch");
const fs = require("fs");
const opn = require("opn");
const PubSub = require(`@google-cloud/pubsub`); //must use gcloud init / install, read google cloud SDK for more info
const StellarSdk = require("stellar-sdk");
const secret = require("./secret.js");
// console.log(secret);

const pubsub = new PubSub({
  keyFilename: secret.jobCentEmailJson
});
const subscriptionName = secret.subName;
const subscription = pubsub.subscription(subscriptionName);

const gmailPort = 3001;
const app = express();

const scopes = [
  "https://mail.google.com/",
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send"
];
const { google } = require("googleapis");
const gmailClass = google.gmail("v1");
const oauth2Client = new google.auth.OAuth2(
  secret.oauth2one,
  secret.oauth2two,
  `http://localhost:3001/`
);
const oauthUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: scopes
});

const gmailApiSync = require("gmail-api-sync");
gmailApiSync.setClientSecretsFile(secret.clientSecret);

const ncentSDK = require("ncent-sandbox-sdk");
const jobCentSDK = require("../jobCentSDK/");
const ncentSdkInstance = new ncentSDK();
const jobcentSdkInstance = new jobCentSDK();
const walletsCreated = {
  "jobcent@ncnt.io": true
};

const alreadyProcessed = {};
let gmail;
let startHistoryId;
let currHistoryId;
let token_id;
let jobcentKeyPair;
let tkn = {
  access_token: secret.accessToken,
  refresh_token: secret.refreshToken,
  scope:
    "https://mail.google.com/ https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send",
  token_type: "Bearer",
  expiry_date: 1535494427290
};

function initJobCent() {
  jobcentKeyPair = ncentSdkInstance.createWalletAddress();
  new Promise(function(resolve, reject) {
    return jobcentSdkInstance.storeWalletAddress(
      "jobcent@ncnt.io",
      jobcentKeyPair,
      resolve,
      reject
    );
  })
    .then(function() {
      new Promise(function(resolve, reject) {
        return ncentSdkInstance.stampToken(
          jobcentKeyPair.publicKey(),
          "Jbcent",
          1000000,
          "2021",
          resolve,
          reject
        );
      })
        .then(function(response) {
          console.log(response);
          token_id = response.data["token"]["uuid"];
          console.log(token_id);
        })
        .then(function() {
          return createAndTransfer(secret.emails.email1, 2000);
        })
        .then(function() {
          return createAndTransfer(secret.emails.email2, 2000);
        })
        .then(function() {
          return createAndTransfer(secret.emails.email3, 1000);
        })
        .then(function() {
          return createAndTransfer(secret.emails.email4, 2000);
        })
        .then(function() {
          return createAndTransfer(secret.emails.email5, 1);
        })
        .then(function() {
          return createAndTransfer(secret.emails.email6, 1);
        })
        .then(function() {
          return createAndTransfer(secret.emails.email7, 1);
        })
        .then(function() {
          return createAndTransfer(secret.emails.email8, 1);
        })
        .then(function() {
          return createAndTransfer(secret.emails.email9, 2000);
        })
        .catch(function(error) {
          console.log(error);
          return;
        });
    })
    .catch(function(error) {
      console.log(error);
      return;
    });
}
function createAndTransfer(email, amount) {
  if (email !== "mailer-daemon@googlemail.com") {
    return new Promise(function(resolve, reject) {
      createWalletIfNeeded(email, resolve, reject);
    })
      .then(function(createWalletResponse) {
        return new Promise(function(resolve, reject) {
          jobcentSdkInstance.getUserKeyPair(email, resolve, reject);
        })
          .then(function(response) {
            //let keyPair = StellarSdk.Keypair.fromPublicKey(response.data[0].public_key);
            if (createWalletResponse !== "nothing done") {
              return new Promise(function(resolve, reject) {
                ncentSdkInstance.transferTokens(
                  jobcentKeyPair,
                  response.data[0].public_key,
                  token_id,
                  amount,
                  resolve,
                  reject
                );
              });
            } else {
              return new Promise(function(resolve, reject) {
                ncentSdkInstance.getTokenBalance(
                  response.data[0].public_key,
                  token_id,
                  resolve,
                  reject
                );
              });
            }
          })
          .catch(function(error) {
            console.log(error);
            return;
          });
      })
      .catch(function(error) {
        console.log(error);
        return;
      });
  }
}

function createWalletIfNeeded(email, res, rej) {
  return new Promise(function(resolve, reject) {
    jobcentSdkInstance.getUserKeyPair(email, resolve, reject);
  })
    .then(function(response) {
      if (response.status === 204) {
        let keyPair = ncentSdkInstance.createWalletAddress();
        jobcentSdkInstance.storeWalletAddress(email, keyPair, res, rej);
      } else {
        res("nothing done");
      }
    })
    .catch(function(error) {
      console.log(error);
      return;
    });
}

function getEmailString(headerVal) {
  let startIdx = headerVal.value.indexOf("<");
  let endIdx = headerVal.value.indexOf(">");
  let emailString =
    headerVal.value.indexOf("<") === -1
      ? headerVal.value
      : headerVal.value.substring(startIdx + 1, endIdx);
  return emailString;
}

function defaultResolve(response) {
  return response;
}

function defaultError(error) {
  return error;
}

function processTransaction(to, from) {
  createAndTransfer(from, 1)
    .then(function(response) {
      console.log(response.data);
      if (response.data.txn || response.data[0].balance !== 0) {
        new Promise(function(resolve, reject) {
          return createWalletIfNeeded(to, resolve, reject);
        })
          .then(function() {
            let sender_keyPair;
            if (to !== "jobcent@ncnt.io") {
              new Promise(function(resolve, reject) {
                jobcentSdkInstance.getUserKeyPair(from, resolve, reject);
              })
                .then(function(resp) {
                  sender_keyPair = StellarSdk.Keypair.fromSecret(
                    resp.data[0].private_key
                  );
                })
                .then(function() {
                  new Promise(function(resolve, reject) {
                    jobcentSdkInstance.getUserKeyPair(to, resolve, reject);
                  })
                    .then(function(rsp) {
                      new Promise(function(resolve, reject) {
                        ncentSdkInstance.transferTokens(
                          sender_keyPair,
                          rsp.data[0].public_key,
                          token_id,
                          1,
                          resolve,
                          reject
                        );
                      })
                        .then(function() {
                          console.log(
                            "jobCent sent to " + to + " from " + from
                          );
                          sendEmail(
                            to,
                            "./receivedJobCentnew.html",
                            "Congrats, you've received a jobCent!"
                          );
                          return;
                        })
                        .catch(function(error) {
                          console.log(error.message);
                          return;
                        });
                    })
                    .catch(function(error) {
                      console.log(error.message);
                      return;
                    });
                })
                .catch(function(error) {
                  console.log(error.message);
                  return;
                });
            } else if (response.data.txn) {
              console.log("jobCent sent to " + from + " from jobcent@ncnt.io");
              sendEmail(
                from,
                "./receivedJobCentnew.html",
                "Congrats, you've received a jobCent!"
              );
              return;
            }
          })
          .catch(function(error) {
            console.log(error.message);
            //if (error.response.status === 403) sendEmail(from, './noJobCentnew.html', "Error: You do not have any jobcents to send");
            return;
          });
      } else if (response.data[0].balance === 0) {
        sendEmail(
          from,
          "./noJobCentnew.html",
          "Error: You do not have any jobcents to send"
        );
      }
    })
    .catch(function(error) {
      console.log(error.message);
      return;
    });
}

function printMessage(message) {
  console.log(`Received message ${message.id}:`);
  console.log(`\tData: ${message.data}`);
  console.log(`\tAttributes: ${message.attributes}`);
}

function dealNewMessage(msgOptions, message) {
  let toEmail = "";
  let fromEmail = "";
  new Promise(function(resolve, reject) {
    gmail.users.messages
      .get(msgOptions)
      .then(function(response) {
        console.log("getresponse: " + response.data.id);
        let ccFound = -1;
        let multiTo = false;
        let toJbCent = false;
        let headers = response.data.payload.headers;
        for (idx in headers) {
          if (headers[idx].name === "To") {
            console.log("full headers: " + headers[idx].value);
            console.log(
              "first header: " +
                headers[idx].value.substring(
                  1,
                  headers[idx].value.indexOf("<") - 1
                )
            );
            if (
              !(
                ((headers[idx].value.match(/@/g) || []).length === 2 &&
                  headers[idx].value.match(/</g) &&
                  headers[idx].value.substring(
                    1,
                    headers[idx].value.indexOf("<") - 1
                  ) === getEmailString(headers[idx])) ||
                (headers[idx].value.match(/@/g) || []).length === 1
              )
            )
              multiTo = true;
            toEmail = getEmailString(headers[idx]);
            let stIdx = headers[idx].value.indexOf("jobcent@ncnt.io");
            if (stIdx !== -1) toJbCent = true;
          }
          if (headers[idx].name === "From") {
            fromEmail = getEmailString(headers[idx]);
          }
          if (headers[idx].name === "Cc") {
            let startIdx = headers[idx].value.indexOf("jobcent@ncnt.io");
            if (startIdx !== -1) {
              ccFound = 1;
            } else {
              ccFound = 0;
            }
          }
          if (toEmail !== "" && fromEmail !== "" && ccFound !== -1) break;
        }
        console.log(
          "out of loop" +
            ", FromEmail: " +
            fromEmail +
            ", ToEmail: " +
            toEmail +
            ", ccFound: " +
            ccFound +
            ", toJbCent: " +
            toJbCent
        );
        if ((ccFound !== 1 && !toJbCent) || toEmail === fromEmail) {
          return;
        }
        if (multiTo) {
          console.log("Too many addresses by " + fromEmail + " to " + toEmail);
          sendEmail(
            fromEmail,
            "./manyAddressesnew.html",
            "Error: You've entered too many addresses in the To line"
          );
          return;
        }
        console.log(
          "\nSending one jobCent from " + fromEmail + " to " + toEmail
        );
        processTransaction(toEmail, fromEmail);
      })
      .catch(function(error) {
        console.log(error.message);
      });
  })
    .then(function() {
      console.log("message acknowledged");
      message.ack();
      return;
    })
    .catch(function(error) {
      console.log(error.message);
      return;
    });
}
function errorHandler(error) {
  // Do something with the error
  console.log(error);
}

function messageHandler(message) {
  let messageJSON = JSON.parse(message.data);
  console.log("in message handler");
  if (messageJSON.emailAddress !== "jobcent@ncnt.io") {
    message.ack();
    return;
  }
  if (message.id in alreadyProcessed) return;
  printMessage(message);
  currHistoryId = messageJSON.historyId;
  if (startHistoryId === undefined || currHistoryId < startHistoryId) {
    message.ack();
    return;
  }
  console.log(
    "startHistoryId: " + startHistoryId + ", currHistoryId: " + currHistoryId
  );
  const syncOptions = { historyId: startHistoryId };
  new Promise(function(resolve, reject) {
    return syncMessages(false, syncOptions, resolve, reject);
  })
    .then(function(response) {
      if (response.emails.length !== 0) {
        for (i = 0; i < response.emails.length; i++) {
          const msgOptions = {
            userId: messageJSON.emailAddress,
            auth: oauth2Client,
            id: response.emails[i].id
          };
          alreadyProcessed[response.emails[i].id] = 1;
          dealNewMessage(msgOptions, message);
        }
      } else {
        console.log("array is empty again");
      }
    })
    .catch(function(error) {
      console.log(error);
      return;
    });
  startHistoryId = currHistoryId;
}

const sendEmail = async (receiver, file, subject) => {
  fs.readFile(file, (err, data) => {
    let email_lines = [];

    email_lines.push('From: "nCnt Hiring" <jobcent@ncnt.io>');
    email_lines.push("To: " + receiver);
    email_lines.push("Content-type: text/html;charset=utf-8");
    email_lines.push("MIME-Version: 1.0");
    email_lines.push("Subject: " + subject);
    email_lines.push("");

    email_lines.push(data);

    let email = email_lines.join("\r\n").trim();

    let base64EncodedEmail = new Buffer(email).toString("base64");
    base64EncodedEmail = base64EncodedEmail
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    gmailClass.users.messages.send({
      auth: oauth2Client,
      userId: "me",
      resource: {
        raw: base64EncodedEmail
      }
    });
  });
};

function initEmailWatcher() {
  let options = {
    userId: "me",
    auth: oauth2Client,
    resource: {
      labelIds: ["INBOX"],
      topicName: ""
    }
  };
  console.log("initt");
  gmail.users.watch(options, function(err, res) {
    if (err) {
      console.log(err);
      return;
    }
  });
}

function getOauthTokens(tokenCode) {
  //console.log("get auth tokens");
  return oauth2Client.getToken(tokenCode);
}

async function setOauthCredentials() {
  //console.log("set auth credentials");
  oauth2Client.credentials = tkn;
  console.log(tkn);
  tokens = await oauth2Client.refreshAccessToken();
  //tokens = await oauth2Client.refreshAccessToken();
  console.log(oauth2Client);
}

function syncMessages(full, syncOptions, resolve, reject) {
  gmailApiSync.authorizeWithToken(tkn, function(err, oauth) {
    if (err) {
		
      return reject(err);
    } else {
      if (full) {
        gmailApiSync.queryMessages(oauth, syncOptions, function(err, response) {
          if (err) {
            return reject(err);
          }
          return resolve(response);
          //console.log(response);
        });
      } else {
        gmailApiSync.syncMessages(oauth, syncOptions, function(err, response) {
          if (err) {
            return reject(err);
          }
          //console.log(response.emails);
          return resolve(response);
        });
      }
    }
  });
}

function getHomePageCallback() {
  const fullSyncOptions = { query: "from: ncnt.io" };
  setOauthCredentials().catch(console.error);
  gmail = google.gmail({ version: "v1", oauth2Client });
  initEmailWatcher();
  new Promise(function(resolve, reject) {
    syncMessages(true, fullSyncOptions, resolve, reject);
  })
    .then(function(response) {
      //console.log(response);
      startHistoryId = response.historyId;
      console.log(startHistoryId);
      subscription.on(`message`, messageHandler);
      console.log("after message here");
      //subscription.on(`error`, errorHandler);
    })
    .catch(function(error) {
      console.log(error);
    });
}

function main() {
  initJobCent();
  //console.log(oauthUrl);
  //opn(oauthUrl);
  getHomePageCallback();
  app.listen(gmailPort, err => {
    if (err) {
      console.log(`failed to listen to ${gmailPort}`, err);
    }
  });
}
////////////////////////CODE\\\\\\\\\\\\\\\\\\\\\\\\\\\\
main();
