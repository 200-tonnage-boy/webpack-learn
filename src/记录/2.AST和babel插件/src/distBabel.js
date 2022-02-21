var _this = this;

const arrow = function (a, b) {
  console.log(_this);

  const minus = function (c, d) {
    console.log(_this);
    return c - d;
  };

  return a + b;
};

function Person(name) {
  this.name = name;
}

Person.prototype.sayName = function () {
  console.log('my name is ', this.name);
  return this.name();
}

const c = 'ss111';
