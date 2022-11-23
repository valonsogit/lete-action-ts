import * as core from "@actions/core";
import {GitHub} from "@actions/github/lib/utils";
import {context} from "@actions/github";

export async function createBranch(
    octoInstance: InstanceType<typeof GitHub>,
    branch: string,
    sha?: string,
): Promise<boolean> {
    // Sometimes branch might come in with refs/heads already
    const ref = `refs/heads/${branch}`;
    core.debug(`Creating branch ${ref}`);
    // throws HttpError if branch already exists.
    try {
        await octoInstance.rest.repos.getBranch({
            ...context.repo,
            branch,
        });
        core.debug(`Branch ${ref} already exists`);
        core.setFailed(`Branch ${ref} already exists`);
    } catch (error: any) {
        if (error.name === "HttpError" && error.status === 404) {
            const resp = await octoInstance.rest.git.createRef({
                ref,
                sha: sha || context.sha,
                ...context.repo,
            });
            return resp?.data?.ref === ref;
        } else {
            core.setFailed(JSON.stringify(error));
            throw error;
        }
    }
    return true;
}
