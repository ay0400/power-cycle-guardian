
import React, { useState, useEffect } from 'react';
import PowerStatus from '@/components/PowerStatus';
import PowerTimeline from '@/components/PowerTimeline';
import SetupWizard from '@/components/SetupWizard';
import Settings from '@/components/Settings';
import { Settings as SettingsType } from '@/types/power';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { calculateCurrentStatus, getNextEventDate, getNextEventType } from '@/utils/powerCycleUtils';

const LOCAL_STORAGE_KEY = 'power-cycle-guardian-data';

const Index = () => {
  const { toast } = useToast();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [settings, setSettings] = useState<SettingsType>({
    notificationsEnabled: true,
    notificationLeadTime: 30, // 30 minutes default
    cycleStartDate: new Date(), // Initialize with current date
  });
  
  // Load saved data from local storage
  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      if (parsedData.startDate) {
        setStartDate(new Date(parsedData.startDate));
      }
      if (parsedData.settings) {
        setSettings(parsedData.settings);
      }
    }
  }, []);
  
  // Save data to local storage when it changes
  useEffect(() => {
    if (startDate) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
        startDate: startDate.toISOString(),
        settings,
      }));
    }
  }, [startDate, settings]);
  
  // Handle setup completion
  const handleSetupComplete = (date: Date) => {
    setStartDate(date);
    toast({
      title: "Setup Complete",
      description: "Your power cycle has been configured successfully.",
    });
  };
  
  // Handle settings update
  const handleSaveSettings = (newSettings: SettingsType) => {
    setSettings(newSettings);
    // If the cycle start date has changed, update the startDate state as well
    if (newSettings.cycleStartDate !== settings.cycleStartDate) {
      setStartDate(newSettings.cycleStartDate);
    }
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
    });
  };
  
  // Handle reset
  const handleReset = () => {
    if (confirm('Are you sure you want to reset your power cycle? This will clear your current settings.')) {
      setStartDate(null);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      toast({
        title: "Reset Complete",
        description: "Your power cycle has been reset.",
      });
    }
  };
  
  // Notification logic
  useEffect(() => {
    if (!startDate || !settings.notificationsEnabled) return;
    
    const nextEventDate = getNextEventDate(startDate);
    const nextEventType = getNextEventType(startDate);
    
    // Calculate when to send the notification
    const notificationTime = new Date(nextEventDate.getTime() - settings.notificationLeadTime * 60 * 1000);
    
    // Check if notification time is in the future
    if (notificationTime > new Date()) {
      const timeoutId = setTimeout(() => {
        if (Notification.permission === "granted") {
          new Notification(`Power going ${nextEventType.toUpperCase()} soon`, {
            body: `Your power will be going ${nextEventType} in ${settings.notificationLeadTime} minutes.`,
            icon: '/power-icon.png'
          });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission();
        }
        
        // Also show an in-app toast notification
        toast({
          title: `Power going ${nextEventType.toUpperCase()} soon`,
          description: `Your power will be going ${nextEventType} in ${settings.notificationLeadTime} minutes.`,
        });
      }, notificationTime.getTime() - new Date().getTime());
      
      return () => clearTimeout(timeoutId);
    }
  }, [startDate, settings.notificationsEnabled, settings.notificationLeadTime]);
  
  if (!startDate) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Power Cycle Guardian</h1>
          <p className="mt-2 text-lg text-gray-600">Track your power cycle and never be caught off guard again.</p>
        </div>
        <SetupWizard onComplete={handleSetupComplete} />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Power Cycle Guardian</h1>
          <p className="mt-2 text-lg text-gray-600">Track your power cycle and never be caught off guard again.</p>
        </div>
        
        <Tabs defaultValue="status" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="status">Status & Timeline</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="status" className="space-y-6">
            <PowerStatus startDate={startDate} />
            <PowerTimeline startDate={startDate} />
          </TabsContent>
          
          <TabsContent value="settings">
            <Settings 
              settings={settings} 
              onSave={handleSaveSettings} 
              onReset={handleReset} 
            />
          </TabsContent>
        </Tabs>
        
        <div className="text-center mt-10 text-sm text-gray-500">
          <p>Power Cycle Guardian | Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
