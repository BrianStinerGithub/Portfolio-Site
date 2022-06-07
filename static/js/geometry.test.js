import {calcX2Y2, findDistance, findAngle} from './glassSmashHelper.js';

describe('calcX2Y2', () => {
    test("zeros return zeros", () => {
        expect(calcX2Y2(0, 0, 0, 0)).toEqual({ X2: 0, Y2: 0 });
    });
    test("assignment to variables", () => {
        const { X2, Y2 } = calcX2Y2(0, 0, 0, 0);
        expect(X2).toBe(0);
        expect(Y2).toBe(0);
    });
});

describe('findAngle', () => {
    test("same point returns 0", () => {
        expect(findAngle({ X: 0, Y: 0 }, { X: 0, Y: 0 })).toBe(0);
    });
    test("angle 45 returns 45", () => {
        expect(findAngle({ X: 0, Y: 0 }, { X: 1, Y: 1 })).toBe(45);
    });
});

describe('findDistance', () => {
    test("same point returns 0", () => {
        expect(findDistance({ X: 0, Y: 0 }, { X: 0, Y: 0 })).toBe(0);
    });
    test("distance 1 returns 1", () => {
        expect(findDistance({ X: 0, Y: 0 }, { X: 1, Y: 0 })).toBe(1);
    });
});