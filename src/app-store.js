var React = require('react');
var _ = require('lodash');
var $ = require('jquery');

/**
 * Initialize an AppStore without any models
 */
var AppStore = function() {
  this.modelHash = {};
  this.COLLECTIONS = {};
  this.ENDPOINTS = {};
  // The root react node for the app
  this.rootNode = null;
  // Will contain the appStore (this)
  // and a ref to the root data objects
  this.rootProps = {};

  // Keeps track of ids currently in process of getting fetched
  // so they aren't fetched twice
  this.fetchCache = {};
};

/**
 * Register a Backbone model for the app store
 * @param {String} name       The name to use for the model (plural)
 * @param {Object} collection The Backbone collection for the model
 * @param {String} endpoint   The base URL for CRUD operations on this model
 */
AppStore.prototype.registerModel = function(name, collection, endpoint) {
  this.COLLECTIONS[name] = this.COLLECTIONS[name] || collection;
  this.ENDPOINTS[name] = this.ENDPOINTS[name] || endpoint;
  this.modelHash[name] = this.modelHash[name] || new this.COLLECTIONS[name]();
};

/**
 * Reset the application data and re-render the top-level of the app
 * @param  {Object} data            The root props of the toplevel element
 *                                  (including app store models, such that
 *                                  data[modelName] = array of model objects
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

/**
 * Re-render the root with (presumably) new model data
 */
AppStore.prototype.renderRoot = function() {
  for (var model in this.modelHash) {
    this.rootProps[model] = this.modelHash[model].toJSON();
  }
  this.rootNode.setProps(this.rootProps);
};

/**
 * Fetch a set of ids from the server and store their models in model hash
 * @param  {String[]} ids       Ids of models to fetch
 * @param  {String}   modelName The name of the type of model to fetch
 * @param  {Function} cb        Optional callback
 */
AppStore.prototype.fetch = function(ids, modelName, cb) {
  if (!_.isArray(ids) || !ids.length) {
    return cb && cb();
  }

  var that = this;
  var idsToFetch = [];
  _.each(ids, function(id) {
    // Only fetch ids not currently in the fetchCache
    if (!that.fetchCache[id]) {
      idsToFetch.push(id);
      that.fetchCache[id] = true;
    }
  });

  var numFetched = 0;
  var numToFetch = idsToFetch.length;
  var endpoint = this.ENDPOINTS[modelName] + '/';

  _.each(idsToFetch, function(id) {
    $.get(endpoint + id, function(res) {
      that.modelHash[modelName].add(res);
      delete that.fetchCache[id];
      if (++numFetched === numToFetch) {
        that.renderRoot();
        cb && cb();
      }
    });
  });
};

/**
 * Get cached model with particular id and type
 * @param  {String} id        The id of the desired model
 * @param  {String} modelName The name of the desired model type
 * @return {Object}           The model object or undefined if not yet fetched
 */
AppStore.prototype.getModel = function(id, modelName) {
  var model = this.modelHash[modelName].get(id);
  return model && model.toJSON();
};

/**
 * Update fields on model of particular type with particular id
 * @param {Object}   updateObject Key-value-pairs specifying fields to update
 * @param {String}   id           Id of the model to be updated
 * @param {String}   modelName    Name of the type of model being updated
 * @param {Function} callback     Callback once model has been synced with db
 */
AppStore.prototype.set = function(updateObject, id, modelName, callback) {
  var model = this.modelHash[modelName].get(id);
  var that = this;
  model.save(updateObject, {
    wait: true,
    success: function(newModel) {
      that.refresh(id, modelName, callback);
    }
  });
};

/**
 * Sync a particular model with data in the database
 * @param  {String}   id        Id of the model to be synced
 * @param  {String}   modelName Name of the type of model getting synced
 * @param  {Function} callback  Optional callback
 */
AppStore.prototype.refresh = function(id, modelName, callback) {
  var model = this.modelHash[modelName].get(id);
  var that = this;
  // Sync the model with the database
  model.fetch({
    wait: true,
    success: function(bbModel, modelObj) {
      that.renderRoot();
      callback && callback();
    }
  });
};

module.exports = AppStore;
