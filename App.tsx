
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ProfileForm from './components/ProfileForm';
import PhysiqueInsightComponent from './components/PhysiqueInsight';
import FoodCheck from './components/FoodCheck';
import FoodDatabase from './components/FoodDatabase';
import Learn from './components/Learn';
import { ViewType, UserProfile, NutritionPlan } from './types';
import { getNutritionPlan } from './services/geminiService';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load persistence
  useEffect(() => {
    const savedProfile = localStorage.getItem('nutrify_profile');
    const savedPlan = localStorage.getItem('nutrify_plan');
    const savedTheme = localStorage.getItem('nutrify_theme');
    
    if (savedProfile) setProfile(JSON.parse(savedProfile));
    if (savedPlan) setNutritionPlan(JSON.parse(savedPlan));
    if (savedTheme === 'dark') setIsDarkMode(true);
  }, []);

  const handleSaveProfile = async (newProfile: UserProfile) => {
    setIsLoading(true);
    try {
      const plan = await getNutritionPlan(newProfile);
      setProfile(newProfile);
      setNutritionPlan(plan);
      localStorage.setItem('nutrify_profile', JSON.stringify(newProfile));
      localStorage.setItem('nutrify_plan', JSON.stringify(plan));
      setActiveView('dashboard');
    } catch (error) {
      console.error(error);
      alert('Failed to generate plan. Please check your API configuration.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('nutrify_theme', newTheme ? 'dark' : 'light');
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard plan={nutritionPlan} profile={profile} onStart={() => setActiveView('profile')} />;
      case 'profile':
        return <ProfileForm initialProfile={profile} onSave={handleSaveProfile} isLoading={isLoading} />;
      case 'physique':
        return <PhysiqueInsightComponent />;
      case 'food-check':
        return <FoodCheck />;
      case 'food-database':
        return <FoodDatabase />;
      case 'learn':
        return <Learn />;
      default:
        return <Dashboard plan={nutritionPlan} profile={profile} onStart={() => setActiveView('profile')} />;
    }
  };

  return (
    <Layout 
      activeView={activeView} 
      onNavigate={setActiveView} 
      isDarkMode={isDarkMode} 
      toggleTheme={toggleTheme}
    >
      {renderView()}
    </Layout>
  );
};

export default App;
