import React, { useState, useRef, useEffect } from "react";

const PINNED_COLORS = [
  "#d9d9d9", "#0c0c0c", "#f6130d", "#05abc4", "#ffc433", "#ffffff"
];

const MAIN_COLORS = [
  "#980000", "#F00", "#F90", "#FF0", "#03FF00", "#03FFFF", "#00F", "#90F", "#F0F"
];
const TRANSPARENCY_LEVELS = [0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1];

// Helper to convert hex to rgba with alpha
function hexToRgba(hex, alpha) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

const FIRST_ROW = ["#000000", "#434343", "#666666", "#999999", "#b7b7b7", "#cccccc", "#d9d9d9", "#efefef", "#f3f3f3"];

function isColorValid(str) {
  if (!str) return false;
  if (/^#[0-9a-fA-F]{6}$/.test(str)) return true;
  if (/^#[0-9a-fA-F]{3}$/.test(str)) return true;
  if (/^rgba?\((\d{1,3},\s*){2,3}(\d{1,3}|1|0|0?\.\d+)\)$/.test(str)) return true;
  return false;
}

export default function ColorPicker({ value, onChange, defaultColor = "#000000", label }) {
  const [open, setOpen] = useState(false);
  const [hex, setHex] = useState(value || "");
  const [isMobile, setIsMobile] = useState(false);
  const buttonRef = useRef();
  const popupRef = useRef();
  const pickerRef = useRef(); // New ref for the picker
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => { setHex(value || ""); }, [value]);

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    function handleClick(e) {
      if (open && popupRef.current && !popupRef.current.contains(e.target) && !buttonRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      setOpen(true);
      setIsAnimating(true);
      // Trigger animation after a small delay
      setTimeout(() => {
        if (pickerRef.current) {
          pickerRef.current.style.transform = "translateY(0)";
        }
      }, 10);
    } else {
      if (pickerRef.current) {
        pickerRef.current.style.transform = "translateY(100%)";
      }
      setTimeout(() => {
        setOpen(false);
        setIsAnimating(false);
      }, 300);
    }
  }, [open]);

  function handleSelect(color) {
    setHex(color);
    onChange(color);
    setOpen(false);
  }

  function handleHexChange(e) {
    setHex(e.target.value);
  }

  function handleHexBlur() {
    if (isColorValid(hex)) {
      onChange(hex);
    } else {
      setHex(value || "");
    }
  }

  function handleReset() {
    setHex(defaultColor);
    onChange(defaultColor);
    setOpen(false);
  }

  const handleClose = () => {
    if (pickerRef.current) {
      pickerRef.current.style.transform = "translateY(100%)";
    }
    setTimeout(() => {
      setOpen(false);
      setIsAnimating(false);
    }, 300);
  };

  // Build main color columns with transparency
  const mainColorColumns = MAIN_COLORS.map((color) => [
    color,
    ...TRANSPARENCY_LEVELS.map(alpha => hexToRgba(color, alpha))
  ]);

  const colorPickerContent = (
    <div
      ref={popupRef}
      style={{
        background: "#fff",
        border: "1px solid #eee",
        borderRadius: isMobile ? "12px 12px 0 0" : 10,
        boxShadow: isMobile ? "0 4px 24px rgba(0,0,0,0.15)" : "0 4px 24px rgba(0,0,0,0.15)",
        padding: isMobile ? 20 : 12,
        minWidth: isMobile ? "100%" : 220,
        width: isMobile ? "100%" : 'auto',
        minHeight: isMobile ? "85vh" : 180,
        maxWidth: isMobile ? "100%" : 320,
        position: isMobile ? "fixed" : "absolute",
        top: isMobile ? "15vh" : 36,
        left: isMobile ? 0 : 0,
        right: isMobile ? 0 : "auto",
        bottom: isMobile ? 0 : "auto",
        zIndex: 1000,
        transform: isMobile ? (open ? "translateY(0)" : "translateY(100%)") : "none",
        transition: isMobile ? "transform 0.3s ease-out" : "none",
        overflowY: isMobile ? "auto" : "visible",
      }}
    >
      {/* Mobile header */}
      {isMobile && (
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: 16,
          paddingBottom: 12,
          borderBottom: "1px solid #eee"
        }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#000' }}>Color Picker</h3>
          <button
            type="button"
            onClick={handleClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 24,
              cursor: "pointer",
              padding: 4,
              color: "#666"
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Pinned Colors */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, color: '#111', textAlign: 'left' }}>Pinned Colors</div>
        <div style={{ display: "flex", gap: isMobile ? 6 : 8, flexWrap: "wrap", justifyContent: isMobile ? "flex-start" : "flex-start" }}>
          {PINNED_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => handleSelect(color)}
              style={{
                width: isMobile ? 28 : 24,
                height: isMobile ? 28 : 24,
                borderRadius: "50%",
                border: value === color ? "2px solid #333" : "2px solid #eee",
                background: color,
                cursor: "pointer",
                outline: "none",
                margin: 0,
                padding: 0,
              }}
              aria-label={`Pinned color ${color}`}
            />
          ))}
        </div>
      </div>

      {/* Color Picker Main Section */}
      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, color: '#111', textAlign: 'left' }}>Color Picker</div>
      {/* First row: black to white */}
      <div style={{ display: "flex", gap: isMobile ? 3 : 4, marginBottom: 4, flexWrap: "wrap", justifyContent: isMobile ? "flex-start" : "flex-start" }}>
        {FIRST_ROW.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => handleSelect(color)}
            style={{
              width: isMobile ? 24 : 20,
              height: isMobile ? 24 : 20,
              borderRadius: "50%",
              border: value === color ? "2px solid #333" : "1px solid #eee",
              background: color,
              cursor: "pointer",
              outline: "none",
              margin: 0,
              padding: 0,
            }}
            aria-label={`Main color ${color}`}
          />
        ))}
      </div>
      {/* Main color columns with transparency */}
      <div style={{ display: "flex", gap: isMobile ? 3 : 4, marginBottom: 8, flexWrap: "wrap", justifyContent: isMobile ? "flex-start" : "flex-start" }}>
        {mainColorColumns.map((col, i) => (
          <div key={MAIN_COLORS[i]} style={{ display: "flex", flexDirection: "column", gap: isMobile ? 1 : 2 }}>
            {col.map((color, j) => (
              <button
                key={color}
                type="button"
                onClick={() => handleSelect(color)}
                style={{
                  width: isMobile ? 24 : 20,
                  height: isMobile ? 24 : 20,
                  borderRadius: "50%",
                  border: value === color ? "2px solid #333" : "1px solid #eee",
                  background: color,
                  cursor: "pointer",
                  outline: "none",
                  margin: 0,
                  padding: 0,
                }}
                aria-label={`Main color ${MAIN_COLORS[i]}${j > 0 ? ` ${Math.round(TRANSPARENCY_LEVELS[j-1]*100)}%` : ''}`}
              />
            ))}
          </div>
        ))}
      </div>
      {/* Hex input and OK button in one row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-start", marginBottom: 0, flexWrap: "wrap" }}>
        <input
          type="text"
          value={hex}
          onChange={handleHexChange}
          onBlur={handleHexBlur}
          placeholder="#hex or rgba()"
          style={{ 
            width: isMobile ? 120 : 100, 
            padding: 4, 
            borderRadius: 4, 
            border: "1px solid #ccc",
            fontSize: isMobile ? 16 : 14
          }}
          aria-label="Hex or RGBA color"
        />
        <button
          type="button"
          onClick={() => { if (isColorValid(hex)) { onChange(hex); setOpen(false); } }}
          disabled={!isColorValid(hex)}
          style={{ 
            padding: "4px 10px", 
            borderRadius: 4, 
            border: "1px solid #eee", 
            background: isColorValid(hex) ? "#eee" : "#f8f8f8", 
            color: isColorValid(hex) ? "#222" : "#aaa", 
            cursor: isColorValid(hex) ? "pointer" : "not-allowed",
            fontSize: isMobile ? 16 : 14
          }}
        >
          OK
        </button>
      </div>
      {/* Reset button below hex input, left aligned */}
      <div style={{ display: "flex", justifyContent: "flex-start", marginTop: 4 }}>
        <button type="button" onClick={handleReset} style={{ 
          background: "none", 
          border: "none", 
          cursor: "pointer", 
          color: "#444", 
          fontWeight: 500, 
          fontSize: isMobile ? 16 : 15, 
          display: "flex", 
          alignItems: "center", 
          gap: 4 
        }}>
          <span role="img" aria-label="reset">🎨</span> Reset
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: "inline-block", position: "relative" }}>
      <button
        ref={buttonRef}
        type="button"
        aria-label={label || "Pick color"}
        style={{
          width: 28,
          height: 28,
          borderRadius: "6px",
          border: "2px solid #eee",
          background: value ? value : "#fff",
          display: "inline-block",
          cursor: "pointer",
          boxShadow: open ? "0 2px 8px rgba(0,0,0,0.12)" : undefined,
        }}
        onClick={() => setOpen((v) => !v)}
      />
      {open && (
        isMobile ? (
          // Mobile offcanvas overlay
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
            onClick={handleClose}
          >
            <div
              ref={pickerRef}
              style={{
                background: "white",
                borderRadius: "16px 16px 0 0",
                padding: "20px",
                width: "100%",
                maxWidth: "100%",
                height: "85vh",
                overflow: "auto",
                transform: "translateY(100%)",
                transition: "transform 0.3s ease-out",
                boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.15)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {colorPickerContent}
            </div>
          </div>
        ) : (
          // Desktop popup
          colorPickerContent
        )
      )}
    </div>
  );
} 