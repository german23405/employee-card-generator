import { useState, useRef, useEffect } from "react";
import Card from "./components/Card";
import Controls from "./components/Controls";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import domtoimage from "dom-to-image-more";
import * as Tabs from '@radix-ui/react-tabs';
// Remove: import { RichTextEditor } from '@mantine/rte';
import dayjs from 'dayjs';
import LetterPreview from "./components/LetterPreview";
import html2pdf from "html2pdf.js";

export default function App() {
  // Shared fields
  const [employeeName, setEmployeeName] = useState("");
  const [position, setPosition] = useState("");
  const [dateOfJoining, setDateOfJoining] = useState("");

  // Card-specific state
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

  // Letter-specific state
  const [letterFields, setLetterFields] = useState({
    employeeName: "",
    position: "",
    teamName: "",
    dateOfJoining: "",
    direction: "",
    telegram: "",
    instructionsContacts: {
      tpo: [],
      agile: [],
      chapter: [],
      buddy: [],
      question: [],
    },
  });
  // Contract type for letter
  const [contractType, setContractType] = useState("Гіг-контракт");
  // Dynamic variable template
  const defaultLetterTemplate = `Привіт, <var>@fullname</var>!\nТи прийняв(-ла) нашу пропозицію — і ми неймовірно раді, що ти зовсім скоро станеш частиною\nкоманди IT SmartFlex\nТвоя позиція – <var>@position</var>, ти працюватимеш у команді <var>@team</var>. Напрямок:Д <var>@direction</var>\nТвій перший робочий день - дата: <var>@date</var>\nПоки ще залишилося декілька днів до твого старту, ось невеличкий план, що відбуватиметься далі:\n1. Підтвердження та офіційності\nОфер прийнято, перевірка Служби Безпеки пройдена успішно! Тепер готуємо документи (Гіг-\nконтракт, Трудовий Договір та Заява на прийом), які потрібно буде підписати онлайн на сервісі\nDocument.online: https://document.online/\nКоли (Гіг-контракт, Трудовий Договір та Заява на прийом) буде готовий, тобі прийде повідомлення\nна особисту пошту від сервісу про необхідність підписати документи. Це можна зробити за\nдопомогою ЕЦП (фізична особа) або в застосунку Дія.\n2. Документи\nОсь перелік документів, які потрібні для подальшого оформлення:\n1. Диплом про освіту\n2. Свідоцтво про шлюб\n3. Свідоцтва дітей до 16 років – для привітань\n4. Номер Vodafone та фото сімкарти (серійний номер), котрий буде слугувати корпоративним,\nтариф - Vodafone Red Unlim Max. Можемо підключити будь-який існуючий номер або видамо\ne-Sim\n5. Відкрити рахунок в Райффайзен банк, надати реквізити (інструкція по відкриттю рахунку\nонлайн у вкладенні)\n6. 7. Фото для перепустки (на світлому фоні) – якщо ти в Києві\nМісто, Відділення Нової пошти, ПІБ та номер телефону отримувача (для відправки техніки,\nWelcomeBox)\n8. ПІБ, номер телефона і дата народження контактної особи/родича\nОчікуємо документи та інформацію ___протягом тижня\nЯкщо щось буде незрозуміло — завжди підкажемо!\n3. Готуємо техніку\nНаші колеги з ІТ відділу вже готують для тебе ноутбук та все необхідне. Узгодимо, коли і як зручно\nйого отримати - доставка НП (по території України за рахунок компанії) або забрати в офісі (адреса\nофісу - м. Київ, бульвар Вацлава Гавела, 6, БЦ ”Сігма”).\nПісля отримання техніки тобі потрібно буде підписати Акт про приймання-передачу на сервісі\nDocument.online.\n4. Buddy support\nЗа кілька днів до твого виходу з тобою зв’яжеться твій buddy — колега, який буде твоїм напарником\nпротягом перших 6 тижнів. Buddy допоможе тобі адаптуватися, познайомить з командою, відповість\nна всі поточні питання і поділиться корисними ресурсами.\n5. Вітання від нас\nПротягом першого місяця роботи очікуй welcome box — невеликий подарунок із корисними\nдрібничками, які допоможуть відчути себе частиною нашої команди.\nБільш детальну інформацію щодо роботи ти отримаєш наступним листом.\nЯкщо є питання чи щось викликає сумніви — просто напиши мені в телеграм <var>@telegram</var>\nМи завжди поруч, і дуже чекаємо знайомства\nА поки чекаємо зустрічі, приєднуйся до нас у LinkedIn і стеж за новинами компанії.`;

  const [letterContent, setLetterContent] = useState(defaultLetterTemplate);
  const [showEditor, setShowEditor] = useState(false);
  const contentEditableRef = useRef(null);
  const [exportState, setExportState] = useState('idle'); // idle | exporting | done
  const [exportCardState, setExportCardState] = useState('idle'); // idle | exporting | done

  // Basic formatting commands
  const format = (cmd) => document.execCommand(cmd, false, null);

  // Helper: Insert variable at cursor
  function insertVariable(varName) {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    const span = document.createElement('var');
    span.textContent = varName;
    span.style.fontStyle = 'italic';
    span.style.color = '#888';
    range.insertNode(span);
    // Move cursor after inserted node
    range.setStartAfter(span);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    // Update state
    setLetterContent(contentEditableRef.current.innerHTML);
  }

  // Helper: Reset to template
  function resetToTemplate() {
    if (window.confirm('Are you sure you want to reset the letter to the default template? All changes will be lost.')) {
      setLetterContent(defaultLetterTemplate);
    }
  }

  // Helper: Render preview with variable replacement
  function renderPreview(html) {
    let out = html;
    const replacements = {
      '@fullname': letterFields.employeeName ? `<b>${letterFields.employeeName}</b>` : '<span style="font-style:italic;font-weight:bold;color:#888">@fullname</span>',
      '@position': letterFields.position ? `<b>${letterFields.position}</b>` : '<span style="font-style:italic;font-weight:bold;color:#888">@position</span>',
      '@team': letterFields.teamName ? `<b>${letterFields.teamName}</b>` : '<span style="font-style:italic;font-weight:bold;color:#888">@team</span>',
      '@direction': letterFields.direction ? `<b>${letterFields.direction}</b>` : '<span style="font-style:italic;font-weight:bold;color:#888">@direction</span>',
      '@date': letterFields.dateOfJoining ? `<b>${dayjs(letterFields.dateOfJoining).format('DD.MM.YYYY')}</b>` : '<span style="font-style:italic;font-weight:bold;color:#888">@date</span>',
      '@telegram': letterFields.telegram ? `<a href="https://t.me/${letterFields.telegram.replace(/^@/, '')}" target="_blank"><b>@${letterFields.telegram.replace(/^@/, '')}</b></a>` : '<span style="font-style:italic;font-weight:bold;color:#888">@telegram</span>',
    };
    Object.entries(replacements).forEach(([k, v]) => {
      out = out.replaceAll(`<var>${k}</var>`, v);
    });
    return out;
  }

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

  // Sync shared fields between card and letter
  useEffect(() => {
    setCardData(prev => ({ ...prev, name: employeeName, position, dateOfJoining }));
    setLetterFields(prev => ({ ...prev, employeeName, position, dateOfJoining }));
  }, [employeeName, position, dateOfJoining]);

  // When card or letter changes, update shared fields
  const handleEmployeeNameChange = (val) => {
    setEmployeeName(val);
  };
  const handlePositionChange = (val) => {
    setPosition(val);
  };
  const handleDateOfJoiningChange = (val) => {
    setDateOfJoining(val);
  };

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

  // Letter builder state
  const [letterCategory, setLetterCategory] = useState('docs');
  // Add selectedTab state and handler
  const [selectedTab, setSelectedTab] = useState('card');

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
      <Tabs.Root defaultValue="card" onValueChange={setSelectedTab}>
        <Tabs.List style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
          <Tabs.Trigger value="card" style={{
            padding: '10px 24px',
            fontSize: 18,
            fontWeight: 600,
            border: '2px solid #1976d2',
            borderRadius: 8,
            background: window.location.hash === '#card' || selectedTab === 'card' ? '#1976d2' : 'none',
            color: window.location.hash === '#card' || selectedTab === 'card' ? '#fff' : '#1976d2',
            cursor: 'pointer',
            outline: 'none',
            transition: 'background 0.2s, color 0.2s',
            boxShadow: window.location.hash === '#card' || selectedTab === 'card' ? '0 2px 8px rgba(25, 118, 210, 0.08)' : 'none',
          }}>
            Card
          </Tabs.Trigger>
          <Tabs.Trigger value="letter" style={{
            padding: '10px 24px',
            fontSize: 18,
            fontWeight: 600,
            border: '2px solid #1976d2',
            borderRadius: 8,
            background: window.location.hash === '#letter' || selectedTab === 'letter' ? '#1976d2' : 'none',
            color: window.location.hash === '#letter' || selectedTab === 'letter' ? '#fff' : '#1976d2',
            cursor: 'pointer',
            outline: 'none',
            transition: 'background 0.2s, color 0.2s',
            boxShadow: window.location.hash === '#letter' || selectedTab === 'letter' ? '0 2px 8px rgba(25, 118, 210, 0.08)' : 'none',
          }}>
            Letter
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="card">
          {/* Main app UI for card generation */}
          <div className={isMobile ? "app-main-layout" : undefined} style={isMobile ? undefined : { display: "flex", gap: 32, alignItems: "flex-start", padding: 32 }}>
            <div ref={cardContainerRef} className={isMobile ? "card-preview-sticky" : undefined} style={isMobile ? undefined : { position: "sticky", top: 32, zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div ref={cardRef} style={{ fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif', WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' }}>
                <Card cardData={cardData} settings={settings} />
              </div>
              <button
                style={{
                  marginTop: 24,
                  width: 350,
                  fontWeight: 600,
                  fontSize: 16,
                  background: exportCardState === 'done' ? '#27ae60' : '',
                  color: exportCardState === 'done' ? '#fff' : '',
                  transition: 'background 0.2s, color 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8
                }}
                disabled={exportCardState === 'exporting'}
                onClick={async () => {
                  setExportCardState('exporting');
                  await handleExport();
                  setExportCardState('done');
                  setTimeout(() => setExportCardState('idle'), 2000);
                }}
              >
                {exportCardState === 'exporting' && (
                  <span className="spinner" style={{ width: 18, height: 18, border: '3px solid #fff', borderTop: '3px solid #888', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
                )}
                {exportCardState === 'idle' && 'Export as PNG'}
                {exportCardState === 'exporting' && 'Exporting...'}
                {exportCardState === 'done' && 'Done'}
              </button>
              <p>Made by <a className="herman-link" href="https://www.linkedin.com/in/product-owner-herman/" target="_blank" rel="noopener noreferrer">Herman Baiatian</a></p>
            </div>
            <Controls
              cardData={cardData}
              setCardData={setCardData}
              settings={settings}
              setSettings={setSettings}
              employeeName={employeeName}
              onEmployeeNameChange={handleEmployeeNameChange}
              position={position}
              onPositionChange={handlePositionChange}
              dateOfJoining={dateOfJoining}
              onDateOfJoiningChange={handleDateOfJoiningChange}
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
          <div
            className={isMobile ? "letter-main-mobile" : undefined}
            style={isMobile
              ? { maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'stretch', padding: 16 }
              : { maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'row-reverse', gap: 32, alignItems: 'flex-start', padding: 32 }
            }
          >
            {/* Letter form */}
            <div style={{ flex: 1, minWidth: 320 }}>
              {/* Hide Category radio buttons */}
              {/*
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontWeight: 600, marginRight: 16 }}>Category:</label>
                <label><input type="radio" name="letter-category" value="docs" checked={letterCategory === 'docs'} onChange={() => setLetterCategory('docs')} /> Docs</label>
                <label style={{ marginLeft: 16 }}><input type="radio" name="letter-category" value="instructions" checked={letterCategory === 'instructions'} onChange={() => setLetterCategory('instructions')} /> Instructions</label>
              </div>
              */}
              {/* Shared fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <label>Employee Name
                  <input type="text" value={employeeName} onChange={e => handleEmployeeNameChange(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
                </label>
                <label>Position
                  <input type="text" value={position} onChange={e => handlePositionChange(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
                </label>
                <label>Date of joining
                  <input type="date" value={dateOfJoining} onChange={e => handleDateOfJoiningChange(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
                </label>
                <label>Team Name
                  <input type="text" value={letterFields.teamName} onChange={e => setLetterFields(f => ({ ...f, teamName: e.target.value }))} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
                </label>
                <label>Direction
                  <input type="text" value={letterFields.direction} onChange={e => setLetterFields(f => ({ ...f, direction: e.target.value }))} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
                </label>
                {/* Contract type dropdown - maybe later add a custom option written by user */}
                <label>Contract Type
                  <select value={contractType} onChange={e => setContractType(e.target.value)} 
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', fontWeight: 600, boxSizing: 'border-box', height: 40 }}>
                    <option value="Гіг-контракт">Гіг-контракт</option>
                    <option value="Трудовий Договір">Трудовий Договір</option>
                    <option value="Заява на прийом">Заява на прийом</option>
                  </select>
                </label>
                <label>Telegram
                  <input type="text" value={letterFields.telegram} onChange={e => setLetterFields(f => ({ ...f, telegram: e.target.value }))} placeholder="username" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
                  {letterFields.telegram && <span style={{ fontSize: 12, color: '#888' }}>https://t.me/{letterFields.telegram.replace(/^@/, '')}</span>}
                </label>
              </div>
              {/* Instructions fields placeholder for future */}
              {letterCategory === 'instructions' && (
                <div style={{ marginTop: 24, color: '#aaa' }}>
                  <em>Instructions fields and contacts coming soon...</em>
                </div>
              )}
            </div>
            {/* Letter preview/editor */}
            <div style={{ flex: 2, minWidth: 320 }}>
              {/* Hide 'Letter Preview (editable):' label */}
              {/* <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Letter Preview (editable):</label> */}
              {/* Hide the div with Reset to template button */}
              {/* Reset to template and formatting controls hidden */}
              {showEditor && (
                <div
                  ref={contentEditableRef}
                  contentEditable
                  suppressContentEditableWarning
                  style={{ minHeight: 400, background: '#fff', borderRadius: 8, border: '1px solid #ccc', marginBottom: 16, padding: 16, outline: 'none', color: '#111' }}
                  onInput={e => setLetterContent(e.currentTarget.innerHTML)}
                  dangerouslySetInnerHTML={{ __html: letterContent }}
                />
              )}
              <label style={{ fontWeight: 600, marginBottom: 8, display: 'block', marginTop: -8 }}>Preview:</label>
              <div id="letter-preview-pdf" style={{ minHeight: 400, background: '#fff', borderRadius: 8, marginBottom: 16, color: '#111' }}>
                <LetterPreview
                  fullName={letterFields.employeeName}
                  position={letterFields.position}
                  teamName={letterFields.teamName}
                  direction={letterFields.direction}
                  firstDate={letterFields.dateOfJoining}
                  telegram={letterFields.telegram}
                  contractType={contractType}
                />
              </div>
              {/* Export as PDF button moved below preview */}
              <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <button
                  style={{
                    marginTop: 8,
                    width: 220,
                    fontWeight: 600,
                    fontSize: 16,
                    background: exportState === 'done' ? '#27ae60' : '',
                    color: exportState === 'done' ? '#fff' : '',
                    transition: 'background 0.2s, color 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8
                  }}
                  disabled={exportState === 'exporting'}
                  onClick={async () => {
                    setExportState('exporting');
                    const preview = document.getElementById('letter-preview-pdf');
                    if (!preview) return;
                    const safeName = letterFields.employeeName
                      ? letterFields.employeeName
                          .replace(/[^\p{L}\p{N}\s\-_]/gu, '') // allow Unicode letters/numbers, spaces, dash, underscore
                          .replace(/\s+/g, ' ').trim()
                      : '';
                    const filename = safeName ? `NC-letter - ${safeName}.pdf` : 'NC-letter.pdf';
                    await html2pdf().set({
                      margin: 0.5,
                      filename,
                      image: { type: 'jpeg', quality: 0.98 },
                      html2canvas: { scale: 2, useCORS: true },
                      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
                      pagebreak: { mode: ['css', 'legacy'] }
                    }).from(preview).save();
                    setExportState('done');
                    setTimeout(() => setExportState('idle'), 2000);
                  }}
                >
                  {exportState === 'exporting' && (
                    <span className="spinner" style={{ width: 18, height: 18, border: '3px solid #fff', borderTop: '3px solid #888', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
                  )}
                  {exportState === 'idle' && 'Export as PDF'}
                  {exportState === 'exporting' && 'Exporting...'}
                  {exportState === 'done' && 'Done'}
                </button>
              </div>
              {/* Remove Pages: 1 (auto-detect coming soon) element if present */}
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
