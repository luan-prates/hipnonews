const calculadora = require("../models/calculadora.js")

test ("Somar 2 + 2 deveria retornar 4", () => {
    const resultado = calculadora.somar(2, 2);
    expect(resultado).toBe(4)
});

test ("Somar 2 + 100 deveria retornar 4", () => {
    const resultado = calculadora.somar(2, 100);
    expect(resultado).toBe(102)
});

test ("Somar 'banana' + 2 deveria retornar 4", () => {
    const resultado = calculadora.somar("banana", 2);
    expect(resultado).toBe("Erro")
});