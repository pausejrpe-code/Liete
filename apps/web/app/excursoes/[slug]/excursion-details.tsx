"use client";

import { useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Gallery,
  Rating,
  Stepper,
  TripCard
} from "@liete/ui-web";
import {
  formatTravelerCurrency,
  travelerExcursions,
  type TravelerExcursion
} from "../../_traveler/traveler-data";
import { TravelerShell } from "../../_traveler/traveler-shell";
import { withBasePath } from "../../../lib/site-path";
import styles from "./excursion-details.module.css";

export function ExcursionDetails({
  excursion,
  relatedExcursions
}: {
  excursion: TravelerExcursion;
  relatedExcursions?: TravelerExcursion[];
}) {
  const [travelers, setTravelers] = useState(1);
  const soldOut = excursion.availability === "sold-out";
  const checkoutPath = `/checkout/${excursion.slug}/?travelers=${travelers}`;
  const related =
    relatedExcursions && relatedExcursions.length > 0
      ? relatedExcursions
      : travelerExcursions.filter((item) => item.slug !== excursion.slug).slice(0, 3);

  const goToCheckout = () => {
    if (!soldOut) window.location.assign(withBasePath(checkoutPath));
  };

  return (
    <TravelerShell>
      <div className={styles.pageContent}>
        <nav aria-label="Navegação estrutural" className={styles.breadcrumb}>
          <a href={withBasePath("/")}>Início</a>
          <span aria-hidden="true">/</span>
          <a href={withBasePath("/excursoes/")}>Excursões</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{excursion.destination}</span>
        </nav>

        <header className={styles.titleBlock}>
          <div>
            <div className={styles.titleBadges}>
              <Badge
                label={soldOut ? "Esgotada" : excursion.durationLabel}
                showDot={false}
                tone={soldOut ? "disabled" : "secondary"}
              />
              {excursion.seats > 0 && excursion.seats <= 5 ? (
                <Badge label={`Últimas ${excursion.seats} vagas`} tone="attention" />
              ) : null}
            </div>
            <h1>{excursion.title}</h1>
            <p>
              {excursion.destination} • Saída de {excursion.departureCity} • {excursion.date}
            </p>
          </div>
          <Rating
            count={excursion.participantCount}
            labelMode="score-count"
            size="md"
            value={excursion.rating}
          />
        </header>

        <Gallery
          className={styles.gallery}
          images={excursion.gallery.map((src, index) => ({
            alt: index === 0 ? `Paisagem principal de ${excursion.destination}` : "",
            src: withBasePath(src)
          }))}
          remainingCount={3}
        />

        <div className={styles.detailsLayout}>
          <div className={styles.mainContent}>
            <section aria-labelledby="about-title" className={styles.sectionCard}>
              <h2 id="about-title">Sobre esta aventura</h2>
              <p className={styles.description}>{excursion.description}</p>
              <dl className={styles.highlights}>
                <div><dt>Data</dt><dd>{excursion.date}</dd></div>
                <div><dt>Duração</dt><dd>{excursion.durationLabel}</dd></div>
                <div><dt>Embarque</dt><dd>{excursion.departureCity}</dd></div>
                <div><dt>Categoria</dt><dd>{excursion.category}</dd></div>
              </dl>
            </section>

            <section aria-labelledby="itinerary-title" className={styles.sectionCard}>
              <h2 id="itinerary-title">Roteiro</h2>
              <ol className={styles.itinerary}>
                {excursion.itinerary.map((item) => (
                  <li key={`${item.time}-${item.title}`}>
                    <time>{item.time}</time>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section aria-labelledby="boarding-title" className={styles.sectionCard}>
              <h2 id="boarding-title">Pontos de embarque</h2>
              <ul className={styles.boardingList}>
                {excursion.boardingPoints.map((point) => <li key={point}>{point}</li>)}
              </ul>
            </section>

            <section aria-labelledby="included-title" className={styles.sectionCard}>
              <h2 id="included-title">O que está incluído</h2>
              <div className={styles.inclusionGrid}>
                <div>
                  <h3>Incluído</h3>
                  <ul>{excursion.included.map((item) => <li key={item}>✓ {item}</li>)}</ul>
                </div>
                <div>
                  <h3>Não incluído</h3>
                  <ul>{excursion.notIncluded.map((item) => <li key={item}>— {item}</li>)}</ul>
                </div>
              </div>
            </section>

            <section aria-labelledby="organizer-title" className={styles.sectionCard}>
              <div className={styles.organizerCard}>
                <Avatar initials="RS" name={excursion.organizer} size="lg" verified />
                <div>
                  <span>Organizador verificado</span>
                  <h2 id="organizer-title">{excursion.organizer}</h2>
                  <p>Experiência acompanhada antes, durante e depois da viagem.</p>
                </div>
                <Button size="sm" variant="ghost">Ver perfil</Button>
              </div>
            </section>

            <section aria-labelledby="policy-title" className={styles.sectionCard}>
              <h2 id="policy-title">Cancelamento e suporte</h2>
              <p className={styles.description}>{excursion.cancellationPolicy}</p>
              <p className={styles.supporting}>Solicitações são feitas pela área “Minhas excursões”.</p>
            </section>
          </div>

          <aside aria-label="Resumo para reserva" className={styles.bookingCard}>
            <span>por pessoa</span>
            <strong>{formatTravelerCurrency(excursion.price)}</strong>
            <p>Taxas da plataforma incluídas no valor.</p>
            <Stepper
              disabled={soldOut}
              label="Ingressos"
              max={Math.max(1, Math.min(excursion.seats, 5))}
              min={1}
              onValueChange={setTravelers}
              size="md"
              value={travelers}
            />
            <div className={styles.bookingTotal}>
              <span>Total</span>
              <strong>{formatTravelerCurrency(excursion.price * travelers)}</strong>
            </div>
            <Button disabled={soldOut} onClick={goToCheckout} size="lg">
              {soldOut ? "Excursão esgotada" : "Continuar para reserva"}
            </Button>
            {!soldOut && excursion.seats <= 5 ? (
              <small>Restam apenas {excursion.seats} vagas nesta excursão.</small>
            ) : null}
          </aside>
        </div>

        <section aria-labelledby="related-title" className={styles.relatedSection}>
          <div className={styles.relatedHeader}>
            <div>
              <h2 id="related-title">Outras aventuras para você</h2>
              <p>Continue explorando destinos em grupo.</p>
            </div>
            <a href={withBasePath("/excursoes/")}>Ver todas</a>
          </div>
          <div className={styles.relatedGrid}>
            {related.map((item) => (
              <TripCard
                actionLabel="Ver detalhes"
                availability={item.availability}
                departure={`Saída: ${item.departureCity} · ${item.date}`}
                imageSrc={withBasePath(item.image)}
                key={item.slug}
                onReserve={() => window.location.assign(withBasePath(`/excursoes/${item.slug}/`))}
                organizer={`Organizado por ${item.organizer}`}
                participantCount={item.participantCount}
                price={formatTravelerCurrency(item.price)}
                rating={item.rating.toFixed(1)}
                seats={item.seats}
                title={item.title}
              />
            ))}
          </div>
        </section>
      </div>

      <div className={styles.mobileBooking}>
        <div><span>{travelers} ingresso{travelers > 1 ? "s" : ""}</span><strong>{formatTravelerCurrency(excursion.price * travelers)}</strong></div>
        <Button disabled={soldOut} onClick={goToCheckout}>{soldOut ? "Esgotada" : "Reservar"}</Button>
      </div>
    </TravelerShell>
  );
}
