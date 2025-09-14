# GitHub Actions CI/CD Setup Guide

## 🚀 Overview

This project now includes a comprehensive GitHub Actions CI/CD pipeline that provides:

- **Automated Testing** on multiple Node.js versions
- **Code Quality Checks** with linting and formatting
- **Security Auditing** for dependencies
- **Performance Monitoring** and regression detection
- **Automated Publishing** to npm
- **Dependency Management** with security updates

## 📁 Workflow Files Created

### 1. **Main CI/CD Pipeline** (`.github/workflows/npm-publish.yml`)
- **Triggers**: Push to main/master, Pull Requests, Releases
- **Features**: Multi-Node testing, quality checks, security audits, automated publishing
- **Matrix Testing**: Node.js versions 18, 20, and 21

### 2. **Pull Request Validation** (`.github/workflows/pr-validation.yml`)
- **Triggers**: Pull Requests
- **Features**: Quick validation, merge conflict detection, code quality analysis
- **Feedback**: Automated PR comments with detailed results

### 3. **Dependency Management** (`.github/workflows/dependency-update.yml`)
- **Triggers**: Weekly schedule, Manual dispatch, package.json changes
- **Features**: Automated updates, security scanning, compatibility testing
- **Safety**: Creates PRs for safe dependency updates

### 4. **Performance Monitoring** (`.github/workflows/performance.yml`)
- **Triggers**: Push to main/master, Pull Requests, Weekly schedule
- **Features**: CLI benchmarking, memory analysis, bundle size tracking
- **Regression Detection**: Identifies performance degradation

## 🔧 Setup Instructions

### Step 1: Repository Secrets

Add these secrets to your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add the following secrets:

```
NPM_TOKEN          # Required for npm publishing
SLACK_WEBHOOK_URL  # Optional for notifications
```

#### Getting NPM_TOKEN:
1. Login to npm: `npm login`
2. Create token: `npm token create --type=automation`
3. Copy the token and add it to GitHub secrets

### Step 2: Enable GitHub Actions

1. Go to **Settings** → **Actions** → **General**
2. Select **Allow all actions and reusable workflows**
3. Enable **Read and write permissions** for GITHUB_TOKEN

### Step 3: Branch Protection (Recommended)

1. Go to **Settings** → **Branches**
2. Add rule for `main` branch:
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - ✅ Require pull request reviews
   - ✅ Dismiss stale reviews

## 🎯 How It Works

### On Pull Requests:
1. **PR Validation** runs quick checks
2. **Main CI/CD** runs full test suite
3. **Performance** checks for regressions
4. Automated comments provide feedback

### On Push to Main:
1. **Full CI/CD** pipeline runs
2. **Performance** monitoring tracks metrics
3. **Dependency** checks run if package.json changed

### On Releases:
1. All tests must pass
2. **Automated publishing** to npm
3. **Performance** baseline updated

### Weekly Maintenance:
1. **Dependency updates** check for outdated packages
2. **Security scanning** for vulnerabilities
3. **Performance** benchmarks for trend analysis

## 📊 Monitoring and Reports

### Workflow Status
Monitor all workflows in the **Actions** tab of your repository.

### Artifacts Generated:
- **Test Coverage Reports** (30 days retention)
- **Performance Benchmarks** (90 days retention)
- **Bundle Analysis** (90 days retention)
- **Security Scan Results** (90 days retention)

### PR Comments
Automated comments provide:
- Test results summary
- Performance metrics
- Bundle size changes
- Code quality feedback

## 🛠️ Customization

### Performance Thresholds
Edit these values in `performance.yml`:

```yaml
MAX_STARTUP_TIME: 2000    # CLI startup time limit (ms)
MAX_BUNDLE_SIZE: 5120     # Bundle size limit (KB)
COVERAGE_THRESHOLD: 80    # Test coverage minimum (%)
```

### Node.js Versions
Update the matrix in `npm-publish.yml`:

```yaml
strategy:
  matrix:
    node-version: [18, 20, 21]  # Add/remove versions as needed
```

### Notification Setup
To enable Slack notifications:

1. Create a Slack webhook URL
2. Add `SLACK_WEBHOOK_URL` to repository secrets
3. Critical security issues will trigger notifications

## 🚨 Troubleshooting

### Common Issues:

**❌ Build Failures**
- Check Node.js version compatibility
- Verify TypeScript compilation
- Review dependency conflicts

**❌ Test Failures**
- Ensure CLI builds successfully
- Check for missing dependencies
- Verify file permissions on dist/cli.js

**❌ Publishing Failures**
- Verify NPM_TOKEN is valid
- Check package.json version increment
- Ensure no duplicate versions on npm

**❌ Performance Regressions**
- Review recent code changes
- Check for new heavy dependencies
- Analyze bundle size increases

### Debug Mode
Enable detailed logging by adding to workflow:

```yaml
env:
  ACTIONS_STEP_DEBUG: true
  ACTIONS_RUNNER_DEBUG: true
```

## 📈 Best Practices

### Development Workflow:
1. Create feature branch
2. Make changes and commit
3. Push branch (triggers PR validation)
4. Create pull request
5. Review automated feedback
6. Merge after approval
7. Release when ready (triggers publishing)

### Release Process:
1. Update version in package.json
2. Create release notes
3. Create GitHub release
4. Automated publishing handles the rest

### Maintenance:
- **Weekly**: Review dependency update PRs
- **Monthly**: Check performance trends
- **Quarterly**: Update Node.js versions
- **As needed**: Adjust thresholds based on project growth

## 🔗 Useful Commands

```bash
# Test locally before pushing
npm test
npm run lint
npm run format:check
npm audit

# Build and verify
npm run build
node dist/cli.js --help

# Manual dependency check
npm outdated
npm audit
```

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Workflow README](./.github/workflows/README.md)

---

## ✅ Setup Complete!

Your repository now has a production-ready CI/CD pipeline. The workflows will:

- ✅ **Test** your code automatically
- ✅ **Maintain** code quality standards
- ✅ **Monitor** performance and security
- ✅ **Publish** releases automatically
- ✅ **Update** dependencies safely

**Next Steps:**
1. Add NPM_TOKEN to repository secrets
2. Enable branch protection rules
3. Create your first pull request to see it in action!

*Happy coding! 🎉*