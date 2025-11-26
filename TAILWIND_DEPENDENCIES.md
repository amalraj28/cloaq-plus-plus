# Tailwind CSS Dependencies to Remove

This file lists all the packages that are related to Tailwind CSS and are no longer needed after converting to plain CSS.

Once you've verified that everything works correctly with the plain CSS implementation, you can manually remove these dependencies using `npm uninstall` or `bun remove`:

## Core Tailwind Packages
- `tailwindcss` - The main Tailwind CSS package
- `tailwindcss-animate` - Tailwind plugin for animations
- `autoprefixer` - PostCSS plugin (usually used with Tailwind)

## Utility Packages
- `tailwind-merge` - Used for merging Tailwind classes (exported as `cn` utility)
- `class-variance-authority` - Used for creating component variants with Tailwind classes

## Files to Remove
After uninstalling the packages, you can also remove these configuration files:
- `tailwind.config.ts` - Tailwind configuration file
- `postcss.config.js` - PostCSS configuration (if it only contains Tailwind config)

## Commands to Remove Dependencies

### Using npm:
```bash
npm uninstall tailwindcss tailwindcss-animate autoprefixer tailwind-merge class-variance-authority
```

### Using bun:
```bash
bun remove tailwindcss tailwindcss-animate autoprefixer tailwind-merge class-variance-authority
```

### Using Lovable tools:
Use the `lov-remove-dependency` tool to uninstall each package individually.

## Note
The following packages should be kept as they are NOT Tailwind-specific:
- All `@radix-ui/*` packages
- `framer-motion`
- `lucide-react`
- `react`, `react-dom`, `react-router-dom`
- `sonner`
- All other UI and functionality packages
