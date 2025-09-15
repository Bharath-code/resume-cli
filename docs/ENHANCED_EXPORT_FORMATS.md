# Enhanced Export Formats

This document describes the new enhanced export formats available in the resume CLI tool.

## Overview

Four new export formats have been added to provide specialized outputs for different use cases:

- **JSON-LD Schema**: SEO-optimized structured data for web integration
- **ATS-Friendly Formats**: Applicant Tracking System optimized exports
- **Portfolio Website Generator**: One-command static site generation
- **Resume API**: Generate REST endpoints for resume data

## JSON-LD Schema Export

### Purpose
Generates SEO-optimized structured data using Schema.org vocabulary for better search engine visibility and web integration.

### Usage
```bash
# Export as JSON-LD
npx bharathkumar-palanisamy --format jsonld --output resume.jsonld

# Or without saving to file
npx bharathkumar-palanisamy --format jsonld
```

### Features
- Schema.org Person vocabulary compliance
- Structured data for search engines
- Professional experience as Organization objects
- Education as EducationalOrganization objects
- Projects as CreativeWork objects
- Contact information and social profiles

### Use Cases
- Embedding in personal websites for SEO
- Integration with content management systems
- Structured data for search engine optimization
- Professional profile syndication

## ATS-Friendly Format Export

### Purpose
Creates plain text, keyword-optimized resumes specifically designed for Applicant Tracking Systems (ATS).

### Usage
```bash
# Export as ATS-friendly format
npx bharathkumar-palanisamy --format ats --output resume-ats.txt

# With specific sections
npx bharathkumar-palanisamy --format ats --section experience techStack --output resume-ats.txt
```

### Features
- Plain text format for maximum ATS compatibility
- Keyword optimization for better parsing
- Clear section headers in UPPERCASE
- Bullet points using standard characters
- No special formatting or graphics
- Optimized layout for automated parsing

### Use Cases
- Job applications through ATS systems
- Corporate recruitment platforms
- Automated resume screening processes
- HR database imports

## Portfolio Website Generator

### Purpose
Generates a complete, responsive HTML portfolio website with modern styling and professional layout.

### Usage
```bash
# Generate portfolio website
npx bharathkumar-palanisamy --format portfolio --output portfolio.html

# With custom sections
npx bharathkumar-palanisamy --format portfolio --section personal profile experience projects --output portfolio.html
```

### Features
- Responsive design with mobile optimization
- Modern CSS with gradient headers
- Professional color scheme
- Grid-based contact section
- Styled project and experience cards
- Clean typography and spacing
- Ready-to-deploy HTML file

### Technical Details
- Self-contained HTML file with embedded CSS
- No external dependencies
- Mobile-first responsive design
- Cross-browser compatibility
- Semantic HTML structure

### Use Cases
- Personal portfolio websites
- Quick professional landing pages
- GitHub Pages deployment
- Professional networking
- Client presentations

## Resume API Generator

### Purpose
Generates OpenAPI 3.0 specification for REST endpoints that serve resume data.

### Usage
```bash
# Generate API specification
npx bharathkumar-palanisamy --format api --output resume-api.json

# View API spec in console
npx bharathkumar-palanisamy --format api
```

### Features
- OpenAPI 3.0 compliant specification
- Multiple endpoints for different data sections
- Complete schema definitions
- Professional API documentation
- Ready for implementation

### API Endpoints
- `GET /resume` - Complete resume data
- `GET /resume/contact` - Contact information only
- `GET /resume/experience` - Professional experience
- `GET /resume/skills` - Technical skills

### Use Cases
- Building resume APIs
- Integration with portfolio websites
- Mobile app backends
- Professional profile services
- Headless CMS integration

## CLI Integration

### Updated Format Options
The `--format` option now supports all new formats:

```bash
--format <type>
```

Available formats:
- `colored` (default) - Terminal colored output
- `plain` - Plain text output
- `json` - JSON format
- `html` - HTML format
- `pdf` - PDF format
- `markdown` - Markdown format
- `latex` - LaTeX format
- `linkedin` - LinkedIn optimized
- `twitter` - Twitter bio format
- **`jsonld`** - JSON-LD Schema (NEW)
- **`ats`** - ATS-friendly format (NEW)
- **`portfolio`** - Portfolio website (NEW)
- **`api`** - API specification (NEW)

### Template Integration
New formats automatically select appropriate templates:
- `jsonld` → `tech_resume` template
- `ats` → `tech_resume` template
- `portfolio` → `creative_portfolio` template
- `api` → `tech_resume` template

### Examples

```bash
# Generate all new formats
npx bharathkumar-palanisamy --format jsonld --output seo-data.json
npx bharathkumar-palanisamy --format ats --output ats-resume.txt
npx bharathkumar-palanisamy --format portfolio --output portfolio.html
npx bharathkumar-palanisamy --format api --output api-spec.json

# Use with custom templates
npx bharathkumar-palanisamy --format portfolio --template creative_portfolio --output creative-portfolio.html

# Combine with section filtering
npx bharathkumar-palanisamy --format ats --section experience techStack education --output focused-resume.txt
```

## Implementation Details

### File Structure
New export functions are implemented in `src/modules/export.ts`:
- `exportToJsonLD()` - JSON-LD Schema generation
- `exportToATS()` - ATS-friendly text generation
- `exportToPortfolio()` - Portfolio website generation
- `exportToAPI()` - API specification generation

### Type Safety
All new formats are properly typed in `src/data/types.ts`:
```typescript
type OutputFormat = 'colored' | 'plain' | 'json' | 'html' | 'pdf' | 
                   'markdown' | 'latex' | 'linkedin' | 'twitter' |
                   'jsonld' | 'ats' | 'portfolio' | 'api';
```

### Error Handling
- Graceful error handling for all new formats
- Validation of template compatibility
- Clear error messages for troubleshooting

## Best Practices

### JSON-LD
- Use for websites that need SEO optimization
- Validate output with Google's Structured Data Testing Tool
- Include in website `<script type="application/ld+json">` tags

### ATS Format
- Always save as `.txt` file for maximum compatibility
- Use standard section names for better parsing
- Avoid special characters and formatting

### Portfolio Website
- Test responsiveness on multiple devices
- Customize colors and styling as needed
- Deploy to GitHub Pages or similar hosting

### API Specification
- Use with API development tools like Swagger UI
- Implement actual endpoints based on the specification
- Validate with OpenAPI validators

## Future Enhancements

Potential future improvements:
- Custom CSS themes for portfolio generator
- Multiple ATS format variants
- Extended JSON-LD vocabulary support
- API implementation generator
- Integration with popular hosting platforms