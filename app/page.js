'use client';

// Import each component individually
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import ItemComparison from '@/components/ui/ItemComparison';

export default function Home() {
  const handleSliderChange = (value) => {
    console.log('Slider value changed:', value);
  };

  return (
    <main className="container mx-auto p-4 space-y-4">
      <ItemComparison />
      <Card>
        <CardContent>
          <h1 className="text-2xl font-bold mb-4">My Components</h1>

          <Button onClick={() => alert('Button clicked!')}>
            Click Me
          </Button>

          <div className="mt-4">
            <Slider 
              defaultValue={[3]} 
              max={10} 
              min={0} 
              step={1}
              onValueChange={handleSliderChange}
            />
          </div>

          <div className="mt-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
              </SelectContent>
            </Select>
          </div>        
        </CardContent>
      </Card>
    </main>
  );
}