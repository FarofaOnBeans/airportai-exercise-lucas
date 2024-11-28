

const bcrypt = require('bcrypt');

function isPasswordGood(passw){
  let regxSpecialCharacter = /[\W]/g;
  let regxUppercase = /[A-Z]/g;
  return (
    regxSpecialCharacter.test(passw) &&
    regxUppercase.test(passw) &&
    passw.length >= 8
  )
}

async function hashPassword(passw){
  return await bcrypt.hashSync(passw, 10);
}

module.exports = {
  isPasswordGood,
  hashPassword
}