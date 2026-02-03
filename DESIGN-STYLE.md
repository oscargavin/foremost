# Foremost Design System

A Factory.ai-inspired design system with warm grays, strategic orange accents, and clean typography.

---

## Color Palette

### Core Colors

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#eeeeee` | Page background (warm light gray) |
| Background Card | `#fafafa` | Card surfaces |
| Background Dark | `#1f1d1c` | Dark sections |
| Background Button | `#101010` | Button backgrounds |
| Foreground | `#020202` | Primary text |
| Foreground Secondary | `#4d4947` | Secondary text |
| Foreground Muted | `#524e4b` | Muted text (WCAG AA) |
| Foreground Light | `#eeeeee` | Text on dark |

### Accent Colors

| Token | Value | Usage |
|-------|-------|-------|
| Accent Orange | `#ee6018` | CTAs, focus rings, highlights |
| Accent Orange Light | `#ef6f2e` | Hover states |
| Accent Orange Border | `#d15010` | Active states |
| Destructive | `#dc2626` | Error states |

### Border Colors

| Token | Value | Usage |
|-------|-------|-------|
| Border Primary | `#b8b3b0` | Default borders |
| Border Secondary | `#a49d9a` | Subtle borders |
| Border Dark | `#4d4947` | Dark section borders |

---

## Typography

### Font Families

- **Sans**: Geist (`--font-geist-sans`) - All UI text
- **Mono**: Geist Mono (`--font-geist-mono`) - Labels, code, metadata

### Type Scale

| Name | Size | Line Height | Letter Spacing | Usage |
|------|------|-------------|----------------|-------|
| Hero | 32px → 60px | 1.1 | -1px → -2.88px | Landing page headlines |
| Page | 28px → 48px | 1.1 | -0.5px → -1.44px | Page titles |
| Section | 28px → 48px | 1.1 | -0.5px → -1.44px | Section headings |
| Card | 20px → 24px | 1.2 | — | Card titles |
| Body Large | 18px | 1.5 | -0.36px | Lead paragraphs |
| Body | 16px | 1.5 | — | Default text |
| Body Small | 14px | 1.5 | — | Supporting text |
| Code | 12px | 1.4 | -0.24px | Code blocks |

### Font Weight

All headings use **normal weight (400)**. Emphasis is achieved through size, tracking, and color rather than bold.

---

## Spacing

### Section Padding

```
Mobile:  py-10 (40px)
sm:      py-12 (48px)
md:      py-16 (64px)
```

### Container

```
Max width: 7xl (1280px)
Padding:   px-4 sm:px-6 md:px-8 lg:px-9
```

### Component Padding

| Element | Padding |
|---------|---------|
| Card | `p-6` (24px) |
| Button | `px-3 py-2.5` |
| Button Large | `px-4 h-11` |
| Input | `px-3 py-2` |

### Custom Spacing Tokens

- `--spacing-18`: 4.5rem (72px)
- `--spacing-22`: 5.5rem (88px)
- `--spacing-30`: 7.5rem (120px)

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| sm | 4px | Buttons, badges |
| md | 6px | Cards (default) |
| lg | 8px | Large cards |
| xl | 16px | Sections |
| 2xl | 24px | Dark sections |
| full | 9999px | Pills, dots |

---

## Shadows

### Elevation

- **Card hover**: `shadow-md` with `-translate-y-0.5`
- **Button hover**: `shadow-lg shadow-black/10`

### Section Blending

```css
/* Inset shadow for depth */
.section-shadow-inset {
  box-shadow: inset 0 1px 3px rgba(foreground, 3%);
}

/* Dark section blend */
.section-dark-blend {
  box-shadow:
    inset 0 1px 0 rgba(white, 5%),
    0 -4px 20px rgba(--background-dark, 50%);
}
```

---

## Animation

### Timing

- **Duration Fast**: 200ms
- **Duration Normal**: 250ms
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)`

### Key Animations

**Logo Dot Pulse**
```css
@keyframes logo-dot-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.25); opacity: 0.85; }
}
/* Duration: 2.5s, pauses on hover */
```

**Floating Pills**
```css
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-2px) rotate(0.5deg); }
  50% { transform: translateY(-4px) rotate(0deg); }
  75% { transform: translateY(-2px) rotate(-0.5deg); }
}
/* Duration: 3.5-4.5s staggered */
```

### Interactive Patterns

| Element | Effect | Timing |
|---------|--------|--------|
| Button arrow | `translateX(3px)` | 200ms |
| Link underline | Scale 0 → 100% | 200ms |
| Card hover | Lift + shadow | 200ms |
| Tap feedback | `scale(0.98)` | instant |

### Motion Components

- **FadeIn**: Viewport-triggered fade + Y translate
- **TextReveal**: Staggered word reveal (0.03s delay)
- **MagneticWrapper**: Cursor-following effect
- **TiltCard**: 3D perspective with spring physics

### Reduced Motion

All complex animations respect `prefers-reduced-motion: reduce`. Float animations disable completely; scroll animations still trigger.

---

## Components

### Button

**Variants**
- Primary: `bg-[#101010]` white text, transparent border
- Secondary: `bg-background` dark text, visible border

**States**
- Hover: Color transition + shadow
- Focus: 2px orange ring, 2px offset
- Disabled: 50% opacity
- Tap: 98% scale

**Minimum touch target**: 44px height (mobile)

### Card

- Background: `#fafafa` with `#b8b3b0` border
- Hover: Border darkens, subtle lift, `shadow-md`
- Padding: 24px consistent

### Input

- Background: `#fafafa`
- Border: Warm gray
- Focus: Orange border + 3px ring (30% opacity)
- Height: 44px (mobile), 36px (desktop)

### Section Label

Small uppercase text with orange dot prefix, monospace font.

```tsx
<SectionLabel>Our Process</SectionLabel>
// Renders: • OUR PROCESS
```

### CTA Card

Dark section with:
- Dashed border
- Diagonal pattern overlay
- Pulsing orange dot
- Monospace description

---

## Layout

### Breakpoints

| Name | Width | Usage |
|------|-------|-------|
| sm | 640px | Small tablets |
| md | 768px | Tablets |
| lg | 1024px | Laptops |
| xl | 1280px | Desktops |
| 2xl | 1536px | Large screens |

### Section Variants

```tsx
<Section variant="default" />  // Light #eeeeee
<Section variant="card" />     // Card #fafafa
<Section variant="dark" />     // Dark #1f1d1c with rounded corners
```

### Background Patterns

- `.bg-pattern-grid` — 48px grid
- `.bg-pattern-dots` — 24px dot pattern
- `.bg-pattern-diagonal` — Diagonal lines
- `.bg-noise` — SVG fractal noise (3% opacity)

---

## Icons

**Library**: Lucide React

**Common icons**: AlertCircle, MessageSquare, X, Send, ArrowRight, RefreshCw

**Sizing**
- Small: 16x16 (default)
- Medium: 12x12 (compact)

**Color**: Inherits from text (`currentColor`)

---

## Accessibility

### Contrast

All text meets WCAG AA (4.5:1 minimum). Muted colors adjusted for compliance.

### Focus States

2px orange ring with 2px offset on all interactive elements.

### Touch Targets

44px minimum height on mobile for buttons and inputs.

### Motion

Respects `prefers-reduced-motion`. Complex animations disable; scroll triggers remain.

---

## Usage Examples

### Colors

```tsx
className="bg-background text-foreground border-border"
className="bg-accent-orange text-foreground-light"
```

### Typography

```tsx
<Heading as="h1" size="hero">Welcome</Heading>
<Heading as="h2" size="section">Features</Heading>
<Text variant="bodyLarge">Lead paragraph text.</Text>
<Text variant="muted">Supporting information.</Text>
```

### Animation

```tsx
<FadeIn delay={0.1}>
  <Card>Content</Card>
</FadeIn>

<m.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
  Click me
</m.button>
```

### Responsive

```tsx
// Mobile-first
className="text-sm sm:text-base md:text-lg"
className="py-10 sm:py-12 md:py-16"
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
```

---

## File Structure

```
/src
├── components/
│   ├── ui/           # Button, Card, Input, etc.
│   ├── layout/       # Section, Container, Header
│   └── motion/       # FadeIn, TextReveal, MagneticWrapper
├── app/
│   └── globals.css   # Design tokens, utilities
└── lib/
    └── utils.ts      # cn() utility
```
