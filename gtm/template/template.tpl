___TERMS_OF_SERVICE___

By creating or modifying this file you agree to Google Tag Manager's Community
Template Gallery Developer Terms of Service available at
https://developers.google.com/tag-manager/gallery-tos (or such other URL as
Google may provide), as modified from time to time.


___INFO___

{
  "type": "TAG",
  "id": "cvt_temp_public_id",
  "version": 1,
  "securityGroups": [],
  "displayName": "ENTD Draw Button",
  "categories": [
    "MARKETING",
    "PERSONALIZATION"
  ],
  "brand": {
    "id": "brand_dummy",
    "displayName": "ENTD"
  },
  "description": "Adds an ENTD draw button to your site. Visitors enter a shop drawing in the ENTD modal without leaving the page. Render a branded button into a container, or open the modal from your own element.",
  "containerContexts": [
    "WEB"
  ]
}


___TEMPLATE_PARAMETERS___

[
  {
    "type": "TEXT",
    "name": "connectionId",
    "displayName": "Connection ID",
    "simpleValueType": true,
    "help": "Unique identifier of your shop in the ENTD system.",
    "valueValidators": [
      {
        "type": "NON_EMPTY"
      }
    ]
  },
  {
    "type": "TEXT",
    "name": "drawingId",
    "displayName": "Drawing ID",
    "simpleValueType": true,
    "help": "ID of the shop drawing in ENTD. Can be a variable, e.g. a Data Layer Variable with the drawing of the current product.",
    "valueValidators": [
      {
        "type": "NON_EMPTY"
      }
    ]
  },
  {
    "type": "RADIO",
    "name": "mode",
    "displayName": "Mode",
    "radioItems": [
      {
        "value": "render",
        "displayValue": "Render the ENTD button into a container",
        "help": "The button is inserted into every element that matches the CSS selector."
      },
      {
        "value": "attach",
        "displayValue": "Open the modal on click of my own element",
        "help": "Your existing buttons or links that match the CSS selector open the drawing modal."
      }
    ],
    "simpleValueType": true,
    "defaultValue": "render"
  },
  {
    "type": "TEXT",
    "name": "selector",
    "displayName": "CSS selector",
    "simpleValueType": true,
    "defaultValue": "#entd-draw",
    "help": "Elements that appear later (single-page apps, lazy blocks) are picked up automatically.",
    "valueValidators": [
      {
        "type": "NON_EMPTY"
      }
    ]
  },
  {
    "type": "GROUP",
    "name": "userGroup",
    "displayName": "Participant",
    "groupStyle": "ZIPPY_OPEN",
    "subParams": [
      {
        "type": "TEXT",
        "name": "externalId",
        "displayName": "User ID",
        "simpleValueType": true,
        "help": "ID of the logged-in user in your system, usually a Data Layer Variable. Leave empty or let it resolve to empty for guests."
      },
      {
        "type": "SELECT",
        "name": "guestMode",
        "displayName": "When User ID is empty",
        "selectItems": [
          {
            "value": "anonymous",
            "displayValue": "Enter with an anonymous ID (stored in the browser)"
          },
          {
            "value": "login",
            "displayValue": "Send the visitor to the login page"
          }
        ],
        "simpleValueType": true,
        "defaultValue": "anonymous"
      },
      {
        "type": "TEXT",
        "name": "loginUrl",
        "displayName": "Login URL",
        "simpleValueType": true,
        "help": "The current page is appended as the redirect_to parameter.",
        "enablingConditions": [
          {
            "paramName": "guestMode",
            "paramValue": "login",
            "type": "EQUALS"
          }
        ],
        "valueValidators": [
          {
            "type": "NON_EMPTY"
          }
        ]
      },
      {
        "type": "TEXT",
        "name": "source",
        "displayName": "Source",
        "simpleValueType": true,
        "help": "Name of the store or website. Defaults to the page hostname."
      },
      {
        "type": "SIMPLE_TABLE",
        "name": "extraData",
        "displayName": "Additional data",
        "simpleTableColumns": [
          {
            "defaultValue": "",
            "displayName": "Key",
            "name": "key",
            "type": "TEXT",
            "valueValidators": [
              {
                "type": "NON_EMPTY"
              }
            ]
          },
          {
            "defaultValue": "",
            "displayName": "Value",
            "name": "value",
            "type": "TEXT"
          }
        ],
        "help": "Extra fields sent to ENTD with the entry, e.g. product_id."
      }
    ]
  },
  {
    "type": "GROUP",
    "name": "appearanceGroup",
    "displayName": "Button appearance",
    "groupStyle": "ZIPPY_CLOSED",
    "enablingConditions": [
      {
        "paramName": "mode",
        "paramValue": "render",
        "type": "EQUALS"
      }
    ],
    "subParams": [
      {
        "type": "SELECT",
        "name": "text",
        "displayName": "Label",
        "selectItems": [
          {
            "value": "enter_draw",
            "displayValue": "Enter draw"
          },
          {
            "value": "join_giveaway",
            "displayValue": "Join giveaway"
          },
          {
            "value": "participate",
            "displayValue": "Participate"
          },
          {
            "value": "try_your_luck",
            "displayValue": "Try your luck"
          },
          {
            "value": "custom",
            "displayValue": "Custom text"
          }
        ],
        "simpleValueType": true,
        "defaultValue": "enter_draw"
      },
      {
        "type": "TEXT",
        "name": "customText",
        "displayName": "Custom text",
        "simpleValueType": true,
        "enablingConditions": [
          {
            "paramName": "text",
            "paramValue": "custom",
            "type": "EQUALS"
          }
        ]
      },
      {
        "type": "SELECT",
        "name": "theme",
        "displayName": "Theme",
        "selectItems": [
          {
            "value": "light",
            "displayValue": "Light"
          },
          {
            "value": "dark",
            "displayValue": "Dark"
          },
          {
            "value": "auto",
            "displayValue": "Auto (follows visitor's system)"
          }
        ],
        "simpleValueType": true,
        "defaultValue": "light"
      },
      {
        "type": "SELECT",
        "name": "size",
        "displayName": "Size",
        "selectItems": [
          {
            "value": "small",
            "displayValue": "Small"
          },
          {
            "value": "medium",
            "displayValue": "Medium"
          },
          {
            "value": "large",
            "displayValue": "Large"
          }
        ],
        "simpleValueType": true,
        "defaultValue": "medium"
      },
      {
        "type": "SELECT",
        "name": "shape",
        "displayName": "Shape",
        "selectItems": [
          {
            "value": "rectangular",
            "displayValue": "Rectangular"
          },
          {
            "value": "pill",
            "displayValue": "Pill"
          }
        ],
        "simpleValueType": true,
        "defaultValue": "rectangular"
      },
      {
        "type": "CHECKBOX",
        "name": "logo",
        "checkboxText": "Show ENTD mark",
        "simpleValueType": true,
        "defaultValue": true
      },
      {
        "type": "CHECKBOX",
        "name": "fullWidth",
        "checkboxText": "Full width",
        "simpleValueType": true,
        "defaultValue": false
      },
      {
        "type": "TEXT",
        "name": "className",
        "displayName": "Extra CSS classes",
        "simpleValueType": true
      }
    ]
  },
  {
    "type": "GROUP",
    "name": "advancedGroup",
    "displayName": "Advanced",
    "groupStyle": "ZIPPY_CLOSED",
    "subParams": [
      {
        "type": "SELECT",
        "name": "environment",
        "displayName": "ENTD environment",
        "selectItems": [
          {
            "value": "production",
            "displayValue": "Production"
          },
          {
            "value": "staging",
            "displayValue": "Staging"
          }
        ],
        "simpleValueType": true,
        "defaultValue": "production"
      }
    ]
  }
]


___SANDBOXED_JS_FOR_WEB_TEMPLATE___

const createQueue = require('createQueue');
const injectScript = require('injectScript');
const logToConsole = require('logToConsole');
const makeString = require('makeString');
const makeTableMap = require('makeTableMap');

// Bundle = ENTD library + glue (gtm/src/entd-gtm.js). URLs must match the inject_script permission.
const SCRIPT_URLS = {
  production: 'https://entd.tech/em/entd-gtm.js',
  staging: 'https://aientd.space/em/entd-gtm.js'
};

const environment = data.environment === 'staging' ? 'staging' : 'production';
const rawExternalId = data.externalId ? makeString(data.externalId) : '';
const externalId = rawExternalId === 'undefined' || rawExternalId === 'null' ? '' : rawExternalId;
const label = data.text === 'custom' ? makeString(data.customText || '') : data.text;

// Sandboxed code cannot touch the DOM: queue the settings, the loaded bundle mounts the button.
const push = createQueue('entdGtmQueue');

push({
  connectionId: makeString(data.connectionId),
  drawingId: makeString(data.drawingId),
  selector: makeString(data.selector),
  mode: data.mode === 'attach' ? 'attach' : 'render',
  externalId: externalId,
  guestMode: data.guestMode === 'login' ? 'login' : 'anonymous',
  loginUrl: data.loginUrl ? makeString(data.loginUrl) : '',
  source: data.source ? makeString(data.source) : '',
  extra: data.extraData ? makeTableMap(data.extraData, 'key', 'value') : {},
  button: {
    text: label || 'enter_draw',
    theme: data.theme || 'light',
    size: data.size || 'medium',
    shape: data.shape || 'rectangular',
    logo: data.logo !== false,
    fullWidth: data.fullWidth === true,
    className: data.className ? makeString(data.className) : ''
  }
});

injectScript(SCRIPT_URLS[environment], data.gtmOnSuccess, () => {
  logToConsole('ENTD Draw Button: failed to load ' + SCRIPT_URLS[environment]);
  data.gtmOnFailure();
}, 'entd-gtm-' + environment);


___WEB_PERMISSIONS___

[
  {
    "instance": {
      "key": {
        "publicId": "inject_script",
        "versionId": "1"
      },
      "param": [
        {
          "key": "urls",
          "value": {
            "type": 2,
            "listItem": [
              {
                "type": 1,
                "string": "https://entd.tech/em/entd-gtm.js"
              },
              {
                "type": 1,
                "string": "https://aientd.space/em/entd-gtm.js"
              }
            ]
          }
        }
      ]
    },
    "clientAnnotations": {
      "isEditedByUser": true
    },
    "isRequired": true
  },
  {
    "instance": {
      "key": {
        "publicId": "access_globals",
        "versionId": "1"
      },
      "param": [
        {
          "key": "keys",
          "value": {
            "type": 2,
            "listItem": [
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "key"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  },
                  {
                    "type": 1,
                    "string": "execute"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "entdGtmQueue"
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": false
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    "clientAnnotations": {
      "isEditedByUser": true
    },
    "isRequired": true
  },
  {
    "instance": {
      "key": {
        "publicId": "logging",
        "versionId": "1"
      },
      "param": [
        {
          "key": "environments",
          "value": {
            "type": 1,
            "string": "debug"
          }
        }
      ]
    },
    "clientAnnotations": {
      "isEditedByUser": true
    },
    "isRequired": true
  }
]


___TESTS___

scenarios:
- name: Render mode pushes settings and loads the production bundle
  code: |-
    let pushed;
    mock('createQueue', (key) => {
      assertThat(key).isEqualTo('entdGtmQueue');
      return (value) => { pushed = value; };
    });
    mock('injectScript', (url, onSuccess) => {
      assertThat(url).isEqualTo('https://entd.tech/em/entd-gtm.js');
      onSuccess();
    });

    runCode(mockData);

    assertThat(pushed.connectionId).isEqualTo('d9c7b289-e8ac-40da-92a3-18d0ca13c927');
    assertThat(pushed.drawingId).isEqualTo('80fee286-888b-414a-b2b9-349b56c7c6c6');
    assertThat(pushed.mode).isEqualTo('render');
    assertThat(pushed.externalId).isEqualTo('');
    assertThat(pushed.button.text).isEqualTo('enter_draw');
    assertThat(pushed.button.logo).isTrue();
    assertApi('gtmOnSuccess').wasCalled();
- name: Custom label, user ID, extra data and staging bundle
  code: |-
    let pushed;
    mock('createQueue', () => (value) => { pushed = value; });
    mock('injectScript', (url, onSuccess) => {
      assertThat(url).isEqualTo('https://aientd.space/em/entd-gtm.js');
      onSuccess();
    });

    mockData.environment = 'staging';
    mockData.text = 'custom';
    mockData.customText = 'Participate now';
    mockData.externalId = 12345;
    mockData.extraData = [{key: 'product_id', value: '42'}];

    runCode(mockData);

    assertThat(pushed.button.text).isEqualTo('Participate now');
    assertThat(pushed.externalId).isEqualTo('12345');
    assertThat(pushed.extra.product_id).isEqualTo('42');
    assertApi('gtmOnSuccess').wasCalled();
- name: Script load failure calls gtmOnFailure
  code: |-
    mock('injectScript', (url, onSuccess, onFailure) => { onFailure(); });

    runCode(mockData);

    assertApi('gtmOnFailure').wasCalled();
    assertApi('gtmOnSuccess').wasNotCalled();
setup: |-
  const mockData = {
    connectionId: 'd9c7b289-e8ac-40da-92a3-18d0ca13c927',
    drawingId: '80fee286-888b-414a-b2b9-349b56c7c6c6',
    mode: 'render',
    selector: '#entd-draw',
    guestMode: 'anonymous',
    text: 'enter_draw',
    theme: 'light',
    size: 'medium',
    shape: 'rectangular',
    logo: true,
    fullWidth: false,
    environment: 'production'
  };


___NOTES___

The loaded bundle is the ENTD JS library plus gtm/src/entd-gtm.js from the sd-em repository,
built with `npm run build` in gtm/.
