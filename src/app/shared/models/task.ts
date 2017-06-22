// Copyright (C) 2017 Nokia

/**
 * https://docs.openstack.org/developer/mistral/dsl/dsl_v2.html#tasks
 */
export interface TaskDef {
    description?: string;
    action?: string;
    workflow?: string;
    input?: {[key: string]: any};
    publish?: {[key: string]: any};
    "with-items"?: string;
    retry?: {delay: number, count: number}
}
