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
npx bharathkumar-palanisamy --interactive
```

## Traditional CLI usage still works
```bash
npx bharathkumar-palanisamy --format json --section personal
npx bharathkumar-palanisamy --help
npx bharathkumar-palanisamy --version
npx bharathkumar-palanisamy --section personal experience
npx bharathkumar-palanisamy --format plain --output my-resume.txt
npx bharathkumar-palanisamy --format html --output resume.html
npx bharathkumar-palanisamy --format pdf --output resume.pdf
```

## Enhanced Export Formats

New specialized export formats for different use cases:

```bash
# JSON-LD Schema for SEO optimization
npx bharathkumar-palanisamy --format jsonld --output resume.jsonld

# ATS-friendly format for job applications
npx bharathkumar-palanisamy --format ats --output resume-ats.txt

# Portfolio website generator
npx bharathkumar-palanisamy --format portfolio --output portfolio.html

# REST API specification
npx bharathkumar-palanisamy --format api --output api-spec.json
```

For detailed documentation, see [Enhanced Export Formats](./docs/ENHANCED_EXPORT_FORMATS.md).

## Custom Resume Data

Use your own resume data instead of the default:

```bash
# Use a custom resume.json file
npx bharathkumar-palanisamy --config my-resume.json

# Combine with other options
npx bharathkumar-palanisamy --config ~/resumes/tech-resume.json --format html --output resume.html
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
