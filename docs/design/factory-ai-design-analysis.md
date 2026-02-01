# Factory.ai Design System Analysis

A comprehensive breakdown of Factory.ai's visual design language, capturing the technical details of their minimalist, developer-focused aesthetic.

---

## 1. Color Palette

### Primary Colors

| Name | RGB | Hex | Usage |
|------|-----|-----|-------|
| Almost Black | `rgb(2, 2, 2)` | `#020202` | Primary text, headings |
| Near Black | `rgb(16, 16, 16)` | `#101010` | Login button background, dark accents |
| Dark Charcoal | `rgb(31, 29, 28)` | `#1f1d1c` | Dark section backgrounds (CTA cards, enterprise section) |

### Accent Colors

| Name | RGB | Hex | Usage |
|------|-----|-----|-------|
| Factory Orange | `rgb(238, 96, 24)` | `#ee6018` | Primary accent, dots, indicators |
| Factory Orange (Light) | `rgb(239, 111, 46)` | `#ef6f2e` | Active states, highlighted text |
| Orange Border | `rgb(209, 80, 16)` | `#d15010` | Orange-bordered elements |

### Neutral Grays (Light Theme)

| Name | RGB | Hex | Usage |
|------|-----|-----|-------|
| Page Background | `rgb(238, 238, 238)` | `#eeeeee` | Main page background |
| Card Background | `rgb(250, 250, 250)` | `#fafafa` | Cards, elevated surfaces |
| Light Gray | `rgb(214, 211, 210)` | `#d6d3d2` | Subtle backgrounds |
| Border Gray | `rgb(184, 179, 176)` | `#b8b3b0` | Primary border color |
| Medium Border | `rgb(164, 157, 154)` | `#a49d9a` | Secondary borders, button borders |

### Text Colors

| Name | RGB | Hex | Usage |
|------|-----|-----|-------|
| Primary Text | `rgb(2, 2, 2)` | `#020202` | Headings, primary content |
| Secondary Text | `rgb(77, 73, 71)` | `#4d4947` | Nav links, secondary labels |
| Muted Text | `rgb(92, 88, 85)` | `#5c5855` | Descriptions, footer links |
| Subtle Text | `rgb(138, 131, 128)` | `#8a8380` | Tertiary content |
| Light Text (Dark BG) | `rgb(238, 238, 238)` | `#eeeeee` | Text on dark backgrounds |
| Muted Light | `rgb(204, 201, 199)` | `#ccc9c7` | Secondary text on dark backgrounds |

---

## 2. Typography

### Font Families

```css
/* Primary Font - UI Text */
font-family: Geist, "Geist Fallback";

/* Monospace - Code, Labels, Descriptions */
font-family: "Geist Mono", "Geist Mono Fallback";

/* System Fallback */
font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
```

### Type Scale

| Element | Font | Size | Weight | Line Height | Letter Spacing |
|---------|------|------|--------|-------------|----------------|
| H1 (Hero) | Geist | 60px | 400 | 60px (1.0) | -2.88px |
| H1 (Page) | Geist | 48px | 400 | 48px (1.0) | -1.44px |
| H2 (Section) | Geist | 48px | 400 | 48px (1.0) | -1.44px |
| H2 (Card) | Geist | 24px | 400 | 24px (1.0) | normal |
| H2 (Pricing) | Geist | 36px | 400 | 36px (1.0) | -0.72px |
| Body Large | Geist Mono | 18px | 400 | 21.6px (1.2) | -0.36px |
| Body | Geist | 16px | 400 | 24px (1.5) | normal |
| Body Small | Geist | 14px | 400 | - | normal |
| Code/Label | Geist Mono | 12px | 400 | 12px (1.0) | -0.24px |
| Label | Geist Mono | 14px | 400 | - | -0.0175rem |
| Testimonial | Geist | 33.28px | 400 | 33.28px | - |

### Typography Patterns

**Headings:**
- All headings use `font-weight: 400` (regular) - no bold headings
- Tight line-height matching font size (1:1 ratio)
- Negative letter-spacing for larger headings (-2.88px at 60px, -1.44px at 48px)
- Color: `rgb(2, 2, 2)` (almost black)

**Labels & Tags:**
- `text-transform: uppercase`
- Geist Mono font
- 14px size
- Often preceded by section indicators (e.g., "01 - Terminal / IDE")

**Body/Description Text:**
- Geist Mono for descriptions (creates technical feel)
- Color: `rgb(92, 88, 85)` (muted gray)
- 18px with 1.2 line-height for larger descriptions
- Negative letter-spacing (-0.36px)

---

## 3. Layout & Grid System

### Grid Structure

```css
/* 12-column grid */
grid-template-columns: repeat(12, 78.6562px);
column-gap: 24px;
```

### Container Spacing

| Element | Padding | Margin |
|---------|---------|--------|
| Header | 0 36px | - |
| Main Sections | 0 36px | 40px 0 88px |
| Dark CTA Section | 48px 0 | 120px 36px |
| Cards | 16px 0 or 24px 0 | - |

### Spacing Scale

- **4px** - Micro spacing
- **8px** - Small spacing
- **12px** - Button padding, gaps
- **16px** - Card internal padding
- **24px** - Section padding, grid gaps
- **36px** - Container horizontal padding
- **40px** - Section margins
- **48px** - Large section padding
- **88px** - Section bottom margins
- **120px** - CTA section margins

---

## 4. Components

### Navbar

```css
header {
  position: sticky;
  top: 0;
  z-index: 60;
  height: 65px;
  padding: 0 36px;
  background-color: transparent;
  /* No backdrop-filter blur */
}
```

**Nav Links:**
- Color: `rgb(77, 73, 71)`
- Font: Geist, 16px, weight 400
- No underline (`text-decoration: none`)
- Dropdown indicators with 12px chevron icons

### Buttons

**Primary Button (Log In):**
```css
{
  background-color: rgb(16, 16, 16);
  color: rgb(2, 2, 2); /* Uses inner text color */
  border: 1px solid transparent;
  border-radius: 4px;
  padding: 0 12px;
  font-family: Geist;
  font-size: 16px;
  font-weight: 400;
}
```

**Secondary Button (Contact Sales):**
```css
{
  background-color: rgb(238, 238, 238);
  color: rgb(2, 2, 2);
  border: 1px solid rgb(164, 157, 154);
  border-radius: 4px;
  padding: 0 12px;
  font-family: Geist;
  font-size: 16px;
  font-weight: 400;
}
```

**CTA Button (Start Building):**
```css
{
  background-color: rgb(238, 238, 238);
  color: rgb(2, 2, 2);
  border: 1px solid rgb(164, 157, 154);
  border-radius: 4px;
  padding: 0 14px;
  font-family: Geist;
  font-size: 16px;
  /* Includes arrow icon */
}
```

### Cards

**Feature Card:**
```css
{
  background-color: rgb(250, 250, 250);
  border: 1px solid rgb(184, 179, 176);
  border-radius: 6px; /* or 8px */
  padding: 16px 0;
  box-shadow: none;
}
```

**Dark CTA Card:**
```css
{
  background-color: rgb(31, 29, 28);
  border-radius: 16px;
  padding: 48px 0; /* or 20px */
  margin: 120px 36px;
}
```

**Pricing Card:**
```css
{
  background-color: rgb(238, 238, 238);
  border: 1px solid rgb(184, 179, 176);
  border-radius: 6px;
  padding: 24px 0;
}
```

### Links

**Arrow Links (Learn more):**
```css
{
  display: flex;
  align-items: center;
  color: rgb(2, 2, 2);
  font-size: 16px;
  font-weight: 400;
  text-decoration: none;
  /* Arrow icon follows text */
}
```

**Footer Links:**
```css
{
  color: rgb(92, 88, 85);
  font-size: 14px;
  font-weight: 400;
}
```

### Section Labels/Tags

```css
{
  font-family: "Geist Mono";
  font-size: 14px;
  font-weight: 400;
  color: rgb(2, 2, 2);
  text-transform: uppercase;
  /* Often with numeric prefix: "01 - Terminal / IDE" */
}
```

**Badge Indicator Dots:**
- Orange filled circle before section labels
- Color: `rgb(238, 96, 24)`

---

## 5. Border System

### Border Colors

| Name | RGB | Usage |
|------|-----|-------|
| Primary Border | `rgb(184, 179, 176)` | Cards, sections |
| Secondary Border | `rgb(164, 157, 154)` | Buttons, subtle borders |
| Dark Border | `rgb(77, 73, 71)` | Dark theme elements |
| Darker Border | `rgb(92, 88, 85)` | Dark theme accents |
| Orange Border | `rgb(209, 80, 16)` | Active/focused states |

### Border Styles

```css
/* Standard solid border */
border: 1px solid rgb(184, 179, 176);

/* Dashed border (rare) */
border: 1px dashed rgb(92, 88, 85);

/* Transparent border (for consistent sizing) */
border: 1px solid transparent;
```

### Border Radius Scale

| Value | Usage |
|-------|-------|
| 4px | Buttons, small elements, theme toggle |
| 6px | Cards, pricing cards |
| 8px | Feature cards, code blocks |
| 16px | Large sections, CTA cards |
| 24px | Pill shapes |
| 9999px | Full circular/pill |

---

## 6. Backgrounds & Surfaces

### Background Hierarchy (Light → Dark)

1. **Page Background:** `rgb(238, 238, 238)` - Main canvas
2. **Card Surface:** `rgb(250, 250, 250)` - Elevated cards
3. **Subtle Background:** `rgb(214, 211, 210)` - Hover states, active items
4. **Dark Section:** `rgb(31, 29, 28)` - CTA sections, enterprise areas
5. **Near Black:** `rgb(16, 16, 16)` - Primary buttons, footer toggle

### Surface Usage Counts (from analysis)

| Background | Count | Primary Use |
|------------|-------|-------------|
| `rgb(250, 250, 250)` | 15 | Cards, elevated surfaces |
| `rgb(138, 131, 128)` | 22 | Progress indicators, dots |
| `rgb(214, 211, 210)` | 8 | Subtle backgrounds |
| `rgb(164, 157, 154)` | 6 | Border-like backgrounds |
| `rgb(238, 238, 238)` | 6 | Buttons, page elements |

---

## 7. Icons & SVGs

### Icon Characteristics

- **Count:** ~110 SVG icons on homepage
- **Fill:** Usually `none` (outline style)
- **Color:** Inherits from parent or `currentColor`
- **Common sizes:** 12px, 18px, 24px, 40px

### Icon Styling

```css
/* Small icons (nav dropdowns) */
{
  width: 12px;
  height: 12px;
  fill: none;
  color: rgb(77, 73, 71);
}

/* Medium icons */
{
  width: 18px;
  height: 18px;
  fill: rgb(77, 73, 71);
  color: rgb(77, 73, 71);
}

/* Feature icons */
{
  width: 24px;
  height: 24px;
  fill: none;
}

/* Logo */
{
  width: 128px;
  height: 19px;
  fill: none;
  color: rgb(2, 2, 2);
}
```

### Arrow Icons

- Used consistently with "Learn more", "Start building" CTAs
- Positioned inline after text
- Same color as text (inherits)

---

## 8. Animations & Transitions

### Transition Patterns

**Color Transitions (most common):**
```css
transition: color 0.2s cubic-bezier(0.4, 0, 0.2, 1),
            background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1),
            border-color 0.2s cubic-bezier(0.4, 0, 0.2, 1),
            outline-color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
```

**Opacity Transitions:**
```css
transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
```

**Transform Transitions:**
```css
transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),
            translate 0.2s cubic-bezier(0.4, 0, 0.2, 1),
            scale 0.2s cubic-bezier(0.4, 0, 0.2, 1);
```

### Easing Function

All transitions use: `cubic-bezier(0.4, 0, 0.2, 1)` (ease-out style)

- Duration: 0.2s - 0.25s (fast, snappy)
- No bounce or spring effects
- Subtle, professional feel

---

## 9. Code/Terminal Styling

### Code Blocks

```css
{
  font-family: "Geist Mono", "Geist Mono Fallback";
  font-size: 12px; /* or 16px for larger blocks */
  background-color: transparent; /* or rgb(250, 250, 250) */
  color: rgb(2, 2, 2);
}
```

### Syntax Highlighting

- Keywords (like `droid`): `rgb(239, 111, 46)` (orange)
- Regular code: `rgb(2, 2, 2)` (dark)
- Comments/strings: Gray tones

### Terminal Cards

```css
{
  background-color: rgb(250, 250, 250);
  border: 1px solid rgb(184, 179, 176);
  border-radius: 8px;
  /* Three-dot window controls at top-left */
}
```

---

## 10. Footer

### Footer Structure

- Background: `rgb(250, 250, 250)`
- Contained within card with `border-radius: 0` (or integrated)
- 3-column layout: Resources, Company, Legal

### Footer Headings

```css
{
  color: rgb(2, 2, 2);
  font-size: 14px;
  font-weight: 400;
  font-family: Geist;
}
```

### Footer Links

```css
{
  color: rgb(92, 88, 85);
  font-size: 14px;
  font-weight: 400;
}
```

### Theme Toggle

```css
{
  background-color: rgb(16, 16, 16);
  border-radius: 4px;
  /* Contains sun/moon/system icons */
}
```

### Social Links

- X (Twitter), LinkedIn, GitHub
- Positioned in footer
- Same gray color as footer links

---

## 11. Design Patterns & Principles

### Minimalism

- No box shadows (clean, flat design)
- Sparse use of color (primarily grayscale + orange accent)
- Generous whitespace
- Single accent color (orange) used sparingly

### Typography-First

- Content hierarchy established through type scale, not weight
- All headings use regular weight (400)
- Negative letter-spacing for display text
- Monospace for technical/label content

### Developer-Focused Aesthetic

- Terminal/code-like styling
- Monospace fonts for descriptions
- Numbered section labels (01, 02, 03...)
- Clean, functional interface

### Subtle Borders Over Shadows

- 1px borders for elevation and separation
- No drop shadows or glows
- Border colors in warm gray palette

### Orange Accent Strategy

- Used for:
  - Status indicators (dots)
  - Active/selected states
  - Data visualization (chart elements)
  - Highlighted code syntax
- Never used for large surfaces
- Always draws attention to key elements

---

## 12. Responsive Considerations

### Grid Behavior

- 12-column grid on desktop
- 24px column gap
- 36px horizontal page padding
- Cards likely stack on mobile

### Sticky Header

```css
{
  position: sticky;
  top: 0;
  z-index: 60;
}
```

---

## 13. Dark Theme Notes

While the site defaults to light mode, dark theme elements are present:

**Dark Section Colors:**
- Background: `rgb(31, 29, 28)`
- Text: `rgb(238, 238, 238)` (primary), `rgb(204, 201, 199)` (secondary)
- Muted: `rgb(138, 131, 128)`

**Dark Theme Toggle:**
- Three options: Dark, Light, System
- Located in footer

---

## 14. Summary: Key Takeaways

1. **Color Philosophy:** Warm grays (not blue-grays), single orange accent
2. **Typography:** Geist + Geist Mono pairing, regular weight throughout, tight line-heights
3. **Borders:** 1px solid, warm gray colors, no shadows
4. **Border Radius:** 4px (small), 6-8px (cards), 16px (sections)
5. **Spacing:** 8px increments, generous margins (40-120px between sections)
6. **Transitions:** 0.2s with ease-out cubic-bezier
7. **Voice:** Technical, minimalist, developer-focused
