import co1 from "../assets/companies/co1.png";
import co2 from "../assets/companies/co2.png";
import co3 from "../assets/companies/co3.png";
import co4 from "../assets/companies/co4.png";
import co5 from "../assets/companies/co5.png";
import co6 from "../assets/companies/co6.png";
import co7 from "../assets/companies/co7.png";
import co8 from "../assets/companies/co8.png";
import co9 from "../assets/companies/co9.png";
import co10 from "../assets/companies/co10.png";
import co11 from "../assets/companies/co11.png";
import co12 from "../assets/companies/co12.webp";
import co13 from "../assets/companies/co13.webp";
import co14 from "../assets/companies/co14.png";
import co15 from "../assets/companies/co15.png";
import co16 from "../assets/companies/co16.png";
import co17 from "../assets/companies/co17.png";
import co18 from "../assets/companies/co18.webp";
import co19 from "../assets/companies/co19.png";
import co20 from "../assets/companies/co20.webp";
import co21 from "../assets/companies/co21.png";
import co22 from "../assets/companies/co22.png";
import co23 from "../assets/companies/co23.png";
import co24 from "../assets/companies/co24.webp";
import co25 from "../assets/companies/co25.png";
import co26 from "../assets/companies/co26.png";
import co27 from "../assets/companies/co27.svg";
import co28 from "../assets/companies/co28.png";
import co29 from "../assets/companies/co29.png";

const logos = [
  { src: co1, alt: "Client logo" },
  { src: co2, alt: "Client logo" },
  { src: co3, alt: "Client logo" },
  { src: co4, alt: "Client logo" },
  { src: co5, alt: "Client logo" },
  { src: co6, alt: "Client logo" },
  { src: co7, alt: "Client logo" },
  { src: co8, alt: "Client logo" },
  { src: co9, alt: "Client logo" },
  { src: co10, alt: "Client logo" },
  { src: co11, alt: "Client logo" },
  { src: co12, alt: "Client logo" },
  { src: co13, alt: "Client logo" },
  { src: co14, alt: "Client logo" },
  { src: co15, alt: "Client logo" },
  { src: co16, alt: "Client logo" },
  { src: co17, alt: "Client logo" },
  { src: co18, alt: "Client logo" },
  { src: co19, alt: "Client logo" },
  { src: co20, alt: "Client logo" },
  { src: co21, alt: "Client logo" },
  { src: co22, alt: "Client logo" },
  { src: co23, alt: "Client logo" },
  { src: co24, alt: "Client logo" },
  { src: co25, alt: "Client logo" },
  { src: co26, alt: "Client logo" },
  { src: co27, alt: "Client logo" },
  { src: co28, alt: "Client logo" },
  { src: co29, alt: "Client logo" },
];

function LogoTrack() {
  return (
    <>
      {logos.map((logo, i) => (
        <img
          key={i}
          className="client-logos__logo"
          src={logo.src}
          alt={logo.alt}
          loading="lazy"
          draggable={false}
        />
      ))}
    </>
  );
}

function ClientLogos() {
  return (
    <section className="client-logos" aria-label="Trusted by leading companies">
      <div className="client-logos__fade client-logos__fade--left" aria-hidden="true" />
      <div className="client-logos__track-wrapper">
        <div className="client-logos__track">
          <LogoTrack />
          <LogoTrack />
        </div>
      </div>
      <div className="client-logos__fade client-logos__fade--right" aria-hidden="true" />
    </section>
  );
}

export default ClientLogos;
