import React, { useRef, useState, useEffect } from "react";
import ColorPicker from "./ColorPicker";

export default function Controls({ cardData, setCardData, settings, setSettings, employeeName, onEmployeeNameChange, position, onPositionChange, dateOfJoining, onDateOfJoiningChange }) {
  const fileInputRef = useRef();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle photo upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setCardData((prev) => ({ ...prev, photo: ev.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle fun facts change
  const handleFunFactChange = (idx, value) => {
    setCardData((prev) => {
      const newFacts = [...prev.funFacts];
      newFacts[idx] = value;
      return { ...prev, funFacts: newFacts };
    });
  };

  // Add new fun fact
  const addFunFact = () => {
    setCardData((prev) => ({ ...prev, funFacts: [...prev.funFacts, ""] }));
  };

  // Remove fun fact
  const removeFunFact = (idx) => {
    setCardData((prev) => {
      const newFacts = prev.funFacts.filter((_, i) => i !== idx);
      return { ...prev, funFacts: newFacts };
    });
  };

  return (
    <div style={{ minWidth: 320, maxWidth: 360, display: "flex", flexDirection: "column", gap: 20 }}>
      <label style={{ fontWeight: 600 }}>Photo</label>
      <div
        style={{
          border: "2px dashed #bbb",
          borderRadius: 12,
          padding: 16,
          textAlign: "center",
          cursor: "pointer",
          marginBottom: 8,
        }}
        onClick={() => fileInputRef.current.click()}
      >
        {cardData.photo ? (
          <img src={cardData.photo} alt="Preview" style={{ width: 80, height: 80, borderRadius: settings.imageFormat === "circle" ? "50%" : 12, objectFit: "cover" }} />
        ) : (
          <span>Click or drag to upload</span>
        )}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handlePhotoChange}
        />
      </div>
      {/* Photo settings only if photo is uploaded */}
      {cardData.photo && <>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <label>Format:</label>
          <select
            value={settings.imageFormat}
            onChange={e => setSettings(prev => ({ ...prev, imageFormat: e.target.value }))}
          >
            <option value="circle">Circle</option>
            <option value="half">Half Card</option>
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <label>Scale:</label>
          <input
            type="range"
            min={0.5}
            max={2}
            step={0.01}
            value={settings.imageScale}
            onChange={e => setSettings(prev => ({ ...prev, imageScale: Number(e.target.value) }))}
          />
          <span>{settings.imageScale}x</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <label>Horizontal Position:</label>
          <input
            type="range"
            min={0}
            max={100}
            value={settings.imagePositionX}
            onChange={e => setSettings(prev => ({ ...prev, imagePositionX: Number(e.target.value) }))}
          />
          <span>{settings.imagePositionX}%</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <label>Vertical Position:</label>
          <input
            type="range"
            min={0}
            max={100}
            value={settings.imagePositionY}
            onChange={e => setSettings(prev => ({ ...prev, imagePositionY: Number(e.target.value) }))}
          />
          <span>{settings.imagePositionY}%</span>
        </div>
      </>}
      {/* Logo upload UI, same as photo */}
      <label style={{ fontWeight: 600 }}>Logo</label>
      <div
        style={{
          border: "2px dashed #bbb",
          borderRadius: 12,
          padding: 16,
          textAlign: "center",
          cursor: "pointer",
          marginBottom: 8,
        }}
        onClick={() => document.getElementById("logo-upload").click()}
      >
        {cardData.logo ? (
          <img src={cardData.logo} alt="Logo preview" style={{ width: 48, height: 48, objectFit: "contain" }} />
        ) : (
          <span>Click or drag to upload</span>
        )}
        <input
          id="logo-upload"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={e => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (ev) => {
                setCardData((prev) => ({ ...prev, logo: ev.target.result }));
              };
              reader.readAsDataURL(file);
            }
          }}
        />
      </div>
      {/* Logo settings only if logo is uploaded */}
      {cardData.logo && <>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <label>Size</label>
          <input
            type="range"
            min={16}
            max={120}
            value={settings.logoSize}
            onChange={e => setSettings(prev => ({ ...prev, logoSize: Number(e.target.value) }))}
          />
          <span>{settings.logoSize}px</span>
        </div>
        <div className="label-controls" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <label>X</label>
          <input
            type="range"
            min={0}
            max={100}
            value={settings.logoPositionX}
            onChange={e => setSettings(prev => ({ ...prev, logoPositionX: Number(e.target.value) }))}
          />
          <span>{settings.logoPositionX}%</span>
          <label>Y</label>
          <input
            type="range"
            min={0}
            max={100}
            value={settings.logoPositionY}
            onChange={e => setSettings(prev => ({ ...prev, logoPositionY: Number(e.target.value) }))}
          />
          <span>{settings.logoPositionY}%</span>
        </div>
      </>}

      <label style={{ fontWeight: 600 }}>Name</label>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <input
          type="text"
          value={employeeName}
          onChange={e => onEmployeeNameChange(e.target.value)}
          placeholder="Employee Name"
          style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <ColorPicker
          value={settings.fontColorName}
          onChange={color => setSettings(prev => ({ ...prev, fontColorName: color }))}
          defaultColor="#000000"
          label="Name color"
        />
      </div>

      <label style={{ fontWeight: 600 }}>Position</label>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <input
          type="text"
          value={position}
          onChange={e => onPositionChange(e.target.value)}
          placeholder="Position"
          style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <ColorPicker
          value={settings.fontColorPosition}
          onChange={color => setSettings(prev => ({ ...prev, fontColorPosition: color }))}
          defaultColor="#000000"
          label="Position color"
        />
      </div>

      {/* Position label settings: two columns */}
      <div style={{ display: "flex", gap: 16, marginBottom: 8, flexDirection: isMobile ? "column" : "column" }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
          <label>BG</label>
          <ColorPicker
            value={settings.positionBgColor}
            onChange={color => setSettings(prev => ({ ...prev, positionBgColor: color }))}
            defaultColor="#d9d9d9"
            label="Position background color"
          />
          <label>Radius</label>
          <input
            type="range"
            min={0}
            max={32}
            value={settings.positionRadius}
            onChange={e => setSettings(prev => ({ ...prev, positionRadius: Number(e.target.value) }))}
          />
          <span>{settings.positionRadius}px</span>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, flexDirection: isMobile ? "column" : "row", justifyContent: isMobile ? "flex-start" : "flex-start" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, width: isMobile ? "100%" : "auto" }}>
            <label>Y</label>
            <input
              type="range"
              min={0}
              max={32}
              value={settings.positionPaddingY}
              onChange={e => setSettings(prev => ({ ...prev, positionPaddingY: Number(e.target.value) }))}
            />
            <span>{settings.positionPaddingY}px</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, width: isMobile ? "100%" : "auto" }}>
            <label>X</label>
            <input
              type="range"
              min={0}
              max={32}
              value={settings.positionPaddingX}
              onChange={e => setSettings(prev => ({ ...prev, positionPaddingX: Number(e.target.value) }))}
            />
            <span>{settings.positionPaddingX}px</span>
          </div>
        </div>
      </div>

      <label style={{ fontWeight: 600 }}>Small Description</label>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <input
          type="text"
          value={cardData.smallDescription}
          onChange={e => setCardData(prev => ({ ...prev, smallDescription: e.target.value }))}
          placeholder="Short description"
          style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <ColorPicker
          value={settings.fontColorSmallDescription}
          onChange={color => setSettings(prev => ({ ...prev, fontColorSmallDescription: color }))}
          defaultColor="#888888"
          label="Small description color"
        />
      </div>

      <label style={{ fontWeight: 600 }}>Fun Facts</label>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {cardData.funFacts.map((fact, idx) => (
          <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="text"
              value={fact}
              onChange={(e) => handleFunFactChange(idx, e.target.value)}
              placeholder={`Fun fact #${idx + 1}`}
              style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
            />
            {cardData.funFacts.length > 1 && (
              <button type="button" onClick={() => removeFunFact(idx)} style={{padding: "4px 8px" }}>
                ×
              </button>
            )}
            {idx === 0 && (
              <ColorPicker
                value={settings.fontColorFunFacts}
                onChange={color => setSettings(prev => ({ ...prev, fontColorFunFacts: color }))}
                defaultColor="#000000"
                label="Fun facts color"
              />
            )}
          </div>
        ))}
        <button type="button" onClick={addFunFact} style={{ marginTop: 4 }}>
          + Add Fun Fact
        </button>
      </div>

      {/* Fun facts settings: two columns */}
      <div style={{ display: "flex", gap: 16, marginBottom: 16, flexDirection: "column" }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
          <label>BG</label>
          <ColorPicker
            value={settings.funFactsBgColor}
            onChange={color => setSettings(prev => ({ ...prev, funFactsBgColor: color }))}
            defaultColor="#f0f0f0"
            label="Fun facts background color"
          />
          <label>Radius</label>
          <input
            type="range"
            min={0}
            max={32}
            value={settings.funFactsRadius}
            onChange={e => setSettings(prev => ({ ...prev, funFactsRadius: Number(e.target.value) }))}
          />
          <span>{settings.funFactsRadius}px</span>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
          <label>Padding</label>
          <input
            type="range"
            min={0}
            max={24}
            value={settings.funFactsPadding}
            onChange={e => setSettings(prev => ({ ...prev, funFactsPadding: Number(e.target.value) }))}
          />
          <span>{settings.funFactsPadding}px</span>
        </div>
      </div>

      <label style={{ fontWeight: 600 }}>Greeting/Description</label>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, marginTop: 16 }}>
        <textarea
          value={cardData.greeting}
          onChange={(e) => setCardData((prev) => ({ ...prev, greeting: e.target.value }))}
          placeholder="Welcome to the team!"
          rows={2}
          style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <ColorPicker
          value={settings.fontColorGreeting}
          onChange={color => setSettings(prev => ({ ...prev, fontColorGreeting: color }))}
          defaultColor="#000000"
          label="Greeting color"
        />
      </div>

      <label style={{ fontWeight: 600 }}>Date of Joining</label>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <input
          type="date"
          value={dateOfJoining}
          onChange={e => onDateOfJoiningChange(e.target.value)}
          style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <ColorPicker
          value={settings.fontColorDate}
          onChange={color => setSettings(prev => ({ ...prev, fontColorDate: color }))}
          defaultColor="#000000"
          label="Date color"
        />
      </div>
      <label style={{ fontWeight: 600 }}>Card Settings</label>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <input
          type="checkbox"
          checked={settings.shadow}
          onChange={(e) => setSettings((prev) => ({ ...prev, shadow: e.target.checked }))}
          id="shadow-toggle"
        />
        <label htmlFor="shadow-toggle">Shadow</label>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <label htmlFor="radius-slider">Border Radius</label>
        <input
          type="range"
          min={0}
          max={40}
          value={settings.borderRadius}
          onChange={(e) => setSettings((prev) => ({ ...prev, borderRadius: Number(e.target.value) }))}
          id="radius-slider"
        />
        <span>{settings.borderRadius}px</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <label htmlFor="bg-color">Background</label>
        <ColorPicker
          value={settings.background}
          onChange={color => setSettings(prev => ({ ...prev, background: color }))}
          defaultColor="#ffffff"
          label="Card background color"
        />
      </div>
    </div>
  );
} 