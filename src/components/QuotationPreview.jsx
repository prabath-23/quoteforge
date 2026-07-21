import { forwardRef } from 'react';
import { formatINR, formatDateDisplay, addDays } from '../utils/format';

const QuotationPreview = forwardRef(function QuotationPreview({ state, totals }, ref) {
  const validUntil = addDays(state.date, state.validity);

  return (
    <div id="quotation-preview" className="quote-doc" ref={ref}>
      <div className="quote-doc-topbar">
        <div className="quote-doc-studio">PRABATH.IN</div>
        <div className="quote-doc-label">QUOTATION</div>
      </div>
      <div className="quote-doc-meta">
        <span>{state.quoteNumber || 'QT-001'}</span>
        <span>{formatDateDisplay(state.date)}</span>
      </div>

      <div className="quote-doc-rule" />

      <div className="quote-doc-client">
        <div className="quote-doc-client-name">{state.clientName || 'Client Name'}</div>
        {state.businessName && (
          <div className="quote-doc-business-name">{state.businessName}</div>
        )}
      </div>

      <table className="quote-doc-table">
        <thead>
          <tr>
            <th className="col-service">Service</th>
            <th className="col-qty">Qty</th>
            <th className="col-price">Unit Price</th>
            <th className="col-total">Total</th>
          </tr>
        </thead>
        <tbody>
          {state.lineItems.map((li, i) => (
            <tr key={li.id} className={i % 2 === 1 ? 'row-alt' : ''}>
              <td className="col-service">{li.name || 'Service'}</td>
              <td className="col-qty">{Number(li.qty) || 0}</td>
              <td className="col-price">{formatINR(li.unitPrice)}</td>
              <td className="col-total">
                {formatINR((Number(li.qty) || 0) * (Number(li.unitPrice) || 0))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="quote-doc-summary">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>{formatINR(totals.subtotal)}</span>
        </div>
        {totals.discountAmount > 0 && (
          <div className="summary-row summary-discount">
            <span>
              Discount{state.discountReason ? ` (${state.discountReason})` : ''}
            </span>
            <span>− {formatINR(totals.discountAmount)}</span>
          </div>
        )}
        <div className="summary-row summary-total">
          <span>Total</span>
          <span>{formatINR(totals.total)}</span>
        </div>
      </div>

      {state.notes && <div className="quote-doc-notes">{state.notes}</div>}

      {validUntil && (
        <div className="quote-doc-validity">
          This quotation is valid until {formatDateDisplay(validUntil)}
        </div>
      )}

      <div className="quote-doc-rule" />
      <div className="quote-doc-footer">PRABATH.IN · 9809977779</div>
    </div>
  );
});

export default QuotationPreview;
