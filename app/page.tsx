"use client"

import Image from "next/image";
import Link from "next/link";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { PlusIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import BlogList from "@/components/BlogList/BlogList";
import { logout } from "@/lib/utils";
import BlogFilter from "@/components/BlogList/BlogFilters";
import { BlogFilters } from "@/types/blog.types";


const INITIAL_FILTERS: BlogFilters = {
  status: null,
  primary_tag_id: null,
  industry_ids: null,
  search: "",
  sort_by: "updated_at",
  sort_order: "desc",
  page: 1,
  page_size: 9,
};


export default function Home() {
  const [page, setPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<BlogFilters>(INITIAL_FILTERS);

  const observerTarget: RefObject<HTMLDivElement | null> = useRef(null);

  const limit = 9;
  const hasMore = page * limit < totalCount;

  const handleFilterChange = useCallback(
    (newFilters: Partial<BlogFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
      setPage(1);
    },
    []
  );

  const handleReset = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setPage(1);
  }, []);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) observer.observe(currentTarget);

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [loadMore]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black">
            Wokelo Blog Builder
          </h1>

          <div className='flex items-center gap-2'>
            <Button asChild className="bg-black text-white hover:bg-gray-800">
              <Link href="/editor/new" className="flex gap-1 items-center">
                <PlusIcon />
                Create Blog
              </Link>
            </Button>

            <Button variant="destructive" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <BlogFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />

        <BlogList
          page={page} 
          limit={limit}
          filters={filters}
          setTotalCount={setTotalCount}
          setLoading={setLoading}
          setInitialLoading={setInitialLoading}
        />

        {loading && !initialLoading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <Skeleton className="w-full h-48" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {hasMore && <div ref={observerTarget} className="h-4" />}
      </main>
    </div>
  );
}
