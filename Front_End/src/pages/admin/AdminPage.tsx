import { UseAuthStore } from '@/stores/UseAuthStore';
import { UseMusicStore } from '@/stores/UseMusicStore';
import React, { useEffect } from 'react'
import Header from './components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Album, Music } from 'lucide-react';
import DashboardStats from './components/DashboardStats';
import SongsTabContent from './components/SongsTabContent';
import AlbumsTabContent from './components/AlbumsTabContent';

const AdminPage = () => {
    const { isAdmin, isLoading } = UseAuthStore();

	const { fetchAlbums, fetchSongs, fetchStats } = UseMusicStore();

	useEffect(() => {
		fetchAlbums();
		fetchSongs();
		fetchStats();
	}, [fetchAlbums, fetchSongs, fetchStats]);

    if (!isAdmin && !isLoading) {
        return (
            <div className='flex items-center justify-center h-screen'>
                <h1 className='text-2xl font-bold text-white'>Access Denied</h1>
            </div>
        )
    }

  return (
		<div
			className='min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900
   to-black text-zinc-100 p-8'
		>
			<Header />

			<DashboardStats />

			<Tabs defaultValue='songs' className='space-y-6'>
				<TabsList className='p-1 bg-zinc-800/50'>
					<TabsTrigger value='songs' className='data-[state=active]:bg-zinc-700'>
						<Music className='mr-2 size-4' />
						Songs
					</TabsTrigger>
					<TabsTrigger value='albums' className='data-[state=active]:bg-zinc-700'>
						<Album className='mr-2 size-4' />
						Albums
					</TabsTrigger>
				</TabsList>

				<TabsContent value='songs'>
					<SongsTabContent />
				</TabsContent>
				<TabsContent value='albums'>
					<AlbumsTabContent />
				</TabsContent>
			</Tabs>
		</div>
	);
}

export default AdminPage