# Contributing to 500-Rule Calculator

Thank you for your interest in contributing to the 500-Rule Astrophotography Calculator! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### 1. Code Contributions

#### Setting Up Development Environment
```bash
# Fork and clone the repository
git clone https://github.com/your-username/500rule.git
cd 500rule

# Install dependencies
npm install

# Start development server
npm run dev
```

#### Making Changes
1. **Create a feature branch**: `git checkout -b feature/your-feature-name`
2. **Make your changes**: Follow the coding standards below
3. **Test thoroughly**: Ensure all functionality works as expected
4. **Commit with clear messages**: Use conventional commit format
5. **Push and create PR**: Submit a pull request with detailed description

### 2. Equipment Database Contributions

We always need more cameras and lenses! Here's how to add them:

#### Adding Cameras
Edit `backend/data/cameras.js`:
```javascript
{
  id: 'brand-model', // Unique identifier
  brand: 'Brand Name',
  name: 'Model Name',
  mount: 'Mount Type', // e.g., 'Canon RF', 'Sony E'
  sensor_format: 'Format', // 'Full Frame', 'APS-C', 'Micro Four Thirds'
  crop_factor: 1.5, // Numeric crop factor
  megapixels: 24, // Sensor resolution
  price_range: 'Entry' // 'Entry', 'Enthusiast', 'Professional'
}
```

#### Adding Lenses
Edit `backend/data/lenses.js`:
```javascript
{
  id: 'brand-focal-aperture-mount',
  brand: 'Brand Name',
  name: 'Lens Name with specifications',
  mount: 'Mount Type',
  focal_length: '24-70', // Single focal length or range
  max_aperture: 'f/2.8', // Widest aperture
  type: 'zoom', // 'prime' or 'zoom'
  category: 'standard', // 'wide-angle', 'standard', 'telephoto', 'macro'
  is_stabilized: true, // Has image stabilization
  weight: 680 // Weight in grams
}
```

#### Mount Compatibility
Update `backend/data/mountCompatibility.js` for new mount types:
```javascript
'New Mount': ['Compatible Mount 1', 'Compatible Mount 2']
```

### 3. Documentation Improvements

- **README updates**: Improve installation, usage, or feature documentation
- **Code comments**: Add helpful comments for complex functionality
- **API documentation**: Enhance endpoint descriptions
- **User guides**: Create tutorials or how-to guides

### 4. Bug Reports

When reporting bugs, please include:
- **Clear description** of the issue
- **Steps to reproduce** the problem
- **Expected vs actual behavior**
- **Browser/device information**
- **Console errors** if applicable
- **Screenshots** when helpful

Use this template:
```markdown
## Bug Description
Brief description of the bug

## Steps to Reproduce
1. Go to...
2. Click on...
3. Observe...

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Browser: Chrome 120
- Device: Desktop/Mobile
- OS: macOS/Windows/Linux
```

### 5. Feature Requests

For new features, please:
- **Check existing issues** to avoid duplicates
- **Provide clear use case** and rationale
- **Describe expected behavior** in detail
- **Consider implementation impact**

## 📝 Coding Standards

### TypeScript/JavaScript
- Use **TypeScript** for type safety
- Follow **ESLint** configuration
- Use **meaningful variable names**
- Add **JSDoc comments** for functions
- Handle **errors gracefully**

### React Components
- Use **functional components** with hooks
- Implement **proper state management**
- Add **PropTypes** or TypeScript interfaces
- Follow **component composition** patterns
- Use **semantic HTML** elements

### CSS/Styling
- Use **TailwindCSS** utility classes
- Follow **responsive design** principles
- Maintain **consistent spacing** and colors
- Use **semantic class names** when custom CSS needed

### API Design
- Follow **RESTful** conventions
- Use **consistent response** formats
- Implement **proper error handling**
- Add **input validation**
- Document **all endpoints**

## 🧪 Testing Guidelines

### Manual Testing
- Test **all user flows** thoroughly
- Verify **responsive design** on different screen sizes
- Check **accessibility** features
- Test **edge cases** and error conditions

### Cross-browser Testing
- **Chrome** (primary development browser)
- **Firefox** 
- **Safari** (especially on macOS)
- **Mobile browsers** (iOS Safari, Chrome Mobile)

### Equipment Testing
- Verify **calculation accuracy** with known setups
- Test **search functionality** with various queries
- Check **compatibility logic** between cameras and lenses

## 🔄 Pull Request Process

### Before Submitting
1. **Update documentation** if needed
2. **Test thoroughly** in development
3. **Check for lint errors**: `npm run lint`
4. **Verify build succeeds**: `npm run build`

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Database addition
- [ ] Performance improvement

## Testing
- [ ] Manual testing completed
- [ ] Cross-browser testing done
- [ ] Mobile testing completed

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows project standards
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No lint errors
```

### Review Process
1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Testing** in various environments
4. **Approval** and merge

## 🏷️ Equipment Contribution Priorities

### High Priority
- **New camera releases** (2023-2024 models)
- **Popular APS-C cameras** (entry-level DSLRs/mirrorless)
- **Third-party lenses** (Sigma, Tamron, Tokina)
- **Vintage/film cameras** with digital equivalents

### Medium Priority
- **Specialized cameras** (medium format, cinema)
- **Rare lens mounts** and adapters
- **Manual focus lenses**
- **Historical equipment**

### Information Needed
For each camera/lens, try to include:
- **Official specifications** from manufacturer
- **Real-world crop factors** (may differ from theoretical)
- **Mount compatibility** details
- **Weight and size** information

## 🌟 Recognition

Contributors will be:
- **Listed in README** acknowledgments
- **Credited in commit messages**
- **Mentioned in release notes** for significant contributions
- **Invited as collaborators** for sustained contributions

## 📞 Getting Help

- **GitHub Issues**: Technical questions and bug reports
- **GitHub Discussions**: General questions and ideas
- **Code Comments**: Inline questions in PRs
- **Documentation**: Check existing docs first

## 📜 Code of Conduct

### Our Standards
- **Be respectful** and inclusive
- **Provide constructive** feedback
- **Focus on collaboration** over competition
- **Help newcomers** learn and contribute
- **Share knowledge** and expertise

### Unacceptable Behavior
- Harassment or discriminatory language
- Personal attacks or trolling
- Sharing private information
- Commercial spam or self-promotion

---

**Thank you for contributing to the astrophotography community!** 🌌

Every contribution, no matter how small, helps fellow astrophotographers capture better images of our universe. 