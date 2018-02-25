// Copyright (C) 2017 Nokia

import {Pipe, PipeTransform} from '@angular/core';

/**
 * Use the 'search' pipe with specifying field name like <Array>|search:<ngModel>:'name',
 * or with several field names separated by comma <Array>|search:<ngModel>:'name,id'
 */
@Pipe({
    name: 'search'
})
export class SearchPipe implements PipeTransform {
    matches(item: any, searchValue: string, fieldName?: string): boolean {
        const fieldNames = fieldName ? fieldName.split(",") : Object.keys(item);
        return fieldNames
            .filter(name => item[name] != null)
            .some(name => item[name].toString().toLocaleLowerCase().includes(searchValue));
    }

    transform(items: any[], searchValue: string, fieldName?: string): any {
        if (!items) {
            return [];
        }
        if (!searchValue) {
            return items;
        }
        return items.filter(it => this.matches(it, searchValue.toLocaleLowerCase(), fieldName));
    }

}
