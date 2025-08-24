import { useState, useEffect } from 'react';

// Builder.io API configuration
const BUILDER_API_KEY = process.env.REACT_APP_BUILDER_API_KEY || 'b332dff24efe415680306c97b6b8c502';
const BUILDER_API_URL = 'https://cdn.builder.io/api/v3/content/workout';

// Fallback data to ensure the app always works
const FALLBACK_WORKOUTS = [
  {
    id: 'fallback-1',
    data: {
      title: "30 Mins Full Body Mobility",
      duration: 30,
      workoutType: "Mobility",
      image: "https://api.builder.io/api/v1/image/assets/TEMP/7dc2a579d94f83b1bb38dd9acb6a3b8496311c24?width=637",
      scheduleTime: "7:30 PM",
      featured: true,
      gradientColors: { from: "#9D9BFF", to: "#19182E" },
      tags: [{ tag: "Flexibility & Mobility" }, { tag: "Balance" }],
      sortOrder: 1
    }
  },
  {
    id: 'fallback-2',
    data: {
      title: "50 Mins Zumba",
      duration: 50,
      workoutType: "Zumba",
      image: "https://api.builder.io/api/v1/image/assets/TEMP/f0016c60e21fd3136ce95ea50bd2d132cc9ca4a2?width=129",
      featured: false,
      gradientColors: { from: "#FEF2AE", to: "#4B4B78" },
      tags: [{ tag: "Cardio" }, { tag: "Dance" }],
      sortOrder: 2
    }
  },
  {
    id: 'fallback-3',
    data: {
      title: "60 Mins Yoga",
      duration: 60,
      workoutType: "Yoga",
      image: "https://api.builder.io/api/v1/image/assets/TEMP/a99568d4ccf0a5336264654d214a650f47d5a4f8?width=245",
      featured: false,
      gradientColors: { from: "#F6A0F7", to: "#4B4B78" },
      tags: [{ tag: "Balance" }, { tag: "Mindfulness" }],
      sortOrder: 3
    }
  },
  {
    id: 'fallback-4',
    data: {
      title: "45 Mins HIIT",
      duration: 45,
      workoutType: "HIIT",
      image: "https://api.builder.io/api/v1/image/assets/TEMP/df03553201af1f41503b44b683afe85373a297c7?width=210",
      featured: false,
      gradientColors: { from: "#A9F7A0", to: "#4B4B78" },
      tags: [{ tag: "Strength" }, { tag: "Cardio" }, { tag: "HIIT" }],
      sortOrder: 4
    }
  }
];

export const useWorkouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try multiple API endpoints and methods
        let data = null;
        
        // Method 1: Try the v3 API with published filter and cache busting
        try {
          const timestamp = Date.now();
          const response = await fetch(
            `${BUILDER_API_URL}?apiKey=${BUILDER_API_KEY}&limit=20&published=published&fields=data,id,name&cachebust=${timestamp}&sort.data.sortOrder=1`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
              }
            }
          );
          
          if (response.ok) {
            data = await response.json();
            console.log('✅ CMS API Success:', data);
          } else {
            console.warn(`❌ API Response ${response.status}:`, response.statusText);
            throw new Error(`API returned ${response.status}: ${response.statusText}`);
          }
        } catch (apiError) {
          console.warn('❌ Primary API failed:', apiError.message);
          
          // Method 2: Try without the published filter
          try {
            const fallbackResponse = await fetch(
              `${BUILDER_API_URL}?apiKey=${BUILDER_API_KEY}&limit=20&fields=data,id,name&cachebust=${timestamp}&sort.data.sortOrder=1`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Cache-Control': 'no-cache',
                }
              }
            );
            
            if (fallbackResponse.ok) {
              data = await fallbackResponse.json();
              console.log('✅ Fallback API Success:', data);
            } else {
              throw new Error(`Fallback API failed: ${fallbackResponse.status}`);
            }
          } catch (fallbackError) {
            console.warn('�� Fallback API also failed:', fallbackError.message);
            throw new Error('All API methods failed');
          }
        }
        
        // Process the data
        if (data && data.results && data.results.length >= 4) {
          console.log(`📊 Loaded ${data.results.length} workouts from CMS`);
          setWorkouts(data.results);
          setUsingFallback(false);
        } else {
          console.warn(`⚠️ Only ${data?.results?.length || 0} workouts found in CMS, need 4. Using fallback to ensure complete display.`);
          // Use fallback to ensure all 4 workouts are displayed
          setWorkouts(FALLBACK_WORKOUTS);
          setUsingFallback(true);
        }
        
      } catch (err) {
        setError(err.message);
        console.error('❌ CMS Error, using fallback data:', err.message);
        
        // Use fallback data to ensure app functionality
        setWorkouts(FALLBACK_WORKOUTS);
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  // Helper functions to get specific workout types
  const getFeaturedWorkout = () => {
    return workouts.find(workout => workout.data.featured) || workouts[0];
  };

  const getRegularWorkouts = () => {
    return workouts.filter(workout => !workout.data.featured);
  };

  const getAllTags = () => {
    const tags = workouts.flatMap(workout => 
      workout.data.tags?.map(tag => tag.tag) || []
    );
    return [...new Set(tags)]; // Remove duplicates
  };

  // Debug info
  const getDebugInfo = () => ({
    workoutCount: workouts.length,
    usingFallback,
    error,
    apiKey: BUILDER_API_KEY.substring(0, 8) + '...' // Only show first 8 chars for security
  });

  return {
    workouts,
    loading,
    error,
    usingFallback,
    getFeaturedWorkout,
    getRegularWorkouts,
    getAllTags,
    getDebugInfo
  };
};
