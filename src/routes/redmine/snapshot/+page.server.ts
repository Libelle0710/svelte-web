import type {Actions} from "./$types";
import {supabase} from "$lib/supabase";

export const actions: Actions = {
    createsnapshot: async ({request, locals, url}) => {

        //insert:
        const {data, error} = await supabase
            .from('tickets')
            .select()

        const bugs = data.filter((obj) => obj.ticket_type == "Bug" && obj.status != "Done" && obj.status != "Closed").sort((a, b) => (a.id > b.id) ? 1 : -1).length;
        const features = data.filter((obj) => obj.ticket_type == "Feature" && obj.status != "Done" && obj.status != "Closed").sort((a, b) => (a.id > b.id) ? 1 : -1).length;
        const unassigned = data.filter((obj) => obj.status == "Unassigned").length;

        const assigned = data.filter((obj) => obj.status == "Assigned").length;
        const unevaluated = data.filter((obj) => obj.status == "Unevaluated").length;
        const testperiod = data.filter((obj) => obj.status == "test period").length;
        const shipping = data.filter((obj) => obj.status == "Shipping").length;
        const intermitted = data.filter((obj) => obj.status == "Intermitted").length;
        const actionrequired = data.filter((obj) => obj.status == "Action required").length;
        const inprogress = data.filter((obj) => obj.status == "In progress").length;
        const done = data.filter((obj) => obj.status == "Done").length;
        const closed = data.filter((obj) => obj.status == "Closed").length;

        const snapshot = {
            bugs: bugs,
            features: features,
            unassigned: unassigned,
            assigned: assigned,
            unevaluated: unevaluated,
            test_period: testperiod,
            shipping: shipping,
            intermitted: intermitted,
            action_required: actionrequired,
            in_progress: inprogress,
            done: done,
            closed: closed,
            tickets: data
        }

        console.log(bugs);
        console.log(features);

        return {message: "all ok"}
    }
}