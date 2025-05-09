var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/credit-card-type/dist/lib/card-types.js
var require_card_types = __commonJS({
  "node_modules/credit-card-type/dist/lib/card-types.js"(exports, module) {
    "use strict";
    var cardTypes = {
      visa: {
        niceType: "Visa",
        type: "visa",
        patterns: [4],
        gaps: [4, 8, 12],
        lengths: [16, 18, 19],
        code: {
          name: "CVV",
          size: 3
        }
      },
      mastercard: {
        niceType: "Mastercard",
        type: "mastercard",
        patterns: [[51, 55], [2221, 2229], [223, 229], [23, 26], [270, 271], 2720],
        gaps: [4, 8, 12],
        lengths: [16],
        code: {
          name: "CVC",
          size: 3
        }
      },
      "american-express": {
        niceType: "American Express",
        type: "american-express",
        patterns: [34, 37],
        gaps: [4, 10],
        lengths: [15],
        code: {
          name: "CID",
          size: 4
        }
      },
      "diners-club": {
        niceType: "Diners Club",
        type: "diners-club",
        patterns: [[300, 305], 36, 38, 39],
        gaps: [4, 10],
        lengths: [14, 16, 19],
        code: {
          name: "CVV",
          size: 3
        }
      },
      discover: {
        niceType: "Discover",
        type: "discover",
        patterns: [6011, [644, 649], 65],
        gaps: [4, 8, 12],
        lengths: [16, 19],
        code: {
          name: "CID",
          size: 3
        }
      },
      jcb: {
        niceType: "JCB",
        type: "jcb",
        patterns: [2131, 1800, [3528, 3589]],
        gaps: [4, 8, 12],
        lengths: [16, 17, 18, 19],
        code: {
          name: "CVV",
          size: 3
        }
      },
      unionpay: {
        niceType: "UnionPay",
        type: "unionpay",
        patterns: [
          620,
          [62100, 62182],
          [62184, 62187],
          [62185, 62197],
          [62200, 62205],
          [622010, 622999],
          622018,
          [62207, 62209],
          [623, 626],
          6270,
          6272,
          6276,
          [627700, 627779],
          [627781, 627799],
          [6282, 6289],
          6291,
          6292,
          810,
          [8110, 8131],
          [8132, 8151],
          [8152, 8163],
          [8164, 8171]
        ],
        gaps: [4, 8, 12],
        lengths: [14, 15, 16, 17, 18, 19],
        code: {
          name: "CVN",
          size: 3
        }
      },
      maestro: {
        niceType: "Maestro",
        type: "maestro",
        patterns: [
          493698,
          [5e5, 504174],
          [504176, 506698],
          [506779, 508999],
          [56, 59],
          63,
          67,
          6
        ],
        gaps: [4, 8, 12],
        lengths: [12, 13, 14, 15, 16, 17, 18, 19],
        code: {
          name: "CVC",
          size: 3
        }
      },
      elo: {
        niceType: "Elo",
        type: "elo",
        patterns: [
          401178,
          401179,
          438935,
          457631,
          457632,
          431274,
          451416,
          457393,
          504175,
          [506699, 506778],
          [509e3, 509999],
          627780,
          636297,
          636368,
          [650031, 650033],
          [650035, 650051],
          [650405, 650439],
          [650485, 650538],
          [650541, 650598],
          [650700, 650718],
          [650720, 650727],
          [650901, 650978],
          [651652, 651679],
          [655e3, 655019],
          [655021, 655058]
        ],
        gaps: [4, 8, 12],
        lengths: [16],
        code: {
          name: "CVE",
          size: 3
        }
      },
      mir: {
        niceType: "Mir",
        type: "mir",
        patterns: [[2200, 2204]],
        gaps: [4, 8, 12],
        lengths: [16, 17, 18, 19],
        code: {
          name: "CVP2",
          size: 3
        }
      },
      hiper: {
        niceType: "Hiper",
        type: "hiper",
        patterns: [637095, 63737423, 63743358, 637568, 637599, 637609, 637612],
        gaps: [4, 8, 12],
        lengths: [16],
        code: {
          name: "CVC",
          size: 3
        }
      },
      hipercard: {
        niceType: "Hipercard",
        type: "hipercard",
        patterns: [606282],
        gaps: [4, 8, 12],
        lengths: [16],
        code: {
          name: "CVC",
          size: 3
        }
      }
    };
    module.exports = cardTypes;
  }
});

// node_modules/credit-card-type/dist/lib/clone.js
var require_clone = __commonJS({
  "node_modules/credit-card-type/dist/lib/clone.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.clone = void 0;
    function clone(originalObject) {
      if (!originalObject) {
        return null;
      }
      return JSON.parse(JSON.stringify(originalObject));
    }
    exports.clone = clone;
  }
});

// node_modules/credit-card-type/dist/lib/matches.js
var require_matches = __commonJS({
  "node_modules/credit-card-type/dist/lib/matches.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.matches = void 0;
    function matchesRange(cardNumber, min, max) {
      var maxLengthToCheck = String(min).length;
      var substr = cardNumber.substr(0, maxLengthToCheck);
      var integerRepresentationOfCardNumber = parseInt(substr, 10);
      min = parseInt(String(min).substr(0, substr.length), 10);
      max = parseInt(String(max).substr(0, substr.length), 10);
      return integerRepresentationOfCardNumber >= min && integerRepresentationOfCardNumber <= max;
    }
    function matchesPattern(cardNumber, pattern) {
      pattern = String(pattern);
      return pattern.substring(0, cardNumber.length) === cardNumber.substring(0, pattern.length);
    }
    function matches(cardNumber, pattern) {
      if (Array.isArray(pattern)) {
        return matchesRange(cardNumber, pattern[0], pattern[1]);
      }
      return matchesPattern(cardNumber, pattern);
    }
    exports.matches = matches;
  }
});

// node_modules/credit-card-type/dist/lib/add-matching-cards-to-results.js
var require_add_matching_cards_to_results = __commonJS({
  "node_modules/credit-card-type/dist/lib/add-matching-cards-to-results.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.addMatchingCardsToResults = void 0;
    var clone_1 = require_clone();
    var matches_1 = require_matches();
    function addMatchingCardsToResults(cardNumber, cardConfiguration, results) {
      var i, patternLength;
      for (i = 0; i < cardConfiguration.patterns.length; i++) {
        var pattern = cardConfiguration.patterns[i];
        if (!(0, matches_1.matches)(cardNumber, pattern)) {
          continue;
        }
        var clonedCardConfiguration = (0, clone_1.clone)(cardConfiguration);
        if (Array.isArray(pattern)) {
          patternLength = String(pattern[0]).length;
        } else {
          patternLength = String(pattern).length;
        }
        if (cardNumber.length >= patternLength) {
          clonedCardConfiguration.matchStrength = patternLength;
        }
        results.push(clonedCardConfiguration);
        break;
      }
    }
    exports.addMatchingCardsToResults = addMatchingCardsToResults;
  }
});

// node_modules/credit-card-type/dist/lib/is-valid-input-type.js
var require_is_valid_input_type = __commonJS({
  "node_modules/credit-card-type/dist/lib/is-valid-input-type.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isValidInputType = void 0;
    function isValidInputType(cardNumber) {
      return typeof cardNumber === "string" || cardNumber instanceof String;
    }
    exports.isValidInputType = isValidInputType;
  }
});

// node_modules/credit-card-type/dist/lib/find-best-match.js
var require_find_best_match = __commonJS({
  "node_modules/credit-card-type/dist/lib/find-best-match.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.findBestMatch = void 0;
    function hasEnoughResultsToDetermineBestMatch(results) {
      var numberOfResultsWithMaxStrengthProperty = results.filter(function(result) {
        return result.matchStrength;
      }).length;
      return numberOfResultsWithMaxStrengthProperty > 0 && numberOfResultsWithMaxStrengthProperty === results.length;
    }
    function findBestMatch(results) {
      if (!hasEnoughResultsToDetermineBestMatch(results)) {
        return null;
      }
      return results.reduce(function(bestMatch, result) {
        if (!bestMatch) {
          return result;
        }
        if (Number(bestMatch.matchStrength) < Number(result.matchStrength)) {
          return result;
        }
        return bestMatch;
      });
    }
    exports.findBestMatch = findBestMatch;
  }
});

// node_modules/credit-card-type/dist/index.js
var require_dist = __commonJS({
  "node_modules/credit-card-type/dist/index.js"(exports, module) {
    "use strict";
    var __assign = exports && exports.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    var cardTypes = require_card_types();
    var add_matching_cards_to_results_1 = require_add_matching_cards_to_results();
    var is_valid_input_type_1 = require_is_valid_input_type();
    var find_best_match_1 = require_find_best_match();
    var clone_1 = require_clone();
    var customCards = {};
    var cardNames = {
      VISA: "visa",
      MASTERCARD: "mastercard",
      AMERICAN_EXPRESS: "american-express",
      DINERS_CLUB: "diners-club",
      DISCOVER: "discover",
      JCB: "jcb",
      UNIONPAY: "unionpay",
      MAESTRO: "maestro",
      ELO: "elo",
      MIR: "mir",
      HIPER: "hiper",
      HIPERCARD: "hipercard"
    };
    var ORIGINAL_TEST_ORDER = [
      cardNames.VISA,
      cardNames.MASTERCARD,
      cardNames.AMERICAN_EXPRESS,
      cardNames.DINERS_CLUB,
      cardNames.DISCOVER,
      cardNames.JCB,
      cardNames.UNIONPAY,
      cardNames.MAESTRO,
      cardNames.ELO,
      cardNames.MIR,
      cardNames.HIPER,
      cardNames.HIPERCARD
    ];
    var testOrder = (0, clone_1.clone)(ORIGINAL_TEST_ORDER);
    function findType(cardType) {
      return customCards[cardType] || cardTypes[cardType];
    }
    function getAllCardTypes() {
      return testOrder.map(function(cardType) {
        return (0, clone_1.clone)(findType(cardType));
      });
    }
    function getCardPosition(name, ignoreErrorForNotExisting) {
      if (ignoreErrorForNotExisting === void 0) {
        ignoreErrorForNotExisting = false;
      }
      var position = testOrder.indexOf(name);
      if (!ignoreErrorForNotExisting && position === -1) {
        throw new Error('"' + name + '" is not a supported card type.');
      }
      return position;
    }
    function creditCardType(cardNumber) {
      var results = [];
      if (!(0, is_valid_input_type_1.isValidInputType)(cardNumber)) {
        return results;
      }
      if (cardNumber.length === 0) {
        return getAllCardTypes();
      }
      testOrder.forEach(function(cardType) {
        var cardConfiguration = findType(cardType);
        (0, add_matching_cards_to_results_1.addMatchingCardsToResults)(cardNumber, cardConfiguration, results);
      });
      var bestMatch = (0, find_best_match_1.findBestMatch)(results);
      if (bestMatch) {
        return [bestMatch];
      }
      return results;
    }
    creditCardType.getTypeInfo = function(cardType) {
      return (0, clone_1.clone)(findType(cardType));
    };
    creditCardType.removeCard = function(name) {
      var position = getCardPosition(name);
      testOrder.splice(position, 1);
    };
    creditCardType.addCard = function(config) {
      var existingCardPosition = getCardPosition(config.type, true);
      customCards[config.type] = config;
      if (existingCardPosition === -1) {
        testOrder.push(config.type);
      }
    };
    creditCardType.updateCard = function(cardType, updates) {
      var originalObject = customCards[cardType] || cardTypes[cardType];
      if (!originalObject) {
        throw new Error('"'.concat(cardType, "\" is not a recognized type. Use `addCard` instead.'"));
      }
      if (updates.type && originalObject.type !== updates.type) {
        throw new Error("Cannot overwrite type parameter.");
      }
      var clonedCard = (0, clone_1.clone)(originalObject);
      clonedCard = __assign(__assign({}, clonedCard), updates);
      customCards[clonedCard.type] = clonedCard;
    };
    creditCardType.changeOrder = function(name, position) {
      var currentPosition = getCardPosition(name);
      testOrder.splice(currentPosition, 1);
      testOrder.splice(position, 0, name);
    };
    creditCardType.resetModifications = function() {
      testOrder = (0, clone_1.clone)(ORIGINAL_TEST_ORDER);
      customCards = {};
    };
    creditCardType.types = cardNames;
    module.exports = creditCardType;
  }
});

// node_modules/card-validator/dist/cardholder-name.js
var require_cardholder_name = __commonJS({
  "node_modules/card-validator/dist/cardholder-name.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.cardholderName = void 0;
    var CARD_NUMBER_REGEX = /^[\d\s-]*$/;
    var MAX_LENGTH = 255;
    function verification(isValid, isPotentiallyValid) {
      return { isValid, isPotentiallyValid };
    }
    function cardholderName(value) {
      if (typeof value !== "string") {
        return verification(false, false);
      }
      if (value.length === 0) {
        return verification(false, true);
      }
      if (value.length > MAX_LENGTH) {
        return verification(false, false);
      }
      if (CARD_NUMBER_REGEX.test(value)) {
        return verification(false, true);
      }
      return verification(true, true);
    }
    exports.cardholderName = cardholderName;
  }
});

// node_modules/card-validator/dist/luhn-10.js
var require_luhn_10 = __commonJS({
  "node_modules/card-validator/dist/luhn-10.js"(exports, module) {
    "use strict";
    function luhn10(identifier) {
      var sum = 0;
      var alt = false;
      var i = identifier.length - 1;
      var num;
      while (i >= 0) {
        num = parseInt(identifier.charAt(i), 10);
        if (alt) {
          num *= 2;
          if (num > 9) {
            num = num % 10 + 1;
          }
        }
        alt = !alt;
        sum += num;
        i--;
      }
      return sum % 10 === 0;
    }
    module.exports = luhn10;
  }
});

// node_modules/card-validator/dist/card-number.js
var require_card_number = __commonJS({
  "node_modules/card-validator/dist/card-number.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.cardNumber = void 0;
    var luhn10 = require_luhn_10();
    var getCardTypes = require_dist();
    function verification(card, isPotentiallyValid, isValid) {
      return {
        card,
        isPotentiallyValid,
        isValid
      };
    }
    function cardNumber(value, options) {
      if (options === void 0) {
        options = {};
      }
      var isPotentiallyValid, isValid, maxLength;
      if (typeof value !== "string" && typeof value !== "number") {
        return verification(null, false, false);
      }
      var testCardValue = String(value).replace(/-|\s/g, "");
      if (!/^\d*$/.test(testCardValue)) {
        return verification(null, false, false);
      }
      var potentialTypes = getCardTypes(testCardValue);
      if (potentialTypes.length === 0) {
        return verification(null, false, false);
      } else if (potentialTypes.length !== 1) {
        return verification(null, true, false);
      }
      var cardType = potentialTypes[0];
      if (options.maxLength && testCardValue.length > options.maxLength) {
        return verification(cardType, false, false);
      }
      if (options.skipLuhnValidation === true || cardType.type === getCardTypes.types.UNIONPAY && options.luhnValidateUnionPay !== true) {
        isValid = true;
      } else {
        isValid = luhn10(testCardValue);
      }
      maxLength = Math.max.apply(null, cardType.lengths);
      if (options.maxLength) {
        maxLength = Math.min(options.maxLength, maxLength);
      }
      for (var i = 0; i < cardType.lengths.length; i++) {
        if (cardType.lengths[i] === testCardValue.length) {
          isPotentiallyValid = testCardValue.length < maxLength || isValid;
          return verification(cardType, isPotentiallyValid, isValid);
        }
      }
      return verification(cardType, testCardValue.length < maxLength, false);
    }
    exports.cardNumber = cardNumber;
  }
});

// node_modules/card-validator/dist/expiration-year.js
var require_expiration_year = __commonJS({
  "node_modules/card-validator/dist/expiration-year.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.expirationYear = void 0;
    var DEFAULT_VALID_NUMBER_OF_YEARS_IN_THE_FUTURE = 19;
    function verification(isValid, isPotentiallyValid, isCurrentYear) {
      return {
        isValid,
        isPotentiallyValid,
        isCurrentYear: isCurrentYear || false
      };
    }
    function expirationYear(value, maxElapsedYear) {
      if (maxElapsedYear === void 0) {
        maxElapsedYear = DEFAULT_VALID_NUMBER_OF_YEARS_IN_THE_FUTURE;
      }
      var isCurrentYear;
      if (typeof value !== "string") {
        return verification(false, false);
      }
      if (value.replace(/\s/g, "") === "") {
        return verification(false, true);
      }
      if (!/^\d*$/.test(value)) {
        return verification(false, false);
      }
      var len = value.length;
      if (len < 2) {
        return verification(false, true);
      }
      var currentYear = (/* @__PURE__ */ new Date()).getFullYear();
      if (len === 3) {
        var firstTwo = value.slice(0, 2);
        var currentFirstTwo = String(currentYear).slice(0, 2);
        return verification(false, firstTwo === currentFirstTwo);
      }
      if (len > 4) {
        return verification(false, false);
      }
      var numericValue = parseInt(value, 10);
      var twoDigitYear = Number(String(currentYear).substr(2, 2));
      var valid2 = false;
      if (len === 2) {
        if (String(currentYear).substr(0, 2) === value) {
          return verification(false, true);
        }
        isCurrentYear = twoDigitYear === numericValue;
        valid2 = numericValue >= twoDigitYear && numericValue <= twoDigitYear + maxElapsedYear;
      } else if (len === 4) {
        isCurrentYear = currentYear === numericValue;
        valid2 = numericValue >= currentYear && numericValue <= currentYear + maxElapsedYear;
      }
      return verification(valid2, valid2, isCurrentYear);
    }
    exports.expirationYear = expirationYear;
  }
});

// node_modules/card-validator/dist/lib/is-array.js
var require_is_array = __commonJS({
  "node_modules/card-validator/dist/lib/is-array.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isArray = void 0;
    exports.isArray = Array.isArray || function(arg) {
      return Object.prototype.toString.call(arg) === "[object Array]";
    };
  }
});

// node_modules/card-validator/dist/lib/parse-date.js
var require_parse_date = __commonJS({
  "node_modules/card-validator/dist/lib/parse-date.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseDate = void 0;
    var expiration_year_1 = require_expiration_year();
    var is_array_1 = require_is_array();
    function getNumberOfMonthDigitsInDateString(dateString) {
      var firstCharacter = Number(dateString[0]);
      var assumedYear;
      if (firstCharacter === 0) {
        return 2;
      }
      if (firstCharacter > 1) {
        return 1;
      }
      if (firstCharacter === 1 && Number(dateString[1]) > 2) {
        return 1;
      }
      if (firstCharacter === 1) {
        assumedYear = dateString.substr(1);
        return (0, expiration_year_1.expirationYear)(assumedYear).isPotentiallyValid ? 1 : 2;
      }
      if (dateString.length === 5) {
        return 1;
      }
      if (dateString.length > 5) {
        return 2;
      }
      return 1;
    }
    function parseDate(datestring) {
      var date;
      if (/^\d{4}-\d{1,2}$/.test(datestring)) {
        date = datestring.split("-").reverse();
      } else if (/\//.test(datestring)) {
        date = datestring.split(/\s*\/\s*/g);
      } else if (/\s/.test(datestring)) {
        date = datestring.split(/ +/g);
      }
      if ((0, is_array_1.isArray)(date)) {
        return {
          month: date[0] || "",
          year: date.slice(1).join()
        };
      }
      var numberOfDigitsInMonth = getNumberOfMonthDigitsInDateString(datestring);
      var month = datestring.substr(0, numberOfDigitsInMonth);
      return {
        month,
        year: datestring.substr(month.length)
      };
    }
    exports.parseDate = parseDate;
  }
});

// node_modules/card-validator/dist/expiration-month.js
var require_expiration_month = __commonJS({
  "node_modules/card-validator/dist/expiration-month.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.expirationMonth = void 0;
    function verification(isValid, isPotentiallyValid, isValidForThisYear) {
      return {
        isValid,
        isPotentiallyValid,
        isValidForThisYear: isValidForThisYear || false
      };
    }
    function expirationMonth(value) {
      var currentMonth = (/* @__PURE__ */ new Date()).getMonth() + 1;
      if (typeof value !== "string") {
        return verification(false, false);
      }
      if (value.replace(/\s/g, "") === "" || value === "0") {
        return verification(false, true);
      }
      if (!/^\d*$/.test(value)) {
        return verification(false, false);
      }
      var month = parseInt(value, 10);
      if (isNaN(Number(value))) {
        return verification(false, false);
      }
      var result = month > 0 && month < 13;
      return verification(result, result, result && month >= currentMonth);
    }
    exports.expirationMonth = expirationMonth;
  }
});

// node_modules/card-validator/dist/expiration-date.js
var require_expiration_date = __commonJS({
  "node_modules/card-validator/dist/expiration-date.js"(exports) {
    "use strict";
    var __assign = exports && exports.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.expirationDate = void 0;
    var parse_date_1 = require_parse_date();
    var expiration_month_1 = require_expiration_month();
    var expiration_year_1 = require_expiration_year();
    function verification(isValid, isPotentiallyValid, month, year) {
      return {
        isValid,
        isPotentiallyValid,
        month,
        year
      };
    }
    function expirationDate(value, maxElapsedYear) {
      var date;
      if (typeof value === "string") {
        value = value.replace(/^(\d\d) (\d\d(\d\d)?)$/, "$1/$2");
        date = (0, parse_date_1.parseDate)(String(value));
      } else if (value !== null && typeof value === "object") {
        var fullDate = __assign({}, value);
        date = {
          month: String(fullDate.month),
          year: String(fullDate.year)
        };
      } else {
        return verification(false, false, null, null);
      }
      var monthValid = (0, expiration_month_1.expirationMonth)(date.month);
      var yearValid = (0, expiration_year_1.expirationYear)(date.year, maxElapsedYear);
      if (monthValid.isValid) {
        if (yearValid.isCurrentYear) {
          var isValidForThisYear = monthValid.isValidForThisYear;
          return verification(isValidForThisYear, isValidForThisYear, date.month, date.year);
        }
        if (yearValid.isValid) {
          return verification(true, true, date.month, date.year);
        }
      }
      if (monthValid.isPotentiallyValid && yearValid.isPotentiallyValid) {
        return verification(false, true, null, null);
      }
      return verification(false, false, null, null);
    }
    exports.expirationDate = expirationDate;
  }
});

// node_modules/card-validator/dist/cvv.js
var require_cvv = __commonJS({
  "node_modules/card-validator/dist/cvv.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.cvv = void 0;
    var DEFAULT_LENGTH = 3;
    function includes(array, thing) {
      for (var i = 0; i < array.length; i++) {
        if (thing === array[i]) {
          return true;
        }
      }
      return false;
    }
    function max(array) {
      var maximum = DEFAULT_LENGTH;
      var i = 0;
      for (; i < array.length; i++) {
        maximum = array[i] > maximum ? array[i] : maximum;
      }
      return maximum;
    }
    function verification(isValid, isPotentiallyValid) {
      return { isValid, isPotentiallyValid };
    }
    function cvv(value, maxLength) {
      if (maxLength === void 0) {
        maxLength = DEFAULT_LENGTH;
      }
      maxLength = maxLength instanceof Array ? maxLength : [maxLength];
      if (typeof value !== "string") {
        return verification(false, false);
      }
      if (!/^\d*$/.test(value)) {
        return verification(false, false);
      }
      if (includes(maxLength, value.length)) {
        return verification(true, true);
      }
      if (value.length < Math.min.apply(null, maxLength)) {
        return verification(false, true);
      }
      if (value.length > max(maxLength)) {
        return verification(false, false);
      }
      return verification(true, true);
    }
    exports.cvv = cvv;
  }
});

// node_modules/card-validator/dist/postal-code.js
var require_postal_code = __commonJS({
  "node_modules/card-validator/dist/postal-code.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.postalCode = void 0;
    var DEFAULT_MIN_POSTAL_CODE_LENGTH = 3;
    var ALPHANUM = new RegExp(/^[a-z0-9]+$/i);
    function verification(isValid, isPotentiallyValid) {
      return { isValid, isPotentiallyValid };
    }
    function postalCode(value, options) {
      if (options === void 0) {
        options = {};
      }
      var minLength = options.minLength || DEFAULT_MIN_POSTAL_CODE_LENGTH;
      if (typeof value !== "string") {
        return verification(false, false);
      } else if (value.length < minLength) {
        return verification(false, true);
      } else if (!ALPHANUM.test(value.trim().slice(0, minLength))) {
        return verification(false, true);
      }
      return verification(true, true);
    }
    exports.postalCode = postalCode;
  }
});

// node_modules/card-validator/dist/index.js
var require_dist2 = __commonJS({
  "node_modules/card-validator/dist/index.js"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var creditCardType = __importStar(require_dist());
    var cardholder_name_1 = require_cardholder_name();
    var card_number_1 = require_card_number();
    var expiration_date_1 = require_expiration_date();
    var expiration_month_1 = require_expiration_month();
    var expiration_year_1 = require_expiration_year();
    var cvv_1 = require_cvv();
    var postal_code_1 = require_postal_code();
    var cardValidator = {
      creditCardType,
      cardholderName: cardholder_name_1.cardholderName,
      number: card_number_1.cardNumber,
      expirationDate: expiration_date_1.expirationDate,
      expirationMonth: expiration_month_1.expirationMonth,
      expirationYear: expiration_year_1.expirationYear,
      cvv: cvv_1.cvv,
      postalCode: postal_code_1.postalCode
    };
    module.exports = cardValidator;
  }
});

// src/run.js
var import_card_validator = __toESM(require_dist2());
function maskCardNumber(cardNumber) {
  const cleaned = cardNumber.replace(/\D/g, "");
  if (cleaned.length < 8) return cleaned;
  const firstFour = cleaned.slice(0, 4);
  const lastFour = cleaned.slice(-4);
  const maskedMiddle = "*".repeat(cleaned.length - 8);
  return `${firstFour}${maskedMiddle}${lastFour}`;
}
function run(input) {
  const { cardNumber } = input;
  if (!cardNumber) {
    return { error: "Please enter a credit card number" };
  }
  const normalizedCardNumber = cardNumber.replace(/\D/g, "");
  if (!/^\d+$/.test(normalizedCardNumber)) {
    return { error: "Invalid credit card format: only numbers are allowed" };
  }
  try {
    const numberValidation = import_card_validator.default.number(normalizedCardNumber);
    const details = [
      { label: "Is Card Valid?", value: numberValidation.isValid ? "Yes" : "No" },
      { label: "Is Potentially Valid?", value: numberValidation.isPotentiallyValid ? "Yes" : "No" },
      { label: "Card Type", value: numberValidation.card ? numberValidation.card.niceType : "Unknown" },
      { label: "Masked Format", value: maskCardNumber(normalizedCardNumber) }
    ];
    if (!numberValidation.isPotentiallyValid) {
      details.splice(1, 0, { label: "Error", value: "This card number cannot be valid" });
    }
    return { details };
  } catch (error) {
    return { error: "Failed to process credit card number: " + error.message };
  }
}
export {
  run
};
