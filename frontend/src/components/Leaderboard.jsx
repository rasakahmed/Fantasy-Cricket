import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Table, Badge, Loading, Button } from './ui';

function Leaderboard() {
  const { leagueId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [selectedGameweek, setSelectedGameweek] = useState(null);
  
  useEffect(() => {
    fetchLeaderboard();
  }, [leagueId, selectedGameweek]);
  
  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const url = leagueId 
        ? `http://localhost:3001/api/leagues/${leagueId}/leaderboard${selectedGameweek ? `?gameweek_id=${selectedGameweek}` : ''}`
        : 'http://localhost:3001/api/leagues/1/leaderboard';
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      
      const result = await response.json();
      setLeaderboardData(result.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const columns = [
    {
      header: 'Rank',
      accessor: 'league_rank',
      render: (value) => (
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">
            {value === 1 && '🥇'}
            {value === 2 && '🥈'}
            {value === 3 && '🥉'}
            {value > 3 && `#${value}`}
          </span>
        </div>
      )
    },
    {
      header: 'Team',
      accessor: 'team_name',
      render: (value, row) => (
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {value}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            by {row.owner_username}
          </div>
        </div>
      )
    },
    {
      header: 'Total Points',
      accessor: 'total_points',
      render: (value) => (
        <Badge variant="primary" size="lg">
          {value} pts
        </Badge>
      )
    },
    {
      header: 'GW Points',
      accessor: 'latest_gw_points',
      render: (value) => (
        <span className="font-semibold text-gray-700 dark:text-gray-300">
          {value || 0}
        </span>
      )
    }
  ];
  
  if (loading) {
    return <Loading fullScreen text="Loading leaderboard..." />;
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 p-6">
        <Card className="max-w-2xl mx-auto">
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 text-lg">
              Error: {error}
            </p>
            <Button onClick={fetchLeaderboard} className="mt-4">
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 p-6 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🏆 Leaderboard
          </h1>
          {leaderboardData?.league && (
            <div className="flex items-center gap-3">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {leaderboardData.league.league_name}
              </p>
              <Badge variant="info">
                {leaderboardData.league.league_code}
              </Badge>
            </div>
          )}
        </div>
        
        {/* Filters */}
        <Card className="mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter by Gameweek:
            </span>
            <Button
              variant={!selectedGameweek ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedGameweek(null)}
            >
              All Gameweeks
            </Button>
            {[1, 2, 3, 4, 5].map((gw) => (
              <Button
                key={gw}
                variant={selectedGameweek === gw ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedGameweek(gw)}
              >
                GW {gw}
              </Button>
            ))}
          </div>
        </Card>
        
        {/* Leaderboard Table */}
        <Card noPadding>
          <Table
            columns={columns}
            data={leaderboardData?.leaderboard || []}
            striped
            hover
          />
        </Card>
        
        {/* Pagination Info */}
        {leaderboardData?.pagination && (
          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Showing {leaderboardData.pagination.total} teams
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
