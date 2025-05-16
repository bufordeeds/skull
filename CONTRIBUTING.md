# Contributing to Skull Digital

Thank you for your interest in contributing to Skull Digital! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone. Please be considerate of differing viewpoints and experiences, and refrain from any form of harassment or discrimination.

## How Can I Contribute?

### Reporting Bugs

If you find a bug in the application, please create an issue in the GitHub repository with the following information:

-   A clear, descriptive title
-   Steps to reproduce the bug
-   Expected behavior
-   Actual behavior
-   Screenshots (if applicable)
-   Device/environment information (OS, browser, mobile device, etc.)

### Suggesting Features

Have an idea for a new feature? Create an issue with the following:

-   A clear, descriptive title prefixed with "Feature Request:"
-   A detailed description of the feature
-   Any relevant mockups or diagrams
-   Explanation of why this feature would be valuable to users

### Pull Requests

We welcome pull requests for bug fixes, features, and improvements. To submit a pull request:

1. Fork the repository
2. Create a new branch from `main` following our branch naming convention
3. Make your changes, following our coding standards
4. Add or update tests as necessary
5. Update documentation to reflect your changes
6. Submit a pull request with a clear description of the changes

## Development Process

### Getting Started

Please refer to the [DEVELOPMENT.md](DEVELOPMENT.md) file for instructions on setting up your development environment and running the project locally.

### Coding Standards

#### JavaScript/TypeScript

-   Use ES6+ features where appropriate
-   Follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
-   Use meaningful variable and function names
-   Add comments for complex logic
-   Keep functions small and focused on a single responsibility

#### React Native

-   Use functional components with hooks instead of class components
-   Keep components small and reusable
-   Use prop-types or TypeScript for type checking
-   Follow the [React Native community guidelines](https://reactnative.dev/docs/contributing)

#### CSS/Styling

-   Use React Native's StyleSheet for styling
-   Keep styles organized and modular
-   Use consistent naming conventions

### Testing

-   Write tests for all new features and bug fixes
-   Ensure all tests pass before submitting a pull request
-   Aim for good test coverage, especially for critical game logic

### Documentation

-   Update documentation to reflect your changes
-   Document new features, APIs, and components
-   Use clear, concise language
-   Include examples where appropriate

## Review Process

All pull requests will be reviewed by at least one maintainer. The review process includes:

1. Automated checks (linting, tests, etc.)
2. Code review by maintainers
3. Feedback and requested changes (if necessary)
4. Approval and merge

## Git Workflow

### Branching Strategy

-   `main`: Production-ready code
-   `develop`: Integration branch for features
-   Feature branches: Created from `develop` for new features
-   Hotfix branches: Created from `main` for critical bug fixes

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types include:

-   `feat`: A new feature
-   `fix`: A bug fix
-   `docs`: Documentation changes
-   `style`: Code style changes (formatting, etc.)
-   `refactor`: Code changes that neither fix bugs nor add features
-   `test`: Adding or updating tests
-   `chore`: Changes to the build process or auxiliary tools

### Pull Request Titles

Use the same format as commit messages for pull request titles.

## Release Process

1. Features are merged into `develop`
2. When ready for release, `develop` is merged into `main`
3. A new version tag is created
4. Release notes are generated from commit messages

## Questions?

If you have any questions about contributing, please reach out to the maintainers or create an issue labeled "question" in the repository.

Thank you for contributing to Skull Digital!
