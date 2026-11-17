# frankndok repository instructions

## Branches and pull requests

- Verify the default branch on GitHub before starting. It is currently `gh_pages`.
- Fetch the latest default branch and create a new, task-specific branch from it.
- Commit only the requested changes, push the feature branch, and open a pull request against the default branch for the owner to review and approve.
- Include a summary and validation results in the pull request, and share its URL with the owner. If PR creation is blocked, report the error and share the GitHub compare link for the pushed branch.
- Leave merging and deployment to the owner.

## Documentation

- Put guides under the most relevant category in `docs/` and dated posts in `blog/`. Ubuntu and other Linux administration guides belong under DevOps → Linux.
- Docusaurus generates the docs sidebar from the directory structure. Use the existing `_category_.json` convention when a new section needs a label.
- Preserve supplied wording unless the task calls for editing. When moving existing pages, check their URLs and update affected internal links.

## Local validation

- Use Node.js 18 or later. Install dependencies from the committed lockfile with `npm ci` when needed.
- Run `npm start -- --host 0.0.0.0 --no-open` for local preview and `npm run build` before submitting changes. For new or moved docs, check the generated page and its sidebar entry.
- Keep generated output and dependencies out of commits.
