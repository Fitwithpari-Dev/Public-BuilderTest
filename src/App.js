import React from 'react';
import './App.css';
import { useWorkouts } from './hooks/useWorkouts';

function App() {
  const { workouts, loading, error, usingFallback, getFeaturedWorkout, getRegularWorkouts, getAllTags, getDebugInfo } = useWorkouts();

  if (loading) {
    return (
      <div className="fitness-app">
        <div className="loading-container">
          <p>Loading workouts...</p>
        </div>
      </div>
    );
  }

  // Debug information (only shown in development)
  if (process.env.NODE_ENV === 'development') {
    const debugInfo = getDebugInfo();
    console.log('🔍 Debug Info:', debugInfo);
  }

  const featuredWorkout = getFeaturedWorkout();
  const regularWorkouts = getRegularWorkouts();
  const allTags = getAllTags();

  // Show status indicator if using fallback data
  const showStatusIndicator = usingFallback || error;

  return (
    <div className="fitness-app">
      {/* Status Indicator for Development */}
      {showStatusIndicator && process.env.NODE_ENV === 'development' && (
        <div className="status-indicator">
          {usingFallback ? '⚠️ Using fallback data - CMS connection failed' : `❌ CMS Error: ${error}`}
        </div>
      )}

      {/* Top Navigation */}
      <header className="top-navigation">
        <div className="logo">
          <div className="logo-icon"></div>
        </div>

        <nav className="screen-names">
          <span className="nav-item active">Home</span>
          <span className="nav-item">My Booking</span>
          <span className="nav-item">Private Workout</span>
          <span className="nav-item">My Progress</span>
        </nav>

        <div className="right-section">
          <div className="refer-earn">
            <div className="coin-icon"></div>
            <span>Refer & Earn</span>
          </div>
          <div className="user-account">
            <div className="user-icon"></div>
          </div>
        </div>
      </header>

      {/* Date Navigation */}
      <div className="date-navigation">
        <button className="date-arrow">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M20 4C28.8366 4 36 11.1634 36 20C36 28.8366 28.8366 36 20 36C11.1634 36 4 28.8366 4 20C4 11.1634 11.1634 4 20 4ZM20 6C12.268 6 6 12.268 6 20C6 27.732 12.268 34 20 34C27.732 34 34 27.732 34 20C34 12.268 27.732 6 20 6Z" fill="white"/>
            <path d="M23.7657 12.2604C23.4533 11.9132 22.9468 11.9132 22.6344 12.2604L16.2343 19.3715C15.9219 19.7187 15.9219 20.2813 16.2343 20.6285L22.6344 27.7396C22.9468 28.0868 23.4533 28.0868 23.7657 27.7396C24.0781 27.3925 24.0781 26.8298 23.7657 26.4827L17.9312 20L23.7657 13.5173C24.0781 13.1702 24.0781 12.6075 23.7657 12.2604Z" fill="white"/>
          </svg>
        </button>
        <span className="date-text">Thu 17 Jul</span>
        <button className="date-arrow">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M20 4C11.1634 4 4 11.1634 4 20C4 28.8366 11.1634 36 20 36C28.8366 36 36 28.8366 36 20C36 11.1634 28.8366 4 20 4ZM20 6C27.732 6 34 12.268 34 20C34 27.732 27.732 34 20 34C12.268 34 6 27.732 6 20C6 12.268 12.268 6 20 6Z" fill="white"/>
            <path d="M16.2343 12.2604C16.5467 11.9132 17.0532 11.9132 17.3656 12.2604L23.7657 19.3715C24.0781 19.7187 24.0781 20.2813 23.7657 20.6285L17.3656 27.7396C17.0532 28.0868 16.5467 28.0868 16.2343 27.7396C15.9219 27.3925 15.9219 26.8298 16.2343 26.4827L22.0688 20L16.2343 13.5173C15.9219 13.1702 15.9219 12.6075 16.2343 12.2604Z" fill="white"/>
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <main className="main-content">
        {/* Featured Workout Card */}
        {featuredWorkout && (
          <div
            className="featured-card"
            style={{
              background: featuredWorkout.data.gradientColors
                ? `radial-gradient(208.58% 116.91% at 24.85% 2.36%, ${featuredWorkout.data.gradientColors.from} 0%, ${featuredWorkout.data.gradientColors.to} 100%)`
                : 'radial-gradient(208.58% 116.91% at 24.85% 2.36%, #9D9BFF 0%, #19182E 100%)'
            }}
          >
            {featuredWorkout.data.scheduleTime && (
              <div className="time-tag">{featuredWorkout.data.scheduleTime}</div>
            )}
            <div className="card-content">
              <h2 className="workout-title">
                {featuredWorkout.data.duration} Mins<br/>
                {featuredWorkout.data.title.replace(/^\d+\s*Mins\s*/, '')}
              </h2>
              <button className="mark-calendar-btn">Mark Calendar</button>
            </div>
            <div
              className="card-image"
              style={{
                backgroundImage: `url(${featuredWorkout.data.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            ></div>
          </div>
        )}

        {/* Workout Cards Grid */}
        <div className="workout-grid">
          {regularWorkouts.slice(0, 3).map((workout, index) => (
            <div
              key={workout.id || index}
              className={`workout-card ${workout.data.workoutType.toLowerCase()}`}
              style={{
                background: workout.data.gradientColors
                  ? `linear-gradient(180deg, ${workout.data.gradientColors.from} 0%, ${workout.data.gradientColors.to} 100%)`
                  : 'linear-gradient(180deg, #F6A0F7 0%, #4B4B78 100%)'
              }}
            >
              <div
                className="card-image"
                style={{
                  backgroundImage: `url(${workout.data.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              ></div>
              <div className="card-content">
                <h3>
                  {workout.data.duration} Mins<br/>
                  {workout.data.title.replace(/^\d+\s*Mins\s*/, '')}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Category Tags */}
      <div className="category-tags">
        {allTags.slice(0, 5).map((tag, index) => (
          <span key={index} className="tag">{tag}</span>
        ))}
      </div>

      {/* What you need section */}
      <div className="info-section">
        <h3>What you need for this?</h3>
        <p>You enrol in a package of your choice. You enrol in a package of your choice You enrol in a package of your choice. You enrol in a package of your choice</p>
      </div>
    </div>
  );
}

export default App;
