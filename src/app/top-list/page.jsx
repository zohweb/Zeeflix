// src/app/top-list/page.jsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import Navbar1 from "@/components/ui/nav-bar";
import AuthModal from "@/components/ui/auth-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const OMDB_API_KEY = "71ba95f"; //  API 

const CATEGORIES = {
  bollywood: [
    { id: 1001, title: "3 Idiots", year: 2009, rating: 8.4 },
    { id: 1002, title: "Dangal", year: 2016, rating: 8.3 },
    { id: 1003, title: "Gully Boy", year: 2019, rating: 7.9 },
    { id: 1004, title: "Lagaan", year: 2001, rating: 8.1 },
    { id: 1005, title: "Queen", year: 2013, rating: 8.1 },
  ],
  hollywood: [
    { id: 2001, title: "Inception", year: 2010, rating: 8.8 },
    { id: 2002, title: "The Dark Knight", year: 2008, rating: 9.0 },
    { id: 2003, title: "Interstellar", year: 2014, rating: 8.6 },
    { id: 2004, title: "The Matrix", year: 1999, rating: 8.7 },
    { id: 2005, title: "Fight Club", year: 1999, rating: 8.8 },
  ],
  classics: [
    { id: 3001, title: "Casablanca", year: 1942, rating: 8.5 },
    { id: 3002, title: "Gone with the Wind", year: 1939, rating: 8.2 },
    { id: 3003, title: "12 Angry Men", year: 1957, rating: 9.0 },
  ],
  tollywood: [
    { id: 4001, title: "Baahubali: The Beginning", year: 2015, rating: 8.0 },
    { id: 4002, title: "Baahubali 2: The Conclusion", year: 2017, rating: 8.2 },
  ],
  anime: [
    { id: 5001, title: "Spirited Away", year: 2001, rating: 8.6 },
    { id: 5002, title: "Your Name", year: 2016, rating: 8.4 },
  ],
  other: [
    { id: 6001, title: "Parasite", year: 2019, rating: 8.6 },
    { id: 6002, title: "City of God", year: 2002, rating: 8.6 },
  ],
};

export default function TopListPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState(CATEGORIES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  <div className="flex justify-end p-4">
        <AuthModal />
      </div>
  // Helper with retry for OMDb (handles slow API / missing poster)
  async function safeFetch(url, retries = 2) {
    for (let i = 0; i <= retries; i++) {
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (data && data.Response === "True") return data;
      } catch {}
      await new Promise((r) => setTimeout(r, 300));
    }
    return null;
  }

  // Fetch movie data (poster + imdb)
  async function fetchMovieData(movie) {
    const url = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(
      movie.title
    )}&y=${movie.year}`;

    const data = await safeFetch(url);
    if (data) {
      return {
        ...movie,
        Poster: data.Poster !== "N/A" ? data.Poster : null,
        imdbID: data.imdbID || null,
      };
    }

    // fallback: try without year
    const fallback = await safeFetch(
      `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(movie.title)}`
    );
    if (fallback) {
      return {
        ...movie,
        Poster: fallback.Poster !== "N/A" ? fallback.Poster : null,
        imdbID: fallback.imdbID || null,
      };
    }

    return { ...movie, Poster: null, imdbID: null };
  }

  // ✅ Faster poster loading (parallelized)
  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const updated = await Promise.all(
          Object.entries(CATEGORIES).map(async ([key, list]) => {
            const enriched = await Promise.all(list.map(fetchMovieData));
            return [key, enriched];
          })
        );
        if (active) setCategories(Object.fromEntries(updated));
      } catch (err) {
        console.error(err);
        if (active) setError("⚠️ Failed to fetch some posters. Try again later.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const allMovies = useMemo(() => Object.values(categories).flat(), [categories]);

  const filteredMovies = (catKey) => {
    const base = catKey === "all" ? allMovies : categories[catKey];
    if (!search) return base;
    const q = search.toLowerCase();
    return base.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.year.toString().includes(q) ||
        m.rating.toString().includes(q)
    );
  };

  const categoriesOrder = ["all", "bollywood", "hollywood", "classics", "tollywood", "anime", "other"];
  const categoryLabels = {
    all: "All",
    bollywood: "Bollywood",
    hollywood: "Hollywood",
    classics: "Classics",
    tollywood: "Tollywood",
    anime: "Anime",
    other: "Other",
  };

  return (
    <>
      <Navbar1
        domainName="Zeeflix"
        navLinks={[
          { name: "Home", href: "/home" },
          { name: "Top List", href: "/top-list" },
          { name: "Popular", href: "/popular" },
        ]}
        authLinks={{ login: { text: "Login", href: "/login" } }}
      />

      <main className="pt-28 min-h-screen bg-gradient-to-b from-teal-900 via-indigo-950 to-black text-white">
        <section className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-indigo-300">
                Top Lists
              </h1>
              <p className="mt-2 text-lg text-teal-100">
                Browse curated movie collections by category.
              </p>
              {loading && <p className="text-sm text-neutral-300">Loading posters…</p>}
              {error && <p className="text-sm text-red-400">{error}</p>}
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search movies..."
                className="w-full md:w-64"
              />
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categoriesOrder.map((k) => (
                    <SelectItem key={k} value={k}>
                      {categoryLabels[k]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={() => { setSearch(""); setFilter("all"); }}>
                Reset
              </Button>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-16 space-y-10">
          {(filter === "all" ? categoriesOrder.filter((k) => k !== "all") : [filter]).map((cat) => {
            const items = filteredMovies(cat);
            return (
              <div key={cat}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">{categoryLabels[cat]}</h2>
                  <Badge>{items.length}</Badge>
                </div>

                {items.length === 0 ? (
                  <p className="text-neutral-400">No movies found.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((m, i) => (
                      <Card
                        key={m.imdbID ?? m.id}
                        className="overflow-hidden bg-white/5 border-white/10 backdrop-blur-md hover:scale-[1.02] transition-transform"
                        style={{ transitionDelay: `${i * 40}ms` }}
                      >
                        {m.Poster ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={m.Poster}
                            alt={m.title}
                            className="w-full h-52 object-cover"
                          />
                        ) : (
                          <div className="w-full h-52 bg-neutral-800 flex items-center justify-center text-neutral-400">
                            <div>
                              <div className="font-semibold text-white">{m.title}</div>
                              <div className="text-sm">{m.year}</div>
                            </div>
                          </div>
                        )}

                        <CardContent className="p-4 space-y-2">
                          <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-lg text-white truncate">{m.title}</h3>
                            <span className="text-sm text-neutral-400">{m.year}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-neutral-300">⭐ {m.rating}</div>
                            {m.imdbID && (
                              <a
                                href={`https://www.imdb.com/title/${m.imdbID}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-indigo-300 hover:text-indigo-200"
                              >
                                IMDb
                              </a>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      </main>
    </>
  );
}
