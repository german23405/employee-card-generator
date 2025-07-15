import { useState, useRef, useEffect } from "react";
import Card from "./components/Card";
import Controls from "./components/Controls";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import domtoimage from "dom-to-image-more";

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
    <div style={{ display: "flex", gap: 32, alignItems: "flex-start", padding: 32 }}>
      <div style={{ position: "sticky", top: 32, zIndex: 10 }}>
        <div ref={cardRef} style={{ fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif', WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' }}>
          <Card cardData={cardData} settings={settings} />
        </div>
        <button style={{ marginTop: 24, width: 350 }} onClick={handleExport}>
          Export as PNG
        </button>
      </div>
      <Controls
        cardData={cardData}
        setCardData={setCardData}
        settings={settings}
        setSettings={setSettings}
      />
    </div>
  );
}
