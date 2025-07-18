# Changelog

## [v1.0.7] - 2024-12-19
### Added
- **Mobile Offcanvas Color Picker**: Enhanced mobile experience with slide-up offcanvas
  - Smooth slide-up animation from bottom with 0.3s ease-out transition
  - Full-width layout (100% screen width) with no horizontal scrolling
  - Optimized color grid spacing and button sizes for mobile screens
  - Black title text and left-aligned reset button for better contrast
  - Touch-friendly controls with proper spacing and sizing

### Changed
- **Color Picker Buttons**: Changed from circular to square buttons with 6px border radius
- **Position Controls Layout**: 
  - Desktop: Padding controls (Y/X) now positioned under BG and Radius settings
  - Mobile: Maintains vertical stacking with left alignment for better touch interaction
- **Responsive Design**: Improved mobile detection and layout adaptation across all screen sizes
- **Color Grid Optimization**: Reduced gaps and button sizes on mobile for better space utilization

### Improved
- Better mobile UX with full-width offcanvas and no horizontal scrolling
- More organized desktop layout with logical control grouping
- Enhanced touch targets and spacing for mobile devices
- Consistent styling across desktop and mobile interfaces

## [v1.0.6] - 2024-12-19
### Added
- **Custom Color Picker**: Replaced default color inputs with a professional Google Docs-style color picker
  - Pinned colors section for quick access to frequently used colors
  - Main color palette with transparency options (90% to 10% opacity)
  - Hex/RGBA input field for custom color values
  - Reset button to restore default colors
  - Compact, organized layout with clear sections
- **Interchangeable Input Controls**: Restored ability to control name, position, and date fields from parent components
- **Enhanced Color Selection**: Support for rgba colors with transparency, improved color validation

### Changed
- All color picker inputs now use the new custom ColorPicker component
- Improved color selection UX with visual feedback and organized palette
- More intuitive color management with pinned colors and transparency options

## v1.0.2

- Added client-side PDF export for letter preview with high-res, style, emoji, and Cyrillic support
- Added export state and spinner to both PDF and PNG export buttons (loading, done, reset)
- Moved export buttons below previews for better UX
- Added SmartFlex logo to the bottom of the letter preview
- Improved page break handling for PDF export (less blank space, better CSS)
- Improved mobile and desktop layout for both card and letter tabs
- Updated tab styles: active tab is solid blue, inactive is blue outline
- Various bug fixes and polish 

## v1.0.3

- PDF export filename now supports Cyrillic and all Unicode letters/numbers for employee names 

## [v.1.0.5] - 2024-06-09
### Changed
- Pinned color and All colors (native color picker) are now fully independent.
- Popup for pinned colors no longer closes when using the color picker.
- Improved UX and stability for color selection. 

## [v.1.0.5] - 2024-06-09
### Added
- Contract type dropdown (Гіг-контракт, Трудовий Договір, Заява на прийом) in letter controls, with default and future extensibility comment.
- Selected contract type now appears in the letter preview, styled bold and black.
- Improved dropdown styling for perfect alignment with other input fields. 