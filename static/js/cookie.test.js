/**
 * @jest-environment jsdom
 */

import { getCookie, setCookie, checkCookie } from "./glassSmashHelper";

describe("getCookie", () => {
    test("returns cookie value", () => {
        document.cookie = "test=123";
        expect(getCookie("test")).toBe("123");
    });
});

describe("setCookie", () => {
    test("sets cookie", () => {
        setCookie("test", "123");
        expect(getCookie("test")).toBe("123");
    });
});

describe("checkCookie", () => {
    test("returns true if cookie is set", () => {
        document.cookie = "test=123";
        expect(checkCookie("test", "123")).toBe(true);
    });
    test("returns false if cookie is not set", () => {
        document.cookie = "test=0"
        expect(checkCookie("test", "123")).toBe(false);
    });
});