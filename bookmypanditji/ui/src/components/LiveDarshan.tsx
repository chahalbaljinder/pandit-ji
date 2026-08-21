"use client";

import { useState, useEffect } from 'react';
import { useTemples, useLiveDarshanTemples } from '@/hooks/useApi';

type Temple = {
  id: string;
  name: string;
  location: string;
  streamUrl: string;
  thumbnailUrl: string;
  description: string;
  isLive: boolean;
  viewerCount?: number;
  nextStreamTime?: string;
};

export default function LiveDarshan() {
  const { data: allTemples, isLoading: allLoading } = useTemples({ hasLiveDarshan: true, limit: 20 });
  const { data: liveTemples } = useLiveDarshanTemples();
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'live' | 'upcoming'>('all');

  const temples = allTemples?.data || [];

  useEffect(() => {
    const firstLiveTemple = temples.find(t => t.isLive);
    if (firstLiveTemple) {
      setSelectedTemple(firstLiveTemple);
    } else if (temples.length > 0) {
      setSelectedTemple(temples[0]);
    }
  }, [temples]);

  const handleTempleSelect = (temple: Temple) => {
    setIsLoading(true);
    setSelectedTemple(temple);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  const filteredTemples = temples.filter(temple => {
    if (filter === 'live') return temple.isLive;
    if (filter === 'upcoming') return !temple.isLive;
    return true;
  });

  if (allLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-black rounded-lg animate-pulse" style={{ paddingBottom: '56.25%' }} />
          <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b" />
            <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="flex items-center p-3 animate-pulse">
                  <div className="h-16 w-24 bg-gray-200 rounded" />
                  <div className="ml-3 flex-grow">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LiveDarshan() {
  const { data: allTemples, isLoading: allLoading } = useTemples({ hasLiveDarshan: true, limit: 20 });
  const { data: liveTemples } = useLiveDarshanTemples();
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'live' | 'upcoming'>('all');

  const temples = allTemples?.data || [];

  useEffect(() => {
    const firstLiveTemple = temples.find(t => t.isLive);
    if (firstLiveTemple) {
      setSelectedTemple(firstLiveTemple);
    } else if (temples.length > 0) {
      setSelectedTemple(temples[0]);
    }
  }, [temples]);

  const handleTempleSelect = (temple: Temple) => {
    setIsLoading(true);
    setSelectedTemple(temple);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  const filteredTemples = temples.filter(temple => {
    if (filter === 'live') return temple.isLive;
    if (filter === 'upcoming') return !temple.isLive;
    return true;
  });

  if (allLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-black rounded-lg animate-pulse" style={{ paddingBottom: '56.25%' }} />
          <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b" />
            <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="flex items-center p-3 animate-pulse">
                  <div className="h-16 w-24 bg-gray-200 rounded" />
                  <div className="ml-3 flex-grow">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LiveDarshan() {
  const { data: allTemples, isLoading: allLoading } = useTemples({ hasLiveDarshan: true, limit: 20 });
  const { data: liveTemples } = useLiveDarshanTemples();
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'live' | 'upcoming'>('all');

  const temples = allTemples?.data || [];

  useEffect(() => {
    const firstLiveTemple = temples.find(t => t.isLive);
    if (firstLiveTemple) {
      setSelectedTemple(firstLiveTemple);
    } else if (temples.length > 0) {
      setSelectedTemple(temples[0]);
    }
  }, [temples]);

  const handleTempleSelect = (temple: Temple) => {
    setIsLoading(true);
    setSelectedTemple(temple);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  const filteredTemples = temples.filter(temple => {
    if (filter === 'live') return temple.isLive;
    if (filter === 'upcoming') return !temple.isLive;
    return true;
  });

  if (allLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-black rounded-lg animate-pulse" style={{ paddingBottom: '56.25%' }} />
          <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b" />
            <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="flex items-center p-3 animate-pulse">
                  <div className="h-16 w-24 bg-gray-200 rounded" />
                  <div className="ml-3 flex-grow">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LiveDarshan() {
  const { data: allTemples, isLoading: allLoading } = useTemples({ hasLiveDarshan: true, limit: 20 });
  const { data: liveTemples } = useLiveDarshanTemples();
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'live' | 'upcoming'>('all');

  const temples = allTemples?.data || [];

  useEffect(() => {
    const firstLiveTemple = temples.find(t => t.isLive);
    if (firstLiveTemple) {
      setSelectedTemple(firstLiveTemple);
    } else if (temples.length > 0) {
      setSelectedTemple(temples[0]);
    }
  }, [temples]);

  const handleTempleSelect = (temple: Temple) => {
    setIsLoading(true);
    setSelectedTemple(temple);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  const filteredTemples = temples.filter(temple => {
    if (filter === 'live') return temple.isLive;
    if (filter === 'upcoming') return !temple.isLive;
    return true;
  });

  if (allLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-black rounded-lg animate-pulse" style={{ paddingBottom: '56.25%' }} />
          <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b" />
            <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="flex items-center p-3 animate-pulse">
                  <div className="h-16 w-24 bg-gray-200 rounded" />
                  <div className="ml-3 flex-grow">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LiveDarshan() {
  const { data: allTemples, isLoading: allLoading } = useTemples({ hasLiveDarshan: true, limit: 20 });
  const { data: liveTemples } = useLiveDarshanTemples();
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'live' | 'upcoming'>('all');

  const temples = allTemples?.data || [];

  useEffect(() => {
    const firstLiveTemple = temples.find(t => t.isLive);
    if (firstLiveTemple) {
      setSelectedTemple(firstLiveTemple);
    } else if (temples.length > 0) {
      setSelectedTemple(temples[0]);
    }
  }, [temples]);

  const handleTempleSelect = (temple: Temple) => {
    setIsLoading(true);
    setSelectedTemple(temple);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  const filteredTemples = temples.filter(temple => {
    if (filter === 'live') return temple.isLive;
    if (filter === 'upcoming') return !temple.isLive;
    return true;
  });

  if (allLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-black rounded-lg animate-pulse" style={{ paddingBottom: '56.25%' }} />
          <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b" />
            <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="flex items-center p-3 animate-pulse">
                  <div className="h-16 w-24 bg-gray-200 rounded" />
                  <div className="ml-3 flex-grow">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}