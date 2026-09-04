import { useState } from "react";
import JSZip from "jszip";
import accent from "../assets/brand/1.png";
import white from "../assets/brand/2.png";
import black from "../assets/brand/3.png";
import symbolWordmark from "../assets/brand/4.png";
import wordmark from "../assets/brand/5.png";
import { useSeo } from "../hooks/useSeo";

const SEO = {
  title: "Brand Assets \u2014 Nagriva",
  description: "Download the official Nagriva logo assets for use across digital and print applications.",
  canonical: "https://nagriva.ma/brand",
  og: { title: "Brand Assets \u2014 Nagriva", description: "Download the official Nagriva logo assets for use across digital and print applications.", url: "https://nagriva.ma/brand" },
  twitter: { title: "Brand Assets \u2014 Nagriva", description: "Download the official Nagriva logo assets for use across digital and print applications.", card: "summary_large_image" as const },
};

interface BrandAsset {
  name: string;
  file: string;
  src: string;
  darkBg: boolean;
}

const ASSETS: BrandAsset[] = [
  { name: "Nagriva Accent", file: "1.png", src: accent, darkBg: false },
  { name: "Nagriva White", file: "2.png", src: white, darkBg: true },
  { name: "Nagriva Black", file: "3.png", src: black, darkBg: false },
  { name: "Nagriva Symbol + Wordmark", file: "4.png", src: symbolWordmark, darkBg: true },
  { name: "Nagriva Wordmark", file: "5.png", src: wordmark, darkBg: true },
];

const ZIP_FILENAME = "nagriva-brand-assets.zip";

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function fetchAsBlob(src: string, file: string): Promise<Blob> {
  const res = await fetch(src);
  if (!res.ok) {
    throw new Error(`Failed to load ${file}`);
  }
  return res.blob();
}

function Brand() {
  useSeo(SEO);
  const [busy, setBusy] = useState(false);

  const downloadOne = async (asset: BrandAsset) => {
    setBusy(true);
    try {
      const blob = await fetchAsBlob(asset.src, asset.file);
      triggerDownload(blob, asset.file);
    } finally {
      setBusy(false);
    }
  };

  const downloadAll = async () => {
    setBusy(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder("nagriva-brand-assets") ?? zip;
      await Promise.all(
        ASSETS.map(async (asset) => {
          const blob = await fetchAsBlob(asset.src, asset.file);
          folder.file(asset.file, blob);
        })
      );
      const blob = await zip.generateAsync({ type: "blob" });
      triggerDownload(blob, ZIP_FILENAME);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <style>{`
        .brand-page {
          padding: 6rem 1.25rem 5rem;
          background: var(--color-bg);
        }
        .brand-page__container {
          width: min(1100px, 100%);
          margin: 0 auto;
        }
        .brand-page__header {
          text-align: center;
          margin-bottom: 3.5rem;
        }
        .brand-page__eyebrow {
          display: inline-block;
          font-family: var(--font-heading);
          font-size: .72rem;
          font-weight: 600;
          letter-spacing: .22em;
          text-transform: uppercase;
          color: var(--color-accent);
          margin-bottom: 1rem;
        }
        .brand-page__title {
          margin: 0;
          font-family: var(--font-heading);
          font-size: clamp(2.2rem, 5vw, 3.4rem);
          font-weight: 700;
          line-height: 1.1;
          color: var(--color-text);
        }
        .brand-page__desc {
          max-width: 560px;
          margin: 1.25rem auto 0;
          color: var(--color-muted);
          font-size: 1rem;
          line-height: 1.7;
        }
        .brand-page__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        .brand-card {
          display: flex;
          flex-direction: column;
          background: var(--color-surface);
          border: 1px solid rgba(245,245,245,.08);
          border-radius: var(--radius-card);
          padding: 1.5rem;
        }
        .brand-card__preview {
          aspect-ratio: 1 / 1;
          display: grid;
          place-items: center;
          border-radius: var(--radius-sm);

          padding: 1.25rem;
          margin-bottom: 1.25rem;
          overflow: hidden;
        }
        .brand-card__preview--dark {
          background: #1a1a1a;
        }
        .brand-card__img {
          display: block;
          max-width: 82%;
          max-height: 82%;
          object-fit: contain;
        }
        .brand-card__name {
          margin: 0 0 .25rem;
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-text);
        }
        .brand-card__file {
          margin: 0 0 1.1rem;
          font-family: var(--font-body);
          font-size: .78rem;
          color: var(--color-muted);
          word-break: break-all;
        }
        .brand-card__btn {
          margin-top: auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: .5rem;
          padding: .7rem 1.25rem;
          border: none;
          border-radius: var(--radius-button);
          background: var(--color-accent);
          color: #0d0d0d;
          font-family: var(--font-heading);
          font-size: .82rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: transform .2s ease, box-shadow .2s ease;
        }
        .brand-card__btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(217,242,38,.22);
        }
        .brand-page__download-all {
          display: flex;
          justify-content: center;
          margin-top: 3rem;
        }
        .brand-page__download-all-btn {
          display: inline-flex;
          align-items: center;
          gap: .6rem;
          padding: .95rem 2rem;
          border: 1px solid var(--color-accent);
          border-radius: var(--radius-button);
          background: transparent;
          color: var(--color-accent);
          font-family: var(--font-heading);
          font-size: .9rem;
          font-weight: 600;
          cursor: pointer;
          transition: background .2s ease, color .2s ease;
        }
        .brand-page__download-all-btn:hover {
          background: var(--color-accent);
          color: #0d0d0d;
        }
        .brand-page__download-all-btn:disabled,
        .brand-card__btn:disabled {
          opacity: .6;
          cursor: default;
          transform: none;
        }
        @media (max-width: 980px) {
          .brand-page__grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 620px) {
          .brand-page__grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <main className="brand-page">
        <div className="brand-page__container">
          <header className="brand-page__header">
            <span className="brand-page__eyebrow">Brand Assets</span>
            <h1 className="brand-page__title">Brand Assets</h1>
            <p className="brand-page__desc">
              Download the official Nagriva logo assets for use across digital and print applications.
            </p>
          </header>

          <div className="brand-page__grid">
            {ASSETS.map((asset) => {
              return (
                <article key={asset.file} className="brand-card">
                  <div className={`brand-card__preview${asset.darkBg ? " brand-card__preview--dark" : ""}`}>
                    <img className="brand-card__img" src={asset.src} alt={asset.name} loading="lazy" />
                  </div>
                  <h2 className="brand-card__name">{asset.name}</h2>
                  <p className="brand-card__file">{asset.file}</p>
                  <button
                    className="brand-card__btn"
                    type="button"
                    disabled={busy}
                    onClick={() => downloadOne(asset)}
                  >
                    Download
                  </button>
                </article>
              );
            })}
          </div>

          <div className="brand-page__download-all">
            <button
              className="brand-page__download-all-btn"
              type="button"
              disabled={busy}
              onClick={downloadAll}
            >
              Download All Logos
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

export default Brand;
