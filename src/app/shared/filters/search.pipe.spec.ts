// Copyright (C) 2017 Nokia

import {SearchPipe} from './search.pipe';

describe('SearchPipe', () => {
    let pipe: SearchPipe;
    const input = [{animal: "Cat", age: 6}, {animal: "Dog", age: 12}];

    beforeEach(() => {
        pipe = new SearchPipe();
    });

    it('return the whole array when search value is empty', () => {
        expect(pipe.transform(input, "")).toEqual(input);
    });

    describe('Test empty arrays', () => {
        it('return empty array on null', () => {
            expect(pipe.transform(null, "")).toEqual([]);
        });

        it('return empty array on undefined', () => {
            expect(pipe.transform(undefined, "")).toEqual([]);
        });

        it('return empty array on empty array', () => {
            expect(pipe.transform([], "")).toEqual([]);
        });
    });

    describe('Array filter with field name', () => {
        it('should find an item', () => {
            const result = pipe.transform(input, "cat", "animal");
            expect(result.length).toEqual(1);
            expect(result[0].age).toEqual(6);
        });

        it("shouldn't find an item", () => {
            const result = pipe.transform(input, "jaguar", "animal");
            expect(result.length).toEqual(0);
        });
    });

    describe('Array filter on any field', () => {
        it('should find an item', () => {
            const result = pipe.transform(input, "12");
            expect(result.length).toEqual(1);
            expect(result[0].animal).toEqual("Dog");
        });

        it("Shouldn't find any items", () => {
            const result = pipe.transform(input, "14");
            expect(result.length).toEqual(0);
        });
    });

    describe('Ignore case', () => {
        it('should find an item', () => {
            const result = pipe.transform(input, "cat");
            expect(result.length).toEqual(1);
            expect(result[0].animal).toEqual("Cat");
        });

        it("shouldn't find an item", () => {
            const result = pipe.transform(input, "jaguar");
            expect(result.length).toEqual(0);
        });
    });

    describe('Partial input', () => {
        it('should find 2 items', () => {
            const input2 = [{name: "ABCD"}, {name: "FABCE"}, {name: "DCBA"}];
            const result = pipe.transform(input2, "ab");
            expect(result.length).toEqual(2);
        });

        it("shouldn't find any items", () => {
            const input2 = [{name: "ABCD"}, {name: "FABCE"}, {name: "DCBA"}];
            const result = pipe.transform(input2, "abe");
            expect(result.length).toEqual(0);
        });
    });

    describe("Don't fail on null values of fields", () => {
        it("Shouldn't fail on null value", () => {
            expect(() => pipe.transform([{name: null}], "val")).not.toThrow();
        });
    });
});
