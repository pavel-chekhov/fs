function getAllUrlParams(url) {
  const queryString = url
    ? (url.split("?")[1] || "").split("#")[0]
    : window.location.search.slice(1);
  const params = {};

  if (!queryString) {
    return params;
  }

  queryString.split("&").forEach((pair) => {
    if (!pair) {
      return;
    }

    const [rawKey, rawValue] = pair.split("=");
    let arrayIndex;
    const normalizedKey = rawKey.replace(/\[\d*\]/, (match) => {
      arrayIndex = match.slice(1, -1);
      return "";
    }).toLowerCase();
    const value = typeof rawValue === "undefined" ? true : decodeURIComponent(rawValue);

    if (Object.prototype.hasOwnProperty.call(params, normalizedKey)) {
      if (typeof params[normalizedKey] === "string") {
        params[normalizedKey] = [params[normalizedKey]];
      }

      if (typeof arrayIndex === "undefined") {
        params[normalizedKey].push(value);
      } else {
        params[normalizedKey][arrayIndex] = value;
      }
    } else {
      params[normalizedKey] = value;
    }
  });

  return params;
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

function getGoogleClientId() {
  return typeof gaGlobal === "undefined" || !gaGlobal || !gaGlobal.vid
    ? "not set"
    : gaGlobal.vid;
}

function getTrackingFieldValue(fieldName, extraValues) {
  const params = getAllUrlParams();

  if (Object.prototype.hasOwnProperty.call(extraValues, fieldName)) {
    return extraValues[fieldName];
  }

  switch (fieldName) {
    case "client_id_google":
      return getGoogleClientId();
    case "referrer":
      return document.referrer;
    case "url":
      return document.location.href;
    case "user_agent":
      return navigator.userAgent;
    case "_fbp":
      return getCookie(fieldName) || "";
    case "_fbc":
      return getCookie(fieldName) || window.fbc_ || "";
    default:
      return params[fieldName] || "";
  }
}

function updateNinjaFields(fieldMap, extraValues) {
  Object.entries(fieldMap).forEach(([fieldId, fieldName]) => {
    const value = getTrackingFieldValue(fieldName, extraValues);
    jQuery("#nf-field-" + fieldId).val(value).trigger("change");
  });
}

function updatePhoneNumbers() {
  const phoneNumbers = {
    google: "+16475588567",
    facebook: "+16475585597"
  };
  const params = getAllUrlParams();
  const utmSource = params.utm_source ? String(params.utm_source).toLowerCase() : "";

  if (!Object.prototype.hasOwnProperty.call(phoneNumbers, utmSource)) {
    return;
  }

  const phoneForLink = phoneNumbers[utmSource];
  const phoneForText = phoneForLink.replace(
    /(\+\d{1})(\d{3})(\d{3})(\d{4})/,
    "$1 $2 $3 $4"
  );

  document.querySelectorAll("a[href^='tel:']").forEach((link) => {
    link.setAttribute("href", "tel:" + phoneForLink);
    link.textContent = phoneForText;
  });
}

updatePhoneNumbers();
[500, 1000, 3000, 6000].forEach((delay) => {
  setTimeout(updatePhoneNumbers, delay);
});

(function generateFbc() {
  const urlParams = new URLSearchParams(window.location.search);
  const fbclid = urlParams.get("fbclid");

  if (!fbclid) {
    return;
  }

  const hostname = window.location.hostname;
  const subdomainIndex = hostname.split(".").length - 1;
  const creationTime = Date.now();

  window.fbc_ = "fb." + subdomainIndex + "." + creationTime + "." + fbclid;
})();

const Calculator = {
  style: "",
  size: "",
  ft: 1,
  price: 3000,

  settings: {
    minPrice: 3000,
    specialPriceThreshold: 250,
    specialPriceText: "Contact us for a special price*!"
  },

  priceConfig: {
    "basic-privacy": {
      "6-x-6": [
        { maxExclusive: 80, rate: 70 },
        { maxExclusive: 150, rate: 68 },
        { maxInclusive: 250, rate: 65 }
      ],
      "4-x-4": [
        { maxExclusive: 80, rate: 65 },
        { maxExclusive: 150, rate: 63 },
        { maxInclusive: 250, rate: 60 }
      ]
    },
    "full-or-semi-privacy": {
      "6-x-6": [
        { maxExclusive: 80, rate: 75 },
        { maxExclusive: 150, rate: 72 },
        { maxInclusive: 250, rate: 70 }
      ],
      "4-x-4": [
        { maxExclusive: 80, rate: 71 },
        { maxExclusive: 150, rate: 68 },
        { maxInclusive: 250, rate: 65 }
      ]
    }
  },

  fields: {
    37: "price",
    38: "client_id_google",
    39: "utm_source",
    40: "utm_medium",
    41: "utm_campaign",
    42: "utm_term",
    43: "referrer",
    44: "utm_content",
    45: "url",
    76: "gclid",
    77: "fbclid",
    78: "user_agent",
    79: "_fbp",
    80: "_fbc"
  },

  fieldValue: {
    price: undefined,
    linear_feet: undefined,
    post_size: undefined,
    fence_style: undefined
  },

  readInputs: function() {
    const styleInput = document.querySelector('input[name="nf-field-24"]:checked');
    const sizeInput = document.querySelector('input[name="nf-field-25"]:checked');
    const ftInput = document.querySelector('input[name="nf-field-26"]');
    const ftRaw = ftInput ? ftInput.value : "";
    const ftParsed = parseFloat(ftRaw);

    this.style = styleInput ? styleInput.value : "";
    this.size = sizeInput ? sizeInput.value : "";
    this.ft = Number.isNaN(ftParsed) ? 0 : ftParsed;

    this.fieldValue.fence_style = this.style;
    this.fieldValue.post_size = this.size;
    this.fieldValue.linear_feet = ftRaw;
  },

  getRate: function(style, size, ft) {
    const sizeRules = this.priceConfig[style] && this.priceConfig[style][size];

    if (!sizeRules) {
      return null;
    }

    for (const rule of sizeRules) {
      if (typeof rule.maxExclusive !== "undefined" && ft < rule.maxExclusive) {
        return rule.rate;
      }

      if (typeof rule.maxInclusive !== "undefined" && ft <= rule.maxInclusive) {
        return rule.rate;
      }
    }

    return null;
  },

  updateFields: function() {
    updateNinjaFields(this.fields, {
      price: this.price == null ? "" : this.price
    });
  },

  getPrice: function() {
    this.readInputs();

    const priceElement = document.getElementById("price");
    const sizeKey = this.size === "4-x-4" || this.size === "6-x-6" ? this.size : "";
    const rate = this.getRate(this.style, sizeKey, this.ft);
    const isSpecialPrice = rate === null || this.ft > this.settings.specialPriceThreshold;

    window.dataLayer = window.dataLayer || [];

    if (isSpecialPrice) {
      this.price = null;
      this.fieldValue.price = null;
    } else {
      this.price = Math.max(this.ft * rate, this.settings.minPrice);
      this.fieldValue.price = this.price;
    }

    window.dataLayer.push({
      event: "calculation",
      field_value: this.fieldValue
    });

    if (priceElement) {
      priceElement.textContent = isSpecialPrice
        ? this.settings.specialPriceText
        : "$" + this.price + "*";
    }

    this.updateFields();
  }
};

const ContactForm = {
  fields: {
    48: "client_id_google",
    49: "utm_source",
    50: "utm_medium",
    51: "utm_campaign",
    52: "utm_term",
    53: "referrer",
    54: "utm_content",
    55: "url",
    81: "gclid",
    82: "fbclid",
    83: "user_agent",
    84: "_fbp",
    85: "_fbc"
  },

  updateFields: function() {
    updateNinjaFields(this.fields, {});
  }
};

function syncPostSizeAvailability() {
  const privacyInput = document.getElementById("nf-field-24-2");
  const size4Input = document.getElementById("nf-field-25-0");
  const size6Input = document.getElementById("nf-field-25-1");

  if (!privacyInput || !size4Input || !size6Input) {
    return;
  }

  const shouldForceSixBySix = privacyInput.checked;
  size4Input.disabled = shouldForceSixBySix;

  if (shouldForceSixBySix && !size6Input.checked) {
    size6Input.click();
  }
}

jQuery(document).ready(function() {
  jQuery(document).on("click", "#calculate", Calculator.getPrice.bind(Calculator));
  jQuery(document).on("change", "#nf-field-33", Calculator.updateFields.bind(Calculator));
  jQuery(document).on("change", "#nf-field-34", Calculator.updateFields.bind(Calculator));
  jQuery(document).on("change", "#nf-field-1", ContactForm.updateFields.bind(ContactForm));
  jQuery(document).on("change", "#nf-field-8", ContactForm.updateFields.bind(ContactForm));
  jQuery("#nf-form-3-cont").on("change", "#nf-field-24-0, #nf-field-24-1, #nf-field-24-2", syncPostSizeAvailability);

  syncPostSizeAvailability();
});
