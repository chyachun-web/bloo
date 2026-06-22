import React, { useState, useEffect } from "react";
import { IPhoneMockup } from "./components/IPhoneMockup";
import { HomeView } from "./components/HomeView";
import { DrawView } from "./components/DrawView";
import { GardenView } from "./components/GardenView";
import { DiaryView } from "./components/DiaryView";
import { ProfileView } from "./components/ProfileView";
import { UxSpecsView } from "./components/UxSpecsView";
import { UserProfile, LuckyFlower, EatingLog } from "./types";
import { Compass, Sparkles, Leaf, BookOpen, User as UserIcon } from "lucide-react";

export default function App() {
  // Mode selection: "app" displays the iPhone 16 Pro mockup, "specs" displays design specs
  const [activeWorkMode, setActiveWorkMode] = useState<"app" | "specs">("app");

  // Bottom navigation tab state
  const [activeTab, setActiveTab] = useState<number>(0);

  // User Profile state with localStorage recovery
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem("bloo_user_profile");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return {
      userName: "",
      birthDate: "",
      birthTime: "",
      gender: "",
      constellation: "牡羊座 (Aries)",
      hasRegistered: false
    };
  });

  // Daily Drawn lucky flowers collected by the user
  const [collectedFlowers, setCollectedFlowers] = useState<LuckyFlower[]>(() => {
    try {
      const saved = localStorage.getItem("bloo_collected_flowers");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Mindful Eating logs recorded by the user
  const [eatingLogs, setEatingLogs] = useState<EatingLog[]>(() => {
    try {
      const saved = localStorage.getItem("bloo_eating_logs");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Emotional Energy status values
  const [energyCalm, setEnergyCalm] = useState(70);
  const [energyVitality, setEnergyVitality] = useState(60);
  const [energyCreativity, setEnergyCreativity] = useState(80);
  const [energySocial, setEnergySocial] = useState(50);

  // Sync state changes with localStorage
  useEffect(() => {
    localStorage.setItem("bloo_user_profile", JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem("bloo_collected_flowers", JSON.stringify(collectedFlowers));
  }, [collectedFlowers]);

  useEffect(() => {
    localStorage.setItem("bloo_eating_logs", JSON.stringify(eatingLogs));
  }, [eatingLogs]);

  // Handle adding new flowers drew during daily rituals
  const handlePlantFlowerInGarden = (newFlower: LuckyFlower) => {
    setCollectedFlowers((prev) => {
      // Prevent duplicate planting of the exact same instance ID
      if (prev.some((f) => f.id === newFlower.id)) return prev;
      return [newFlower, ...prev];
    });
  };

  // Handle submitting new food diarites with feedback
  const handleAddEatingLog = (newLog: EatingLog) => {
    setEatingLogs((prev) => [newLog, ...prev]);
  };

  // Compute total accumulated points driven by food diary entries
  const totalGardenPoints = eatingLogs.reduce((acc, log) => acc + log.pointsEarned, 0) + (userProfile.hasRegistered ? 60 : 0);

  // Utility tab navigator switcher
  const handleNavigateToTab = (tabIndex: number) => {
    if (tabIndex === 4 && !userProfile.hasRegistered) {
      // Allow profile access directly
      setActiveTab(4);
    } else {
      setActiveTab(tabIndex);
    }
  };

  return (
    <div className="w-full min-h-screen bg-checkered bg-fixed flex flex-col justify-start">
      
      {/* Background decoration representing Korean aesthetic grids (from the logo) */}
      <div className="w-full h-full flex flex-col items-center">
        
        <IPhoneMockup
          activeWorkMode={activeWorkMode}
          onModeChange={setActiveWorkMode}
        >
          {activeWorkMode === "app" ? (
            /* Render mobile app screen inside the phone chassis */
            <div className="w-full h-full flex flex-col relative bg-white">
              
              {/* Core Screen Client Area Router */}
              <div className="flex-1 w-full h-full overflow-hidden">
                {activeTab === 0 && (
                  <HomeView
                    userProfile={userProfile}
                    energyCalm={energyCalm}
                    energyVitality={energyVitality}
                    energyCreativity={energyCreativity}
                    energySocial={energySocial}
                    setEnergyCalm={setEnergyCalm}
                    setEnergyVitality={setEnergyVitality}
                    setEnergyCreativity={setEnergyCreativity}
                    setEnergySocial={setEnergySocial}
                    onNavigateToTab={handleNavigateToTab}
                    onPlantFlower={handlePlantFlowerInGarden}
                  />
                )}

                {activeTab === 1 && (
                  <DrawView
                    userProfile={userProfile}
                    setUserProfile={setUserProfile}
                    onPlantFlower={handlePlantFlowerInGarden}
                    collectedFlowers={collectedFlowers}
                  />
                )}

                {activeTab === 2 && (
                  <GardenView
                    userProfile={userProfile}
                    collectedFlowers={collectedFlowers}
                    onNavigateToTab={handleNavigateToTab}
                  />
                )}

                {activeTab === 3 && (
                  <DiaryView
                    onAddEatingLog={handleAddEatingLog}
                    eatingLogs={eatingLogs}
                  />
                )}

                {activeTab === 4 && (
                  <ProfileView
                    userProfile={userProfile}
                    setUserProfile={setUserProfile}
                    gardenPoints={totalGardenPoints}
                  />
                )}
              </div>

              {/* Bottom Sleek Korean Bottom Nav Sheet */}
              <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 px-3 py-2.5 flex justify-around items-center z-30 shadow-lg">
                {[
                  { index: 0, icon: Compass, label: "首頁" },
                  { index: 1, icon: Sparkles, label: "抽花" },
                  { index: 2, icon: Leaf, label: "花園" },
                  { index: 3, icon: BookOpen, label: "飲食日記" },
                  { index: 4, icon: UserIcon, label: "我的" }
                ].map((item) => {
                  const IconComponent = item.icon;
                  const isSelected = activeTab === item.index;
                  return (
                    <button
                      key={item.index}
                      onClick={() => handleNavigateToTab(item.index)}
                      className={`flex flex-col items-center justify-center p-1.5 transition-all duration-300 relative ${
                        isSelected 
                          ? "text-[#a3c9e8] scale-110" 
                          : "text-gray-400 hover:text-gray-600 hover:scale-105"
                      }`}
                    >
                      {/* Active glowing micro-dot above item */}
                      {isSelected && (
                        <span className="absolute -top-1 w-1 h-1 rounded-full bg-[#a3c9e8] animate-pulse" />
                      )}
                      
                      <div className={`p-1.5 rounded-full ${isSelected ? "bg-[#a3c9e8]/10" : ""}`}>
                        <IconComponent className="w-[18px] h-[18px]" strokeWidth={isSelected ? 2.5 : 2} />
                      </div>
                      
                      <span className="text-[9px] mt-0.5 font-serif font-semibold tracking-tight">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>

            </div>
          ) : (
            /* Render professional spec deliverables in wide view */
            <div className="w-full max-w-5xl px-4 py-4">
              <UxSpecsView />
            </div>
          )}
        </IPhoneMockup>

      </div>
    </div>
  );
}
