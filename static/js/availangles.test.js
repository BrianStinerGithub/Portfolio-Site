import { pickFrom, range, removeChunkFromAvailangles } from "./glassSmashHelper";

describe("pickFrom", () => {
    test("returns only element", () => {
        const arr = [1];
        expect(pickFrom(arr)).toBe(1);
    });
});

describe("range", () => {
    test("returns zero array", () => {
        expect(range(0, 0)).toEqual([0]);
    });
    test("returns 123 array", () => {
        expect(range(1, 3)).toEqual([1, 2, 3]);
    });
});

describe("removechunkfromavailangles", () => {
    test("length of list reduced", () => {
        const arr = range(0, 360);
        const newarr = removeChunkFromAvailangles(arr, 20, 10);
        console.log(arr.length, newarr.length);
        expect(newarr.length).toEqual(arr.length);
    });
    test("list contains only elements not in chunk", () => {
        const arr = range(0, 360);
        const newarr = removeChunkFromAvailangles(arr, 20, 10);
        expect(newarr).toEqual(arr.filter(x => x !== 20));
    });
});