import { NextRequest, NextResponse } from 'next/server';

// Mock modules data
const mockModules = [
  {
    id: 'module-1',
    title: 'Introduction to Reading',
    description: 'Learn the basics of reading comprehension with interactive exercises designed for neurodivergent learners.',
    subject: 'Reading',
    targetAudience: 'elementary',
    difficultyLevel: 'beginner',
    estimatedTime: 30,
    isActive: true,
    order: 1,
    isAdhdFriendly: true,
    isDyslexiaFriendly: true,
    isAutismFriendly: true,
    tags: ['reading', 'comprehension', 'interactive', 'beginner'],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'module-2',
    title: 'Basic Math Concepts',
    description: 'Learn fundamental math concepts with visual aids and hands-on activities.',
    subject: 'Mathematics',
    targetAudience: 'elementary',
    difficultyLevel: 'beginner',
    estimatedTime: 45,
    isActive: true,
    order: 2,
    isAdhdFriendly: true,
    isDyslexiaFriendly: false,
    isAutismFriendly: true,
    tags: ['math', 'counting', 'visual', 'hands-on'],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'module-3',
    title: 'Advanced Reading Comprehension',
    description: 'Develop deeper reading comprehension skills with complex texts and analysis.',
    subject: 'Reading',
    targetAudience: 'elementary',
    difficultyLevel: 'intermediate',
    estimatedTime: 60,
    isActive: true,
    order: 3,
    isAdhdFriendly: false,
    isDyslexiaFriendly: true,
    isAutismFriendly: false,
    tags: ['reading', 'comprehension', 'advanced', 'analysis'],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'module-4',
    title: 'Visual Math Problem Solving',
    description: 'Solve math problems using visual strategies and real-world applications.',
    subject: 'Mathematics',
    targetAudience: 'elementary',
    difficultyLevel: 'intermediate',
    estimatedTime: 50,
    isActive: true,
    order: 4,
    isAdhdFriendly: true,
    isDyslexiaFriendly: true,
    isAutismFriendly: true,
    tags: ['math', 'visual', 'problem-solving', 'real-world'],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'module-5',
    title: 'Science Exploration',
    description: 'Explore basic science concepts through experiments and observation.',
    subject: 'Science',
    targetAudience: 'elementary',
    difficultyLevel: 'beginner',
    estimatedTime: 40,
    isActive: true,
    order: 5,
    isAdhdFriendly: true,
    isDyslexiaFriendly: true,
    isAutismFriendly: true,
    tags: ['science', 'experiments', 'observation', 'hands-on'],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  }
];

// GET /api/learning/modules - Get all learning modules with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const subject = searchParams.get('subject');
    const targetAudience = searchParams.get('targetAudience');
    const difficultyLevel = searchParams.get('difficultyLevel');
    const isActive = searchParams.get('isActive');
    const learningDisabilities = searchParams.get('learningDisabilities');
    const tags = searchParams.get('tags');
    
    let filteredModules = [...mockModules];
    
    // Apply filters
    if (subject) {
      filteredModules = filteredModules.filter(module => 
        module.subject.toLowerCase().includes(subject.toLowerCase())
      );
    }
    
    if (targetAudience) {
      filteredModules = filteredModules.filter(module => 
        module.targetAudience === targetAudience
      );
    }
    
    if (difficultyLevel) {
      filteredModules = filteredModules.filter(module => 
        module.difficultyLevel === difficultyLevel
      );
    }
    
    if (isActive !== null && isActive !== undefined) {
      const activeFilter = isActive === 'true';
      filteredModules = filteredModules.filter(module => 
        module.isActive === activeFilter
      );
    }
    
    // Filter by learning disabilities
    if (learningDisabilities) {
      const disabilities = learningDisabilities.split(',').map(d => d.trim().toLowerCase());
      filteredModules = filteredModules.filter(module => {
        return disabilities.every(disability => {
          switch (disability) {
            case 'adhd':
              return module.isAdhdFriendly;
            case 'dyslexia':
              return module.isDyslexiaFriendly;
            case 'autism':
              return module.isAutismFriendly;
            default:
              return true;
          }
        });
      });
    }
    
    // Filter by tags
    if (tags) {
      const tagList = tags.split(',').map(tag => tag.trim().toLowerCase());
      filteredModules = filteredModules.filter(module =>
        tagList.some(tag => 
          module.tags.some(moduleTag => moduleTag.toLowerCase().includes(tag))
        )
      );
    }
    
    // Sort by order
    filteredModules.sort((a, b) => a.order - b.order);
    
    return NextResponse.json({
      success: true,
      data: filteredModules,
      total: filteredModules.length,
      filters: {
        subject,
        targetAudience,
        difficultyLevel,
        isActive,
        learningDisabilities,
        tags
      }
    });

  } catch (error) {
    console.error('Error fetching learning modules:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 