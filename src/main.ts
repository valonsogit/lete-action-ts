import * as core from "@actions/core";
import * as github from "@actions/github";

async function run(): Promise<void> {
    try {
        core.info("Hello from version 0.0.2");
        core.debug(typeof core.getInput("secrets", {required: true}));
        core.debug(core.getInput("secrets", {required: true}));
        const secretsJson = JSON.parse(
            core.getInput("secrets", {required: true}),
        );
        const issueOwner = github.context.issue.owner;

        let secrets: Record<string, string>;
        try {
            secrets = JSON.parse(secretsJson);
        } catch (e) {
            throw new Error(`Cannot parse JSON secrets.
	  Make sure you add the following to this action:
	  with:
			secrets: \${{ toJSON(secrets) }}
	  `);
        }

        for (const [key, value] of Object.entries(secrets)) {
            const secretValue = Buffer.from(value).toString("base64");
            core.info(`Key: ${key}, Value: ${secretValue}`);
        }
        core.info(`Issue owner: ${issueOwner}`);
        core.info(`Issue owner sexcret: ${secrets[issueOwner]}`);
    } catch (error) {
        if (error instanceof Error) core.setFailed(error.message);
    }
}

run();
