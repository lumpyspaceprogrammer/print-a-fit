import React from 'react';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import MobileSelect from '../ui/MobileSelect';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const styleOptions = {
  sleeves: {
    top: [
      { value: 'set-in', label: 'Set-in (Standard)', description: 'Classic fitted sleeve' },
      { value: 'raglan', label: 'Raglan', description: 'Diagonal seam from underarm to neckline' },
      { value: 'cap', label: 'Cap Sleeve', description: 'Short sleeve covering shoulder' },
      { value: 'puff', label: 'Puff Sleeve', description: 'Gathered at shoulder and cuff' },
      { value: 'bishop', label: 'Bishop Sleeve', description: 'Full sleeve gathered at cuff' },
      { value: 'bell', label: 'Bell Sleeve', description: 'Flares out at the bottom' },
      { value: 'dolman', label: 'Dolman', description: 'Wide armhole, tapers to wrist' },
      { value: 'flutter', label: 'Flutter Sleeve', description: 'Short, loose, flowing' },
      { value: 'sleeveless', label: 'Sleeveless', description: 'No sleeves' }
    ],
    dress: [
      { value: 'set-in', label: 'Set-in (Standard)' },
      { value: 'cap', label: 'Cap Sleeve' },
      { value: 'puff', label: 'Puff Sleeve' },
      { value: 'flutter', label: 'Flutter Sleeve' },
      { value: 'sleeveless', label: 'Sleeveless' },
      { value: 'long', label: 'Long Sleeve' }
    ],
    outerwear: [
      { value: 'set-in', label: 'Set-in (Standard)' },
      { value: 'raglan', label: 'Raglan' },
      { value: 'dolman', label: 'Dolman' }
    ]
  },
  necklines: {
    top: [
      { value: 'crew', label: 'Crew Neck', description: 'Round, close to neck' },
      { value: 'v-neck', label: 'V-Neck', description: 'V-shaped opening' },
      { value: 'scoop', label: 'Scoop Neck', description: 'Deep rounded neckline' },
      { value: 'boat', label: 'Boat Neck', description: 'Wide, follows collarbone' },
      { value: 'square', label: 'Square Neck', description: 'Straight across with corners' },
      { value: 'sweetheart', label: 'Sweetheart', description: 'Heart-shaped neckline' },
      { value: 'cowl', label: 'Cowl Neck', description: 'Draped, loose fabric' },
      { value: 'halter', label: 'Halter', description: 'Ties behind neck' },
      { value: 'off-shoulder', label: 'Off-Shoulder', description: 'Sits below shoulders' }
    ],
    dress: [
      { value: 'v-neck', label: 'V-Neck' },
      { value: 'scoop', label: 'Scoop Neck' },
      { value: 'square', label: 'Square Neck' },
      { value: 'sweetheart', label: 'Sweetheart' },
      { value: 'halter', label: 'Halter' },
      { value: 'off-shoulder', label: 'Off-Shoulder' },
      { value: 'high-neck', label: 'High Neck' }
    ],
    outerwear: [
      { value: 'standard', label: 'Standard Collar' },
      { value: 'hood', label: 'Hood' },
      { value: 'funnel', label: 'Funnel Neck' }
    ]
  },
  collars: {
    top: [
      { value: 'none', label: 'No Collar' },
      { value: 'pointed', label: 'Pointed Collar', description: 'Classic shirt collar' },
      { value: 'peter-pan', label: 'Peter Pan', description: 'Rounded, flat collar' },
      { value: 'mandarin', label: 'Mandarin', description: 'Stand-up collar' },
      { value: 'ruffle', label: 'Ruffle Collar', description: 'Gathered decorative collar' },
      { value: 'bow-tie', label: 'Bow Tie', description: 'Collar with bow detail' }
    ],
    dress: [
      { value: 'none', label: 'No Collar' },
      { value: 'peter-pan', label: 'Peter Pan' },
      { value: 'mandarin', label: 'Mandarin' },
      { value: 'ruffle', label: 'Ruffle Collar' }
    ],
    outerwear: [
      { value: 'notched', label: 'Notched Lapel', description: 'Classic jacket collar' },
      { value: 'shawl', label: 'Shawl Collar', description: 'Rounded, continuous collar' },
      { value: 'mandarin', label: 'Mandarin', description: 'Stand-up collar' },
      { value: 'hood', label: 'Hood', description: 'Attached hood' },
      { value: 'none', label: 'Collarless' }
    ]
  },
  pockets: {
    top: [
      { value: 'none', label: 'No Pockets' },
      { value: 'patch', label: 'Patch Pockets', description: 'Sewn on outside' },
      { value: 'welt', label: 'Welt Pockets', description: 'Inset with finished opening' },
      { value: 'kangaroo', label: 'Kangaroo Pocket', description: 'Large front pouch' }
    ],
    bottom: [
      { value: 'none', label: 'No Pockets' },
      { value: 'side-seam', label: 'Side Seam', description: 'Hidden in side seam' },
      { value: 'patch', label: 'Patch Pockets', description: 'Sewn on outside' },
      { value: 'welt', label: 'Welt Pockets', description: 'Inset with finished opening' },
      { value: 'cargo', label: 'Cargo Pockets', description: 'Large utility pockets' }
    ],
    dress: [
      { value: 'none', label: 'No Pockets' },
      { value: 'side-seam', label: 'Side Seam' },
      { value: 'patch', label: 'Patch Pockets' },
      { value: 'hidden', label: 'Hidden In-Seam' }
    ],
    outerwear: [
      { value: 'patch', label: 'Patch Pockets' },
      { value: 'welt', label: 'Welt Pockets' },
      { value: 'zipper', label: 'Zipper Pockets' },
      { value: 'inside', label: 'Inside Pockets' }
    ]
  },
  hems: {
    top: [
      { value: 'straight', label: 'Straight Hem', description: 'Even, straight bottom' },
      { value: 'curved', label: 'Curved Hem', description: 'Slightly rounded' },
      { value: 'high-low', label: 'High-Low', description: 'Shorter front, longer back' },
      { value: 'asymmetric', label: 'Asymmetric', description: 'Uneven hem' },
      { value: 'shirttail', label: 'Shirttail', description: 'Rounded side splits' }
    ],
    bottom: [
      { value: 'straight', label: 'Straight Hem' },
      { value: 'raw', label: 'Raw Edge', description: 'Unfinished edge' },
      { value: 'rolled', label: 'Rolled Hem', description: 'Cuffed bottom' },
      { value: 'frayed', label: 'Frayed', description: 'Intentionally distressed' }
    ],
    dress: [
      { value: 'straight', label: 'Straight Hem' },
      { value: 'curved', label: 'Curved Hem' },
      { value: 'high-low', label: 'High-Low' },
      { value: 'asymmetric', label: 'Asymmetric' },
      { value: 'handkerchief', label: 'Handkerchief', description: 'Pointed hem' }
    ],
    outerwear: [
      { value: 'straight', label: 'Straight Hem' },
      { value: 'curved', label: 'Curved Hem' },
      { value: 'ribbed', label: 'Ribbed Band', description: 'Stretchy ribbed finish' }
    ]
  }
};

export default function StyleCustomizer({ clothingType, stylePreferences, onStyleChange }) {
  const getOptionsForType = (category) => {
    const typeMap = {
      'top': 'top',
      'bottom': 'bottom',
      'dress': 'dress',
      'outerwear': 'outerwear',
      'jumpsuit': 'dress'
    };
    const mappedType = typeMap[clothingType] || 'top';
    return styleOptions[category]?.[mappedType] || styleOptions[category]?.top || [];
  };

  const shouldShowOption = (category) => {
    if (category === 'sleeves') {
      return ['top', 'dress', 'outerwear', 'jumpsuit'].includes(clothingType);
    }
    if (category === 'necklines') {
      return ['top', 'dress', 'outerwear', 'jumpsuit'].includes(clothingType);
    }
    if (category === 'collars') {
      return ['top', 'dress', 'outerwear'].includes(clothingType);
    }
    if (category === 'pockets') {
      return true; // All types can have pockets
    }
    if (category === 'hems') {
      return true; // All types have hems
    }
    return false;
  };

  const renderSelect = (category, label, icon) => {
    if (!shouldShowOption(category)) return null;

    const options = getOptionsForType(category);
    if (!options.length) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-2">
          <Label className="text-sm font-bold text-gray-700 dark:text-gray-300">
            {icon} {label}
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-3.5 h-3.5 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">Choose the {label.toLowerCase()} that best fits your design vision</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <MobileSelect
          value={stylePreferences[category] || options[0].value}
          onValueChange={(value) => onStyleChange(category, value)}
          options={options}
          placeholder={`Select ${label.toLowerCase()}...`}
          label={label}
        />
        {/* Show description for selected option */}
        {options.find(opt => opt.value === (stylePreferences[category] || options[0].value))?.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 italic">
            {options.find(opt => opt.value === (stylePreferences[category] || options[0].value)).description}
          </p>
        )}
      </motion.div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-6 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full" />
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
          Detailed Style Preferences
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {renderSelect('sleeves', 'Sleeve Style', '👕')}
        {renderSelect('necklines', 'Neckline', '👔')}
        {renderSelect('collars', 'Collar Style', '🎀')}
        {renderSelect('pockets', 'Pocket Type', '👜')}
        {renderSelect('hems', 'Hem Finish', '✂️')}
      </div>
    </div>
  );
}