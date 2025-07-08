'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  url: string;
}

export default function KnowledgeBasePage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await fetch(`/api/knowledge-base/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch search results.');
      }
      const data = await response.json();
      setResults(data.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Knowledge Base</h1>
        <p className="text-muted-foreground">
          Search for articles, lessons, and resources.
        </p>
      </header>

      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="search"
          placeholder="Search the knowledge base..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow"
        />
        <Button type="submit" disabled={isLoading}>
          <Search className="h-4 w-4 mr-2" />
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </form>

      <div className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}
        
        {results.length > 0 ? (
          results.map((result) => (
            <Card key={result.id}>
              <CardHeader>
                <CardTitle>
                  <a href={result.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {result.title}
                  </a>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{result.snippet}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          !isLoading && <p>No results found. Try a different search term.</p>
        )}

        {isLoading && <p>Loading search results...</p>}
      </div>
    </div>
  );
} 