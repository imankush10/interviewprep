import { useQuery } from "@tanstack/react-query";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const res = await fetch("/api/current-user");
      if (!res.ok) return null;
      return res.json();
    },
    staleTime: 1000 * 60, // 1 min
  });
}
