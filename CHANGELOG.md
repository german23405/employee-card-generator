# Changelog

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