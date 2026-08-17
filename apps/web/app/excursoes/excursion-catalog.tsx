"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Button,
  EmptyState,
  Pagination,
  Search,
  Select,
  TripCard
} from "@liete/ui-web";
import {
  formatTravelerCurrency,
  travelerExcursions,
  type TravelerExcursion
} from "../_traveler/traveler-data";
import { TravelerShell } from "../_traveler/traveler-shell";
import { withBasePath } from "../../lib/site-path";
import styles from "./excursion-catalog.module.css";

const PAGE_SIZE = 4;

type Filters = {
  availability: string;
  category: string;
  departure: string;
  destination: string;
  duration: string;
  period: string;
  price: string;
};

const initialFilters: Filters = {
  availability: "all",
  category: "all",
  departure: "all",
  destination: "all",
  duration: "all",
  period: "all",
  price: "all"
};

function daysUntil(dateIso: string) {
  const referenceDate = new Date();
  return Math.ceil(
    (new Date(`${dateIso}T12:00:00-03:00`).getTime() -
      referenceDate.getTime()) /
      86_400_000
  );
}

export function ExcursionCatalog({
  initialExcursions
}: {
  initialExcursions?: TravelerExcursion[];
}) {
  const [filters, setFilters] = useState(initialFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recommended");
  const [currentPage, setCurrentPage] = useState(1);
  const [catalogItems, setCatalogItems] = useState<TravelerExcursion[]>(
    initialExcursions && initialExcursions.length > 0 ? initialExcursions : travelerExcursions
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get("destination") ?? params.get("departure") ?? "");

    async function loadLiveExcursions() {
      try {
        const res = await fetch(withBasePath("/api/excursions"));
        if (res.ok) {
          const data = await res.json();
          if (data.excursions && Array.isArray(data.excursions) && data.excursions.length > 0) {
            const mapped = data.excursions.map((item: any) => ({
              availability: item.status === "sold_out" ? "sold-out" : (item.status || "available"),
              boardingPoints: Array.isArray(item.boarding_points) ? item.boarding_points : ["Embarque Central"],
              cancellationPolicy: item.cancellation_policy || "Cancelamento conforme regras da plataforma.",
              category: item.category || "natureza",
              date: item.date || "Em breve",
              dateIso: item.date_iso || "2026-10-24",
              departureCity: item.departure_city || "São Paulo",
              description: item.description || item.summary || "",
              destination: item.destination || "Destino",
              duration: item.duration_type || "bate-volta",
              durationLabel: item.duration_label || "Bate-volta",
              gallery: Array.isArray(item.gallery) && item.gallery.length ? item.gallery : [item.image_url || "/home/trip-sakura.jpeg"],
              image: item.image_url || "/home/trip-sakura.jpeg",
              included: Array.isArray(item.included) ? item.included : ["Transporte executivo", "Guia acompanhante"],
              itinerary: Array.isArray(item.itinerary) ? item.itinerary : [],
              notIncluded: Array.isArray(item.not_included) ? item.not_included : ["Alimentação"],
              organizer: "Organizador parceiro",
              participantCount: item.sold_seats || 24,
              price: Number(item.price_per_seat || 0),
              rating: Number(item.rating || 5.0),
              seats: Math.max(0, (item.capacity || 48) - (item.sold_seats || 0)),
              slug: item.slug,
              title: item.title,
              verified: true
            }));
            setCatalogItems(mapped);
          }
        }
      } catch {
        // Fallback
      }
    }

    if (!initialExcursions || initialExcursions.length === 0) {
      loadLiveExcursions();
    }
  }, [initialExcursions]);

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setQuery("");
    setCurrentPage(1);
  };

  const filteredExcursions = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
    const result = catalogItems.filter((excursion) => {
      const matchesQuery =
        !normalizedQuery ||
        [
          excursion.title,
          excursion.destination,
          excursion.departureCity,
          excursion.organizer
        ].some((value) =>
          value.toLocaleLowerCase("pt-BR").includes(normalizedQuery)
        );
      const matchesDestination =
        filters.destination === "all" ||
        excursion.destination.includes(filters.destination);
      const matchesDeparture =
        filters.departure === "all" ||
        excursion.departureCity === filters.departure;
      const matchesPeriod =
        filters.period === "all" ||
        daysUntil(excursion.dateIso) <= Number(filters.period);
      const matchesDuration =
        filters.duration === "all" || excursion.duration === filters.duration;
      const matchesCategory =
        filters.category === "all" || excursion.category === filters.category;
      const matchesAvailability =
        filters.availability === "all" ||
        excursion.availability === filters.availability;
      const matchesPrice =
        filters.price === "all" ||
        (filters.price === "under400" && excursion.price < 400) ||
        (filters.price === "400to800" &&
          excursion.price >= 400 &&
          excursion.price <= 800) ||
        (filters.price === "over800" && excursion.price > 800);

      return (
        matchesQuery &&
        matchesDestination &&
        matchesDeparture &&
        matchesPeriod &&
        matchesDuration &&
        matchesCategory &&
        matchesAvailability &&
        matchesPrice
      );
    });

    return [...result].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "date") return a.dateIso.localeCompare(b.dateIso);
      return Number(b.availability === "available") - Number(a.availability === "available");
    });
  }, [filters, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredExcursions.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const visibleExcursions = filteredExcursions.slice(
    pageStart,
    pageStart + PAGE_SIZE
  );
  const activeFilterCount =
    Object.values(filters).filter((value) => value !== "all").length +
    (query.trim() ? 1 : 0);

  return (
    <TravelerShell>
      <div className={styles.pageContent}>
        <header className={styles.hero}>
          <div>
            <span>Próxima parada</span>
            <h1>Encontre uma excursão para chamar de sua</h1>
            <p>
              Compare destinos, datas e pontos de embarque com organizadores
              verificados.
            </p>
          </div>
          <Search
            className={styles.search}
            inputLabel="Destino, excursão ou organizador"
            onSearch={setQuery}
            onValueChange={(value) => {
              setQuery(value);
              setCurrentPage(1);
            }}
            placeholder="Para onde você quer ir?"
            value={query}
          />
        </header>

        <div className={styles.mobileFilterBar}>
          <Button
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen((open) => !open)}
            variant="secondary"
          >
            Filtros{activeFilterCount ? ` (${activeFilterCount})` : ""}
          </Button>
          <span>{filteredExcursions.length} excursões</span>
        </div>

        <div className={styles.catalogLayout}>
          <aside
            aria-label="Filtros de excursões"
            className={styles.filters}
            data-open={filtersOpen || undefined}
          >
            <div className={styles.filterHeader}>
              <div>
                <h2>Filtrar excursões</h2>
                <p>Ajuste a busca ao seu ritmo.</p>
              </div>
              {activeFilterCount ? (
                <Button onClick={clearFilters} size="sm" variant="ghost">
                  Limpar
                </Button>
              ) : null}
            </div>

            <div className={styles.filterFields}>
              <Select
                hideHelperText
                label="Destino"
                onChange={(event) =>
                  updateFilter("destination", event.currentTarget.value)
                }
                value={filters.destination}
              >
                <option value="all">Todos os destinos</option>
                <option value="Holambra">Holambra</option>
                <option value="Capitólio">Capitólio</option>
                <option value="Arraial do Cabo">Arraial do Cabo</option>
                <option value="Barreirinhas">Lençóis Maranhenses</option>
                <option value="Foz do Iguaçu">Foz do Iguaçu</option>
              </Select>
              <Select
                hideHelperText
                label="Cidade de embarque"
                onChange={(event) =>
                  updateFilter("departure", event.currentTarget.value)
                }
                value={filters.departure}
              >
                <option value="all">Todas as cidades</option>
                <option value="São Paulo">São Paulo</option>
                <option value="Belo Horizonte">Belo Horizonte</option>
                <option value="Rio de Janeiro">Rio de Janeiro</option>
                <option value="São Luís">São Luís</option>
              </Select>
              <Select
                hideHelperText
                label="Período"
                onChange={(event) =>
                  updateFilter("period", event.currentTarget.value)
                }
                value={filters.period}
              >
                <option value="all">Qualquer período</option>
                <option value="90">Próximos 90 dias</option>
                <option value="120">Próximos 120 dias</option>
                <option value="180">Próximos 6 meses</option>
              </Select>
              <Select
                hideHelperText
                label="Faixa de preço"
                onChange={(event) =>
                  updateFilter("price", event.currentTarget.value)
                }
                value={filters.price}
              >
                <option value="all">Qualquer valor</option>
                <option value="under400">Até R$ 400</option>
                <option value="400to800">R$ 400 a R$ 800</option>
                <option value="over800">Acima de R$ 800</option>
              </Select>
              <Select
                hideHelperText
                label="Duração"
                onChange={(event) =>
                  updateFilter("duration", event.currentTarget.value)
                }
                value={filters.duration}
              >
                <option value="all">Todas as durações</option>
                <option value="bate-volta">Bate-volta</option>
                <option value="fim-de-semana">Fim de semana</option>
                <option value="4dias">4 dias ou mais</option>
              </Select>
              <Select
                hideHelperText
                label="Categoria"
                onChange={(event) =>
                  updateFilter("category", event.currentTarget.value)
                }
                value={filters.category}
              >
                <option value="all">Todas as categorias</option>
                <option value="aventura">Aventura</option>
                <option value="cultural">Cultural</option>
                <option value="natureza">Natureza</option>
                <option value="praia">Praia</option>
              </Select>
              <Select
                hideHelperText
                label="Disponibilidade"
                onChange={(event) =>
                  updateFilter("availability", event.currentTarget.value)
                }
                value={filters.availability}
              >
                <option value="all">Todas</option>
                <option value="available">Com vagas</option>
                <option value="sold-out">Esgotadas</option>
              </Select>
            </div>

            <Button
              className={styles.applyFilters}
              onClick={() => setFiltersOpen(false)}
            >
              Ver {filteredExcursions.length} excursões
            </Button>
          </aside>

          <section aria-labelledby="catalog-results-title" className={styles.results}>
            <div className={styles.resultsHeader}>
              <div>
                <h2 id="catalog-results-title">Excursões encontradas</h2>
                <p>{filteredExcursions.length} opções para explorar</p>
              </div>
              <Select
                className={styles.sort}
                hideHelperText
                label="Ordenar por"
                onChange={(event) => setSort(event.currentTarget.value)}
                value={sort}
              >
                <option value="recommended">Recomendadas</option>
                <option value="date">Data mais próxima</option>
                <option value="price-asc">Menor preço</option>
                <option value="rating">Melhor avaliação</option>
              </Select>
            </div>

            {visibleExcursions.length ? (
              <>
                <div className={styles.tripGrid}>
                  {visibleExcursions.map((excursion) => (
                    <TripCard
                      actionLabel="Ver detalhes"
                      availability={excursion.availability}
                      departure={`Saída: ${excursion.departureCity} · ${excursion.date}`}
                      imageAlt={`Paisagem de ${excursion.destination}`}
                      imageSrc={withBasePath(excursion.image)}
                      key={excursion.slug}
                      onReserve={() =>
                        window.location.assign(
                          withBasePath(`/excursoes/${excursion.slug}/`)
                        )
                      }
                      organizer={`Organizado por ${excursion.organizer}`}
                      participantCount={excursion.participantCount}
                      price={formatTravelerCurrency(excursion.price)}
                      rating={excursion.rating.toFixed(1)}
                      seats={excursion.seats}
                      title={excursion.title}
                      verified={excursion.verified}
                    />
                  ))}
                </div>
                <Pagination
                  className={styles.pagination}
                  currentPage={safePage}
                  onPageChange={setCurrentPage}
                  resultsLabel={`${pageStart + 1}–${Math.min(pageStart + PAGE_SIZE, filteredExcursions.length)} de ${filteredExcursions.length} excursões`}
                  totalPages={totalPages}
                />
              </>
            ) : (
              <EmptyState
                actionLabel="Limpar filtros"
                className={styles.emptyState}
                context="search"
                description="Tente ampliar o período, a faixa de preço ou escolher outro destino."
                onAction={clearFilters}
                title="Nenhuma excursão encontrada"
              />
            )}
          </section>
        </div>
      </div>
    </TravelerShell>
  );
}
