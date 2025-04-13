import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDateSelected: (date: Date) => void;
}

export function DatePickerModal({ isOpen, onClose, onDateSelected }: DatePickerModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      console.log('DatePickerModal - Raw selected date:', date);
      console.log('DatePickerModal - Date components:', {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hours: date.getHours(),
        minutes: date.getMinutes(),
        timezone: date.getTimezoneOffset()
      });
      
      // Create date at midnight UTC
      const utcDate = new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        0, 0, 0, 0
      ));
      
      console.log('DatePickerModal - Created UTC date:', utcDate.toISOString());
      console.log('DatePickerModal - UTC components:', {
        year: utcDate.getUTCFullYear(),
        month: utcDate.getUTCMonth() + 1,
        day: utcDate.getUTCDate(),
        hours: utcDate.getUTCHours(),
        minutes: utcDate.getUTCMinutes()
      });
      
      setSelectedDate(utcDate);
    }
  };

  const handleConfirm = () => {
    // Create UTC date again to ensure consistency
    const utcDate = new Date(Date.UTC(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      0, 0, 0, 0
    ));
    
    console.log('DatePickerModal - Confirming with UTC date:', utcDate.toISOString());
    onDateSelected(utcDate);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Select Date for "On This Day" Fact</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-md border"
            defaultMonth={selectedDate}
          />
          <div className="flex justify-end gap-2 w-full">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>
              Confirm
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 