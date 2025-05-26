# Routine

This is a POC for a routine tracking app. It's perfect for my personal needs. It tracks a weekly workout schedule where parameters can be adjusted run-to-run. Lots of services with similar feature sets; I've yet to see one that is lean and enjoyable to use.

## Setup

Bare bones Vite... `npm install`, then `npm run dev`. Default Vite port... http://localhost:5173/. Prefer to run in a [devcontainer](https://code.visualstudio.com/docs/devcontainers/containers), configuration is included.

## Roadmap

This project is currently ingesting my actual weekly routine from a JSON file with some default parameters. Next major step is to add a data store and CRUD for managing plans.

See the [ROADMAP.md](./ROADMAP.md) for a more complete list of what's next.

## LLM Usage

- Prototyped with OpenAI o3 and Claude Sonnet 4 to validate core flows (code largely scrapped).
- Generated unit and integration test coverage with Claude Sonnet 4; manual tuning still needed.
