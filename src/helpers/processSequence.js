/**
 * @file Домашка по FP ч. 2
 * 
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 * 
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 * 
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */



import {multiply, allPass, compose, gte, length,  lte, toString, __, test, pipe, tap, modulo, curry, prop, assoc, replace, ifElse, always,} from 'ramda';

import Api from '../tools/api';

const api = new Api();

// валидация символов
const validate = allPass([
    compose(lte(__, 10), length, toString),
    compose(gte(__, 2), length, toString),
    gte(__, 0),
    test(/[0-9.]*/),
]);

// цепочка промисов
const then = curry((func, promise) => promise.then(func));

// перевод в двоичную систему счисления
const toBinary = pipe(
    assoc('number', __, { from: 10, to: 2 }),
    api.get('https://api.tech/numbers/base'),
    then(prop('result')),
);

// запрос животного 
const getAnimal = pipe(
    replace('{id}', __, `https://animals.tech/{id}`),
    api.get(__, {}),
    then(prop('result')),
);

// возведение числа в квадрат
const toSquare = (value) => multiply(value, value);

// Обработка валидных данных
const process = ({ writeLog, handleSuccess }) =>
    pipe(
        Number,
        Math.round,
        tap(writeLog),
        toBinary,
        then(tap(writeLog)),
        then(length),
        then(tap(writeLog)),
        then(toSquare),
        then(tap(writeLog)),
        then(modulo(__, 3)),
        then(tap(writeLog)),
        then(getAnimal),
        then(handleSuccess),
    );

const processSequence = ({ value, writeLog, handleSuccess, handleError }) =>
    pipe(
        tap(writeLog),
        ifElse(
            validate,
            process({ writeLog, handleSuccess }),
            compose(handleError, always('ValidationError')),
        ),
    )(value);

export default processSequence;
