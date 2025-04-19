// node_modules/ibantools/jsnext/ibantools.js
function isValidIBAN(iban, validationOptions) {
  if (validationOptions === void 0) {
    validationOptions = { allowQRIBAN: true };
  }
  if (iban === void 0 || iban === null)
    return false;
  var reg = new RegExp("^[0-9]{2}$", "");
  var countryCode = iban.slice(0, 2);
  var spec = countrySpecs[countryCode];
  if (spec === void 0 || spec.bban_regexp === void 0 || spec.bban_regexp === null || spec.chars === void 0)
    return false;
  return spec.chars === iban.length && reg.test(iban.slice(2, 4)) && isValidBBAN(iban.slice(4), countryCode) && isValidIBANChecksum(iban) && (validationOptions.allowQRIBAN || !isQRIBAN(iban));
}
var ValidationErrorsIBAN;
(function(ValidationErrorsIBAN2) {
  ValidationErrorsIBAN2[ValidationErrorsIBAN2["NoIBANProvided"] = 0] = "NoIBANProvided";
  ValidationErrorsIBAN2[ValidationErrorsIBAN2["NoIBANCountry"] = 1] = "NoIBANCountry";
  ValidationErrorsIBAN2[ValidationErrorsIBAN2["WrongBBANLength"] = 2] = "WrongBBANLength";
  ValidationErrorsIBAN2[ValidationErrorsIBAN2["WrongBBANFormat"] = 3] = "WrongBBANFormat";
  ValidationErrorsIBAN2[ValidationErrorsIBAN2["ChecksumNotNumber"] = 4] = "ChecksumNotNumber";
  ValidationErrorsIBAN2[ValidationErrorsIBAN2["WrongIBANChecksum"] = 5] = "WrongIBANChecksum";
  ValidationErrorsIBAN2[ValidationErrorsIBAN2["WrongAccountBankBranchChecksum"] = 6] = "WrongAccountBankBranchChecksum";
  ValidationErrorsIBAN2[ValidationErrorsIBAN2["QRIBANNotAllowed"] = 7] = "QRIBANNotAllowed";
})(ValidationErrorsIBAN || (ValidationErrorsIBAN = {}));
function validateIBAN(iban, validationOptions) {
  if (validationOptions === void 0) {
    validationOptions = { allowQRIBAN: true };
  }
  var result = { errorCodes: [], valid: true };
  if (iban !== void 0 && iban !== null && iban !== "") {
    var spec = countrySpecs[iban.slice(0, 2)];
    if (!spec || !(spec.bban_regexp || spec.chars)) {
      result.valid = false;
      result.errorCodes.push(ValidationErrorsIBAN.NoIBANCountry);
      return result;
    }
    if (spec && spec.chars && spec.chars !== iban.length) {
      result.valid = false;
      result.errorCodes.push(ValidationErrorsIBAN.WrongBBANLength);
    }
    if (spec && spec.bban_regexp && !checkFormatBBAN(iban.slice(4), spec.bban_regexp)) {
      result.valid = false;
      result.errorCodes.push(ValidationErrorsIBAN.WrongBBANFormat);
    }
    if (spec && spec.bban_validation_func && !spec.bban_validation_func(iban.slice(4))) {
      result.valid = false;
      result.errorCodes.push(ValidationErrorsIBAN.WrongAccountBankBranchChecksum);
    }
    var reg = new RegExp("^[0-9]{2}$", "");
    if (!reg.test(iban.slice(2, 4))) {
      result.valid = false;
      result.errorCodes.push(ValidationErrorsIBAN.ChecksumNotNumber);
    }
    if (result.errorCodes.indexOf(ValidationErrorsIBAN.WrongBBANFormat) !== -1 || !isValidIBANChecksum(iban)) {
      result.valid = false;
      result.errorCodes.push(ValidationErrorsIBAN.WrongIBANChecksum);
    }
    if (!validationOptions.allowQRIBAN && isQRIBAN(iban)) {
      result.valid = false;
      result.errorCodes.push(ValidationErrorsIBAN.QRIBANNotAllowed);
    }
  } else {
    result.valid = false;
    result.errorCodes.push(ValidationErrorsIBAN.NoIBANProvided);
  }
  return result;
}
function isValidBBAN(bban, countryCode) {
  if (bban === void 0 || bban === null || countryCode === void 0 || countryCode === null)
    return false;
  var spec = countrySpecs[countryCode];
  if (spec === void 0 || spec === null || spec.bban_regexp === void 0 || spec.bban_regexp === null || spec.chars === void 0 || spec.chars === null)
    return false;
  if (spec.chars - 4 === bban.length && checkFormatBBAN(bban, spec.bban_regexp)) {
    if (spec.bban_validation_func) {
      return spec.bban_validation_func(bban.replace(/[\s.]+/g, ""));
    }
    return true;
  }
  return false;
}
function isQRIBAN(iban) {
  if (iban === void 0 || iban === null)
    return false;
  var countryCode = iban.slice(0, 2);
  var QRIBANCountries = ["LI", "CH"];
  if (!QRIBANCountries.includes(countryCode))
    return false;
  var reg = new RegExp("^3[0-1]{1}[0-9]{3}$", "");
  return reg.test(iban.slice(4, 9));
}
function extractIBAN(iban) {
  var result = {};
  var eFormatIBAN = electronicFormatIBAN(iban);
  result.iban = eFormatIBAN || iban;
  if (!!eFormatIBAN && isValidIBAN(eFormatIBAN)) {
    result.bban = eFormatIBAN.slice(4);
    result.countryCode = eFormatIBAN.slice(0, 2);
    result.valid = true;
    var spec = countrySpecs[result.countryCode];
    if (spec.account_indentifier) {
      var ac = spec.account_indentifier.split("-");
      var starting = parseInt(ac[0]);
      var ending = parseInt(ac[1]);
      result.accountNumber = result.iban.slice(starting, ending + 1);
    }
    if (spec.bank_identifier) {
      var ac = spec.bank_identifier.split("-");
      var starting = parseInt(ac[0]);
      var ending = parseInt(ac[1]);
      result.bankIdentifier = result.bban.slice(starting, ending + 1);
    }
    if (spec.branch_indentifier) {
      var ac = spec.branch_indentifier.split("-");
      var starting = parseInt(ac[0]);
      var ending = parseInt(ac[1]);
      result.branchIdentifier = result.bban.slice(starting, ending + 1);
    }
  } else {
    result.valid = false;
  }
  return result;
}
function checkFormatBBAN(bban, bformat) {
  var reg = new RegExp(bformat, "");
  return reg.test(bban);
}
function electronicFormatIBAN(iban) {
  if (typeof iban !== "string") {
    return null;
  }
  return iban.replace(/[-\ ]/g, "").toUpperCase();
}
function friendlyFormatIBAN(iban, separator) {
  if (typeof iban !== "string") {
    return null;
  }
  if (separator === void 0 || separator === null) {
    separator = " ";
  }
  var electronic_iban = electronicFormatIBAN(iban);
  if (electronic_iban === null) {
    return null;
  }
  return electronic_iban.replace(/(.{4})(?!$)/g, "$1" + separator);
}
function isValidIBANChecksum(iban) {
  var countryCode = iban.slice(0, 2);
  var providedChecksum = parseInt(iban.slice(2, 4), 10);
  var bban = iban.slice(4);
  var validationString = replaceCharaterWithCode("".concat(bban).concat(countryCode, "00"));
  var rest = mod9710(validationString);
  return 98 - rest === providedChecksum;
}
function replaceCharaterWithCode(str) {
  return str.split("").map(function(c) {
    var code = c.charCodeAt(0);
    return code >= 65 ? (code - 55).toString() : c;
  }).join("");
}
var ValidationErrorsBIC;
(function(ValidationErrorsBIC2) {
  ValidationErrorsBIC2[ValidationErrorsBIC2["NoBICProvided"] = 0] = "NoBICProvided";
  ValidationErrorsBIC2[ValidationErrorsBIC2["NoBICCountry"] = 1] = "NoBICCountry";
  ValidationErrorsBIC2[ValidationErrorsBIC2["WrongBICFormat"] = 2] = "WrongBICFormat";
})(ValidationErrorsBIC || (ValidationErrorsBIC = {}));
var checkNorwayBBAN = function(bban) {
  var weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  var bbanWithoutSpacesAndPeriods = bban.replace(/[\s.]+/g, "");
  var controlDigit = parseInt(bbanWithoutSpacesAndPeriods.charAt(10), 10);
  var bbanWithoutControlDigit = bbanWithoutSpacesAndPeriods.substring(0, 10);
  var sum = 0;
  for (var index = 0; index < 10; index++) {
    sum += parseInt(bbanWithoutControlDigit.charAt(index), 10) * weights[index];
  }
  var remainder = sum % 11;
  return controlDigit === (remainder === 0 ? 0 : 11 - remainder);
};
var checkBelgianBBAN = function(bban) {
  var stripped = bban.replace(/[\s.]+/g, "");
  var checkingPart = parseInt(stripped.substring(0, stripped.length - 2), 10);
  var checksum = parseInt(stripped.substring(stripped.length - 2, stripped.length), 10);
  var remainder = checkingPart % 97 === 0 ? 97 : checkingPart % 97;
  return remainder === checksum;
};
var mod9710 = function(validationString) {
  while (validationString.length > 2) {
    var part = validationString.slice(0, 6);
    var partInt = parseInt(part, 10);
    if (isNaN(partInt)) {
      return NaN;
    }
    validationString = partInt % 97 + validationString.slice(part.length);
  }
  return parseInt(validationString, 10) % 97;
};
var checkMod9710BBAN = function(bban) {
  var stripped = bban.replace(/[\s.]+/g, "");
  var reminder = mod9710(stripped);
  return reminder === 1;
};
var checkPolandBBAN = function(bban) {
  var weights = [3, 9, 7, 1, 3, 9, 7];
  var controlDigit = parseInt(bban.charAt(7), 10);
  var toCheck = bban.substring(0, 7);
  var sum = 0;
  for (var index = 0; index < 7; index++) {
    sum += parseInt(toCheck.charAt(index), 10) * weights[index];
  }
  var remainder = sum % 10;
  return controlDigit === (remainder === 0 ? 0 : 10 - remainder);
};
var checkSpainBBAN = function(bban) {
  var weightsBankBranch = [4, 8, 5, 10, 9, 7, 3, 6];
  var weightsAccount = [1, 2, 4, 8, 5, 10, 9, 7, 3, 6];
  var controlBankBranch = parseInt(bban.charAt(8), 10);
  var controlAccount = parseInt(bban.charAt(9), 10);
  var bankBranch = bban.substring(0, 8);
  var account = bban.substring(10, 20);
  var sum = 0;
  for (var index = 0; index < 8; index++) {
    sum += parseInt(bankBranch.charAt(index), 10) * weightsBankBranch[index];
  }
  var remainder = sum % 11;
  if (controlBankBranch !== (remainder === 0 ? 0 : remainder === 1 ? 1 : 11 - remainder)) {
    return false;
  }
  sum = 0;
  for (var index = 0; index < 10; index++) {
    sum += parseInt(account.charAt(index), 10) * weightsAccount[index];
  }
  remainder = sum % 11;
  return controlAccount === (remainder === 0 ? 0 : remainder === 1 ? 1 : 11 - remainder);
};
var checkMod1110 = function(toCheck, control) {
  var nr = 10;
  for (var index = 0; index < toCheck.length; index++) {
    nr += parseInt(toCheck.charAt(index), 10);
    if (nr % 10 !== 0) {
      nr = nr % 10;
    }
    nr = nr * 2;
    nr = nr % 11;
  }
  return control === (11 - nr === 10 ? 0 : 11 - nr);
};
var checkCroatianBBAN = function(bban) {
  var controlBankBranch = parseInt(bban.charAt(6), 10);
  var controlAccount = parseInt(bban.charAt(16), 10);
  var bankBranch = bban.substring(0, 6);
  var account = bban.substring(7, 16);
  return checkMod1110(bankBranch, controlBankBranch) && checkMod1110(account, controlAccount);
};
var checkCzechAndSlovakBBAN = function(bban) {
  var weightsPrefix = [10, 5, 8, 4, 2, 1];
  var weightsSuffix = [6, 3, 7, 9, 10, 5, 8, 4, 2, 1];
  var controlPrefix = parseInt(bban.charAt(9), 10);
  var controlSuffix = parseInt(bban.charAt(19), 10);
  var prefix = bban.substring(4, 9);
  var suffix = bban.substring(10, 19);
  var sum = 0;
  for (var index = 0; index < prefix.length; index++) {
    sum += parseInt(prefix.charAt(index), 10) * weightsPrefix[index];
  }
  var remainder = sum % 11;
  if (controlPrefix !== (remainder === 0 ? 0 : remainder === 1 ? 1 : 11 - remainder)) {
    return false;
  }
  sum = 0;
  for (var index = 0; index < suffix.length; index++) {
    sum += parseInt(suffix.charAt(index), 10) * weightsSuffix[index];
  }
  remainder = sum % 11;
  return controlSuffix === (remainder === 0 ? 0 : remainder === 1 ? 1 : 11 - remainder);
};
var checkEstonianBBAN = function(bban) {
  var weights = [7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7];
  var controlDigit = parseInt(bban.charAt(15), 10);
  var toCheck = bban.substring(2, 15);
  var sum = 0;
  for (var index = 0; index < toCheck.length; index++) {
    sum += parseInt(toCheck.charAt(index), 10) * weights[index];
  }
  var remainder = sum % 10;
  return controlDigit === (remainder === 0 ? 0 : 10 - remainder);
};
var checkFrenchBBAN = function(bban) {
  var stripped = bban.replace(/[\s.]+/g, "");
  var normalized = Array.from(stripped);
  for (var index = 0; index < stripped.length; index++) {
    var c = normalized[index].charCodeAt(0);
    if (c >= 65) {
      switch (c) {
        case 65:
        case 74:
          normalized[index] = "1";
          break;
        case 66:
        case 75:
        case 83:
          normalized[index] = "2";
          break;
        case 67:
        case 76:
        case 84:
          normalized[index] = "3";
          break;
        case 68:
        case 77:
        case 85:
          normalized[index] = "4";
          break;
        case 69:
        case 78:
        case 86:
          normalized[index] = "5";
          break;
        case 70:
        case 79:
        case 87:
          normalized[index] = "6";
          break;
        case 71:
        case 80:
        case 88:
          normalized[index] = "7";
          break;
        case 72:
        case 81:
        case 89:
          normalized[index] = "8";
          break;
        case 73:
        case 82:
        case 90:
          normalized[index] = "9";
          break;
      }
    }
  }
  var remainder = mod9710(normalized.join(""));
  return remainder === 0;
};
var checkHungarianBBAN = function(bban) {
  var weights = [9, 7, 3, 1, 9, 7, 3, 1, 9, 7, 3, 1, 9, 7, 3];
  var controlDigitBankBranch = parseInt(bban.charAt(7), 10);
  var toCheckBankBranch = bban.substring(0, 7);
  var sum = 0;
  for (var index = 0; index < toCheckBankBranch.length; index++) {
    sum += parseInt(toCheckBankBranch.charAt(index), 10) * weights[index];
  }
  var remainder = sum % 10;
  if (controlDigitBankBranch !== (remainder === 0 ? 0 : 10 - remainder)) {
    return false;
  }
  sum = 0;
  if (bban.endsWith("00000000")) {
    var toCheckAccount = bban.substring(8, 15);
    var controlDigitAccount = parseInt(bban.charAt(15), 10);
    for (var index = 0; index < toCheckAccount.length; index++) {
      sum += parseInt(toCheckAccount.charAt(index), 10) * weights[index];
    }
    var remainder_1 = sum % 10;
    return controlDigitAccount === (remainder_1 === 0 ? 0 : 10 - remainder_1);
  } else {
    var toCheckAccount = bban.substring(8, 23);
    var controlDigitAccount = parseInt(bban.charAt(23), 10);
    for (var index = 0; index < toCheckAccount.length; index++) {
      sum += parseInt(toCheckAccount.charAt(index), 10) * weights[index];
    }
    var remainder_2 = sum % 10;
    return controlDigitAccount === (remainder_2 === 0 ? 0 : 10 - remainder_2);
  }
};
var countrySpecs = {
  AD: {
    chars: 24,
    bban_regexp: "^[0-9]{8}[A-Z0-9]{12}$",
    IBANRegistry: true,
    SEPA: true,
    branch_indentifier: "4-7",
    bank_identifier: "0-3",
    account_indentifier: "8-24"
  },
  AE: {
    chars: 23,
    bban_regexp: "^[0-9]{3}[0-9]{16}$",
    IBANRegistry: true,
    bank_identifier: "0-2",
    account_indentifier: "7-23"
  },
  AF: {},
  AG: {},
  AI: {},
  AL: {
    chars: 28,
    bban_regexp: "^[0-9]{8}[A-Z0-9]{16}$",
    IBANRegistry: true,
    branch_indentifier: "3-7",
    bank_identifier: "0-2",
    account_indentifier: "12-28"
  },
  AM: {},
  AO: {
    chars: 25,
    bban_regexp: "^[0-9]{21}$"
  },
  AQ: {},
  AR: {},
  AS: {},
  AT: { chars: 20, bban_regexp: "^[0-9]{16}$", IBANRegistry: true, SEPA: true, bank_identifier: "0-4" },
  AU: {},
  AW: {},
  AX: {
    chars: 18,
    bban_regexp: "^[0-9]{14}$",
    IBANRegistry: true
  },
  AZ: {
    chars: 28,
    bban_regexp: "^[A-Z]{4}[A-Z0-9]{20}$",
    IBANRegistry: true,
    bank_identifier: "0-3",
    account_indentifier: "4-28"
  },
  BA: {
    chars: 20,
    bban_regexp: "^[0-9]{16}$",
    bban_validation_func: checkMod9710BBAN,
    IBANRegistry: true,
    branch_indentifier: "3-5",
    bank_identifier: "0-2"
  },
  BB: {},
  BD: {},
  BE: {
    chars: 16,
    bban_regexp: "^[0-9]{12}$",
    bban_validation_func: checkBelgianBBAN,
    IBANRegistry: true,
    SEPA: true,
    bank_identifier: "0-2",
    account_indentifier: "0-16"
  },
  BF: {
    chars: 28,
    bban_regexp: "^[A-Z0-9]{2}[0-9]{22}$"
  },
  BG: {
    chars: 22,
    bban_regexp: "^[A-Z]{4}[0-9]{6}[A-Z0-9]{8}$",
    IBANRegistry: true,
    SEPA: true,
    branch_indentifier: "4-7",
    bank_identifier: "0-3"
  },
  BH: {
    chars: 22,
    bban_regexp: "^[A-Z]{4}[A-Z0-9]{14}$",
    IBANRegistry: true,
    bank_identifier: "0-3",
    account_indentifier: "8-22"
  },
  BI: {
    chars: 27,
    bban_regexp: "^[0-9]{23}$",
    branch_indentifier: "5-9",
    bank_identifier: "0-4",
    account_indentifier: "14-27"
  },
  BJ: {
    chars: 28,
    bban_regexp: "^[A-Z0-9]{2}[0-9]{22}$"
  },
  BL: {
    chars: 27,
    bban_regexp: "^[0-9]{10}[A-Z0-9]{11}[0-9]{2}$"
  },
  BM: {},
  BN: {},
  BO: {},
  BQ: {},
  BR: {
    chars: 29,
    bban_regexp: "^[0-9]{23}[A-Z]{1}[A-Z0-9]{1}$",
    IBANRegistry: true,
    branch_indentifier: "8-12",
    bank_identifier: "0-7",
    account_indentifier: "17-29"
  },
  BS: {},
  BT: {},
  BV: {},
  BW: {},
  BY: {
    chars: 28,
    bban_regexp: "^[A-Z]{4}[0-9]{4}[A-Z0-9]{16}$",
    IBANRegistry: true,
    bank_identifier: "0-3"
  },
  BZ: {},
  CA: {},
  CC: {},
  CD: {},
  CF: {
    chars: 27,
    bban_regexp: "^[0-9]{23}$"
  },
  CG: {
    chars: 27,
    bban_regexp: "^[0-9]{23}$"
  },
  CH: {
    chars: 21,
    bban_regexp: "^[0-9]{5}[A-Z0-9]{12}$",
    IBANRegistry: true,
    SEPA: true,
    bank_identifier: "0-4"
  },
  CI: {
    chars: 28,
    bban_regexp: "^[A-Z]{1}[0-9]{23}$"
  },
  CK: {},
  CL: {},
  CM: {
    chars: 27,
    bban_regexp: "^[0-9]{23}$"
  },
  CN: {},
  CO: {},
  CR: {
    chars: 22,
    bban_regexp: "^[0-9]{18}$",
    IBANRegistry: true,
    bank_identifier: "0-3",
    account_indentifier: "8-22"
  },
  CU: {},
  CV: { chars: 25, bban_regexp: "^[0-9]{21}$" },
  CW: {},
  CX: {},
  CY: {
    chars: 28,
    bban_regexp: "^[0-9]{8}[A-Z0-9]{16}$",
    IBANRegistry: true,
    SEPA: true,
    branch_indentifier: "3-7",
    bank_identifier: "0-2",
    account_indentifier: "12-28"
  },
  CZ: {
    chars: 24,
    bban_regexp: "^[0-9]{20}$",
    bban_validation_func: checkCzechAndSlovakBBAN,
    IBANRegistry: true,
    SEPA: true,
    bank_identifier: "0-3"
  },
  DE: {
    chars: 22,
    bban_regexp: "^[0-9]{18}$",
    IBANRegistry: true,
    SEPA: true,
    bank_identifier: "0-7",
    account_indentifier: "13-22"
  },
  DJ: {
    chars: 27,
    bban_regexp: "^[0-9]{23}$",
    branch_indentifier: "5-9",
    bank_identifier: "0-4",
    account_indentifier: "14-27"
  },
  DK: {
    chars: 18,
    bban_regexp: "^[0-9]{14}$",
    IBANRegistry: true,
    SEPA: true,
    bank_identifier: "0-3",
    account_indentifier: "4-18"
  },
  DM: {},
  DO: {
    chars: 28,
    bban_regexp: "^[A-Z]{4}[0-9]{20}$",
    IBANRegistry: true,
    bank_identifier: "0-3",
    account_indentifier: "8-28"
  },
  DZ: {
    chars: 26,
    bban_regexp: "^[0-9]{22}$"
  },
  EC: {},
  EE: {
    chars: 20,
    bban_regexp: "^[0-9]{16}$",
    bban_validation_func: checkEstonianBBAN,
    IBANRegistry: true,
    SEPA: true,
    bank_identifier: "0-1",
    account_indentifier: "8-20"
  },
  EG: {
    chars: 29,
    bban_regexp: "^[0-9]{25}",
    IBANRegistry: true,
    branch_indentifier: "4-7",
    bank_identifier: "0-3",
    account_indentifier: "17-29"
  },
  EH: {},
  ER: {},
  ES: {
    chars: 24,
    bban_validation_func: checkSpainBBAN,
    bban_regexp: "^[0-9]{20}$",
    IBANRegistry: true,
    SEPA: true,
    branch_indentifier: "4-7",
    bank_identifier: "0-3",
    account_indentifier: "14-24"
  },
  ET: {},
  FI: {
    chars: 18,
    bban_regexp: "^[0-9]{14}$",
    IBANRegistry: true,
    SEPA: true,
    bank_identifier: "0-2",
    account_indentifier: "0-0"
  },
  FJ: {},
  FK: {
    chars: 18,
    bban_regexp: "^[A-Z]{2}[0-9]{12}$",
    bank_identifier: "0-1",
    account_indentifier: "6-18"
  },
  FM: {},
  FO: {
    chars: 18,
    bban_regexp: "^[0-9]{14}$",
    IBANRegistry: true,
    bank_identifier: "0-3",
    account_indentifier: "4-18"
  },
  FR: {
    chars: 27,
    bban_regexp: "^[0-9]{10}[A-Z0-9]{11}[0-9]{2}$",
    bban_validation_func: checkFrenchBBAN,
    IBANRegistry: true,
    SEPA: true,
    bank_identifier: "0-4",
    branch_indentifier: "5-9",
    account_indentifier: "14-24"
  },
  GA: {
    chars: 27,
    bban_regexp: "^[0-9]{23}$"
  },
  GB: {
    chars: 22,
    bban_regexp: "^[A-Z]{4}[0-9]{14}$",
    IBANRegistry: true,
    SEPA: true,
    branch_indentifier: "4-9",
    bank_identifier: "0-3"
  },
  GD: {},
  GE: {
    chars: 22,
    bban_regexp: "^[A-Z0-9]{2}[0-9]{16}$",
    IBANRegistry: true,
    bank_identifier: "0-1",
    account_indentifier: "6-22"
  },
  GF: {
    chars: 27,
    bban_regexp: "^[0-9]{10}[A-Z0-9]{11}[0-9]{2}$",
    IBANRegistry: true
  },
  GG: {},
  GH: {},
  GI: {
    chars: 23,
    bban_regexp: "^[A-Z]{4}[A-Z0-9]{15}$",
    IBANRegistry: true,
    SEPA: true,
    bank_identifier: "0-3",
    account_indentifier: "8-23"
  },
  GL: {
    chars: 18,
    bban_regexp: "^[0-9]{14}$",
    IBANRegistry: true,
    bank_identifier: "0-3",
    account_indentifier: "4-18"
  },
  GM: {},
  GN: {},
  GP: {
    chars: 27,
    bban_regexp: "^[0-9]{10}[A-Z0-9]{11}[0-9]{2}$",
    IBANRegistry: true
  },
  GQ: {
    chars: 27,
    bban_regexp: "^[0-9]{23}$"
  },
  GR: {
    chars: 27,
    bban_regexp: "^[0-9]{7}[A-Z0-9]{16}$",
    IBANRegistry: true,
    SEPA: true,
    branch_indentifier: "3-6",
    bank_identifier: "0-2",
    account_indentifier: "7-27"
  },
  GS: {},
  GT: {
    chars: 28,
    bban_regexp: "^[A-Z0-9]{24}$",
    IBANRegistry: true,
    bank_identifier: "0-3",
    account_indentifier: "8-28"
  },
  GU: {},
  GW: {
    chars: 25,
    bban_regexp: "^[A-Z]{2}[0-9]{19}$"
  },
  GY: {},
  HK: {},
  HM: {},
  HN: {
    chars: 28,
    bban_regexp: "^[A-Z]{4}[0-9]{20}$"
  },
  HR: {
    chars: 21,
    bban_regexp: "^[0-9]{17}$",
    bban_validation_func: checkCroatianBBAN,
    IBANRegistry: true,
    SEPA: true,
    bank_identifier: "0-6"
  },
  HT: {},
  HU: {
    chars: 28,
    bban_regexp: "^[0-9]{24}$",
    bban_validation_func: checkHungarianBBAN,
    IBANRegistry: true,
    SEPA: true,
    branch_indentifier: "3-6",
    bank_identifier: "0-2"
  },
  ID: {},
  IE: {
    chars: 22,
    bban_regexp: "^[A-Z0-9]{4}[0-9]{14}$",
    IBANRegistry: true,
    SEPA: true,
    branch_indentifier: "4-9",
    bank_identifier: "0-3"
  },
  IL: {
    chars: 23,
    bban_regexp: "^[0-9]{19}$",
    IBANRegistry: true,
    branch_indentifier: "3-5",
    bank_identifier: "0-2"
  },
  IM: {},
  IN: {},
  IO: {},
  IQ: {
    chars: 23,
    bban_regexp: "^[A-Z]{4}[0-9]{15}$",
    IBANRegistry: true,
    branch_indentifier: "4-6",
    bank_identifier: "0-3",
    account_indentifier: "11-23"
  },
  IR: {
    chars: 26,
    bban_regexp: "^[0-9]{22}$"
  },
  IS: {
    chars: 26,
    bban_regexp: "^[0-9]{22}$",
    IBANRegistry: true,
    SEPA: true,
    branch_indentifier: "2-3",
    bank_identifier: "0-1"
  },
  IT: {
    chars: 27,
    bban_regexp: "^[A-Z]{1}[0-9]{10}[A-Z0-9]{12}$",
    IBANRegistry: true,
    SEPA: true,
    branch_indentifier: "6-10",
    bank_identifier: "1-5",
    account_indentifier: "4-27"
  },
  JE: {},
  JM: {},
  JO: {
    chars: 30,
    bban_regexp: "^[A-Z]{4}[0-9]{4}[A-Z0-9]{18}$",
    IBANRegistry: true,
    branch_indentifier: "4-7",
    bank_identifier: "4-7"
  },
  JP: {},
  KE: {},
  KG: {},
  KH: {},
  KI: {},
  KM: {
    chars: 27,
    bban_regexp: "^[0-9]{23}$"
  },
  KN: {},
  KP: {},
  KR: {},
  KW: {
    chars: 30,
    bban_regexp: "^[A-Z]{4}[A-Z0-9]{22}$",
    IBANRegistry: true,
    bank_identifier: "0-3",
    account_indentifier: "20-30"
  },
  KY: {},
  KZ: {
    chars: 20,
    bban_regexp: "^[0-9]{3}[A-Z0-9]{13}$",
    IBANRegistry: true,
    bank_identifier: "0-2",
    account_indentifier: "0-20"
  },
  LA: {},
  LB: {
    chars: 28,
    bban_regexp: "^[0-9]{4}[A-Z0-9]{20}$",
    IBANRegistry: true,
    bank_identifier: "0-3",
    account_indentifier: "14-28"
  },
  LC: {
    chars: 32,
    bban_regexp: "^[A-Z]{4}[A-Z0-9]{24}$",
    IBANRegistry: true,
    bank_identifier: "0-3",
    account_indentifier: "8-32"
  },
  LI: {
    chars: 21,
    bban_regexp: "^[0-9]{5}[A-Z0-9]{12}$",
    IBANRegistry: true,
    SEPA: true,
    bank_identifier: "0-4"
  },
  LK: {},
  LR: {},
  LS: {},
  LT: { chars: 20, bban_regexp: "^[0-9]{16}$", IBANRegistry: true, SEPA: true, bank_identifier: "0-4" },
  LU: {
    chars: 20,
    bban_regexp: "^[0-9]{3}[A-Z0-9]{13}$",
    IBANRegistry: true,
    SEPA: true,
    bank_identifier: "0-2"
  },
  LV: {
    chars: 21,
    bban_regexp: "^[A-Z]{4}[A-Z0-9]{13}$",
    IBANRegistry: true,
    SEPA: true,
    bank_identifier: "0-3",
    account_indentifier: "0-21"
  },
  LY: {
    chars: 25,
    bban_regexp: "^[0-9]{21}$",
    IBANRegistry: true,
    branch_indentifier: "3-5",
    bank_identifier: "0-2",
    account_indentifier: "10-25"
  },
  MA: {
    chars: 28,
    bban_regexp: "^[0-9]{24}$"
  },
  MC: {
    chars: 27,
    bban_regexp: "^[0-9]{10}[A-Z0-9]{11}[0-9]{2}$",
    bban_validation_func: checkFrenchBBAN,
    IBANRegistry: true,
    SEPA: true,
    branch_indentifier: "5-9",
    bank_identifier: "0-4"
  },
  MD: {
    chars: 24,
    bban_regexp: "^[A-Z0-9]{2}[A-Z0-9]{18}$",
    IBANRegistry: true,
    bank_identifier: "0-1",
    account_indentifier: "6-24"
  },
  ME: {
    chars: 22,
    bban_regexp: "^[0-9]{18}$",
    bban_validation_func: checkMod9710BBAN,
    IBANRegistry: true,
    bank_identifier: "0-2",
    account_indentifier: "4-22"
  },
  MF: {
    chars: 27,
    bban_regexp: "^[0-9]{10}[A-Z0-9]{11}[0-9]{2}$",
    IBANRegistry: true
  },
  MG: {
    chars: 27,
    bban_regexp: "^[0-9]{23}$"
  },
  MH: {},
  MK: {
    chars: 19,
    bban_regexp: "^[0-9]{3}[A-Z0-9]{10}[0-9]{2}$",
    bban_validation_func: checkMod9710BBAN,
    IBANRegistry: true,
    bank_identifier: "0-2"
  },
  ML: {
    chars: 28,
    bban_regexp: "^[A-Z0-9]{2}[0-9]{22}$"
  },
  MM: {},
  MN: {
    chars: 20,
    bban_regexp: "^[0-9]{16}$",
    IBANRegistry: true,
    bank_identifier: "0-3",
    account_indentifier: "8-20"
  },
  MO: {},
  MP: {},
  MQ: {
    chars: 27,
    bban_regexp: "^[0-9]{10}[A-Z0-9]{11}[0-9]{2}$",
    IBANRegistry: true
  },
  MR: {
    chars: 27,
    bban_regexp: "^[0-9]{23}$",
    IBANRegistry: true,
    branch_indentifier: "5-9",
    bank_identifier: "0-4",
    account_indentifier: "4-27"
  },
  MS: {},
  MT: {
    chars: 31,
    bban_regexp: "^[A-Z]{4}[0-9]{5}[A-Z0-9]{18}$",
    IBANRegistry: true,
    SEPA: true,
    branch_indentifier: "4-8",
    bank_identifier: "0-3",
    account_indentifier: "15-31"
  },
  MU: {
    chars: 30,
    bban_regexp: "^[A-Z]{4}[0-9]{19}[A-Z]{3}$",
    IBANRegistry: true,
    branch_indentifier: "6-7",
    bank_identifier: "0-5",
    account_indentifier: "0-30"
  },
  MV: {},
  MW: {},
  MX: {},
  MY: {},
  MZ: {
    chars: 25,
    bban_regexp: "^[0-9]{21}$"
  },
  NA: {},
  NC: {
    chars: 27,
    bban_regexp: "^[0-9]{10}[A-Z0-9]{11}[0-9]{2}$",
    IBANRegistry: true
  },
  NE: {
    chars: 28,
    bban_regexp: "^[A-Z]{2}[0-9]{22}$"
  },
  NF: {},
  NG: {},
  NI: {
    chars: 28,
    bban_regexp: "^[A-Z]{4}[0-9]{20}$",
    bank_identifier: "0-3",
    IBANRegistry: true,
    account_indentifier: "8-28"
  },
  NL: {
    chars: 18,
    bban_regexp: "^[A-Z]{4}[0-9]{10}$",
    IBANRegistry: true,
    SEPA: true,
    bank_identifier: "0-3",
    account_indentifier: "8-18"
  },
  NO: {
    chars: 15,
    bban_regexp: "^[0-9]{11}$",
    bban_validation_func: checkNorwayBBAN,
    IBANRegistry: true,
    SEPA: true,
    bank_identifier: "0-3",
    account_indentifier: "4-15"
  },
  NP: {},
  NR: {},
  NU: {},
  NZ: {},
  OM: {
    chars: 23,
    bban_regexp: "^[0-9]{3}[A-Z0-9]{16}$",
    IBANRegistry: true,
    SEPA: false,
    bank_identifier: "0-2"
  },
  PA: {},
  PE: {},
  PF: {
    chars: 27,
    bban_regexp: "^[0-9]{10}[A-Z0-9]{11}[0-9]{2}$",
    IBANRegistry: true
  },
  PG: {},
  PH: {},
  PK: {
    chars: 24,
    bban_regexp: "^[A-Z0-9]{4}[0-9]{16}$",
    IBANRegistry: true,
    bank_identifier: "0-3"
  },
  PL: {
    chars: 28,
    bban_validation_func: checkPolandBBAN,
    bban_regexp: "^[0-9]{24}$",
    IBANRegistry: true,
    SEPA: true,
    branch_indentifier: "0-7",
    account_indentifier: "2-28"
  },
  PM: {
    chars: 27,
    bban_regexp: "^[0-9]{10}[A-Z0-9]{11}[0-9]{2}$",
    IBANRegistry: true
  },
  PN: {},
  PR: {},
  PS: {
    chars: 29,
    bban_regexp: "^[A-Z0-9]{4}[0-9]{21}$",
    IBANRegistry: true,
    bank_identifier: "0-3",
    account_indentifier: "17-29"
  },
  PT: {
    chars: 25,
    bban_regexp: "^[0-9]{21}$",
    bban_validation_func: checkMod9710BBAN,
    IBANRegistry: true,
    SEPA: true,
    bank_identifier: "0-3"
  },
  PW: {},
  PY: {},
  QA: {
    chars: 29,
    bban_regexp: "^[A-Z]{4}[A-Z0-9]{21}$",
    IBANRegistry: true,
    bank_identifier: "0-3",
    account_indentifier: "8-29"
  },
  RE: {
    chars: 27,
    bban_regexp: "^[0-9]{10}[A-Z0-9]{11}[0-9]{2}$",
    IBANRegistry: true
  },
  RO: {
    chars: 24,
    bban_regexp: "^[A-Z]{4}[A-Z0-9]{16}$",
    IBANRegistry: true,
    SEPA: true,
    bank_identifier: "0-3",
    account_indentifier: "0-24"
  },
  RS: {
    chars: 22,
    bban_regexp: "^[0-9]{18}$",
    bban_validation_func: checkMod9710BBAN,
    IBANRegistry: true,
    bank_identifier: "0-2"
  },
  RU: {
    chars: 33,
    bban_regexp: "^[0-9]{14}[A-Z0-9]{15}$",
    IBANRegistry: true,
    branch_indentifier: "9-13",
    bank_identifier: "0-8",
    account_indentifier: "13-33"
  },
  RW: {},
  SA: {
    chars: 24,
    bban_regexp: "^[0-9]{2}[A-Z0-9]{18}$",
    IBANRegistry: true,
    bank_identifier: "0-1",
    account_indentifier: "12-24"
  },
  SB: {},
  SC: {
    chars: 31,
    bban_regexp: "^[A-Z]{4}[0-9]{20}[A-Z]{3}$",
    IBANRegistry: true,
    branch_indentifier: "6-7",
    bank_identifier: "0-5",
    account_indentifier: "12-28"
  },
  SD: {
    chars: 18,
    bban_regexp: "^[0-9]{14}$",
    IBANRegistry: true,
    bank_identifier: "0-1",
    account_indentifier: "6-18"
  },
  SE: { chars: 24, bban_regexp: "^[0-9]{20}$", IBANRegistry: true, SEPA: true, bank_identifier: "0-2" },
  SG: {},
  SH: {},
  SI: {
    chars: 19,
    bban_regexp: "^[0-9]{15}$",
    bban_validation_func: checkMod9710BBAN,
    IBANRegistry: true,
    SEPA: true,
    branch_indentifier: "2-4",
    bank_identifier: "0-1",
    account_indentifier: "9-16"
  },
  SJ: {},
  SK: {
    chars: 24,
    bban_regexp: "^[0-9]{20}$",
    bban_validation_func: checkCzechAndSlovakBBAN,
    IBANRegistry: true,
    SEPA: true
  },
  SL: {},
  SM: {
    chars: 27,
    bban_regexp: "^[A-Z]{1}[0-9]{10}[A-Z0-9]{12}$",
    IBANRegistry: true,
    SEPA: true,
    branch_indentifier: "6-10"
  },
  SN: {
    chars: 28,
    bban_regexp: "^[A-Z]{2}[0-9]{22}$"
  },
  SO: {
    chars: 23,
    bban_regexp: "^[0-9]{19}$",
    IBANRegistry: true,
    branch_indentifier: "4-6",
    account_indentifier: "11-23"
  },
  SR: {},
  SS: {},
  ST: {
    chars: 25,
    bban_regexp: "^[0-9]{21}$",
    IBANRegistry: true,
    branch_indentifier: "4-7"
  },
  SV: {
    chars: 28,
    bban_regexp: "^[A-Z]{4}[0-9]{20}$",
    IBANRegistry: true,
    account_indentifier: "8-28"
  },
  SX: {},
  SY: {},
  SZ: {},
  TC: {},
  TD: {
    chars: 27,
    bban_regexp: "^[0-9]{23}$"
  },
  TF: {
    chars: 27,
    bban_regexp: "^[0-9]{10}[A-Z0-9]{11}[0-9]{2}$",
    IBANRegistry: true
  },
  TG: {
    chars: 28,
    bban_regexp: "^[A-Z]{2}[0-9]{22}$"
  },
  TH: {},
  TJ: {},
  TK: {},
  TL: {
    chars: 23,
    bban_regexp: "^[0-9]{19}$",
    IBANRegistry: true,
    account_indentifier: "4-23"
  },
  TM: {},
  TN: {
    chars: 24,
    bban_regexp: "^[0-9]{20}$",
    IBANRegistry: true,
    branch_indentifier: "2-4",
    account_indentifier: "4-24"
  },
  TO: {},
  TR: {
    chars: 26,
    bban_regexp: "^[0-9]{5}[A-Z0-9]{17}$",
    IBANRegistry: true
  },
  TT: {},
  TV: {},
  TW: {},
  TZ: {},
  UA: {
    chars: 29,
    bban_regexp: "^[0-9]{6}[A-Z0-9]{19}$",
    IBANRegistry: true,
    account_indentifier: "15-29"
  },
  UG: {},
  UM: {},
  US: {},
  UY: {},
  UZ: {},
  VA: {
    chars: 22,
    bban_regexp: "^[0-9]{18}",
    IBANRegistry: true,
    SEPA: true,
    account_indentifier: "7-22"
  },
  VC: {},
  VE: {},
  VG: {
    chars: 24,
    bban_regexp: "^[A-Z0-9]{4}[0-9]{16}$",
    IBANRegistry: true,
    account_indentifier: "8-24"
  },
  VI: {},
  VN: {},
  VU: {},
  WF: {
    chars: 27,
    bban_regexp: "^[0-9]{10}[A-Z0-9]{11}[0-9]{2}$",
    IBANRegistry: true
  },
  WS: {},
  XK: {
    chars: 20,
    bban_regexp: "^[0-9]{16}$",
    IBANRegistry: true,
    branch_indentifier: "2-3",
    account_indentifier: "4-20"
  },
  YE: {},
  YT: {
    chars: 27,
    bban_regexp: "^[0-9]{10}[A-Z0-9]{11}[0-9]{2}$",
    IBANRegistry: true
  },
  ZA: {},
  ZM: {},
  ZW: {}
};

// src/run.js
var ibanErrorToMessage = {
  [ValidationErrorsIBAN.NoIBANProvided]: "No IBAN provided",
  [ValidationErrorsIBAN.NoIBANCountry]: "No IBAN country",
  [ValidationErrorsIBAN.WrongBBANLength]: "Wrong BBAN length",
  [ValidationErrorsIBAN.WrongBBANFormat]: "Wrong BBAN format",
  [ValidationErrorsIBAN.ChecksumNotNumber]: "Checksum is not a number",
  [ValidationErrorsIBAN.WrongIBANChecksum]: "Wrong IBAN checksum",
  [ValidationErrorsIBAN.WrongAccountBankBranchChecksum]: "Wrong account bank branch checksum",
  [ValidationErrorsIBAN.QRIBANNotAllowed]: "QR-IBAN not allowed"
};
function getFriendlyErrors(errorCodes) {
  return errorCodes.map((errorCode) => ibanErrorToMessage[errorCode]).filter(Boolean);
}
function run(input) {
  const { iban } = input;
  if (!iban) {
    return { error: "Please enter an IBAN" };
  }
  const normalizedIban = iban.toUpperCase().replace(/\s/g, "").replace(/-/g, "");
  if (!/^[A-Z0-9]+$/.test(normalizedIban)) {
    return { error: "Invalid IBAN format: only letters and numbers are allowed" };
  }
  try {
    const { valid: isIbanValid, errorCodes } = validateIBAN(normalizedIban);
    const { countryCode, bban } = extractIBAN(normalizedIban);
    const errors = getFriendlyErrors(errorCodes || []);
    const details = [
      { label: "Is IBAN valid?", value: isIbanValid ? "Yes" : "No" },
      { label: "Is IBAN a QR-IBAN?", value: isQRIBAN(normalizedIban) ? "Yes" : "No" },
      { label: "Country code", value: countryCode || "Unknown" },
      { label: "BBAN", value: bban || "Unknown" },
      { label: "IBAN friendly format", value: friendlyFormatIBAN(normalizedIban) || normalizedIban }
    ];
    if (errors.length > 0) {
      details.splice(1, 0, { label: "IBAN errors", value: errors });
    }
    return { details };
  } catch (error) {
    return { error: "Failed to process IBAN: " + error.message };
  }
}
export {
  run
};
/*! Bundled license information:

ibantools/jsnext/ibantools.js:
  (*!
   * @license
   * Copyright Saša Jovanić
   * Licensed under the Mozilla Public License, Version 2.0 or the MIT license,
   * at your option. This file may not be copied, modified, or distributed
   * except according to those terms.
   * SPDX-FileCopyrightText: Saša Jovanić
   * SPDX-License-Identifier: MIT or MPL/2.0
   *)
  (**
   * Validation, extraction and creation of IBAN, BBAN, BIC/SWIFT numbers plus some other helpful stuff
   * @package Documentation
   * @author Saša Jovanić
   * @module ibantools
   * @version 4.5.1
   * @license MIT or MPL-2.0
   * @preferred
   *)
*/
