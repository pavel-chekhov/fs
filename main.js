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
        this.style = document.querySelector('input[name="nf-field-24"]:checked').value;
        this.field_value.fence_style = document.querySelector('input[name="nf-field-24"]:checked').value;

        this.size = document.querySelector('input[name="nf-field-25"]:checked').value;
        this.field_value.post_size = document.querySelector('input[name="nf-field-25"]:checked').value;

        this.ft = document.querySelector('input[name="nf-field-26"]').value;
        this.field_value.linear_feet = document.querySelector('input[name="nf-field-26"]').value;
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
    },
    get_price: function() {
        this.get();
        switch (this.style) {
          case 'basic-privacy':
            switch (this.size) {
                case '4-x-4':
                    if (this.ft < 80) {this.price = this.ft * 62;} else {
                        if (this.ft >= 250) {this.price = this.ft * 56;} else { this.price = this.ft * 57;}
                    }
                    break;
                default: // 6-x-6
                    if (this.ft < 80) {this.price = this.ft * 65;} else {
                        if (this.ft >= 250) {this.price = this.ft * 60;} else {
                            if (this.ft >= 150) {this.price = this.ft * 60;} else {this.price = this.ft * 63;}
                        }
                    }
            }
            break;
          case 'full-or-semi-privacy':
            switch (this.size) {
                case '4-x-4':
                    if (this.ft < 80) {this.price = this.ft * 67;} else {
                        if (this.ft >= 250) {this.price = this.ft * 61;} else { this.price = this.ft * 63;}
                    }
                    break;
                default: // 6-x-6
                    if (this.ft < 80) {this.price = this.ft * 70;} else {
                        if (this.ft >= 250) {this.price = this.ft * 65;} else {
                            if (this.ft >= 150) {this.price = this.ft * 65;} else {this.price = this.ft * 68;}
                        }
                    }
            }
            break;
          default:
            this.price = 3000;
        }
        console.log('price: ', this.price);
        this.field_value.price = this.price;
        dataLayer.push({'event': 'calculation', 'field_value': this.field_value});
        if (this.price < 3000) { this.price = 3000; }
        if (this.ft > 500) {
            document.getElementById('price').textContent = 'Contact us for a special price*!';
        } else {
            document.getElementById('price').textContent = '$' + this.price + '*';
        }
        this.updateFields();
    }
}

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
