"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60 * 1000 }, // 1 minute
        },
      })
  );
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["is-authenticated"],
      queryFn: async () => {
        const res = await fetch("/api/is-authenticated");
        if (!res.ok) return { authenticated: false };
        return await res.json();
      },
    });
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
