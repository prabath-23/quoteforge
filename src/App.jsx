import { useMemo, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import BuilderPanel from './components/BuilderPanel';
import QuotationPreview from './components/QuotationPreview';
import { getNextQuoteNumber } from './utils/quoteNumber';
import { todayISO } from './utils/format';
import './App.css';

let idCounter = 0;
const makeId = () => `li-${Date.now()}-${idCounter++}`;

const DEFAULT_NOTES =
  '50% advance required to begin. Balance due on delivery. Prices valid for 30 days.';

const makeDefaultState = () => ({
  clientName: '',
  businessName: '',
  date: todayISO(),
  quoteNumber: getNextQuoteNumber(),
  lineItems: [{ id: makeId(), name: '', qty: 1, unitPrice: 0 }],
  discountType: '%',
  discountValue: 0,
  discountReason: '',
  notes: DEFAULT_NOTES,
  validity: '30',
});

function App() {
  const [state, setState] = useState(makeDefaultState);
  const [copyStatus, setCopyStatus] = useState('idle');
  const previewRef = useRef(null);

  const update = (patch) => setState((s) => ({ ...s, ...patch }));

  const addLineItem = (item = { name: '', qty: 1, unitPrice: 0 }) => {
    setState((s) => ({
      ...s,
      lineItems: [...s.lineItems, { id: makeId(), ...item }],
    }));
  };

  const updateLineItem = (id, patch) => {
    setState((s) => ({
      ...s,
      lineItems: s.lineItems.map((li) => (li.id === id ? { ...li, ...patch } : li)),
    }));
  };

  const removeLineItem = (id) => {
    setState((s) => ({
      ...s,
      lineItems: s.lineItems.filter((li) => li.id !== id),
    }));
  };

  const totals = useMemo(() => {
    const subtotal = state.lineItems.reduce(
      (sum, li) => sum + (Number(li.qty) || 0) * (Number(li.unitPrice) || 0),
      0
    );
    const discountValue = Number(state.discountValue) || 0;
    let discountAmount =
      state.discountType === '%' ? subtotal * (discountValue / 100) : discountValue;
    discountAmount = Math.min(Math.max(discountAmount, 0), subtotal);
    const total = subtotal - discountAmount;
    return { subtotal, discountAmount, total };
  }, [state.lineItems, state.discountType, state.discountValue]);

  const handleReset = () => {
    if (window.confirm('Reset the quotation? All fields will be cleared.')) {
      setState(makeDefaultState());
      setCopyStatus('idle');
    }
  };

  const renderCanvas = async () => {
    const element = previewRef.current;
    return html2canvas(element, {
      scale: 2,
      backgroundColor: '#faf8f4',
      useCORS: true,
      logging: false,
    });
  };

  const handleCopy = async () => {
    try {
      const canvas = await renderCanvas();
      canvas.toBlob(async (blob) => {
        try {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          setCopyStatus('copied');
          setTimeout(() => setCopyStatus('idle'), 2000);
        } catch {
          setCopyStatus('error');
          setTimeout(() => setCopyStatus('idle'), 2000);
        }
      });
    } catch {
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  const handleDownload = async () => {
    const canvas = await renderCanvas();
    const link = document.createElement('a');
    const safeClient = (state.clientName || 'Client').trim().replace(/\s+/g, '_');
    link.download = `Quote_${safeClient}_${state.quoteNumber}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-title">
          <span className="app-dot" />
          QuoteForge
        </div>
        <div className="app-subtitle">Build · Discount · Share</div>
      </header>

      <div className="main-layout">
        <BuilderPanel
          state={state}
          update={update}
          addLineItem={addLineItem}
          updateLineItem={updateLineItem}
          removeLineItem={removeLineItem}
          totals={totals}
        />
        <div className="preview-panel">
          <div className="preview-panel-label">Live Preview</div>
          <div className="preview-scale-wrap">
            <QuotationPreview ref={previewRef} state={state} totals={totals} />
          </div>
        </div>
      </div>

      <div className="action-bar">
        <button className="btn btn-primary" onClick={handleCopy}>
          {copyStatus === 'copied'
            ? '✓ Copied!'
            : copyStatus === 'error'
              ? 'Copy failed — try again'
              : 'Copy Image to Clipboard'}
        </button>
        <button className="btn btn-outline" onClick={handleDownload}>
          Download as PNG
        </button>
        <button className="btn btn-muted" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
}

export default App;
