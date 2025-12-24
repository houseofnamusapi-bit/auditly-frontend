import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "./ResultsPage.css";

export default function ResultsPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state?.result) {
    navigate("/");
    return null;
  }

  const { result, url } = state;

  // ✅ FIXED SEO SCORE (no screenshots)
  const calculateSeoScore = () => {
    let score = 0;
    if (result?.seo?.title) score += 25;
    if (result?.seo?.metaDescription) score += 25;
    if (result?.seo?.headings?.h1?.length > 0) score += 25;
    if (result?.loadTimeMs < 3000) score += 25;
    return score;
  };

  const score = calculateSeoScore();
  const scoreClass = score >= 80 ? "good" : score >= 50 ? "ok" : "bad";

  const issues: string[] = [];
  if (!result?.seo?.title) issues.push("Missing title tag");
  if (!result?.seo?.metaDescription) issues.push("Missing meta description");
  if (!result?.seo?.headings?.h1?.length) issues.push("No H1 heading found");
  if (result?.loadTimeMs > 3000) issues.push("Page load time is slow");

  // ✅ TEXT-ONLY PDF (VERY SMALL SIZE)
  const downloadPdf = () => {
    const pdf = new jsPDF("p", "mm", "a4");
    let y = 20;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text("Website Audit Report", 20, y);

    y += 10;
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    pdf.text(`URL: ${url}`, 20, y);

    y += 8;
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, y);

    y += 15;
    pdf.setFont("helvetica", "bold");
    pdf.text("SEO Score", 20, y);

    y += 8;
    pdf.setFont("helvetica", "normal");
    pdf.text(`${score} / 100`, 20, y);

    y += 15;
    pdf.setFont("helvetica", "bold");
    pdf.text("SEO Issues", 20, y);

    y += 8;
    pdf.setFont("helvetica", "normal");

    if (issues.length === 0) {
      pdf.text("No major SEO issues found 🎉", 20, y);
      y += 8;
    } else {
      issues.forEach((issue) => {
        if (y > 270) {
          pdf.addPage();
          y = 20;
        }
        pdf.text(`- ${issue}`, 20, y);
        y += 8;
      });
    }

    y += 10;
    pdf.setFont("helvetica", "bold");
    pdf.text("Performance", 20, y);

    y += 8;
    pdf.setFont("helvetica", "normal");
    pdf.text(`Load Time: ${result.loadTimeMs} ms`, 20, y);

    pdf.save("auditly-report.pdf");
  };

  return (
    <div className="results-page">
      {/* UI Header */}
      <div className="results-header">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← New Audit
        </button>
        <span style={{ opacity: 0.6 }}>Powered by houseofnamus.com</span>
      </div>

      {/* Actions */}
      <div className="actions">
        <button className="download-btn" onClick={downloadPdf}>
          📄 Download PDF
        </button>
      </div>

      {/* UI CONTENT (NOT USED FOR PDF) */}
      <div className="results-container">
        <div className="audit-card">
          <h2>Audit Results</h2>
          <p style={{ opacity: 0.7 }}>{url}</p>
          <div className={`score ${scoreClass}`}>{score} / 100</div>
        </div>

        <div className="audit-card">
          <h3>SEO Issues</h3>
          {issues.length === 0 ? (
            <p style={{ color: "#4ade80" }}>✅ No major SEO issues found</p>
          ) : (
            <ul className="issues">
              {issues.map((issue, idx) => (
                <li key={idx}>❌ {issue}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {result?.screenshots && (
  <div className="audit-card">
    <h3>Screenshots</h3>

    <div className="screenshots">
      {result.screenshots.desktop && (
        <div>
          <p style={{ opacity: 0.6, marginBottom: 8 }}>Desktop</p>
          <img
            src={`http://localhost:5000/screenshots/${result.screenshots.desktop}`}
            alt="Desktop Screenshot"
            style={{ width: "100%", borderRadius: 8 }}
          />
        </div>
      )}

      {result.screenshots.mobile && (
        <div style={{ marginTop: 16 }}>
          <p style={{ opacity: 0.6, marginBottom: 8 }}>Mobile</p>
          <img
            src={`http://localhost:5000/screenshots/${result.screenshots.mobile}`}
            alt="Mobile Screenshot"
            style={{ width: "100%", borderRadius: 8 }}
          />
        </div>
      )}
    </div>
  </div>
)}

    </div>
  );
}
