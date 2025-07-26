"use client";

import { useState, useEffect, useRef } from "react";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./input";
import { Badge } from "./badge";

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

interface TagSelectProps {
  value: Tag[];
  onChange: (tags: Tag[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  maxTags?: number;
}

export function TagSelect({
  value = [],
  onChange,
  placeholder = "Search and select tags...",
  className,
  disabled = false,
  maxTags = 10,
}: TagSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch available tags when dropdown opens
  useEffect(() => {
    if (isOpen && !disabled) {
      fetchTags();
    }
  }, [isOpen, disabled]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchTags = async () => {
    try {
      setIsLoading(true);
      setError("");

      const params = new URLSearchParams();
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      params.append("limit", "20");

      const response = await fetch(`/api/tags?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch tags");
      }

      const data = await response.json();
      setAvailableTags(data.data || []);
    } catch (err) {
      setError("Failed to load tags");
      console.error("Error fetching tags:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    // Debounce search
    const timeoutId = setTimeout(() => {
      if (isOpen) {
        fetchTags();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleTagSelect = (tag: Tag) => {
    if (value.length >= maxTags) {
      return;
    }

    const isAlreadySelected = value.some(
      (selectedTag) => selectedTag.id === tag.id
    );
    if (!isAlreadySelected) {
      onChange([...value, tag]);
    }
    setSearchQuery("");
    setIsOpen(false);
  };

  const handleTagRemove = (tagId: string) => {
    onChange(value.filter((tag) => tag.id !== tagId));
  };

  const handleCreateTag = async () => {
    if (!searchQuery.trim() || value.length >= maxTags) {
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response = await fetch("/api/tags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: searchQuery.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create tag");
      }

      const data = await response.json();
      const newTag = data.data;

      onChange([...value, newTag]);
      setSearchQuery("");
      setIsOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create tag");
      console.error("Error creating tag:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAvailableTags = availableTags.filter(
    (tag) => !value.some((selectedTag) => selectedTag.id === tag.id)
  );

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Selected tags display */}
      <div className="min-h-[40px] border border-input bg-background rounded-md p-2 flex flex-wrap gap-1">
        {value.map((tag) => (
          <Badge
            key={tag.id}
            variant="secondary"
            className="flex items-center gap-1"
          >
            <span className="text-xs">{tag.name}</span>
            <button
              type="button"
              onClick={() => handleTagRemove(tag.id)}
              className="ml-1 hover:bg-black/10 rounded-full p-0.5"
              disabled={disabled}
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}

        {value.length < maxTags && (
          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
              setTimeout(() => inputRef.current?.focus(), 0);
            }}
            disabled={disabled}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Plus className="w-4 h-4" />
            {placeholder}
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-input rounded-md shadow-lg z-50 max-h-60 overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-input">
            <Input
              ref={inputRef}
              placeholder="Search tags..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          {/* Tags list */}
          <div className="max-h-48 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Loading tags...
              </div>
            ) : error ? (
              <div className="p-4 text-center text-sm text-destructive">
                {error}
              </div>
            ) : filteredAvailableTags.length === 0 && searchQuery ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                <p>No tags found</p>
                <button
                  type="button"
                  onClick={handleCreateTag}
                  className="mt-2 text-primary hover:underline"
                >
                  Create &quot;{searchQuery}&quot;
                </button>
              </div>
            ) : filteredAvailableTags.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No tags available
              </div>
            ) : (
              <div className="py-1">
                {filteredAvailableTags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagSelect(tag)}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground flex items-center gap-2"
                  >
                    <span>{tag.name}</span>
                    {tag.description && (
                      <span className="text-muted-foreground text-xs">
                        - {tag.description}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Create new tag option */}
          {searchQuery &&
            !isLoading &&
            !error &&
            filteredAvailableTags.length > 0 && (
              <div className="border-t border-input p-2">
                <button
                  type="button"
                  onClick={handleCreateTag}
                  className="w-full px-3 py-2 text-left text-sm text-primary hover:bg-accent hover:text-accent-foreground flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create &quot;{searchQuery}&quot;
                </button>
              </div>
            )}
        </div>
      )}

      {/* Max tags warning */}
      {value.length >= maxTags && (
        <p className="text-xs text-muted-foreground mt-1">
          Maximum {maxTags} tags allowed
        </p>
      )}
    </div>
  );
}
