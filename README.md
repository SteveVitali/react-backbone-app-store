[npm-stats]: https://nodei.co/npm/react-backbone-app-store.png?compact=true
[npm-url]: https://www.npmjs.org/package/react-backbone-app-store

# react-backbone-app-store
[![NPM version][npm-stats]][npm-url]

Lightweight data store for React applications using Backbone models/collections

## Installation
```
npm install react-backbone-app-store --save
bower install react-backbone-app-store --save
```

## Usage

First, initialize an `AppStore` and register models.

```js
var AppStore = require('react-backbone-app-store');

var app = new AppStore();

app.registerModel('Users', UsersCollection, '/api/users');
app.registerModel('Items', ItemsCollection, '/api/items');
// ...
var rootProps = {
  // default props for root node
};
var rootNode = RootReactComponentType; 
var rootParentNode = document.getElementById('root-element');

// Render the application
app.resetData(rootProps, rootNode, rootParentNode);

```

## AppStore API

### registerModel(name, collection, endpoint)

Register a Backbone model for the app store

```js
@param {String} name       The name to use for the model (plural)
@param {Object} collection The Backbone collection for the model
@param {String} endpoint   The base URL for CRUD operations on this model
```


### resetData(data, rootNodeType, rootParentNode)

Reset the application data and re-render the top-level of the app

```js
@param  {Object} data            The root props of the toplevel element
                                 (including app store models, such that
                                 data[modelName] = array of model objects
@param  {React}  rootNodeType    The toplevel React component type
@param  {DOM}    rootParentNode  The DOM element where the app lives

```

### resetModelHash(modelHash)

Take in a mapping of model-type to array-of-model objects
and reset this.modelHash as a mapping of model-type to
Backbone Collection of that model type
(this is useful when we want to update/delete/etc. models later)

```js
@param  {Object} modelHash Map of model names to arrays of model objects
```

### renderRoot()

Re-render the root with (presumably) new model data


### fetch(ids, modelName, callback)

Fetch a set of ids from the server and store their models in model hash

```js
@param  {String[]} ids       Ids of models to fetch
@param  {String}   modelName The name of the type of model to fetch
@param  {Function} cb        Optional callback
```

### get(id, modelName)
### getModel(id, modelName)

Get cached model with particular id and type

```js
@param  {String} id        The id of the desired model
@param  {String} modelName The name of the desired model type
@return {Object}           The model object or undefined if not yet fetched
```

### getAll(modelName)

Get all the models in a particular collection

```js
@param  {String} modelName The name of the desired model type
@return {Object[]}         An array of all the model objects
```

### add(modelData, modelName)

Add a model to the model hash without fetching from server

```js
@param {Object} modelData The model object (must include _id)
@param {String} modelName The name of the model type
```


### set(updateObject, id, modelName, callback)

Update fields on model of particular type with particular id

```js
@param {Object}   updateObject Key-value-pairs specifying fields to update
@param {String}   id           Id of the model to be updated
@param {String}   modelName    Name of the type of model being updated
@param {Function} callback     Callback once model has been synced with db
```


### refresh(id, modelName, callback)

Sync a particular model with data in the database

```js
@param  {String}   id        Id of the model to be synced
@param  {String}   modelName Name of the type of model getting synced
@param  {Function} callback  Optional callback
```


### hasModel(modelName)

Determine whether app store has registered a model with given name

```js
@param  {String}  modelName The name of the model in question
@return {Boolean}           Whether the model has been registered
```
