import type {Actions} from "./$types";
import {fail, redirect} from "@sveltejs/kit";
import {supabase} from "$lib/supabase";

export const actions: Actions = {
    syncissues: async ({request, locals, url}) => {

        const issues = [];
        const body = Object.fromEntries(await request.formData());
        // @ts-ignore
        const maxOffset = body.maxOffset as number;

        for (let i = 0; i <= maxOffset; i += 100) {
            const res = await fetch(`http://bugs.infoboard.biz/issues.json?status_id=*&key=7efa424ca02dd79ec9ae8751843a88235e57122b&limit=100&offset=${i}`, {
                method: "GET",
                mode: "no-cors"
            });
            const currentIssues = await res.json();
            issues.push(currentIssues.issues);
            console.log(i);
        }

        const tickets = [];
        for (let page in issues) {
            for (let issueIdx in issues[page]) {
                const issue = issues[page][issueIdx];
                tickets.push(issue);
            }
        }


        let {data: t, error} = await supabase
            .from('tickets')
            .select('id')

        let newIssues = [];
        let existingIssues = [];

        if (!error) {
            const ids = t.map((t) => t.id);

            for (let i in tickets) {
                const issue = tickets[i];
                console.log(issue.closed_on);
                const normalizedIssue = {
                    id: issue.id,
                    created_on: issue.created_on,
                    subject: issue.subject,
                    project: issue.project.name,
                    tracker: issue.tracker.name,
                    author: issue.author.name,
                    status: issue.status.name,
                    priority: issue.priority.name,
                    description: issue.description,
                    updated_on: issue.updated_on,
                    closed_on: issue.closed_on,
                    assignee: issue.assignee,
                    ticket_type: issue.custom_fields[0]?.value,
                    customer: issue.custom_fields[2]?.value
                };
                // console.log(issue);
                if (ids.includes(issue.id)) {
                    // console.log("ID exists already, will be updated: " + issue.id);
                    // const { data, error } = await supabase
                    //     .from('tickets')
                    //     .update(normalizedIssue)
                    //     .eq("id", normalizedIssue.id)
                    //     .select()

                } else {
                    console.log("ID is new, will be created: " + issue.id);
                    newIssues.push(normalizedIssue);
                }

            }


            //insert:
            const {data, error} = await supabase
                .from('tickets')
                .insert(newIssues)
                .select()

        }


        return {message: "all ok"}
    }
}