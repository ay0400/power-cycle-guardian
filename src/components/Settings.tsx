
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsType } from '@/types/power';

interface SettingsProps {
  settings: SettingsType;
  onSave: (settings: SettingsType) => void;
  onReset: () => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSave, onReset }) => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(settings.notificationsEnabled);
  const [notificationLeadTime, setNotificationLeadTime] = React.useState(settings.notificationLeadTime);

  const handleSave = () => {
    onSave({
      notificationsEnabled,
      notificationLeadTime
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>
          Configure your power cycle tracking preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Notifications</h3>
            <p className="text-sm text-gray-500">
              Receive alerts before power changes
            </p>
          </div>
          <Switch 
            checked={notificationsEnabled} 
            onCheckedChange={setNotificationsEnabled} 
          />
        </div>
        
        {notificationsEnabled && (
          <div>
            <h3 className="text-md font-medium mb-2">
              Notification Lead Time: {notificationLeadTime} minutes
            </h3>
            <Slider 
              value={[notificationLeadTime]} 
              min={5} 
              max={120} 
              step={5} 
              onValueChange={(value) => setNotificationLeadTime(value[0])} 
            />
            <p className="text-sm text-gray-500 mt-2">
              How many minutes before a power change should we notify you?
            </p>
          </div>
        )}
        
        <div className="pt-2">
          <h3 className="text-lg font-medium mb-2">Reset Power Cycle</h3>
          <p className="text-sm text-gray-500 mb-3">
            If your power cycle has changed, you can reset it and go through the setup again.
          </p>
          <Button 
            variant="destructive" 
            onClick={onReset}
          >
            Reset Power Cycle
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave}>Save Settings</Button>
      </CardFooter>
    </Card>
  );
};

export default Settings;
