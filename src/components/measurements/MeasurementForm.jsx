import React from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function MeasurementForm({ measurements, values, onChange, onFocus }) {
  return (
    <TooltipProvider>
      <div className="space-y-4">
        {measurements.map((measurement, index) => (
          <motion.div
            key={measurement.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="relative"
          >
            <div className="flex items-center gap-2 mb-1">
              <Label 
                htmlFor={measurement.id}
                className="font-bold text-black"
              >
                {measurement.label}
              </Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-[#9B5DE5]" />
                </TooltipTrigger>
                <TooltipContent className="bg-[#9B5DE5] text-white border-2 border-black font-semibold">
                  <p>{measurement.description}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            <div className="flex items-center gap-2">
              <Input
                id={measurement.id}
                type="number"
                step="0.5"
                min="0"
                value={values[measurement.id] || ''}
                onChange={(e) => onChange(measurement.id, e.target.value)}
                onFocus={() => onFocus(measurement.id)}
                className="border-3 border-black rounded-xl shadow-[3px_3px_0_0_#000] focus:shadow-[1px_1px_0_0_#000] focus:translate-x-[2px] focus:translate-y-[2px] transition-all font-bold text-lg"
                placeholder="0"
              />
              <span className="font-black text-[#9B5DE5] bg-white border-3 border-black rounded-lg px-3 py-2 shadow-[3px_3px_0_0_#000]">
                {measurement.unit}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </TooltipProvider>
  );
}