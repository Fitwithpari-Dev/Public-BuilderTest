import { useState, useEffect } from 'react';

// Builder.io API configuration
const BUILDER_API_KEY = 'b332dff24efe415680306c97b6b8c502'; // Updated with correct API key
const BUILDER_API_URL = 'https://cdn.builder.io/api/v3/content/workout';

export const useWorkouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${BUILDER_API_URL}?apiKey=${BUILDER_API_KEY}&limit=10&fields=data&published=published`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch workouts');
        }
        
        const data = await response.json();
        console.log('CMS Response:', data); // Debug log
        setWorkouts(data.results || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching workouts:', err);
        
        // Fallback data if CMS fetch fails
        setWorkouts([
          {
            data: {
              title: "30 Mins Full Body Mobility",
              duration: 30,
              workoutType: "Mobility",
              image: "https://api.builder.io/api/v1/image/assets/TEMP/7dc2a579d94f83b1bb38dd9acb6a3b8496311c24?width=637",
              scheduleTime: "7:30 PM",
              featured: true,
              gradientColors: { from: "#9D9BFF", to: "#19182E" },
              tags: [{ tag: "Flexibility & Mobility" }]
            }
          },
          {
            data: {
              title: "50 Mins Zumba",
              duration: 50,
              workoutType: "Zumba",
              image: "https://api.builder.io/api/v1/image/assets/TEMP/f0016c60e21fd3136ce95ea50bd2d132cc9ca4a2?width=129",
              featured: false,
              gradientColors: { from: "#FEF2AE", to: "#4B4B78" },
              tags: [{ tag: "Cardio" }]
            }
          },
          {
            data: {
              title: "60 Mins Yoga",
              duration: 60,
              workoutType: "Yoga",
              image: "https://api.builder.io/api/v1/image/assets/TEMP/a99568d4ccf0a5336264654d214a650f47d5a4f8?width=245",
              featured: false,
              gradientColors: { from: "#F6A0F7", to: "#4B4B78" },
              tags: [{ tag: "Balance" }]
            }
          },
          {
            data: {
              title: "45 Mins HIIT",
              duration: 45,
              workoutType: "HIIT",
              image: "https://api.builder.io/api/v1/image/assets/TEMP/df03553201af1f41503b44b683afe85373a297c7?width=210",
              featured: false,
              gradientColors: { from: "#A9F7A0", to: "#4B4B78" },
              tags: [{ tag: "Strength" }]
            }
          }
        ]);
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

  return {
    workouts,
    loading,
    error,
    getFeaturedWorkout,
    getRegularWorkouts,
    getAllTags
  };
};
