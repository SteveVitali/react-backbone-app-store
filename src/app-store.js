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
 * @param {String} name       The name to use for the model (plural)
 * @param {Object} collection The Backbone collection for the model
 * @param {String} endpoint   The base URL for CRUD operations on this model
 */
AppStore.prototype.addModel = function(name, collection, endpoint) {
  this.modelHash[name] = this.modelHash[name] || {};
  this.COLLECTIONS[name] = this.COLLECTIONS[name] || collection;
  this.ENDPOINTS[name] = this.ENDPOINTS[name] || endpoint;
};

/**
 * Reset the application data and re-render the top-level of the app
 * @param  {Object} data            The root props of the toplevel element
 *                                  (including app store models, such that
 *                                  data.modelName = array of model objects
 * @param  {React}  rootNodeType    The toplevel React component type
 * @param  {DOM}    rootParentNode  The DOM element where the app lives
 */
AppStore.prototype.resetData = function(data, rootNodeType, rootParentNode) {
  var newModelHash = {};
  for (var modelName in this.modelHash) {
    if (data[modelName]) {
      newModelHash[modelName] = data[modelName];
    }
  }
  this.resetModelHash(newModelHash);

  this.rootProps = _.extend(data, {
    appStore: this
  });

  var rootNode = React.createElement(
    rootNodeType,
    this.rootProps,
    rootParentNode
  );

  this.rootNode = React.render(rootNode, rootParentNode);
};

/**
 * Take in a mapping of model-type to array-of-model objects
 * and reset this.modelHash as a mapping of model-type to
 * Backbone Collection of that model type
 * (this is useful when we want to update/delete/etc. models later)
 * @param  {Object} modelHash Map of model names to arrays of model objects
 */
AppStore.prototype.resetModelHash = function(modelHash) {
  for (var modelType in modelHash) {
    var modelObjects = modelHash[modelType];
    var backboneCollection = this.COLLECTIONS[modelType];
    this.modelHash[modelType] = new backboneCollection(modelObjects);
  }
};

module.exports = AppStore;
