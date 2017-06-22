// Copyright (C) 2017 Nokia

import {objectToString, stringToObject, toUrlParams} from './utils';
import * as dedent from 'dedent-js';

describe('Test utils', () => {
    describe('urlParams', () => {
        it('should return empty URLSearchParams on empty object', () => {
            expect(toUrlParams({}).paramsMap.size).toEqual(0);
        });

        it('should convert all values to strings', () => {
            const params = toUrlParams({id: 30});
            expect(params.get("id")).toEqual("30");
            expect(params.get("id")).not.toEqual(30);
        });
    });

    describe('stringToObject', () => {
        it('should convert string to JSON', () => {
           expect(stringToObject('{"id": 30}', "json")).toEqual({id: 30});
        });

        it('should convert string to YAML', () => {
            const yamlString = `
            - param1
            - param2
            `;
            expect(stringToObject(yamlString, "yaml")).toEqual(["param1", "param2"]);
        });

        it('should not convert JSON', () => {
            expect(stringToObject({id: 30}, "json")).toEqual({id: 30});
        });

        it('should not convert empty string', () => {
            expect(stringToObject('', "json")).toEqual('');
        });

        it('should not convert null', () => {
            expect(stringToObject(null, "json")).toBeNull();
        });

    });

    describe('objectToString', () => {
        it('should convert JSON to string', () => {
            const result = dedent`{
              "id": 30
            }`;
            expect(objectToString({id: 30}, "json")).toEqual(result);
        });

       it('should convert null to empty string', () => {
           expect(objectToString(null, "json")).toEqual('');
       });
    });

});
