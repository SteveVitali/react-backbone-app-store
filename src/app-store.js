
/**
 * Initialize an AppStore without any models
 */
var AppStore = function() {
  this.modelHash = {};
  this.COLLECTIONS = {};
  this.ENDPOINT_NAMES = {};
  // The root react node for the app
  this.rootNode = null;
  // Will contain the appStore (this)
  // and a ref to the root data objects
  this.rootProps = {};
};

/**
 * Register a Backbone model for the app store
 * @param {String} name       The name to use for the model
 * @param {Object} collection The Backbone collection for the model
 * @param {String} endpoint   The base URL for CRUD operations on this model
 */
AppStore.prototype.addModel = function(name, collection, endpoint) {
  this.modelHash[name] = this.modelHash[name] || {};
  this.COLLECTIONS[name] = this.COLLECTIONS[name] || collection;
  this.ENDPOINTS[name] = this.ENDPOINTS[name] || endpoint;
};

module.exports = AppStore;
