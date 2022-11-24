# Secret Selection Action

This action for selects a token from all the tokens in your repository given an input key.

## Usage

### Inputs

- `secrets` - REQUIRED: all the secrets in the repository. This input *MUST* be `${{ toJSON(secrets) }}` otherwise the action will fail.
> **Note**: The following inputs will be uppercased and cleaned of all non-alpha-numeric characters. This is to ensure that they are valid environment variable names.
- `secretKey` - REQUIRED: the key of the secret we want to obtain. Useful in combination with expressions like
`${{ github.actor }}` to get a secret based on the current flow.
- `fallbackKey` - OPTIONAL: the key of the secret we want to obtain if the `secretKey` is not found. Useful when an actor secret is not found and we want to fallback to a default secret such as an organization secret.
- `outputName` - REQUIRED: the key for the output variable. Defaults to `SELECTED_SECRET` and will be defined in both the enviroment and as a step output.<br/>
  It can be used in subsequent steps with the following syntax:
    - As an enviroment variable - `${{ env.<outputName> }}`
    - As a step output - `${{ steps.<step-id>.outputs.<outputName> }}`.

### Example workflow:

#### Selecting a secret based on the current issue author


Create a file at `.github/workflows/` with the following content.

```yml
name: Select a secret token based on the current issue author
on:
  issues:
    types: [opened]
jobs:
  test_job:
    runs-on: ubuntu-latest
    name: Test job of secret selection action
    steps:
      - name: Dump GitHub context # This is just to find where the actor is defined in the context
        run: echo "${{ toJSON(github) }}"
      - name: selection
        uses: valonsogit/secrets-token-selector@v1.0
        with:
          secrets: "${{ toJSON(secrets) }}"
          secretKey: TOKEN_${{ github.actor }} # The key will have a TOKEN_ prefix
          outputName: CUSTOM_OUTPUT_NAME
      - name: "Print ouput of previous step with env"
        run: echo "$CUSTOM_OUTPUT_NAME"
      - name: "Print output of previous step with its output"
        run: echo "${{ steps.selection.outputs.CUSTOM_OUTPUT_NAME }}"
      - name: "Print full env"
        run: printenv
```
