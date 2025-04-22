
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format, subDays, addDays, set } from 'date-fns';

interface SetupWizardProps {
  onComplete: (startDate: Date) => void;
}

const SetupWizard: React.FC<SetupWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [powerStatus, setPowerStatus] = useState<"on" | "off">("on");
  const [recentEvent, setRecentEvent] = useState<"today" | "yesterday" | "custom">("today");
  const [customDate, setCustomDate] = useState<Date | null>(null);
  
  const handleSubmit = () => {
    let startDate = new Date();
    
    // Set the start time to noon (12:00 PM)
    startDate = set(startDate, { hours: 12, minutes: 0, seconds: 0, milliseconds: 0 });
    
    // Calculate the actual cycle start date based on user input
    if (powerStatus === "on") {
      // If power is ON now
      if (recentEvent === "today") {
        // Power came on today at 12 PM, use today as start date
        // startDate already set to today at noon
      } else if (recentEvent === "yesterday") {
        // Power came on yesterday at 12 PM
        startDate = subDays(startDate, 1);
      } 
      // For custom date, use the selected date
    } else {
      // If power is OFF now
      if (recentEvent === "today") {
        // Power went off today, which means power was on for 2 days before
        // So the cycle started 2 days ago
        startDate = subDays(startDate, 2);
      } else if (recentEvent === "yesterday") {
        // Power went off yesterday, which means the cycle started 3 days ago
        // But since we're in a new cycle, the new start date is today
        // startDate already set to today at noon
      }
      // For custom date, adjust accordingly
    }
    
    // If custom date was selected, use that
    if (recentEvent === "custom" && customDate) {
      startDate = set(customDate, { hours: 12, minutes: 0, seconds: 0, milliseconds: 0 });
      
      // Adjust for power status
      if (powerStatus === "off") {
        startDate = subDays(startDate, 2); // If OFF, cycle started 2 days before
      }
    }
    
    onComplete(startDate);
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Power Cycle Setup</CardTitle>
        <CardDescription>
          Let's configure your power cycle so we can accurately track it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">What is your current power status?</h3>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant={powerStatus === "on" ? "default" : "outline"}
                className={powerStatus === "on" ? "bg-blue-500 hover:bg-blue-600" : ""}
                onClick={() => setPowerStatus("on")}
              >
                Power is ON
              </Button>
              <Button 
                variant={powerStatus === "off" ? "default" : "outline"}
                className={powerStatus === "off" ? "bg-gray-700 hover:bg-gray-800" : ""}
                onClick={() => setPowerStatus("off")}
              >
                Power is OFF
              </Button>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              {powerStatus === "on" 
                ? "When did your power last come ON?" 
                : "When did your power last go OFF?"}
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <Button 
                variant={recentEvent === "today" ? "default" : "outline"}
                onClick={() => setRecentEvent("today")}
              >
                Today at 12:00 PM
              </Button>
              <Button 
                variant={recentEvent === "yesterday" ? "default" : "outline"}
                onClick={() => setRecentEvent("yesterday")}
              >
                Yesterday at 12:00 PM
              </Button>
              <Button 
                variant={recentEvent === "custom" ? "default" : "outline"}
                onClick={() => setRecentEvent("custom")}
              >
                Custom Date
              </Button>
            </div>
            
            {recentEvent === "custom" && (
              <div className="pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select a date:
                </label>
                <input 
                  type="date" 
                  className="w-full p-2 border rounded-md"
                  onChange={(e) => setCustomDate(e.target.value ? new Date(e.target.value) : null)}
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {step > 1 && (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        )}
        
        {step < 2 ? (
          <Button onClick={() => setStep(step + 1)}>
            Next
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit}
            disabled={recentEvent === "custom" && !customDate}
          >
            Complete Setup
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SetupWizard;
