
var ContextService = function () {
  this.context = {};

  this.put = function (key, object) {
    this.context[key] = object;
  };

  this.get = function (key) {
    if (key && this.context.hasOwnProperty(key)) {
      return this.context[key];
    }
  };

  this.getInstanceOf = function (clazz) {
    if (clazz) {
      var instances = _.values(this.context);
      var i = 0;
      var match;
      while (!match && i < instances.length) {
        var instance = instances[i++];
        if (instance instanceof clazz) {
          match = instance;
        }
      }

      return match;
    }
  }
};

module.exports = ContextService;