import { formatINR } from '../utils/format';
import { PRESET_SERVICES } from '../data/presetServices';

const VALIDITY_OPTIONS = [
  { value: '7', label: '7 days' },
  { value: '15', label: '15 days' },
  { value: '30', label: '30 days' },
];

function BuilderPanel({ state, update, addLineItem, updateLineItem, removeLineItem, totals }) {
  return (
    <div className="builder-panel">
      <section className="panel-section">
        <h2 className="section-title">Client Details</h2>
        <div className="field-grid">
          <label className="field">
            <span className="field-label">Client Name</span>
            <input
              type="text"
              value={state.clientName}
              placeholder="e.g. Ananya Rao"
              onChange={(e) => update({ clientName: e.target.value })}
            />
          </label>
          <label className="field">
            <span className="field-label">Business Name</span>
            <input
              type="text"
              value={state.businessName}
              placeholder="e.g. Rao Interiors"
              onChange={(e) => update({ businessName: e.target.value })}
            />
          </label>
          <label className="field">
            <span className="field-label">Date</span>
            <input
              type="date"
              value={state.date}
              onChange={(e) => update({ date: e.target.value })}
            />
          </label>
          <label className="field">
            <span className="field-label">Quote Number</span>
            <input
              type="text"
              className="mono"
              value={state.quoteNumber}
              onChange={(e) => update({ quoteNumber: e.target.value })}
            />
          </label>
        </div>
      </section>

      <section className="panel-section">
        <h2 className="section-title">Services</h2>

        <div className="line-items">
          <div className="line-item-header">
            <span className="col-service">Service</span>
            <span className="col-qty">Qty</span>
            <span className="col-price">Unit Price</span>
            <span className="col-total">Total</span>
            <span className="col-delete" />
          </div>
          {state.lineItems.map((li) => (
            <div className="line-item-row" key={li.id}>
              <input
                type="text"
                className="col-service"
                placeholder="Service name"
                value={li.name}
                onChange={(e) => updateLineItem(li.id, { name: e.target.value })}
              />
              <input
                type="number"
                className="col-qty mono"
                min="0"
                value={li.qty}
                onChange={(e) => updateLineItem(li.id, { qty: e.target.value })}
              />
              <div className="price-input col-price">
                <span className="price-prefix">₹</span>
                <input
                  type="number"
                  className="mono"
                  min="0"
                  value={li.unitPrice}
                  onChange={(e) => updateLineItem(li.id, { unitPrice: e.target.value })}
                />
              </div>
              <span className="col-total mono line-total">
                {formatINR((Number(li.qty) || 0) * (Number(li.unitPrice) || 0))}
              </span>
              <button
                type="button"
                className="col-delete delete-btn"
                onClick={() => removeLineItem(li.id)}
                aria-label="Remove service"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button type="button" className="add-service-btn" onClick={() => addLineItem()}>
          + Add Service
        </button>

        <div className="quick-add-label">Quick Add</div>
        <div className="quick-add-pills">
          {PRESET_SERVICES.map((preset) => (
            <button
              type="button"
              key={preset.label}
              className="pill"
              onClick={() => addLineItem({ name: preset.name, qty: 1, unitPrice: preset.price })}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </section>

      <section className="panel-section">
        <h2 className="section-title">Discount</h2>
        <div className="discount-row">
          <div className="discount-toggle">
            <button
              type="button"
              className={state.discountType === '%' ? 'toggle-btn active' : 'toggle-btn'}
              onClick={() => update({ discountType: '%' })}
            >
              %
            </button>
            <button
              type="button"
              className={state.discountType === 'flat' ? 'toggle-btn active' : 'toggle-btn'}
              onClick={() => update({ discountType: 'flat' })}
            >
              ₹
            </button>
          </div>
          <input
            type="number"
            className="mono discount-value"
            min="0"
            value={state.discountValue}
            onChange={(e) => update({ discountValue: e.target.value })}
            placeholder="0"
          />
          <input
            type="text"
            className="discount-reason"
            placeholder="Reason (optional) — e.g. Launch offer"
            value={state.discountReason}
            onChange={(e) => update({ discountReason: e.target.value })}
          />
        </div>
        {totals.discountAmount > 0 && (
          <div className="discount-preview">
            − {formatINR(totals.discountAmount)}
            {state.discountReason ? ` · ${state.discountReason}` : ''}
          </div>
        )}
      </section>

      <section className="panel-section">
        <h2 className="section-title">Notes</h2>
        <textarea
          className="notes-textarea"
          rows={3}
          value={state.notes}
          onChange={(e) => update({ notes: e.target.value })}
        />
      </section>

      <section className="panel-section">
        <h2 className="section-title">Validity</h2>
        <div className="validity-options">
          {VALIDITY_OPTIONS.map((opt) => (
            <button
              type="button"
              key={opt.value}
              className={state.validity === opt.value ? 'toggle-btn active' : 'toggle-btn'}
              onClick={() => update({ validity: opt.value })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      <div className="totals-summary">
        <div className="totals-row">
          <span>Subtotal</span>
          <span className="mono">{formatINR(totals.subtotal)}</span>
        </div>
        {totals.discountAmount > 0 && (
          <div className="totals-row discount">
            <span>Discount</span>
            <span className="mono">− {formatINR(totals.discountAmount)}</span>
          </div>
        )}
        <div className="totals-row total">
          <span>Total</span>
          <span className="mono">{formatINR(totals.total)}</span>
        </div>
      </div>
    </div>
  );
}

export default BuilderPanel;
