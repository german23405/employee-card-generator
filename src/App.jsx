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

  // Letter builder state
  const [letterCategory, setLetterCategory] = useState('docs');
  const [letterFields, setLetterFields] = useState({
    fullName: '',
    position: '',
    teamName: '',
    firstDate: '',
    direction: '',
    telegram: '',
    // Instructions contacts scaffolded for future
    instructionsContacts: {
      tpo: [],
      agile: [],
      chapter: [],
      buddy: [],
      question: [],
    },
  });
  // Dynamic variable template
  const defaultLetterTemplate = `Привіт, <var>@fullname</var>!\nТи прийняв(-ла) нашу пропозицію — і ми неймовірно раді, що ти зовсім скоро станеш частиною\nкоманди IT SmartFlex\nТвоя позиція – <var>@position</var>, ти працюватимеш у команді <var>@team</var>. Напрямок:Д <var>@direction</var>\nТвій перший робочий день - дата: <var>@date</var>\nПоки ще залишилося декілька днів до твого старту, ось невеличкий план, що відбуватиметься далі:\n1. Підтвердження та офіційності\nОфер прийнято, перевірка Служби Безпеки пройдена успішно! Тепер готуємо документи (Гіг-\nконтракт, Трудовий Договір та Заява на прийом), які потрібно буде підписати онлайн на сервісі\nDocument.online: https://document.online/\nКоли (Гіг-контракт, Трудовий Договір та Заява на прийом) буде готовий, тобі прийде повідомлення\nна особисту пошту від сервісу про необхідність підписати документи. Це можна зробити за\nдопомогою ЕЦП (фізична особа) або в застосунку Дія.\n2. Документи\nОсь перелік документів, які потрібні для подальшого оформлення:\n1. Диплом про освіту\n2. Свідоцтво про шлюб\n3. Свідоцтва дітей до 16 років – для привітань\n4. Номер Vodafone та фото сімкарти (серійний номер), котрий буде слугувати корпоративним,\nтариф - Vodafone Red Unlim Max. Можемо підключити будь-який існуючий номер або видамо\ne-Sim\n5. Відкрити рахунок в Райффайзен банк, надати реквізити (інструкція по відкриттю рахунку\nонлайн у вкладенні)\n6. 7. Фото для перепустки (на світлому фоні) – якщо ти в Києві\nМісто, Відділення Нової пошти, ПІБ та номер телефону отримувача (для відправки техніки,\nWelcomeBox)\n8. ПІБ, номер телефона і дата народження контактної особи/родича\nОчікуємо документи та інформацію ___протягом тижня\nЯкщо щось буде незрозуміло — завжди підкажемо!\n3. Готуємо техніку\nНаші колеги з ІТ відділу вже готують для тебе ноутбук та все необхідне. Узгодимо, коли і як зручно\nйого отримати - доставка НП (по території України за рахунок компанії) або забрати в офісі (адреса\nофісу - м. Київ, бульвар Вацлава Гавела, 6, БЦ ”Сігма”).\nПісля отримання техніки тобі потрібно буде підписати Акт про приймання-передачу на сервісі\nDocument.online.\n4. Buddy support\nЗа кілька днів до твого виходу з тобою зв’яжеться твій buddy — колега, який буде твоїм напарником\nпротягом перших 6 тижнів. Buddy допоможе тобі адаптуватися, познайомить з командою, відповість\nна всі поточні питання і поділиться корисними ресурсами.\n5. Вітання від нас\nПротягом першого місяця роботи очікуй welcome box — невеликий подарунок із корисними\nдрібничками, які допоможуть відчути себе частиною нашої команди.\nБільш детальну інформацію щодо роботи ти отримаєш наступним листом.\nЯкщо є питання чи щось викликає сумніви — просто напиши мені в телеграм <var>@telegram</var>\nМи завжди поруч, і дуже чекаємо знайомства\nА поки чекаємо зустрічі, приєднуйся до нас у LinkedIn і стеж за новинами компанії.`;

  const [letterContent, setLetterContent] = useState(defaultLetterTemplate);
  const [showEditor, setShowEditor] = useState(false);
  const contentEditableRef = useRef(null);

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
      '@fullname': letterFields.fullName ? `<b>${letterFields.fullName}</b>` : '<span style="font-style:italic;font-weight:bold;color:#888">@fullname</span>',
      '@position': letterFields.position ? `<b>${letterFields.position}</b>` : '<span style="font-style:italic;font-weight:bold;color:#888">@position</span>',
      '@team': letterFields.teamName ? `<b>${letterFields.teamName}</b>` : '<span style="font-style:italic;font-weight:bold;color:#888">@team</span>',
      '@direction': letterFields.direction ? `<b>${letterFields.direction}</b>` : '<span style="font-style:italic;font-weight:bold;color:#888">@direction</span>',
      '@date': letterFields.firstDate ? `<b>${dayjs(letterFields.firstDate).format('DD.MM.YYYY')}</b>` : '<span style="font-style:italic;font-weight:bold;color:#888">@date</span>',
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
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 32, alignItems: 'flex-start', padding: 32 }}>
            {/* Letter form */}
            <div style={{ flex: 1, minWidth: 320 }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontWeight: 600, marginRight: 16 }}>Category:</label>
                <label><input type="radio" name="letter-category" value="docs" checked={letterCategory === 'docs'} onChange={() => setLetterCategory('docs')} /> Docs</label>
                <label style={{ marginLeft: 16 }}><input type="radio" name="letter-category" value="instructions" checked={letterCategory === 'instructions'} onChange={() => setLetterCategory('instructions')} /> Instructions</label>
              </div>
              {/* Shared fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <label>Full Name
                  <input type="text" value={letterFields.fullName} onChange={e => setLetterFields(f => ({ ...f, fullName: e.target.value }))} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
                </label>
                <label>Position
                  <input type="text" value={letterFields.position} onChange={e => setLetterFields(f => ({ ...f, position: e.target.value }))} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
                </label>
                <label>Team Name
                  <input type="text" value={letterFields.teamName} onChange={e => setLetterFields(f => ({ ...f, teamName: e.target.value }))} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
                </label>
                <label>First Date
                  <input type="date" value={letterFields.firstDate} onChange={e => setLetterFields(f => ({ ...f, firstDate: e.target.value }))} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
                </label>
                <label>Direction
                  <input type="text" value={letterFields.direction} onChange={e => setLetterFields(f => ({ ...f, direction: e.target.value }))} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
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
              <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Letter Preview (editable):</label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <button type="button" onClick={() => format('bold')} style={{ fontWeight: 700, display: showEditor ? undefined : 'none' }}>B</button>
                <button type="button" onClick={() => format('italic')} style={{ fontStyle: 'italic', display: showEditor ? undefined : 'none' }}>I</button>
                <button type="button" onClick={() => format('underline')} style={{ textDecoration: 'underline', display: showEditor ? undefined : 'none' }}>U</button>
                <button type="button" onClick={() => format('insertUnorderedList')} style={{ display: showEditor ? undefined : 'none' }}>• List</button>
                <button type="button" onClick={() => format('insertOrderedList')} style={{ display: showEditor ? undefined : 'none' }}>1. List</button>
                <select onChange={e => { if (e.target.value) { insertVariable(e.target.value); e.target.value = ''; } }} style={{ marginLeft: showEditor ? 16 : 0, display: showEditor ? undefined : 'none' }}>
                  <option value="">Insert Variable…</option>
                  <option value="@fullname">Full Name</option>
                  <option value="@position">Position</option>
                  <option value="@team">Team Name</option>
                  <option value="@direction">Direction</option>
                  <option value="@date">First Date</option>
                  <option value="@telegram">Telegram</option>
                </select>
                <button type="button" style={{ marginLeft: 0, color: '#333', border: '1px solid #aaa', background: '#fff', borderRadius: 4, padding: '4px 12px' }} onClick={() => setShowEditor(v => !v)}>
                  {showEditor ? 'Hide static content' : 'Edit static content'}
                </button>
                <button type="button" style={{ marginLeft: 'auto', color: '#c00', border: '1px solid #c00', background: '#fff', borderRadius: 4, padding: '4px 12px' }} onClick={resetToTemplate}>Reset to template</button>
              </div>
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
              <label style={{ fontWeight: 600, marginBottom: 8, display: 'block', marginTop: 24 }}>Preview:</label>
              <div style={{ minHeight: 400, background: '#fafafa', borderRadius: 8, border: '1px solid #eee', marginBottom: 16, padding: 16, color: '#111' }}>
                <LetterPreview
                  fullName={letterFields.fullName}
                  position={letterFields.position}
                  teamName={letterFields.teamName}
                  direction={letterFields.direction}
                  firstDate={letterFields.firstDate}
                  telegram={letterFields.telegram}
                />
              </div>
              {/* PDF export and page count controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 16 }}>
                <button style={{ padding: '8px 24px', fontSize: 16, borderRadius: 6, background: '#646cff', color: '#fff', border: 'none', cursor: 'pointer' }} disabled>Export as PDF (coming soon)</button>
                <span style={{ color: '#888', fontSize: 16 }}>Pages: 1 (auto-detect coming soon)</span>
              </div>
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
