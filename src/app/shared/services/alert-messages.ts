// Copyright (C) 2017 Nokia

export interface AlertMessage {
    msg: string;
    confirmButtonText?: string;
    title?: string;
}

export function taskNotFound(taskId: string): AlertMessage {
    const msg = `Sorry, we couldn't find the requested task.<br/><small><code>ID: ${taskId}</code></small>`;
    const confirmButtonText = 'Back to workflow execution';

    return {msg, confirmButtonText};
}

export function executionNotFound(executionId: string): AlertMessage {
    const msg = `Sorry, we couldn't find that execution.<br/><small><code>ID: ${executionId}</code></small>`;
    const confirmButtonText = `Back to Executions List`;

    return {msg, confirmButtonText};
}

export function workflowDefinitionNotFound(workflowId: string): AlertMessage {
    const msg = `Sorry, we couldn't find the workflow definition.<br/>
        Limited information will be shown.<br/>
        <small><code>Workflow ID: ${workflowId}</code></small>`;
    const title = `Couldn't retrieve the workflow definition`;

    return {msg, title};
}
