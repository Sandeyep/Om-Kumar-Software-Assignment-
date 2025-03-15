import { useEffect, useState } from 'react';
import axios from 'axios';
import { UsersIcon, HomeIcon, TagIcon } from '@heroicons/react/24/outline';

export default function DashboardHome() {
  const [stats, setStats] = useState({
    users: 0,
    properties: 0,
    categories: new Set(),
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, propertiesRes] = await Promise.all([
          axios.get('http://localhost:4000/user'),
          axios.get('http://localhost:4000/property'),
        ]);

        const categories = new Set(propertiesRes.data.map((property) => property.type));

        setStats({
          users: usersRes.data.length,
          properties: propertiesRes.data.length,
          categories: categories.size,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        Dashboard Overview
      </h2>

      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Total Users</dt>
          <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
            <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
              {stats.users}
              <UsersIcon className="ml-2 h-5 w-5 flex-shrink-0" aria-hidden="true" />
            </div>
          </dd>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Total Properties</dt>
          <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
            <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
              {stats.properties}
              <HomeIcon className="ml-2 h-5 w-5 flex-shrink-0" aria-hidden="true" />
            </div>
          </dd>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Categories</dt>
          <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
            <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
              {stats.categories}
              <TagIcon className="ml-2 h-5 w-5 flex-shrink-0" aria-hidden="true" />
            </div>
          </dd>
        </div>
      </dl>
    </div>
  );
}
