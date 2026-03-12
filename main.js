// URL params
function getAllUrlParams(e){var i=e?e.split("?")[1]:window.location.search.slice(1),o={};if(i)for(var t=(i=i.split("#")[0]).split("&"),r=0;r<t.length;r++){var l=t[r].split("="),n=void 0,s=l[0].replace(/\[\d*\]/,function(e){return n=e.slice(1,-1),""}),a=void 0===l[1]||decodeURIComponent(l[1]);o[s=s.toLowerCase()]?("string"==typeof o[s]&&(o[s]=[o[s]]),void 0===n?o[s].push(a):o[s][n]=a):o[s]=a}return o}
	
// Phone number ////////////////////////////
function updatePhoneNumbers() {
  function getQueryParams() {
    const params = {};
    window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, (match, key, value) => {
      params[key] = decodeURIComponent(value);
    });
    return params;
  }

  const phoneNumbers = {
    "google": "+16475588567",
    "facebook": "+16475585597"
  };

  const params = getQueryParams();
  const utmSource = params["utm_source"] ? params["utm_source"].toLowerCase() : null;

  if (utmSource && phoneNumbers.hasOwnProperty(utmSource)) {
    const phoneForLink = phoneNumbers[utmSource];
    const phoneForText = phoneForLink.replace(/(\+\d{1})(\d{3})(\d{3})(\d{4})/, "$1 $2 $3 $4");

    document.querySelectorAll("a[href^='tel:']").forEach(link => {
      link.setAttribute("href", "tel:" + phoneForLink);
      link.textContent = phoneForText;
    });
  }
}

updatePhoneNumbers();
setTimeout(updatePhoneNumbers, 500);
setTimeout(updatePhoneNumbers, 1000);
setTimeout(updatePhoneNumbers, 3000);
setTimeout(updatePhoneNumbers, 6000);
	

// generating fbc ////////////////////////////
(function() {

  // Extract fbclid from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const fbclid = urlParams.get('fbclid');
  if (!fbclid) {
    //console.log('fbclid parameter is missing in the URL');
    return;
  }

  // Universal determination of subdomainIndex:
  // Calculate the number of dots in the hostname.
  // For example: 'com' -> 0, 'example.com' -> 1, 'www.example.com' -> 2
  const hostname = window.location.hostname;
  const subdomainIndex = hostname.split('.').length - 1;

  // Get the creation timestamp (current time, since the cookie was not stored)
  const creationTime = Date.now();

  // Format the fbc value according to the pattern: version.subdomainIndex.creationTime.fbclid
  // version is always "fb"
  window.fbc_ = `fb.${subdomainIndex}.${creationTime}.${fbclid}`;
})();
	
// Fance calculator ////////////////////////////
var Calculator = {
    style: '',
    size: '',
    ft: 1,
    price: 3000,

    settings: {
        minPrice: 3000,
        specialPriceThreshold: 250,
        specialPriceText: 'Contact us for a special price*!'
    },

    price_config: {
        'basic-privacy': {
            '6-x-6': [
                { maxExclusive: 80, rate: 70 },
                { maxExclusive: 150, rate: 68 },
                { maxInclusive: 250, rate: 65 }
            ],
            '4-x-4': [
                { maxExclusive: 80, rate: 65 },
                { maxExclusive: 150, rate: 63 },
                { maxInclusive: 250, rate: 60 }
            ]
        },
        'full-or-semi-privacy': {
            '6-x-6': [
                { maxExclusive: 80, rate: 75 },
                { maxExclusive: 150, rate: 72 },
                { maxInclusive: 250, rate: 70 }
            ],
            '4-x-4': [
                { maxExclusive: 80, rate: 71 },
                { maxExclusive: 150, rate: 68 },
                { maxInclusive: 250, rate: 65 }
            ]
        }
    },

    fields: {
        37: 'price',
        38: 'client_id_google',
        39: 'utm_source',
        40: 'utm_medium',
        41: 'utm_campaign',
        42: 'utm_term',
        43: 'referrer',
        44: 'utm_content',
        45: 'url',
        76: 'gclid',
        77: 'fbclid',
        78: 'user_agent',
        79: '_fbp',
        80: '_fbc'
    },

    field_value: {
        price: undefined,
        linear_feet: undefined,
        post_size: undefined,
        fence_style: undefined
    },

    get: function() {
        var styleInput = document.querySelector('input[name="nf-field-24"]:checked');
        var sizeInput = document.querySelector('input[name="nf-field-25"]:checked');
        var ftInput = document.querySelector('input[name="nf-field-26"]');

        this.style = styleInput ? styleInput.value : '';
        this.field_value.fence_style = this.style;

        this.size = sizeInput ? sizeInput.value : '';
        this.field_value.post_size = this.size;

        var ftRaw = ftInput ? ftInput.value : '';
        var ftParsed = parseFloat(ftRaw);

        this.ft = isNaN(ftParsed) ? 0 : ftParsed;
        this.field_value.linear_feet = ftRaw;
    },

    getCookie: function(name) {
        var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
    },

    getRate: function(style, size, ft) {
        var sizeRules = this.price_config[style] && this.price_config[style][size];

        if (!sizeRules) {
            return null;
        }

        for (var i = 0; i < sizeRules.length; i++) {
            var rule = sizeRules[i];

            if (typeof rule.maxExclusive !== 'undefined' && ft < rule.maxExclusive) {
                return rule.rate;
            }

            if (typeof rule.maxInclusive !== 'undefined' && ft <= rule.maxInclusive) {
                return rule.rate;
            }
        }

        return null;
    },

    updateFields: function() {
        var params = typeof window.getAllUrlParams === 'function' ? window.getAllUrlParams() : {};

        for (var key in this.fields) {
            if (!this.fields.hasOwnProperty(key)) continue;

            var fieldName = this.fields[key];
            var value = '';

            switch (fieldName) {
                case 'price':
                    value = this.price == null ? '' : this.price;
                    break;

                case 'client_id_google':
                    if (typeof gaGlobal === 'undefined' || !gaGlobal || !gaGlobal.vid) {
                        value = 'not set';
                    } else {
                        value = gaGlobal.vid;
                    }
                    break;

                case 'referrer':
                    value = document.referrer;
                    break;

                case 'url':
                    value = document.location.href;
                    break;

                case 'user_agent':
                    value = navigator.userAgent;
                    break;

                case '_fbp':
                    value = this.getCookie(fieldName);
                    break;

                case '_fbc':
                    value = this.getCookie(fieldName) || window.fbc_ || '';
                    break;

                default:
                    if (params[fieldName]) {
                        value = params[fieldName];
                    }
                    break;
            }

            jQuery('#nf-field-' + key).val(value).trigger('change');
        }
    },

    get_price: function() {
        this.get();

        var priceElement = document.getElementById('price');
        var sizeKey = this.size === '4-x-4' || this.size === '6-x-6' ? this.size : '';
        var rate = this.getRate(this.style, sizeKey, this.ft);
        var isSpecialPrice = rate === null || this.ft > this.settings.specialPriceThreshold;

        window.dataLayer = window.dataLayer || [];

        if (isSpecialPrice) {
            this.price = null;
            this.field_value.price = null;
            console.log('price: special');
        } else {
            this.price = Math.max(this.ft * rate, this.settings.minPrice);
            this.field_value.price = this.price;
            console.log('price:', this.price);
        }

        dataLayer.push({
            event: 'calculation',
            field_value: this.field_value
        });

        if (priceElement) {
            priceElement.textContent = isSpecialPrice
                ? this.settings.specialPriceText
                : '$' + this.price + '*';
        }

        this.updateFields();
    }
};

jQuery(document).ready(function() {
	jQuery(document).on('click', '#calculate', Calculator.get_price.bind(Calculator));
	jQuery(document).on('change', '#nf-field-33', Calculator.updateFields.bind(Calculator)); // update for case when not calculate (name)
	jQuery(document).on('change', '#nf-field-34', Calculator.updateFields.bind(Calculator)); // update for case when not calculate (phone)
	
	var input_full_or_semi = 'nf-field-24-1';
	var input_basic = 'nf-field-24-0';
	var input_privacy = 'nf-field-24-2';
	var input_size_4 = 'nf-field-25-0';
	var input_size_6 = 'nf-field-25-1';

	jQuery('#nf-form-3-cont').on('change', '#'+ input_privacy, function() {
	  if (document.getElementById(input_privacy).checked) {
		document.getElementById(input_size_4).disabled = true;
		document.getElementById(input_size_6).click();
	  } else {
		document.getElementById(input_size_4).disabled = false;
	  }
	});

	jQuery('#nf-form-3-cont').on('change', '#'+input_basic, function() {
	  if (document.getElementById(input_basic).checked) {
		document.getElementById(input_size_4).disabled = false;
	  }
	});
	jQuery('#nf-form-3-cont').on('change', '#'+input_full_or_semi, function() {
	  if (document.getElementById(input_full_or_semi).checked) {
		document.getElementById(input_size_4).disabled = false;
	  }
	});
})
// Contact_form ////////////////////////////
var Contact_form = {
    fields: {
        48: 'client_id_google',
        49: 'utm_source',
        50: 'utm_medium',
        51: 'utm_campaign',
        52: 'utm_term',
        53: 'referrer',
        54: 'utm_content',
        55: 'url',
        81: 'gclid',
        82: 'fbclid',
        83: 'user_agent',
        84: '_fbp',
        85: '_fbc'
    },
    getCookie: function(name) {
        var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
    },
    updateFields: function() {
        for (var key in this.fields) {
            var a = this.fields[key];
            var value = '';

            switch (a) {
                case 'price':
                    value = this.price;
                    jQuery( '#nf-field-' + key ).val( value ).trigger( 'change' );
                    break;
                case 'client_id_google':
                    if (!gaGlobal) {
                        value = 'not set';
                    } else {
                        value = gaGlobal.vid;
                    }
                    jQuery( '#nf-field-' + key ).val( value ).trigger( 'change' );
                    break;
                case 'referrer':
                    value = document.referrer;
                    jQuery( '#nf-field-' + key ).val( value ).trigger( 'change' );
                    break;
                case 'url':
                    value = document.location.href;
                    jQuery( '#nf-field-' + key ).val( value ).trigger( 'change' );
                    break;
                case 'user_agent':
                    value = navigator.userAgent;
                    jQuery( '#nf-field-' + key ).val( value ).trigger( 'change' );
                    break;
                case '_fbp':
                    value = this.getCookie(a);
                    jQuery( '#nf-field-' + key ).val( value ).trigger( 'change' );
                    break;
                case '_fbc':
                    value = this.getCookie(a) || window.fbc_;
                    jQuery( '#nf-field-' + key ).val( value ).trigger( 'change' );
                    break;
                default:
                    params = window.getAllUrlParams();
                    if (!!params[a]) {
                        value = params[a];
                        jQuery( '#nf-field-' + key ).val( value ).trigger( 'change' );
                    }
            }
        }
    }
}

jQuery(document).ready(function() {
	jQuery(document).on('change', '#nf-field-1', Contact_form.updateFields.bind(Contact_form)); // update for case when not calculate (name)
	jQuery(document).on('change', '#nf-field-8', Contact_form.updateFields.bind(Contact_form)); // update for case when not calculate (phone)
})
