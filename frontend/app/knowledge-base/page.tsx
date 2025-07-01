'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Search, BookOpen, Filter, Lightbulb, ExternalLink } from 'lucide-react';
import { ContentType, RAGResponse } from '@/lib/vector-db/types';

interface SearchFilters {
  contentType: ContentType[];
  subject: string[];
  gradeLevel: string[];
  difficultyLevel: ('beginner' | 'intermediate' | 'advanced')[];
  disabilityTypes: string[];
}

interface SearchResult {
  answer: string;
  sources: Array<{
    title: string;
    contentType: ContentType;
    relevanceScore: number;
    excerpt: string;
  }>;
  confidence: number;
  followUpQuestions?: string[];
  searchTime?: number;
}

export default function KnowledgeBasePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    contentType: [],
    subject: [],
    gradeLevel: [],
    difficultyLevel: [],
    disabilityTypes: [],
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Available filter options
  const contentTypes = Object.values(ContentType);
  const subjects = ['Mathematics', 'Reading', 'Science', 'Social Studies', 'Art', 'Music', 'Physical Education'];
  const gradeLevels = ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  const difficultyLevels = ['beginner', 'intermediate', 'advanced'] as const;
  const disabilityTypes = ['ADHD', 'Dyslexia', 'Autism', 'Processing Disorders', 'Learning Disabilities'];

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch('/api/knowledge-base/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          filters: filters,
          maxResults: 10,
          includeMetadata: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setSearchResults(data.data);
      
      // Add to search history
      if (!searchHistory.includes(query.trim())) {
        setSearchHistory(prev => [query.trim(), ...prev.slice(0, 4)]);
      }
    } catch (error) {
      console.error('Search error:', error);
      // Handle error state
    } finally {
      setIsSearching(false);
    }
  };

  const handleFollowUpQuestion = (question: string) => {
    setQuery(question);
    handleSearch();
  };

  const clearFilters = () => {
    setFilters({
      contentType: [],
      subject: [],
      gradeLevel: [],
      difficultyLevel: [],
      disabilityTypes: [],
    });
  };

  const updateFilter = <K extends keyof SearchFilters>(
    key: K,
    value: string,
    checked: boolean
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: checked
        ? [...prev[key], value as any]
        : prev[key].filter(item => item !== value)
    }));
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Knowledge Base
        </h1>
        <p className="text-gray-600">
          Search our comprehensive educational resources tailored for neurodivergent learners
        </p>
      </div>

      {/* Search Interface */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Main Search Bar */}
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Ask a question or search for educational resources..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="text-lg"
                />
              </div>
              <Button 
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                size="icon"
              >
                <Filter className="h-4 w-4" />
              </Button>
              <Button 
                onClick={handleSearch} 
                disabled={isSearching || !query.trim()}
                className="px-6"
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Search
              </Button>
            </div>

            {/* Search History */}
            {searchHistory.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-500">Recent:</span>
                {searchHistory.map((historyQuery, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuery(historyQuery)}
                    className="text-xs"
                  >
                    {historyQuery}
                  </Button>
                ))}
              </div>
            )}

            {/* Filters */}
            {showFilters && (
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Search Filters</h3>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                </div>
                
                <Tabs defaultValue="content" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="subject">Subject</TabsTrigger>
                    <TabsTrigger value="grade">Grade</TabsTrigger>
                    <TabsTrigger value="difficulty">Difficulty</TabsTrigger>
                    <TabsTrigger value="disability">Disability</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="content" className="space-y-2">
                    {contentTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`content-${type}`}
                          checked={filters.contentType.includes(type)}
                          onCheckedChange={(checked) => 
                            updateFilter('contentType', type, checked as boolean)
                          }
                        />
                        <label htmlFor={`content-${type}`} className="text-sm capitalize">
                          {type.replace('_', ' ')}
                        </label>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="subject" className="space-y-2">
                    {subjects.map((subject) => (
                      <div key={subject} className="flex items-center space-x-2">
                        <Checkbox
                          id={`subject-${subject}`}
                          checked={filters.subject.includes(subject)}
                          onCheckedChange={(checked) => 
                            updateFilter('subject', subject, checked as boolean)
                          }
                        />
                        <label htmlFor={`subject-${subject}`} className="text-sm">
                          {subject}
                        </label>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="grade" className="space-y-2">
                    <div className="grid grid-cols-6 gap-2">
                      {gradeLevels.map((grade) => (
                        <div key={grade} className="flex items-center space-x-2">
                          <Checkbox
                            id={`grade-${grade}`}
                            checked={filters.gradeLevel.includes(grade)}
                            onCheckedChange={(checked) => 
                              updateFilter('gradeLevel', grade, checked as boolean)
                            }
                          />
                          <label htmlFor={`grade-${grade}`} className="text-sm">
                            {grade}
                          </label>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="difficulty" className="space-y-2">
                    {difficultyLevels.map((level) => (
                      <div key={level} className="flex items-center space-x-2">
                        <Checkbox
                          id={`difficulty-${level}`}
                          checked={filters.difficultyLevel.includes(level)}
                          onCheckedChange={(checked) => 
                            updateFilter('difficultyLevel', level, checked as boolean)
                          }
                        />
                        <label htmlFor={`difficulty-${level}`} className="text-sm capitalize">
                          {level}
                        </label>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="disability" className="space-y-2">
                    {disabilityTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`disability-${type}`}
                          checked={filters.disabilityTypes.includes(type)}
                          onCheckedChange={(checked) => 
                            updateFilter('disabilityTypes', type, checked as boolean)
                          }
                        />
                        <label htmlFor={`disability-${type}`} className="text-sm">
                          {type}
                        </label>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults && (
        <div className="space-y-6">
          {/* AI Answer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                AI Assistant Response
                <Badge variant="secondary" className="ml-auto">
                  {searchResults.confidence}% confidence
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-700">
                  {searchResults.answer}
                </div>
              </div>
              
              {searchResults.searchTime && (
                <div className="mt-4 text-sm text-gray-500">
                  Search completed in {searchResults.searchTime}ms
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sources */}
          {searchResults.sources.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {searchResults.sources.map((source, index) => (
                    <div key={index} className="border-l-4 border-blue-200 pl-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {source.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {source.excerpt}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {source.contentType.replace('_', ' ')}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              Relevance: {Math.round(source.relevanceScore * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Follow-up Questions */}
          {searchResults.followUpQuestions && searchResults.followUpQuestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Suggested Follow-up Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {searchResults.followUpQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="justify-start h-auto p-3 text-left"
                      onClick={() => handleFollowUpQuestion(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Quick Start Guide */}
      {!searchResults && (
        <Card>
          <CardHeader>
            <CardTitle>How to Use the Knowledge Base</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Example Questions:</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• "How can I help a student with ADHD focus during math class?"</li>
                  <li>• "What are effective reading strategies for dyslexic learners?"</li>
                  <li>• "Accommodations for autism spectrum students in science"</li>
                  <li>• "Visual learning techniques for elementary mathematics"</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Search Tips:</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Use specific terms related to learning disabilities</li>
                  <li>• Include grade level or subject for targeted results</li>
                  <li>• Ask questions in natural language</li>
                  <li>• Use filters to narrow down content types</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 