import { useQuery } from "@tanstack/react-query";

export function useIsAuthenticated() {
  return useQuery({
    queryKey: ["is-authenticated"],
    queryFn: async () => {
      const res = await fetch("/api/is-authenticated");
      if (!res.ok) return { authenticated: false };
      return res.json();
    },
    staleTime: 60 * 1000,
  });
}
