// Copyright (C) 2017 Nokia

import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'search'
})
export class SearchPipe implements PipeTransform {

    private static fieldMatch(item: any, fieldName: string, searchValue: string): boolean {
        return item[fieldName] != null &&
            item[fieldName].toString().toLocaleLowerCase().includes(searchValue);
    }

    private static anywhere(item: any, searchValue: string): boolean {
        return Object.keys(item).some(key => SearchPipe.fieldMatch(item, key, searchValue));
    }

    private static matches(item: any, searchValue: string, fieldName?: string): boolean {
        return fieldName ? SearchPipe.fieldMatch(item, fieldName, searchValue) : SearchPipe.anywhere(item, searchValue);
    }

    transform(items: any[], searchValue: string, fieldName?: string): any {
        if (!items) {
            return [];
        }
        if (!searchValue) {
            return items;
        }
        return items.filter(it => SearchPipe.matches(it, searchValue.toLocaleLowerCase(), fieldName));
    }

}
