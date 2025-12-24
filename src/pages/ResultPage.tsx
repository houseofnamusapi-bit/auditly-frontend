import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./ResultsPage.css";

export default function ResultsPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state?.result) {
    navigate("/");
    return null;
  }

  const { result, url } = state;

  const calculateSeoScore = () => {
    let score = 0;
    if (result?.seo?.title) score += 20;
    if (result?.seo?.metaDescription) score += 20;
    if (result?.seo?.headings?.h1?.length > 0) score += 20;
    if (result?.loadTimeMs < 3000) score += 20;
    if (result?.screenshots?.mobile) score += 20;
    return score;
  };

  const score = calculateSeoScore();
  const scoreClass = score >= 80 ? "good" : score >= 50 ? "ok" : "bad";

  const issues: string[] = [];
  if (!result?.seo?.title) issues.push("Missing title tag");
  if (!result?.seo?.metaDescription) issues.push("Missing meta description");
  if (!result?.seo?.headings?.h1?.length) issues.push("No H1 heading found");
  if (result?.loadTimeMs > 3000) issues.push("Page load time is slow");

  const downloadPdf = async () => {
    const el = document.getElementById("audit-report");
    if (!el) return;

    const canvas = await html2canvas(el, {
      scale: 2,
      backgroundColor: "#0a0b1c",
    });

    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = (canvas.height * pageWidth) / canvas.width;

    pdf.addImage(img, "PNG", 0, 0, pageWidth, pageHeight);
    pdf.save("auditly-report.pdf");
  };

  return (
    <div className="results-page">
      {/* UI Header (not part of PDF) */}
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

      {/* PDF CONTENT START */}
      <div className="results-container" id="audit-report">
        <div className="audit-card">
          <h2>Audit Results</h2>
          <p style={{ opacity: 0.7 }}>{url}</p>

          <div className={`score ${scoreClass}`}>
            {score} / 100
          </div>
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

        {result?.screenshots && (
          <div className="audit-card">
            <h3>Screenshots</h3>

            <div className="screenshots">
              <div>
                <p style={{ opacity: 0.6, marginBottom: 8 }}>Desktop</p>
                <img
                  src={`http://localhost:5000/screenshots/${result.screenshots.desktop}`}
                  alt="Desktop Screenshot"
                />
              </div>

              <div>
                <p style={{ opacity: 0.6, marginBottom: 8 }}>Mobile</p>
                <img
                  src={`http://localhost:5000/screenshots/${result.screenshots.mobile}`}
                  alt="Mobile Screenshot"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      {/* PDF CONTENT END */}
    </div>
  );
}
