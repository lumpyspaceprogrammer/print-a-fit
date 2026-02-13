import React from 'react';
import { ExternalLink, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const fabricStores = [
  {
    name: 'Mood Fabrics',
    url: 'https://www.moodfabrics.com/catalogsearch/result/?q=',
    logo: '🎨',
    description: 'NYC\'s famous fabric store'
  },
  {
    name: 'Fabric.com',
    url: 'https://www.fabric.com/search?q=',
    logo: '🧵',
    description: 'Huge online selection'
  },
  {
    name: 'Spoonflower',
    url: 'https://www.spoonflower.com/shop?q=',
    logo: '🌸',
    description: 'Custom & unique prints'
  },
  {
    name: 'Joann',
    url: 'https://www.joann.com/search?q=',
    logo: '🏪',
    description: 'Nationwide craft chain'
  },
  {
    name: 'Fashion Fabrics Club',
    url: 'https://www.fashionfabricsclub.com/search?search_query=',
    logo: '✨',
    description: 'Designer fabrics'
  },
  {
    name: 'Etsy',
    url: 'https://www.etsy.com/search?q=',
    logo: '🛍️',
    description: 'Indie & vintage fabrics'
  }
];

export default function FabricStoreLinks({ searchTerms = [] }) {
  const getSearchUrl = (store, terms) => {
    const query = terms.join(' ');
    return store.url + encodeURIComponent(query);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <ShoppingBag className="w-4 h-4 text-purple-500" />
        <h4 className="font-bold text-sm text-gray-800 dark:text-white">
          Shop This Fabric
        </h4>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {fabricStores.map((store, i) => (
          <a
            key={i}
            href={getSearchUrl(store, searchTerms)}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 p-3 bg-white dark:bg-gray-700 border-2 border-black dark:border-white rounded-lg hover:bg-gradient-to-br hover:from-pink-50 hover:to-purple-50 dark:hover:from-pink-900/20 dark:hover:to-purple-900/20 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[-1px] hover:translate-y-[-1px]"
          >
            <span className="text-xl">{store.logo}</span>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-xs text-gray-800 dark:text-white truncate">
                {store.name}
              </div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                {store.description}
              </div>
            </div>
            <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-purple-500 transition-colors flex-shrink-0" />
          </a>
        ))}
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 text-center pt-2">
        💡 Tip: Compare prices and read reviews before purchasing
      </div>
    </div>
  );
}