import * as core from "@actions/core";
import * as github from "@actions/github";

import {wait} from "./wait";

async function run(): Promise<void> {
    try {
        core.info(github.context.issue.owner);
        //Print the inputs
        core.info(`secrets: ${core.getInput("secrets")}`);

        core.debug(JSON.stringify(core.summary));
        //Print the context
        core.debug(JSON.stringify(github.context));
    } catch (error) {
        if (error instanceof Error) core.setFailed(error.message);
    }
}

run();
