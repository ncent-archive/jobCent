const otplib = require("otplib");

// const secret = otplib.authenticator.generateSecret();
// const notSecret = 333;

const secret = "IM2EQNSPJZVUKSLGJZ4EEQZZOFTVSSLR";
const token = otplib.authenticator.generate(secret);
// const token = 189031;

const isValid = otplib.authenticator.check(token, secret);
// or
// const isValid1 = otplib.authenticator.verify({ token, notSecret });

// const isValid2 = otplib.authenticator.verify({ token, notSecret });
// const isValid3 = otplib.authenticator.check(token, notSecret);

// console.log(secret);
// console.log(token);
// console.log(isValid);
// console.log(isValid1);
// console.log(isValid2);
// console.log(isValid3);
// console.log(otplib.authenticator.generate("secret"));
// console.log(otplib.authenticator.generate("secret"));
// console.log(otplib.authenticator.generate("secret"));
// console.log(otplib.authenticator.generate("secret"));
// console.log(otplib.authenticator.generate("secret"));
// console.log(otplib.authenticator.generate("secret"));

