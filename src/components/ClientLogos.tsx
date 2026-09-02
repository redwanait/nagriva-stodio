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
import co12 from "../assets/companies/co12.png";

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
