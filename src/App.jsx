import { useState, useRef, useEffect } from "react";
import Card from "./components/Card";
import Controls from "./components/Controls";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import domtoimage from "dom-to-image-more";
import * as Tabs from '@radix-ui/react-tabs';

export default function App() {
  const [cardData, setCardData] = useState({
    name: "",
    position: "",
    smallDescription: "",
    funFacts: [""],
    greeting: "",
    photo: null,
    dateOfJoining: "",
    logo: null,
  });
  const [settings, setSettings] = useState({
    shadow: true,
    borderRadius: 16,
    background: "#fff",
    imageFormat: "circle", // "circle" or "half"
    imageScale: 1,
    imagePositionX: 50, // percent (0 = left, 100 = right)
    imagePositionY: 50, // percent (0 = top, 100 = bottom)
    fontColorName: "#222222",
    fontColorPosition: "#ff0000",
    positionBgColor: "#fff0f0",
    positionRadius: 32,
    positionPaddingY: 8,
    positionPaddingX: 16,
    fontColorFunFacts: "#444444",
    funFactsBgColor: "#f8f8f8",
    funFactsRadius: 12,
    funFactsPadding: 18,
    fontColorGreeting: "#666666",
    fontColorDate: "rgb(181,176,176)",
    fontColorSmallDescription: "#666666",
    logoSize: 48,
    logoPositionX: 90,
    logoPositionY: 10,
  });
  const cardRef = useRef();
  const [isDirty, setIsDirty] = useState(false);
  // Popup/modal state
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  // Track if card is visible
  const [cardOutOfView, setCardOutOfView] = useState(false);
  const cardContainerRef = useRef();
  // Add state to detect mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mark as dirty on any change
  useEffect(() => {
    setIsDirty(true);
  }, [cardData, settings]);

  // Warn on tab close if dirty
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "Are you sure you want to close the tab? All settings will be lost";
        return e.returnValue;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Intersection Observer for card preview (only on mobile)
  useEffect(() => {
    if (!isMobile) return;
    if (!cardContainerRef.current) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setCardOutOfView(!entry.isIntersecting);
      },
      { root: null, threshold: 0.01 }
    );
    observer.observe(cardContainerRef.current);
    return () => observer.disconnect();
  }, [isMobile]);

  const handleExport = async () => {
    if (!cardRef.current) return;
    const cardNode = cardRef.current;
    const scale = 4;
    const width = cardNode.offsetWidth;
    const height = cardNode.offsetHeight;

    // Clone card into a hidden, scaled container
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'fixed';
    tempContainer.style.left = '-99999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = width * scale + 'px';
    tempContainer.style.height = height * scale + 'px';
    tempContainer.style.overflow = 'hidden';
    tempContainer.style.background = settings.background;
    document.body.appendChild(tempContainer);

    // Clone the card
    const cardClone = cardNode.cloneNode(true);
    cardClone.style.transform = `scale(${scale})`;
    cardClone.style.transformOrigin = 'top left';
    cardClone.style.width = width + 'px';
    cardClone.style.height = height + 'px';
    cardClone.style.margin = '0';
    cardClone.style.padding = '0';
    cardClone.style.boxSizing = 'border-box';
    tempContainer.appendChild(cardClone);

    // Export the clone
    domtoimage.toPng(tempContainer, {
      bgcolor: settings.background,
      quality: 1,
      width: width * scale,
      height: height * scale,
      style: {
        fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        display: 'block',
      },
      cacheBust: true,
      pixelRatio: 1,
    })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `${cardData.name || "employee-card"}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        alert("Export failed: " + error);
      })
      .finally(() => {
        document.body.removeChild(tempContainer);
      });
  };

  return (
    <div>
      {/* Title and description above tabs */}
      <div style={{ textAlign: 'center', margin: '32px 0 16px 0' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0 }}>Employee Stuff Generation</h1>
        <p style={{ color: '#666', fontSize: 18, margin: '8px 0 0 0' }}>
          Ability to generate newcomer card and newsletter for new employees.
        </p>
      </div>
      {/* Tabs selector */}
      <Tabs.Root defaultValue="card">
        <Tabs.List style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
          <Tabs.Trigger value="card" style={{
            padding: '10px 24px',
            fontSize: 18,
            fontWeight: 600,
            border: 'none',
            borderBottom: '3px solid',
            borderColor: 'var(--tab-active, #646cff)',
            background: 'none',
            color: 'inherit',
            cursor: 'pointer',
            outline: 'none',
            transition: 'border-color 0.2s',
            ...(window.location.hash === '#card' ? { '--tab-active': '#646cff' } : {})
          }}>
            Card
          </Tabs.Trigger>
          <Tabs.Trigger value="letter" style={{
            padding: '10px 24px',
            fontSize: 18,
            fontWeight: 600,
            border: 'none',
            borderBottom: '3px solid',
            borderColor: 'var(--tab-active, #e0e0e0)',
            background: 'none',
            color: 'inherit',
            cursor: 'pointer',
            outline: 'none',
            transition: 'border-color 0.2s',
            ...(window.location.hash === '#letter' ? { '--tab-active': '#646cff' } : {})
          }}>
            Letter
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="card">
          {/* Main app UI for card generation */}
          <div className={isMobile ? "app-main-layout" : undefined} style={isMobile ? undefined : { display: "flex", gap: 32, alignItems: "flex-start", padding: 32 }}>
            <div ref={cardContainerRef} className={isMobile ? "card-preview-sticky" : undefined} style={isMobile ? undefined : { position: "sticky", top: 32, zIndex: 10 }}>
              <div ref={cardRef} style={{ fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif', WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' }}>
                <Card cardData={cardData} settings={settings} />
              </div>
              <button style={{ marginTop: 24, width: 350 }} onClick={handleExport}>
                Export as PNG
              </button>
              <p>Made by <a className="herman-link" href="https://www.linkedin.com/in/product-owner-herman/" target="_blank" rel="noopener noreferrer">Herman Baiatian</a></p>
            </div>
            <Controls
              cardData={cardData}
              setCardData={setCardData}
              settings={settings}
              setSettings={setSettings}
            />
            {/* Fixed Preview Button and Modal: only on mobile */}
            {isMobile && (
              <>
                <button
                  className={`preview-fab${showPreviewModal ? ' open' : ''}`}
                  style={{ display: cardOutOfView || showPreviewModal ? 'flex' : 'none' }}
                  onClick={() => setShowPreviewModal((v) => !v)}
                >
                  {showPreviewModal ? 'Close' : 'Preview'}
                </button>
                {showPreviewModal && (
                  <div className="preview-modal" onClick={() => setShowPreviewModal(false)}>
                    <div className="preview-modal-content" onClick={e => e.stopPropagation()}>
                      <Card cardData={cardData} settings={settings} />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </Tabs.Content>
        <Tabs.Content value="letter">
          <div style={{ padding: 32, textAlign: 'center', color: '#888', fontSize: 22 }}>
            Letter generator coming soon
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
