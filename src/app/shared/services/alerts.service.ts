// Copyright (C) 2017 Nokia

import {Injectable} from "@angular/core";
import swal, {SweetAlertOptions} from "sweetalert2";


@Injectable()
export class AlertsService {
    constructor() {
        swal.setDefaults({
            allowEscapeKey: false,
            allowOutsideClick: false
        });
    }

    private show(msg: string, options: SweetAlertOptions) {
        console.warn(msg);

        return swal({
            html: msg,
            ...options
        });
    }

    success(msg, options: SweetAlertOptions = {}) {
        return this.show(msg, {
            ...options,
            type: "success",
            title: options.title || "Success!"
        });
    }

    warning(msg, options: SweetAlertOptions = {}) {
        return this.show(msg, {
            ...options,
            type: "warning",
            title: options.title || "Warning!"
        });
    }

    error(msg, options: SweetAlertOptions = {}) {
        return this.show(msg, {
            ...options,
            type: "error",
            title: options.title || "Error!"
        });
    }

    info(msg, options: SweetAlertOptions = {}) {
        return this.show(msg, {
            ...options,
            type: "info",
            title: options.title || "Information"
        });
    }

    notFound(msg: string, options: SweetAlertOptions = {}) {
        return this.show(msg, {
            ...options,
            title: options.title || "Nope, it's not here",
            imageUrl: 'assets/icon256.svg',
            imageClass: 'swal-notfound'
        });
    }

}
