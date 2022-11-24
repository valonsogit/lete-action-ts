import * as core from "@actions/core";
async function run(): Promise<void> {
    try {
        /** Define necessary variables */
        let secretsObject: Record<string, string>;
        try {
            secretsObject = JSON.parse(
                core.getInput("secrets", {required: true}),
            );
        } catch (error: any) {
            const parseError = `Cannot parse JSON secrets.\nMake sure you add the following to this action:\n\twith:\n\t\tsecrets: \${{ toJSON(secrets) }}`;
            core.debug(parseError);
            throw Error(parseError);
        }
        core.debug(`Parsed secrets: ${JSON.stringify(secretsObject)}`);

        const secretKey = core
            .getInput("secretKey", {required: true})
            .toUpperCase();
        core.debug(`Secret key found: ${secretKey}`);

        const fallbackKey = core
            .getInput("fallbackKey", {required: false})
            .toUpperCase();
        if (fallbackKey) {
            core.debug(`fallbackKey found: ${fallbackKey}`);
        } else {
            core.debug(`No fallbackKey specified`);
        }

        const outputName = core.getInput("outputName", {
            required: true,
        });
        core.debug(`outputName found: ${outputName}`);

        let expectedSecretValue = secretsObject[secretKey];
        if (!expectedSecretValue) {
            if (!fallbackKey) {
                throw Error(
                    `${secretKey} not found and no fallbackKey was provided`,
                );
            }
            /** Fallback */
            core.debug(
                `No value found for ${secretKey} - falling back to ${fallbackKey}`,
            );
            expectedSecretValue = secretsObject[fallbackKey];
            if (!expectedSecretValue) {
                throw Error(`Fallback to ${fallbackKey} failed`);
            }
        }
        core.exportVariable(outputName, expectedSecretValue);
        core.debug(`Defined ${outputName} as environment variable`);

        core.setOutput(outputName, expectedSecretValue);
        core.debug(`Set ${outputName} as output variable`);
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
    }
}
run();
