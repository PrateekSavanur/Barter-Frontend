"use client";

import Hero from "./components/Hero";
import Items from "./components/Items";
import { useAuth } from "./context/auth-context";

export default function Home() {
  const { isAuthenticated } = useAuth();
  return <>{!isAuthenticated ? <Hero /> : <Items />}</>;
}
