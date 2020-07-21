var name = process.env.BNAME;

var pas = process.env.BPAS;

function getName() {
  process.env.BNAME = name;
  return name;
}

function getPas() {
  process.env.BPAS = pas;
  return pas;
}

module.exports = { getName, getPas };
