/**
 * @file Домашка по FP ч. 1
 * 
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */



import { SHAPES, COLORS } from '../constants';
import { compose, allPass, converge, __, gte, max, equals, props, prop, filter, values, reduce, reject, length, all, not, countBy, identity, } from 'ramda';



//цвета
const white = equals(COLORS.WHITE);
const blue = equals(COLORS.BLUE);
const green = equals(COLORS.GREEN);
const red = equals(COLORS.RED);
const orange = equals(COLORS.ORANGE);

//фигуры
const star = prop(SHAPES.STAR);
const square = prop(SHAPES.SQUARE);
const triangle = prop(SHAPES.TRIANGLE);
const circle = prop(SHAPES.CIRCLE);


// Максимальное количество
const maxValue = compose(reduce(max, 0), values);


// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
    compose(white, triangle),
    compose(white, circle),
    compose(red, star),
    compose(green, square),
]);

// 2. Как минимум две фигуры зеленые.

// цвета всех фигур
const shapeColors = props(values(SHAPES));

// количествo фигур нужного цвета
const countShapes = (value) =>
    compose(length, filter(value), shapeColors);

export const validateFieldN2 = compose(gte(__, 2), countShapes(green));

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = converge(equals, [
    countShapes(red),
    countShapes(blue),
]);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
    compose(blue, circle),
    compose(red, star),
    compose(orange, square),
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = compose(
    gte(__, 3),
    maxValue,
    countBy(identity),
    reject(white),
    shapeColors,
);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
    compose(equals(2), countShapes(green)),
    compose(equals(1), countShapes(red)),
    compose(green, triangle),
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = compose(all(orange), shapeColors);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = allPass([
    compose(not, red, star),
    compose(not, white, star),
]);

// 9. Все фигуры зеленые.
export const validateFieldN9 = compose(all(green), shapeColors);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([
    converge(equals, [triangle, square]),
    compose(not, white, square),
]);