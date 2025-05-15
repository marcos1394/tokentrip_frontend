// src/app/page.tsx
import React from "react";
import Hero from "../app/components/Hero";
import TravelSearch from "../app/components/TravelSearch";
import WhyTokenTrip from "../app/components/WhyTokenTrip";
import FeaturedTrips from "../app/components/FeaturedTrip";
import HowItWorks from "../app/components/HowItWorks";
import Footer from "../app/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Hero />
      <TravelSearch />
      <WhyTokenTrip />
      <FeaturedTrips />
      <HowItWorks />
      <Footer />
    </main>
  );
}