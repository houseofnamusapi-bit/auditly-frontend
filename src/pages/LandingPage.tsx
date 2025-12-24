import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { runAuditApi } from "../auditService";
import "./LandingPage.css"; // import the CSS

function useTypewriter(text: string, speed = 100) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, index + 1));
      index++;
      if (index === text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return displayed;
}

export default function LandingPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const headline = useTypewriter("AI-powered website audit platform", 60);

  const validateUrl = (url: string) => {
    const pattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/i;
    return pattern.test(url);
  };

  const runAudit = async () => {
    if (!url || !validateUrl(url)) {
      setError("Please enter a valid URL (e.g., https://example.com)");
      return;
    }
    setError("");
    try {
      setLoading(true);
      const data = await runAuditApi(url);

      navigate("/results", { state: { result: data, url } });
    } catch {
      setError("Audit failed, please try again!");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { title: "SEO Optimization", icon: "🔍" },
    { title: "Performance Metrics", icon: "⚡" },
    { title: "Accessibility Check", icon: "♿" },
    { title: "Security Scan", icon: "🛡️" },
    { title: "AI Recommendations", icon: "🤖" },
  ];

  return (
    
    <div className="landing-page">

      {/* Hero */}
      
      <section className="hero">

        <div className="particles">
    {[...Array(30)].map((_, i) => (
      <span
        key={i}
        style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 10}s`,
          animationDuration: `${15 + Math.random() * 10}s`,
        }}
      />
    ))}
  </div>

        <h1>Auditly AI</h1>
        <p>{headline}<span className="cursor">|</span></p>

        <div className="mt-10 flex gap-4 flex-wrap justify-center">
          <input
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="input-box"
          />
          <button
            onClick={runAudit}
            disabled={loading}
            className="cta-btn"
          >
            {loading ? "Auditing..." : "Run Audit"}
          </button>
        </div>

        {error && <p className="error-msg" style={{ color: "#f472b6", marginTop: "10px" }}>{error}</p>}
        {loading && (
          <div style={{ marginTop: "20px" }}>
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </section>

      {/* Features */}
      <section className="features">
        {features.map((f) => (
          <div key={f.title} className="feature-card">
            <div className="icon" style={{ fontSize: "32px" }}>{f.icon}</div>
            <h3>{f.title}</h3>
            <p>Instant insights powered by AI.</p>
          </div>
        ))}
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2 className="text-4xl font-bold mb-10">Trusted by companies worldwide</h2>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
          <div className="testimonial-card">"Amazing insights!" - Company A</div>
          <div className="testimonial-card">"Saved us hours of work!" - Company B</div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        © 2025 Auditly AI | Powered by houseofnamus.com
      </footer>
    </div>
  );
}


