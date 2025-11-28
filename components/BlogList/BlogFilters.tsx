"use client";

import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux";
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Checkbox } from '../ui/checkbox'
import { BlogFilters } from '@/types/blog.types';
import { RootState } from '@/store/store';
import { Industry, PrimaryTag } from '@/types/tag.types';


interface BlogFiltersProps {
  filters: BlogFilters;
  onFilterChange: (newFilters: Partial<BlogFilters>) => void;
  onReset: () => void;
}

export default function BlogFilter({ filters, onFilterChange, onReset }: BlogFiltersProps){
    const { primaryTags, industries } = useSelector( (state: RootState) => state.tags );
    const [localSearch, setLocalSearch] = useState<string>(filters.search || "");
    const [showIndustries, setShowIndustries] = useState<boolean>(false);

    useEffect(() => {
        const timer = setTimeout(() => {
        if (localSearch !== filters.search) {
            onFilterChange({ search: localSearch });
        }
        }, 500);

        return () => clearTimeout(timer);
    }, [localSearch]);

    useEffect(() => {
        setLocalSearch(filters.search || "");
    }, [filters.search]);

    const handleIndustryToggle = (industryId: string ) => {
        const current = filters.industry_ids || [];
        const updated = current.includes(industryId)
        ? current.filter((id) => id !== industryId)
        : [...current, industryId];

        onFilterChange({ industry_ids: updated.length > 0 ? updated : null });
    };

    const selectedIndustries = filters.industry_ids || [];
    const hasActiveFilters = filters.status || filters.primary_tag_id || selectedIndustries.length > 0 || filters.search;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex flex-wrap gap-3">
                {/* Search */}
                <div className="flex-1 min-w-[250px] relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Search blogs..."
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Status Filter */}
                <Select value={filters.status || 'all'} onValueChange={(v) => onFilterChange({ status: v === 'all' ? null : v })}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                </Select>

                {/* Primary Tag Filter */}
                <Select value={filters.primary_tag_id || 'all'} onValueChange={(v) => onFilterChange({ primary_tag_id: v === 'all' ? null : v })}>
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Primary Tag" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Tags</SelectItem>
                            {primaryTags.map((tag : PrimaryTag) => (
                                <SelectItem key={tag.id} value={String(tag.id)}>{tag.name}</SelectItem>
                            ))}
                    </SelectContent>
                </Select>

                {/* Industry Filter (Multi-select) */}
                <Popover open={showIndustries} onOpenChange={setShowIndustries}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-[160px] justify-between font-normal">
                        <span>Industries {selectedIndustries.length > 0 && `(${selectedIndustries.length})`}</span>
                        <SlidersHorizontal className="w-4 h-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-3">
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                            {industries.map((industry : Industry) => (
                                <div key={industry.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={industry.id}
                                        checked={selectedIndustries.includes(industry.id)}
                                        onCheckedChange={() => handleIndustryToggle(industry.id)}
                                    />
                                    <label htmlFor={industry.id} className="text-sm cursor-pointer flex-1">
                                        {industry.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>

                {/* Sort By */}
                <Select value={filters.sort_by || 'updated_at'} onValueChange={(v) => onFilterChange({ sort_by: v })}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="updated_at">Updated</SelectItem>
                        <SelectItem value="created_at">Created</SelectItem>
                        <SelectItem value="published_at">Published</SelectItem>
                        <SelectItem value="title">Title</SelectItem>
                        <SelectItem value="read_time_minutes">Read Time</SelectItem>
                    </SelectContent>
                </Select>

                {/* Sort Order */}
                <Select value={filters.sort_order || 'desc'} onValueChange={(v) => onFilterChange({ sort_order: v as "asc" | "desc" })}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="desc">Descending</SelectItem>
                        <SelectItem value="asc">Ascending</SelectItem>
                    </SelectContent>
                </Select>

                {/* Reset Button */}
                {hasActiveFilters && (
                    <Button variant="ghost" onClick={onReset} className="gap-2">
                        <X className="w-4 h-4" />
                        Reset
                    </Button>
                )}
            </div>
        </div>
    )
}
