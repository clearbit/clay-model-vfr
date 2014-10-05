
var VFR= require("clay-vfr")

var Ajax = function(eventName, model, options){
  if(eventName == "create") return Ajax.post.call(this, model,options )
  else if(eventName == "update") return Ajax.put.call(this, model,options )
  else if(eventName == "destroy") return Ajax.del.call(this, model,options )
  
  //Sho
  var params = model;
  if(eventName == "query") return Ajax.query.call(this, params, options);  
  else if(eventName == "read") return Ajax.get.call(this, params, options);
  else if(eventName == "api") return Ajax.api.call(this, params, options);

}

Ajax.api = function(){
  if(!this.namespace) this.namespace = ""
  var args = Array.prototype.slice(arguments);
  var remoteAction = args[0];
  var callArgs = []
  for (var i = 1; i < args.length-1; i++) {
    callArgs.push(args[i]);
  };
  options = args[args.length-1];
  if(typeof remoteAction != "string" ) throw "First Argument should be the Remote Action (string)"
  if(options == remoteAction) options = {};

  var send = VFR( this.namespace + remoteAction, options, options.nullok || false );
  return send.apply( VFR, callArgs );
}

Ajax.query = function(params, options){
  if(!this.namespace) this.namespace =""
  var send = VFR(this.namespace + "ThreevotApiController.handleRest" );
  return send( "query", "" , params );
}

Ajax.get = function(id, options){
      if(!this.namespace) this.namespace =""

  var send = VFR(this.namespace + "ThreevotApiController.handleRest" );
  return send( "get", Ajax.generateURL(this) + "/" + id );
}

Ajax.post = function(model, options){
    if(!model.namespace) model.namespace =""

  var id = this.id;
  delete this.id;
  var _this = this;
  var send = VFR(model.namespace + "ThreevotApiController.handleRest" );
  return send( "post", Ajax.generateURL(model) , JSON.stringify(this.toJSON()) )
  .then( function(data){ _this.id = id; return data; } )
}

Ajax.put = function(model, options){
    if(!model.namespace) model.namespace =""

  var send = VFR(model.namespace + "ThreevotApiController.handleRest", {}, true );
  return send( "put", Ajax.generateURL(model, this.id ), this.toJSON() );
}

Ajax.del = function(model, options){
    if(!model.namespace) model.namespace =""

  var send = VFR(model.namespace + "ThreevotApiController.handleRest", {}, true );
  return send( "del", Ajax.generateURL(model, this.id ) );
}

Ajax.generateURL = function() {
  var args, collection, object, path, scope;
  object = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  collection = object.className;
  
  args.unshift(collection);
  args.unshift(scope);
  path = args.join('/');
  path = path.replace(/(\/\/)/g, "/");
  path = path.replace(/^\/|\/$/g, "");
  return path;
};

module.exports = Ajax;

