# GitHub Actions Workflows

This directory contains automated CI/CD workflows for the bharathkumar_resume_npx project. These workflows ensure code quality, security, and reliable deployments.

## 📋 Workflow Overview

### 🚀 [CI/CD Pipeline](./npm-publish.yml)
**Triggers**: Push to main/master, Pull Requests, Releases

**Features**:
- **Multi-Node Testing**: Tests on Node.js 18, 20, and 21
- **Code Quality**: ESLint, Prettier formatting checks
- **Testing Suite**: Unit tests, integration tests, coverage reporting
- **Security**: npm audit, dependency vulnerability scanning
- **Build Verification**: Ensures clean builds across environments
- **Automated Publishing**: Publishes to npm on releases

**Jobs**:
- `test`: Comprehensive testing and quality checks
- `security-audit`: Security vulnerability scanning
- `publish`: Automated npm publishing (release only)

### 🔍 [Pull Request Validation](./pr-validation.yml)
**Triggers**: Pull Requests

**Features**:
- **Quick Validation**: Fast checks for immediate feedback
- **Merge Conflict Detection**: Prevents problematic merges
- **Code Quality Analysis**: TODO comments, file size checks
- **Bundle Size Monitoring**: Tracks package size changes
- **Automated PR Comments**: Provides detailed feedback

**Jobs**:
- `quick-checks`: Linting, type checking, unit tests
- `code-quality`: File analysis and quality metrics
- `pr-comment`: Automated feedback on pull requests

### 🔄 [Dependency Management](./dependency-update.yml)
**Triggers**: Weekly schedule, Manual dispatch, package.json changes

**Features**:
- **Automated Updates**: Patch and minor version updates
- **Security Monitoring**: Vulnerability scanning and alerts
- **Compatibility Testing**: Ensures updates don't break functionality
- **Automated PRs**: Creates pull requests for safe updates
- **Critical Alerts**: Immediate notifications for security issues

**Jobs**:
- `check-outdated`: Identifies outdated dependencies
- `security-scan`: Scans for security vulnerabilities
- `update-dependencies`: Safely updates compatible versions
- `test-updates`: Validates updates don't break functionality
- `create-pr`: Creates pull requests for updates
- `notify-critical`: Alerts for critical security issues

### ⚡ [Performance Monitoring](./performance.yml)
**Triggers**: Push to main/master, Pull Requests, Weekly schedule

**Features**:
- **CLI Performance**: Startup time benchmarking
- **Memory Analysis**: Memory usage profiling
- **Bundle Size Tracking**: Package size monitoring
- **Regression Detection**: Identifies performance degradation
- **Historical Tracking**: Long-term performance trends

**Jobs**:
- `cli-performance`: Benchmarks CLI startup and execution
- `bundle-analysis`: Analyzes package size and composition
- `regression-check`: Detects performance regressions in PRs

## 🔧 Configuration

### Required Secrets

Add these secrets to your GitHub repository settings:

```
NPM_TOKEN          # npm authentication token for publishing
SLACK_WEBHOOK_URL  # Slack webhook for critical notifications (optional)
```

### Environment Variables

The workflows use these environment variables:

```yaml
NODE_VERSION: 20        # Primary Node.js version
NODE_VERSIONS: [18,20,21] # Test matrix versions
COVERAGE_THRESHOLD: 80   # Minimum test coverage
MAX_BUNDLE_SIZE: 5120    # Maximum bundle size (KB)
MAX_STARTUP_TIME: 2000   # Maximum CLI startup time (ms)
```

## 📊 Workflow Status

### Badges

Add these badges to your main README.md:

```markdown
[![CI/CD Pipeline](https://github.com/YOUR_USERNAME/bharathkumar_resume_npx/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/YOUR_USERNAME/bharathkumar_resume_npx/actions/workflows/npm-publish.yml)
[![PR Validation](https://github.com/YOUR_USERNAME/bharathkumar_resume_npx/actions/workflows/pr-validation.yml/badge.svg)](https://github.com/YOUR_USERNAME/bharathkumar_resume_npx/actions/workflows/pr-validation.yml)
[![Dependency Updates](https://github.com/YOUR_USERNAME/bharathkumar_resume_npx/actions/workflows/dependency-update.yml/badge.svg)](https://github.com/YOUR_USERNAME/bharathkumar_resume_npx/actions/workflows/dependency-update.yml)
[![Performance](https://github.com/YOUR_USERNAME/bharathkumar_resume_npx/actions/workflows/performance.yml/badge.svg)](https://github.com/YOUR_USERNAME/bharathkumar_resume_npx/actions/workflows/performance.yml)
```

### Monitoring

- **Action Runs**: Monitor workflow executions in the Actions tab
- **Artifacts**: Performance reports and test results are stored as artifacts
- **Notifications**: Critical issues trigger Slack notifications (if configured)
- **PR Comments**: Automated feedback on pull requests

## 🛠️ Customization

### Modifying Thresholds

Adjust performance and quality thresholds in the workflow files:

```yaml
# Performance thresholds
MAX_STARTUP_TIME: 2000    # CLI startup time limit (ms)
MAX_BUNDLE_SIZE: 5120     # Bundle size limit (KB)
COVERAGE_THRESHOLD: 80    # Test coverage minimum (%)

# Quality thresholds
MAX_FILE_SIZE: 1048576    # Individual file size limit (bytes)
MAX_TODO_COUNT: 10       # Maximum TODO comments
```

### Adding New Checks

To add new quality checks:

1. **Linting Rules**: Update `.eslintrc.js` configuration
2. **Test Coverage**: Modify coverage thresholds in `package.json`
3. **Security Rules**: Add custom security checks to dependency-update.yml
4. **Performance Metrics**: Extend performance.yml with new benchmarks

### Notification Setup

To enable Slack notifications:

1. Create a Slack webhook URL
2. Add `SLACK_WEBHOOK_URL` to repository secrets
3. Customize notification messages in dependency-update.yml

## 🚨 Troubleshooting

### Common Issues

**Build Failures**:
- Check Node.js version compatibility
- Verify all dependencies are properly installed
- Review ESLint and TypeScript errors

**Test Failures**:
- Ensure test environment matches CI environment
- Check for race conditions in integration tests
- Verify test data and fixtures are available

**Publishing Issues**:
- Verify NPM_TOKEN is valid and has publish permissions
- Check package.json version is properly incremented
- Ensure no duplicate versions exist on npm

**Performance Regressions**:
- Review recent code changes for performance impact
- Check if new dependencies increased bundle size
- Analyze memory usage patterns in failing tests

### Debug Mode

Enable debug logging by adding this to workflow files:

```yaml
env:
  ACTIONS_STEP_DEBUG: true
  ACTIONS_RUNNER_DEBUG: true
```

## 📈 Metrics and Reports

### Generated Artifacts

- **Test Coverage Reports**: HTML coverage reports
- **Performance Reports**: JSON files with benchmark data
- **Bundle Analysis**: Package size breakdown
- **Security Reports**: Vulnerability scan results
- **Lint Reports**: Code quality analysis

### Retention Policy

- **Test Reports**: 30 days
- **Performance Data**: 90 days
- **Security Scans**: 90 days
- **Build Artifacts**: 7 days

## 🔄 Maintenance

### Regular Tasks

- **Monthly**: Review and update Node.js versions
- **Quarterly**: Update GitHub Actions to latest versions
- **As Needed**: Adjust performance thresholds based on project growth
- **Security**: Monitor for new security best practices

### Workflow Updates

When updating workflows:

1. Test changes in a feature branch first
2. Monitor initial runs for any issues
3. Update documentation if behavior changes
4. Communicate changes to team members

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Node.js Testing Best Practices](https://github.com/goldbergyoni/nodebestpractices#-6-testing-and-overall-quality-practices)
- [Security Best Practices](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)

---

*This documentation is automatically maintained. Last updated: $(date)*