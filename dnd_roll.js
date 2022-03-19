// Helper methods
Array.range = function(min, max) { var all = []; for(var i=min; i<=max; i++) { all.push(i) }; return all }
Array.prototype.sum = function() { if (this.length == 0) { return 0 } else { return this.reduce(function(a, b) { return a + b }) } }
Array.prototype.includes = function(a) { return this.indexOf(a) >= 0 }
Array.prototype.remove = function(a) { var all = this.slice(); if (all.includes(a)) { all.splice(all.indexOf(a), 1) }; return all }
Array.prototype.subtract = function(arr) { var all = this.slice(); for(var i=0; i<arr.length; i++) { all = all.remove(arr[i]) }; return all }
String.prototype.repeatReplace = function(regex, replaceWith) {
  var newStr = this
  while (regex.test(newStr)) {
    if (typeof replaceWith === "function") {
      newStr = newStr.replace(regex, replaceWith.apply(null, regex.exec(newStr)))
    } else {
      newStr = newStr.replace(regex, replaceWith)
    }
  }
  return newStr
}

// Classes
function Roll(str) {
  this.raw = str
  this.current = str
  this.dice = []
  this.iterations = []
  // this.bias = undefined // 0-1, 0.5 means equal chance to roll high
  // this.min = undefined
  // this.max = undefined
  this.val = undefined
}
Roll.prototype.calculate = function() {
  // Scan for unknown characters, unbalanced parens, etc
  if (this.val) { return this.val }
  this.current = (this.current || "").trim().replace(/ *([\+\-\*\/\(\)]+) */g, "$1").replace(/ /g, "+")
  this.iterate("Initial")
  this.evaluateDice()
  this.evaluateMath()
  this.val = parseFloat(this.current)

  return this.val
}
Roll.prototype.evaluateDice = function() {
  while(true) {
    var dice = new Dice(this.current)

    if (dice.isValid()) {
      dice.throw()
      this.dice.push(dice)
      if (this.current.indexOf("..") > 0) {
        this.current = dice.val.toString()
      } else {
        this.current = this.current.replace(dice.raw, dice.val)
      }
      this.iterate("Dice(" + dice.raw + ")", dice)
    } else {
      break
    }
  }
}
Roll.prototype.evaluateMath = function() {
  this.current = this.current.replace(/(\d+(?:\.\d+)?)(\()/g, "$1*$2")

  this.evaluateParens()

  this.performMath(this.current, "**", "Exponents")
  this.performMath(this.current, "*", "Multiplication")
  this.performMath(this.current, "/", "Division")
  this.performMath(this.current, "+", "Addition")
  this.performMath(this.current, "-", "Subtraction")
}
Roll.prototype.evaluateParens = function() {
  while(true) {
    if (this.current.indexOf("(") == -1 || this.current.indexOf(")") == -1) { break }
    var inside = this.current
    var nextClose = inside.indexOf(")")
    inside = inside.slice(0, nextClose)
    var prevOpen = inside.lastIndexOf("(")
    if (prevOpen == -1) { break }
    inside = inside.slice(prevOpen + 1, inside.length)

    inside = this.performMath(inside, "**", "Inner Exponents")
    inside = this.performMath(inside, "*", "Inner Multiplication")
    inside = this.performMath(inside, "/", "Inner Division")
    inside = this.performMath(inside, "+", "Inner Addition")
    inside = this.performMath(inside, "-", "Inner Subtraction")

    this.current = this.current.repeatReplace(/\((\d+(?:\.\d+)?)\)/, "$1")
    this.iterate("Parens")
  }
}
Roll.prototype.performMath = function(mathScope, operator, description) {
  if (mathScope.indexOf(operator) >= 0) {
    var mathApplied = mathScope.repeatReplace(new RegExp("\\d+(?:\.\d+)?\\" + operator + "\\d+(?:\.\d+)?"), function(found) {
      try {
        return eval(found)
      } catch(err) {
        console.log(description + " Error: ", err)
        return 0
      }
    })
    this.current = this.current.replace(mathScope, mathApplied)
    this.iterate(description)
    return mathApplied
  }
  return mathScope
}
Roll.prototype.iterate = function(description, dice) {
  this.iterations.push([description, this.current, dice])
}
