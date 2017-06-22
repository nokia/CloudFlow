export const MistralServiceMock = {
    selectedExecution: {
        subscribe: function(next: Function) {
            next({workflow_id: "abcd-efg", id: "xyz-uvw", input: {param1: 1}});

            return {
                unsubscribe: function(){}
            }
        },
    }
};
