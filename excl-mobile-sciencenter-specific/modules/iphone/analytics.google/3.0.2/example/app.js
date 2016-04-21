var win = Ti.UI.createWindow({
  backgroundColor:'white'
});
win.open();

var GA = require('analytics.google');

GA.trackUncaughtExceptions = true; // ios only
// if you wanted to disable analytics across the entire app, you would set optOut to true
GA.optOut = false;
// set dryRun to true if you are debugging and don't want to capture data
GA.dryRun = true;
// Data collected using the Google Analytics SDK for Android is stored locally before being
// dispatched on a separate thread to Google Analytics.
// By default, data is dispatched from the Google Analytics SDK for Android every 30 minutes.
GA.dispatchInterval = 15; // seconds


var tracker = GA.getTracker("UA-XXXXXX-X");

// track a user sign on with some user identifier
tracker.setUser({
  userId: "123456",       // required
  category: "UX",         // required
  action: "User Sign In"  // required
});

// track an event
tracker.trackEvent({
  category: "category",   // required
  action: "test",         // required
  label: "label",
  value: 1
});

// track a social action
tracker.trackSocial({
  network: "facebook",    // required
  action: "action",       // required
  target: "target"
});

// track timing info
tracker.trackTiming({
  category: "Loading",    // required
  time: 10,               // required (in milliseconds)
  name: "",
  label: ""
});

// track a screen
tracker.trackScreen({
  screenName: "Home Screen"  // required
});


// track a transaction
tracker.trackTransaction({
  transactionId: "123456",  // required
  affiliation: "Store",     // required
  revenue: 24.99 * 0.7,     // required
  tax: 0.6,                 // required
  shipping: 0,              // required
  currency: "CAD"           // optional
});

// track a transaction item
tracker.trackTransactionItem({
  transactionId: "123456",        // reference to above transaction - required
  name: "My Alphabet Book",       // required
  sku: "ABC123",                  // required
  category: "product category",
  price: 24.99,                   // required
  quantity: 1,                    // required
  currency: "CAD"
});


// == The above tracking methods also accept custom dimensions and metrics == //
// Dimensions and Metrics are 1 based.

// track a user sign on with some user identifier
tracker.setUser({
  userId: "123456",
  category: "UX",
  action: "User Sign In",
  customDimension: {
    "1": "Ottawa"
  },
  customMetric: {
    "1": 45.4
  }
});

// track an event
tracker.trackEvent({
  category: "category",
  action: "test",
  label: "label",
  value: 1,
  customDimension: {
    "1": "Toronto"
  },
  customMetric: {
    "1": 68.3
  }
});

// track a social action
tracker.trackSocial({
  network: "facebook",
  action: "action",
  target: "target",
  customDimension: {
    "1": "Ottawa",
    "2": "Toronto"
  },
  customMetric: {
    "1": 45.4,
    "2": 68.3
  }
});

// track timing info
tracker.trackTiming({
  category: "Loading Short",
  time: 3,
  name: "",
  label: "",
  customDimension: {
    "1": "Toronto"
  },
  customMetric: {
    "1": 68.3
  }
});

// track a screen
tracker.trackScreen({
  screenName: "Home Screen",
  customDimension: {
    "1": "Ottawa"
  },
  customMetric: {
    "1": 45.4
  }
});


// track a transaction
tracker.trackTransaction({
  transactionId: "123456",
  affiliation: "Store",
  revenue: 24.99 * 0.7,
  tax: 0.6,
  shipping: 0,
  currency: "CAD", // optional
  customDimension: {
    "1": "Ottawa"
  },
  customMetric: {
    "1": 45.4
  }
});

// track a transaction item
tracker.trackTransactionItem({
  transactionId: "123456", // reference to above transaction
  name: "My Alphabet Book",
  sku: "ABC123",
  category: "product category", // optional
  price: 24.99,
  quantity: 1,
  currency: "CAD",
  customDimension: {
    "1": "Toronto"
  },
  customMetric: {
    "1": 68.3
  }
});
