
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsType } from '@/types/power';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsProps {
  settings: SettingsType;
  onSave: (settings: SettingsType) => void;
  onReset: () => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSave, onReset }) => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(settings.notificationsEnabled);
  const [notificationLeadTime, setNotificationLeadTime] = React.useState(settings.notificationLeadTime);
  const [cycleStartDate, setCycleStartDate] = React.useState<Date>(settings.cycleStartDate);

  const handleSave = () => {
    onSave({
      notificationsEnabled,
      notificationLeadTime,
      cycleStartDate
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
        <div>
          <h3 className="text-lg font-medium mb-2">Power Cycle Start Date</h3>
          <p className="text-sm text-gray-500 mb-4">
            Set when your power cycle begins
          </p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !cycleStartDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {cycleStartDate ? format(cycleStartDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={cycleStartDate}
                onSelect={setCycleStartDate}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

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
