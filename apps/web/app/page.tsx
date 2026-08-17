import Image from "next/image";
import type { CSSProperties } from "react";
import { BrandLogo } from "@liete/ui-web";
import { withBasePath } from "../lib/site-path";
import { PublicHeader } from "./_traveler/public-header";
import { HomeBannerHero, HomePartnerHero, HomeTripCard } from "./home-actions";
import { HomeSearch } from "./home-search";
import styles from "./page.module.css";

const partners = [
  { className: "partnerLatam", name: "LATAM" },
  { className: "partnerAzul", name: "Azul" },
  { className: "partnerKlm", name: "KLM" },
  { className: "partnerAirbnb", name: "Airbnb" },
  { className: "partnerAccor", name: "Accor" },
  { className: "partnerCvc", name: "CVC" },
  { className: "partnerLocaliza", name: "Localiza" }
] as const;

const organizers = [
  { name: "Rota Serra Turismo", trips: "12 viagens este mês" },
  { name: "Viva Trip", trips: "8 viagens este mês" },
  { name: "Trilha Viva", trips: "16 viagens este mês" },
  { name: "Bora Tour", trips: "10 viagens este mês" }
] as const;

const destinations = [
  {
    image: withBasePath("/home/destination-capitolio.png"),
    name: "Capitólio",
    region: "Minas Gerais"
  },
  {
    image: withBasePath("/home/destination-bonito.jpeg"),
    name: "Bonito",
    region: "Mato Grosso do Sul"
  },
  {
    image: withBasePath("/home/destination-arraial.jpeg"),
    name: "Arraial do Cabo",
    region: "Rio de Janeiro"
  },
  {
    image: withBasePath("/home/destination-rio.jpeg"),
    name: "Rio de Janeiro",
    region: "Rio de Janeiro"
  },
  {
    image: withBasePath("/home/destination-iguacu.jpeg"),
    name: "Foz do Iguaçu",
    region: "Paraná"
  }
] as const;

const trips = [
  {
    image: withBasePath("/home/trip-sakura.jpeg"),
    slug: "holambra-festival-flores",
    title: "Holambra e o festival das flores",
    departure: "Saída: São Paulo · 24 ago · 06:00",
    organizer: "Organizado por Rota Serra Turismo"
  },
  {
    image: withBasePath("/home/trip-desert.png"),
    slug: "lencois-maranhenses",
    title: "Dunas e lagoas dos Lençóis",
    departure: "Saída: São Luís · 7 set · 05:30",
    organizer: "Organizado por Viva Trip"
  },
  {
    image: withBasePath("/home/trip-coast.png"),
    slug: "arraial-do-cabo",
    title: "Arraial do Cabo bate-volta",
    departure: "Saída: Rio de Janeiro · 14 set · 06:00",
    organizer: "Organizado por Trilha Viva"
  },
  {
    image: withBasePath("/home/trip-mountains.jpeg"),
    slug: "serra-da-canastra",
    title: "Serra e cachoeiras de Minas",
    departure: "Saída: Belo Horizonte · 21 set · 06:30",
    organizer: "Organizado por Bora Tour"
  }
] as const;

import { getPublishedExcursions } from "../lib/db/excursions";

function SectionHeading({
  description,
  href,
  id,
  title
}: {
  description: string;
  href: string;
  id: string;
  title: string;
}) {
  return (
    <div className={styles.sectionHeading}>
      <div>
        <h2 id={id}>{title}</h2>
        <p>{description}</p>
      </div>
      <a href={href}>Ver todos <span aria-hidden="true">→</span></a>
    </div>
  );
}

type TripItem = {
  departure: string;
  image: string;
  organizer: string;
  slug: string;
  title: string;
};

export default async function HomePage() {
  let dynamicTrips: TripItem[] = [...trips];
  try {
    const records = await getPublishedExcursions({ limit: 4 });
    if (records && records.length > 0) {
      dynamicTrips = records.map((r, i) => ({
        departure: `Saída: ${r.departure_city} · ${r.date}`,
        image: r.image_url || trips[i % trips.length]!.image,
        organizer: "Organizador parceiro",
        slug: r.slug,
        title: r.title
      }));
    }
  } catch {
    // Safe fallback
  }

  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#conteudo-principal">Pular para o conteúdo</a>

      <PublicHeader home />

      <main id="conteudo-principal">
        <section aria-labelledby="hero-title" className={styles.hero} id="inicio">
          <Image
            alt="Estrada aberta entre montanhas"
            className={styles.heroImage}
            fill
            priority
            sizes="100vw"
            src={withBasePath("/home/hero-road.jpeg")}
          />
          <div aria-hidden="true" className={styles.heroOverlay} />
          <div className={styles.heroContent}>
            <div className={styles.heroCopy}>
              <h1 id="hero-title">Encontre seu novo destino, vamos pegar a estrada!</h1>
              <p>Descubra sua próxima aventura</p>
            </div>
            <HomeSearch className={styles.heroSearch} />
          </div>
        </section>

        <section
          aria-label="Empresas parceiras"
          className={styles.partners}
          style={{
            "--partner-logos-image": `url("${withBasePath("/home/partner-logos.png")}")`
          } as CSSProperties}
          tabIndex={0}
        >
          <div className={styles.partnerMarquee}>
            {[false, true].map((isDuplicate) => (
              <div
                aria-hidden={isDuplicate || undefined}
                className={`${styles.partnerTrack} ${isDuplicate ? styles.partnerTrackDuplicate : ""}`}
                key={isDuplicate ? "duplicate" : "original"}
              >
                {partners.map((partner) => (
                  <span
                    aria-label={isDuplicate ? undefined : partner.name}
                    className={`${styles.partnerLogo} ${styles[partner.className]}`}
                    key={`${isDuplicate ? "duplicate" : "original"}-${partner.name}`}
                    role={isDuplicate ? undefined : "img"}
                  />
                ))}
              </div>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="organizadores-title"
          className={`${styles.section} ${styles.container}`}
          id="organizadores"
        >
          <SectionHeading
            description="Organizadores mais ativos da plataforma"
            href="#organizadores"
            id="organizadores-title"
            title="Organizadores favoritos"
          />
          <div className={styles.organizerGrid}>
            {organizers.map((organizer) => (
              <article className={styles.organizerCard} key={organizer.name}>
                <span aria-hidden="true" className={styles.organizerMark}>✓</span>
                <div>
                  <h3>{organizer.name}</h3>
                  <p>{organizer.trips}</p>
                </div>
                <span aria-hidden="true" className={styles.cardArrow}>›</span>
              </article>
            ))}
          </div>
        </section>

        <section
          aria-label="Para organizadores"
          className={`${styles.section} ${styles.container}`}
        >
          <HomePartnerHero />
        </section>

        <section
          aria-labelledby="destinos-title"
          className={`${styles.section} ${styles.container}`}
          id="destinos"
        >
          <SectionHeading
            description="Os mais buscados desta semana"
            href={withBasePath("/excursoes/")}
            id="destinos-title"
            title="Destinos populares"
          />
          <div className={styles.destinationGrid}>
            {destinations.map((destination) => (
              <a
                aria-label={`Explorar ${destination.name}, ${destination.region}`}
                className={styles.destinationCard}
                href={`${withBasePath("/excursoes/")}?destination=${encodeURIComponent(destination.name)}`}
                key={destination.name}
              >
                <Image
                  alt=""
                  className={styles.destinationImage}
                  fill
                  sizes="(max-width: 760px) 70vw, 20vw"
                  src={destination.image}
                />
                <span aria-hidden="true" className={styles.destinationOverlay} />
                <span className={styles.destinationCopy}>
                  <small>{destination.region}</small>
                  <strong>{destination.name}</strong>
                </span>
              </a>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="viagens-title"
          className={`${styles.section} ${styles.container}`}
          id="viagens"
        >
          <SectionHeading
            description="Viagens confiáveis criadas por especialistas"
            href={withBasePath("/excursoes/")}
            id="viagens-title"
            title="Viagens imperdíveis"
          />
          <div className={styles.tripGrid}>
            {dynamicTrips.map((trip, index) => (
              <HomeTripCard
                imageAlt={`Paisagem da viagem ${trip.title}`}
                imageSrc={trip.image}
                key={trip.title}
                organizer={trip.organizer}
                participantCount={32 + index * 7}
                seats={8 + index * 2}
                slug={trip.slug}
                title={trip.title}
                departure={trip.departure}
              />
            ))}
          </div>
        </section>

        <section className={`${styles.ctaSection} ${styles.container}`}>
          <HomeBannerHero />
        </section>
      </main>

      <footer className={styles.footer} id="rodape">
        <div className={`${styles.footerGrid} ${styles.container}`}>
          <div className={styles.footerBrand}>
            <BrandLogo decorative tone="green" width={88} />
            <p>Viagens em grupo com confiança, bons encontros e muita estrada.</p>
          </div>

          <div className={styles.footerColumn}>
            <h2>Sobre a Liete</h2>
            <a href="#inicio">Nossa história</a>
            <a href="#organizadores">Parceiros</a>
            <a href="#rodape">Contato</a>
          </div>

          <div className={styles.footerColumn}>
            <h2>Para viajantes</h2>
            <a href={withBasePath("/excursoes/")}>Explorar destinos</a>
            <a href="#viagens">Como funciona</a>
            <a href={withBasePath("/excursoes/")}>Buscar viagens</a>
          </div>

          <div className={styles.footerColumn}>
            <h2>Para parceiros</h2>
            <a href="#organizadores">Seja um parceiro</a>
            <a href="#organizadores">Área do organizador</a>
            <a href="#rodape">Suporte</a>
          </div>

          <div className={styles.newsletter}>
            <h2>Liete</h2>
            <p>Receba novidades e novas viagens.</p>
            <form>
              <label className={styles.srOnly} htmlFor="newsletter-email">Seu e-mail</label>
              <input id="newsletter-email" name="email" placeholder="seu@email.com" type="email" />
              <button type="submit">Assinar</button>
            </form>
          </div>
        </div>

        <div className={`${styles.legal} ${styles.container}`}>
          <p>Liete Tecnologia e Viagens Ltda. · São Paulo — SP</p>
          <nav aria-label="Links legais">
            <a href="#rodape">Termos de uso</a>
            <a href="#rodape">Privacidade</a>
            <a href="#rodape">Cookies</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
