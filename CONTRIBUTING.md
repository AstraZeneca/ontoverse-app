# Contributing to Ontoverse

Thank you for your interest in contributing to Ontoverse! This document provides guidelines for contributing to the project.

## How to Contribute

### Opening Issues

If you find a bug or have a feature request, please open an issue on the repository. When opening an issue, please:

- Use a clear and descriptive title
- Provide a detailed description of the issue or feature
- Include steps to reproduce (for bugs)
- Include relevant code examples or screenshots when applicable

### Pull Requests

We welcome pull requests! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

Please ensure your pull request:
- Follows the existing code style
- Includes tests if applicable
- Updates documentation as needed
- Has a clear description of the changes

## Versioning Guidelines

This project uses [Semantic Versioning](https://semver.org/) (semver) for version numbers.

### Version Format

Versions follow the format: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes that are not backward compatible
- **MINOR**: New features that are backward compatible
- **PATCH**: Bug fixes that are backward compatible

### Version Tags

- Version tags should be created as annotated tags in git
- Example: `git tag -a v0.1.0 -m "Release version 0.1.0"`
- **Important**: Always push tags to the remote repository: `git push --tags`

### Initial Version

If the code is being imported or published for the first time:
- Create an initial version tag: `0.1.0`
- This allows referees and future readers to refer to the specific version at publication time

### Version Updates

- **Patches** (0.1.1, 0.1.2, etc.): For bug fixes and minor corrections requested by referees
- **Minor** (0.2.0, 0.3.0, etc.): For new features or significant additions (e.g., extended algorithms)
- **Major** (1.0.0, 2.0.0, etc.): For breaking changes or major refactoring

### Example Workflow

```bash
# Create and push an annotated tag
git tag -a v0.1.0 -m "Release version 0.1.0"
git push origin v0.1.0

# For a patch release
git tag -a v0.1.1 -m "Release version 0.1.1 - Bug fixes"
git push origin v0.1.1

# For a minor release with new features
git tag -a v0.2.0 -m "Release version 0.2.0 - Added new algorithm"
git push origin v0.2.0
```

## Code of Conduct

Please be respectful and constructive in all interactions. We are committed to providing a welcoming and inclusive environment for all contributors.

## Questions?

If you have questions about contributing, please open an issue with the `question` label.

