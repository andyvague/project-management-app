# Assets Directory

This directory contains static assets for the Monkeybrains MDU Project Management System.

## Logo Files

### How to Add Your Logo

1. **Place your logo file** in the `images/` subdirectory
2. **Use this exact name**: `logo.svg` (or `logo.png`, `logo.jpg`)
3. **Recommended format**: SVG (scalable, best quality)

### Supported File Formats
- **SVG** (recommended - scalable, perfect quality)
- **PNG** (supports transparency)
- **JPG/JPEG** (if transparency not needed)

### Automatic Detection
The system will automatically:
- Look for `logo.svg` first (your current file)
- Fall back to size-specific files if needed
- Use the built-in SVG icon if no files are found
- Scale your logo appropriately for different contexts

### Example Usage
```tsx
// Icon only (will use your logo.svg)
<MonkeybrainsLogo variant="icon" size="small" />

// Compact logo with text (will use your logo.svg)
<MonkeybrainsLogo variant="compact" size="medium" />

// Full logo with tagline (will use your logo.svg)
<MonkeybrainsLogo variant="full" size="large" />
```

### File Structure
```
src/assets/
├── images/
│   └── logo.svg         ← Your logo file (already added!)
└── README.md
```

## Adding Your Logo

1. **Copy your logo file** to `src/assets/images/`
2. **Rename it** to `logo.svg` (or use the name you prefer)
3. **Restart the development server** if needed
4. **The system will automatically use your logo!**

## Current Status

✅ **Logo file detected**: `logo.svg` is in place  
✅ **System ready**: Component will automatically use your logo  
✅ **SVG format**: Perfect for scaling to any size  
✅ **Integration complete**: Logo is now displayed throughout the system  

## Fallback Behavior

If no logo files are found, the system will display a professional antenna icon as a placeholder, ensuring the application always looks complete.
