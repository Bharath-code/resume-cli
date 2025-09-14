# @bharathkumar-palanisamy — CLI Resume

Prints the resume of **Bharathkumar Palanisamy** to the terminal.

## Usage

Try these in order:

```bash
# 1) Preferred (assignment requirement)
npx @bharathkumar-palanisamy

# 2) Fallback (if npm rejects scoped single-name)
npx bharathkumar-palanisamy

# 3) Scoped fallback with slash (alternative)
npx @bharathkumar-palanisamy/resume
```
## Launch interactive mode
```bash
npx bharathkumar-palanisamy  --interactive

## Traditional CLI usage still works
npx bharathkumar-palanisamy  --format json --section personal
npx bharathkumar-palanisamy  --help
npx bharathkumar-palanisamy  --version
npx bharathkumar-palanisamy --section personal experience
npx bharathkumar-palanisamy --format plain --output my-resume.txt
npx bharathkumar-palanisamy --format html --output resume.html
npx bharathkumar-palanisamy --format pdf --output resume.pdf
```
## Local testing

```bash
npm install
chmod +x cli.js
node cli.js
```

## Publish

```bash
npm login
npm publish --access public
```

Notes:
- If you publish the scoped package (`@bharathkumar-palanisamy`) npm may accept or reject the name depending on registry rules.
- If rejected, use one of the fallback names described above.

## Files

- `cli.js` — executable Node script that prints the resume
- `package.json` — package metadata (name, bin, dependencies)
- `README.md` — this file

## License

MIT
