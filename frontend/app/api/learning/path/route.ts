import { NextRequest, NextResponse } from 'next/server';

interface LearningPathRecommendation {
  id: string;
  title: string;
  description: string;
  modules: string[];
  estimatedTime: number;
  reasoning: string;
}

interface UserProfile {
  id: string;
  learningDisabilities: string[];
  learningStyle: string;
  difficultyLevel: string;
  preferredSubjects: string[];
  accommodations: string[];
}

// Mock user profiles and learning paths
const mockUserProfiles: { [key: string]: UserProfile } = {
  'mock-user-id': {
    id: 'mock-user-id',
    learningDisabilities: ['ADHD', 'Dyslexia'],
    learningStyle: 'Visual',
    difficultyLevel: 'beginner',
    preferredSubjects: ['Reading', 'Mathematics'],
    accommodations: ['large_text', 'high_contrast', 'reduced_motion']
  }
};

const availableModules = [
  {
    id: 'module-1',
    title: 'Introduction to Reading',
    subject: 'Reading',
    difficultyLevel: 'beginner',
    estimatedTime: 30,
    prerequisites: [],
    isAdhdFriendly: true,
    isDyslexiaFriendly: true,
  },
  {
    id: 'module-2',
    title: 'Basic Math Concepts',
    subject: 'Mathematics',
    difficultyLevel: 'beginner',
    estimatedTime: 45,
    prerequisites: [],
    isAdhdFriendly: true,
    isDyslexiaFriendly: false,
  },
  {
    id: 'module-3',
    title: 'Advanced Reading Comprehension',
    subject: 'Reading',
    difficultyLevel: 'intermediate',
    estimatedTime: 60,
    prerequisites: ['module-1'],
    isAdhdFriendly: false,
    isDyslexiaFriendly: true,
  },
  {
    id: 'module-4',
    title: 'Visual Math Problem Solving',
    subject: 'Mathematics',
    difficultyLevel: 'intermediate',
    estimatedTime: 50,
    prerequisites: ['module-2'],
    isAdhdFriendly: true,
    isDyslexiaFriendly: true,
  }
];

function generateLearningPath(userProfile: UserProfile, completedModules: string[] = []): LearningPathRecommendation {
  const { learningDisabilities, learningStyle, difficultyLevel, preferredSubjects, accommodations } = userProfile;
  
  // Filter modules based on user profile
  let recommendedModules = availableModules.filter(module => {
    // Check if module matches difficulty level or is one level above
    const levelMatch = module.difficultyLevel === difficultyLevel || 
                      (difficultyLevel === 'beginner' && module.difficultyLevel === 'intermediate');
    
    // Check if module is suitable for user's learning disabilities
    const disabilityMatch = learningDisabilities.every(disability => {
      if (disability === 'ADHD') return module.isAdhdFriendly;
      if (disability === 'Dyslexia') return module.isDyslexiaFriendly;
      return true;
    });
    
    // Check if module subject is preferred
    const subjectMatch = preferredSubjects.includes(module.subject);
    
    // Check if prerequisites are met
    const prerequisitesMet = module.prerequisites.every(prereq => 
      completedModules.includes(prereq)
    );
    
    // Check if module is not already completed
    const notCompleted = !completedModules.includes(module.id);
    
    return levelMatch && disabilityMatch && subjectMatch && prerequisitesMet && notCompleted;
  });

  // Sort by preference (ADHD-friendly and dyslexia-friendly modules first)
  recommendedModules.sort((a, b) => {
    const aScore = (a.isAdhdFriendly ? 1 : 0) + (a.isDyslexiaFriendly ? 1 : 0);
    const bScore = (b.isAdhdFriendly ? 1 : 0) + (b.isDyslexiaFriendly ? 1 : 0);
    return bScore - aScore;
  });

  // Take top 3 modules
  const selectedModules = recommendedModules.slice(0, 3);
  
  // Generate reasoning
  const disabilityText = learningDisabilities.length > 0 
    ? ` designed for learners with ${learningDisabilities.join(' and ')}`
    : '';
  
  const styleText = learningStyle ? ` using ${learningStyle.toLowerCase()} learning approaches` : '';
  
  const reasoning = `This path includes modules${disabilityText}${styleText}. ` +
    `The modules are sequenced to build on each other and match your ${difficultyLevel} skill level.`;

  return {
    id: `path-${userProfile.id}-${Date.now()}`,
    title: `Personalized Learning Path for ${userProfile.id}`,
    description: `A customized learning journey based on your profile and progress`,
    modules: selectedModules.map(m => m.id),
    estimatedTime: selectedModules.reduce((total, m) => total + m.estimatedTime, 0),
    reasoning: reasoning
  };
}

// GET /api/learning/path - Get personalized learning path recommendations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const completedModulesParam = searchParams.get('completedModules');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user profile (in production, this would come from the database)
    const userProfile = mockUserProfiles[userId];
    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Parse completed modules
    const completedModules = completedModulesParam 
      ? completedModulesParam.split(',').map(id => id.trim()).filter(Boolean)
      : [];

    // Generate learning path
    const learningPath = generateLearningPath(userProfile, completedModules);

    return NextResponse.json({
      success: true,
      data: learningPath,
      userProfile: {
        learningDisabilities: userProfile.learningDisabilities,
        learningStyle: userProfile.learningStyle,
        difficultyLevel: userProfile.difficultyLevel,
        preferredSubjects: userProfile.preferredSubjects,
      }
    });

  } catch (error) {
    console.error('Error generating learning path:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/learning/path - Create a custom learning path
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, moduleIds, title, description }: {
      userId: string;
      moduleIds: string[];
      title?: string;
      description?: string;
    } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!moduleIds || !Array.isArray(moduleIds) || moduleIds.length === 0) {
      return NextResponse.json(
        { error: 'Module IDs array is required' },
        { status: 400 }
      );
    }

    // Validate that all module IDs exist
    const validModuleIds = availableModules.map(m => m.id);
    const invalidModules = moduleIds.filter(id => !validModuleIds.includes(id));
    
    if (invalidModules.length > 0) {
      return NextResponse.json(
        { error: `Invalid module IDs: ${invalidModules.join(', ')}` },
        { status: 400 }
      );
    }

    // Calculate total estimated time
    const selectedModules = availableModules.filter(m => moduleIds.includes(m.id));
    const totalTime = selectedModules.reduce((sum, m) => sum + m.estimatedTime, 0);

    const customPath: LearningPathRecommendation = {
      id: `custom-path-${userId}-${Date.now()}`,
      title: title || 'Custom Learning Path',
      description: description || 'A custom learning path created by the user',
      modules: moduleIds,
      estimatedTime: totalTime,
      reasoning: 'This is a custom path created according to your specific preferences.'
    };

    return NextResponse.json({
      success: true,
      message: 'Custom learning path created successfully',
      data: customPath,
    });

  } catch (error) {
    console.error('Error creating custom learning path:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 