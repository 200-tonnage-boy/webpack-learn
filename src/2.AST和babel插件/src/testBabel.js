const arrow = (a, b) => {
  console.log(this);
    const minus = (c,d)=>{
          console.log(this);
        return c-d;
    }
    return a + b;
}


class Person {
  constructor(name) {
    this.name = name
  }
  sayName () {
    console.log('my name is ', this.name)
    return this.name()
  }
}

const c = 'ss111'
