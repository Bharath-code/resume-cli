# Theme & Customization Engine

A comprehensive theming system for the resume builder with AI-powered color generation, font management, brand kit integration, and automatic dark/light mode switching.

## Features

### 🎨 Color Palette Generator
- **AI-suggested color schemes** based on industry and personality
- **Industry-specific palettes** for technology, finance, healthcare, creative, consulting, education, retail, and manufacturing
- **Personality-based customization** with professional, creative, modern, classic, and bold styles
- **Accessibility compliance** with WCAG contrast ratio validation
- **Color harmony algorithms** for complementary and analogous color schemes

### 🔤 Font Management System
- **Curated font pairings** across classic, modern, creative, and technical categories
- **Google Fonts integration** with automatic loading and fallback support
- **Typography scales** with responsive sizing and line heights
- **Font validation** and performance optimization
- **Custom font upload** support for brand-specific typography

### 🏢 Brand Kit Integration
- **Logo integration** with flexible positioning and sizing options
- **Brand color extraction** from uploaded logos using advanced algorithms
- **Company-specific themes** with predefined brand colors for major companies
- **Brand consistency validation** ensuring color harmony and accessibility
- **Multi-format logo support** (SVG, PNG, JPG) with optimization

### 🌓 Dark/Light Mode
- **Automatic theme switching** based on system preferences
- **Time-based switching** with customizable light/dark schedules
- **Intelligent color adaptation** maintaining contrast and readability
- **Smooth transitions** with CSS animations and state persistence
- **Manual override** options for user preference

## Architecture

### Core Modules

```
src/
├── data/
│   └── theme-types.ts          # TypeScript interfaces and types
├── modules/
│   ├── color-generator.ts      # AI color palette generation
│   ├── font-manager.ts         # Font pairing and management
│   ├── brand-kit.ts           # Brand integration utilities
│   ├── theme-mode.ts          # Dark/light mode management
│   └── theme-engine.ts        # Main theme orchestration
└── cli/
    └── theme-cli.ts           # Command-line interface
```

### Key Components

#### ColorPaletteGenerator
- Industry-specific color profiles
- Personality-based palette generation
- Accessibility validation (WCAG AA/AAA)
- Color harmony algorithms
- Contrast ratio calculations

#### FontManager
- Curated font pairing database
- Google Fonts API integration
- Typography scale generation
- Font loading optimization
- Fallback font management

#### BrandKitManager
- Logo color extraction
- Brand-consistent theme generation
- Company brand database
- Color palette validation
- Brand personality mapping

#### ThemeModeManager
- System preference detection
- Time-based switching
- Color adaptation algorithms
- State persistence
- Smooth transitions

#### ThemeEngine
- Theme template management
- Custom theme creation
- CSS generation
- Theme validation
- HTML application

## Usage

### Command Line Interface

```bash
# List available theme templates
npx resume-cli theme list

# Create theme from template
npx resume-cli theme create-from-template --template modern-tech

# Create custom theme
npx resume-cli theme create-custom --industry technology --personality modern --color "#3b82f6"

# Create brand theme
npx resume-cli theme create-brand --colors "#1a73e8,#34a853,#fbbc04" --personality professional

# Generate color schemes
npx resume-cli theme generate-colors --industry creative --personality bold --count 5

# List font pairings
npx resume-cli theme list-fonts --category modern

# Preview theme
npx resume-cli theme preview --theme ./themes/my-theme.json --mode dark

# Validate theme
npx resume-cli theme validate ./themes/my-theme.json

# Interactive theme builder
npx resume-cli theme interactive
```

### Programmatic API

```typescript
import { ThemeEngine, ColorPaletteGenerator, FontManager } from './src/modules';

// Generate AI color scheme
const colorScheme = ColorPaletteGenerator.generateColorScheme({
  industry: 'technology',
  personality: 'modern',
  preferences: {
    favoriteColors: ['#3b82f6'],
    accessibility: true
  }
});

// Create custom theme
const theme = ThemeEngine.createCustomTheme({
  industry: 'technology',
  personality: 'modern'
}, 'Inter & Source Code Pro');

// Apply theme to HTML
const styledHTML = ThemeEngine.applyThemeToHTML(htmlContent, theme, 'light');

// Generate CSS
const css = ThemeEngine.generateCSS(theme, 'dark');
```

## Theme Structure

### Theme Configuration

```typescript
interface ResumeTheme {
  id: string;
  name: string;
  description: string;
  industry?: string;
  colors: {
    light: ColorPalette;
    dark: ColorPalette;
  };
  fonts: FontConfiguration;
  spacing: SpacingScale;
  borderRadius: BorderRadiusScale;
  shadows: ShadowScale;
  layout: LayoutConfiguration;
}
```

### Color Palette

```typescript
interface ColorPalette {
  primary: string;        // Main brand color
  secondary: string;      // Supporting color
  accent: string;         // Highlight color
  background: string;     // Page background
  surface: string;        // Card/section background
  text: {
    primary: string;      // Main text color
    secondary: string;    // Secondary text color
    muted: string;        // Muted text color
  };
  border: string;         // Border color
  success: string;        // Success state color
  warning: string;        // Warning state color
  error: string;          // Error state color
}
```

### Font Configuration

```typescript
interface FontConfiguration {
  heading: {
    family: string;
    weight: number;
    size: {
      h1: string;
      h2: string;
      h3: string;
    };
  };
  body: {
    family: string;
    weight: number;
    size: string;
    lineHeight: string;
  };
  code: {
    family: string;
    size: string;
  };
}
```

## Predefined Themes

### Technology Themes
- **Modern Tech**: Clean, minimal design with blue accents
- **Startup**: Bold, energetic colors with modern typography
- **Enterprise**: Professional, trustworthy design with corporate colors

### Creative Themes
- **Creative Portfolio**: Vibrant, artistic color schemes
- **Design Agency**: Sophisticated, design-focused aesthetics
- **Freelancer**: Personal, approachable styling

### Professional Themes
- **Corporate**: Traditional, conservative design
- **Consulting**: Clean, professional appearance
- **Finance**: Trustworthy, stable color schemes

### Industry-Specific Themes
- **Healthcare**: Calming, trustworthy colors
- **Education**: Friendly, accessible design
- **Legal**: Professional, authoritative styling

## Customization Options

### Color Customization
- Industry-based color suggestions
- Personality-driven palette generation
- Custom color input with harmony validation
- Accessibility compliance checking
- Brand color integration

### Typography Customization
- Curated font pairing selection
- Google Fonts integration
- Custom font upload support
- Typography scale adjustment
- Readability optimization

### Layout Customization
- Spacing scale configuration
- Border radius settings
- Shadow depth options
- Layout width and padding
- Section spacing control

## Accessibility Features

### WCAG Compliance
- **AA Level**: Minimum 4.5:1 contrast ratio for normal text
- **AAA Level**: Minimum 7:1 contrast ratio for enhanced accessibility
- **Large Text**: Minimum 3:1 contrast ratio for 18pt+ text
- **Color Independence**: Information not conveyed by color alone

### Validation Tools
- Automatic contrast ratio calculation
- Color blindness simulation
- Accessibility score reporting
- Compliance recommendations
- Alternative color suggestions

## Performance Optimization

### Font Loading
- Google Fonts API optimization
- Font display swap for faster rendering
- Preload critical fonts
- Fallback font stacks
- Font subsetting for reduced file size

### CSS Generation
- Minimal CSS output
- CSS custom properties for theming
- Efficient selector usage
- Critical CSS inlining
- Unused style elimination

### Theme Switching
- Smooth transitions between modes
- State persistence in localStorage
- Efficient DOM updates
- Reduced layout thrashing
- Optimized color calculations

## Browser Support

- **Modern Browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **CSS Features**: Custom properties, CSS Grid, Flexbox
- **JavaScript Features**: ES2020, Async/await, Modules
- **Fallbacks**: Graceful degradation for older browsers

## Contributing

### Adding New Themes
1. Create theme configuration in `theme-engine.ts`
2. Add industry-specific colors to `color-generator.ts`
3. Include font pairings in `font-manager.ts`
4. Test accessibility compliance
5. Update documentation

### Adding Font Pairings
1. Research font compatibility and licensing
2. Test readability across different sizes
3. Verify Google Fonts availability
4. Add to font pairing database
5. Include fallback fonts

### Extending Color Generation
1. Research industry color psychology
2. Implement color harmony algorithms
3. Add accessibility validation
4. Test across different personalities
5. Document color reasoning

## License

MIT License - see LICENSE file for details.

## Support

For issues, feature requests, or questions:
- Create an issue on GitHub
- Check existing documentation
- Review accessibility guidelines
- Test theme configurations

---

**Built with ❤️ for creating beautiful, accessible resumes**