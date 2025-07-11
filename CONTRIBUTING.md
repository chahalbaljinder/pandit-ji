# Contributing to BookMyPanditJi

We love your input! We want to make contributing to BookMyPanditJi as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## 🚀 Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### 1. Fork the Repository

Click the "Fork" button at the top right of the repository page.

### 2. Clone Your Fork

```bash
git clone https://github.com/chahalbaljinder/pandit-ji.git
cd pandit-ji/bookmypanditji/ui
```

### 3. Create a Branch

```bash
git checkout -b feature/amazing-feature
# or
git checkout -b fix/issue-description
```

### 4. Make Your Changes

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure your code passes all tests

### 5. Test Your Changes

```bash
# Run the development server
npm run dev

# Run linting
npm run lint

# Build the project
npm run build
```

### 6. Commit Your Changes

```bash
git add .
git commit -m "Add amazing feature"
```

Use clear and descriptive commit messages:
- `feat: add user authentication`
- `fix: resolve booking form validation`
- `docs: update API documentation`
- `style: format code with prettier`
- `refactor: optimize search algorithm`

### 7. Push to Your Fork

```bash
git push origin feature/amazing-feature
```

### 8. Create a Pull Request

1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Fill out the PR template
4. Wait for review

## 📋 Pull Request Process

1. **Fill out the template**: Use the provided PR template
2. **Link issues**: Reference any related issues
3. **Update documentation**: Include relevant documentation updates
4. **Add tests**: Ensure new features have appropriate tests
5. **Check builds**: Ensure all CI checks pass

## 🐛 Bug Reports

Great bug reports tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening)

Use our bug report template when creating issues.

## 💡 Feature Requests

We welcome feature requests! Please:

1. Check if the feature already exists
2. Check if it's already been requested
3. Provide detailed context and use cases
4. Consider the impact on existing users

## 🎨 Code Style Guidelines

### TypeScript/React
- Use TypeScript for all new files
- Follow React best practices
- Use functional components with hooks
- Implement proper error boundaries
- Add proper TypeScript types

### CSS/Styling
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing (4px, 8px, 16px, 24px, 32px)
- Use semantic color names

### File Structure
```
src/
├── app/                    # Next.js app router pages
├── components/             # Reusable components
│   ├── ui/                # Basic UI components
│   ├── features/          # Feature-specific components
│   └── layout/            # Layout components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── types/                 # TypeScript type definitions
└── styles/                # Global styles
```

## 🧪 Testing Guidelines

### Unit Tests
- Write tests for utility functions
- Test component logic and state changes
- Mock external dependencies

### Integration Tests
- Test user workflows
- Test API integrations
- Test form submissions

### E2E Tests
- Test critical user paths
- Test across different browsers
- Test responsive design

## 📖 Documentation Standards

- Update README.md for new features
- Add JSDoc comments for functions
- Include TypeScript types and interfaces
- Update API documentation
- Add code examples where helpful

## 🏷️ Versioning

We use [Semantic Versioning](http://semver.org/) for releases:

- **MAJOR**: Incompatible API changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

## 📝 Commit Message Format

```
type(scope): subject

body

footer
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): add user authentication system

Implement JWT-based authentication with login/logout functionality.
Includes password hashing and session management.

Closes #123
```

## 🚫 What NOT to Contribute

- Breaking changes without discussion
- Code that doesn't follow our style guide
- Features without proper documentation
- Code without tests (for new features)
- Offensive or inappropriate content

## 🤝 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to a positive environment:
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team. All complaints will be reviewed and investigated promptly and fairly.

## 📞 Getting Help

- **GitHub Discussions**: For questions and community chat
- **GitHub Issues**: For bug reports and feature requests
- **Email**: For private inquiries

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Annual contributor appreciation posts

Thank you for contributing to BookMyPanditJi! 🕉️
