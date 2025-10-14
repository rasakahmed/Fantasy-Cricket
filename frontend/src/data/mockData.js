export const players = [
  // Batsmen
  { id: 1, name: 'Virat Kohli', team: 'RCB', role: 'Batsman', cost: 15, rating: 'A', totalPoints: 950 },
  { id: 2, name: 'Rohit Sharma', team: 'MI', role: 'Batsman', cost: 15, rating: 'A', totalPoints: 920 },
  { id: 3, name: 'KL Rahul', team: 'LSG', role: 'Batsman', cost: 13, rating: 'B', totalPoints: 850 },
  { id: 4, name: 'Shubman Gill', team: 'GT', role: 'Batsman', cost: 12, rating: 'B', totalPoints: 820 },
  { id: 5, name: 'David Warner', team: 'DC', role: 'Batsman', cost: 14, rating: 'A', totalPoints: 890 },
  { id: 6, name: 'Shreyas Iyer', team: 'KKR', role: 'Batsman', cost: 11, rating: 'C', totalPoints: 780 },
  { id: 7, name: 'Suryakumar Yadav', team: 'MI', role: 'Batsman', cost: 12, rating: 'B', totalPoints: 810 },
  { id: 8, name: 'Jos Buttler', team: 'RR', role: 'Batsman', cost: 14, rating: 'A', totalPoints: 880 },
  
  // Wicket Keepers
  { id: 9, name: 'MS Dhoni', team: 'CSK', role: 'Wicket Keeper', cost: 12, rating: 'B', totalPoints: 750 },
  { id: 10, name: 'Rishabh Pant', team: 'DC', role: 'Wicket Keeper', cost: 13, rating: 'B', totalPoints: 820 },
  { id: 11, name: 'Quinton de Kock', team: 'LSG', role: 'Wicket Keeper', cost: 11, rating: 'C', totalPoints: 760 },
  { id: 12, name: 'Ishan Kishan', team: 'MI', role: 'Wicket Keeper', cost: 10, rating: 'C', totalPoints: 720 },
  { id: 13, name: 'Sanju Samson', team: 'RR', role: 'Wicket Keeper', cost: 11, rating: 'C', totalPoints: 740 },
  
  // Bowlers
  { id: 14, name: 'Jasprit Bumrah', team: 'MI', role: 'Bowler', cost: 15, rating: 'A', totalPoints: 920 },
  { id: 15, name: 'Rashid Khan', team: 'GT', role: 'Bowler', cost: 14, rating: 'A', totalPoints: 890 },
  { id: 16, name: 'Yuzvendra Chahal', team: 'RR', role: 'Bowler', cost: 12, rating: 'B', totalPoints: 830 },
  { id: 17, name: 'Mohammed Shami', team: 'GT', role: 'Bowler', cost: 13, rating: 'B', totalPoints: 850 },
  { id: 18, name: 'Kagiso Rabada', team: 'PBKS', role: 'Bowler', cost: 13, rating: 'B', totalPoints: 840 },
  { id: 19, name: 'Trent Boult', team: 'RR', role: 'Bowler', cost: 12, rating: 'B', totalPoints: 810 },
  { id: 20, name: 'Bhuvneshwar Kumar', team: 'SRH', role: 'Bowler', cost: 10, rating: 'C', totalPoints: 750 },
  
  // Mixed Role (All-rounders)
  { id: 21, name: 'Hardik Pandya', team: 'GT', role: 'Mixed Role', cost: 14, rating: 'A', totalPoints: 900 },
  { id: 22, name: 'Andre Russell', team: 'KKR', role: 'Mixed Role', cost: 13, rating: 'B', totalPoints: 860 },
  { id: 23, name: 'Ravindra Jadeja', team: 'CSK', role: 'Mixed Role', cost: 13, rating: 'B', totalPoints: 870 },
  { id: 24, name: 'Glenn Maxwell', team: 'RCB', role: 'Mixed Role', cost: 12, rating: 'B', totalPoints: 820 },
  { id: 25, name: 'Axar Patel', team: 'DC', role: 'Mixed Role', cost: 10, rating: 'C', totalPoints: 760 },
  { id: 26, name: 'Krunal Pandya', team: 'LSG', role: 'Mixed Role', cost: 9, rating: 'D', totalPoints: 720 },
  { id: 27, name: 'Washington Sundar', team: 'SRH', role: 'Mixed Role', cost: 8, rating: 'D', totalPoints: 690 },
  { id: 28, name: 'Sam Curran', team: 'PBKS', role: 'Mixed Role', cost: 11, rating: 'C', totalPoints: 780 },
  { id: 29, name: 'Moeen Ali', team: 'CSK', role: 'Mixed Role', cost: 10, rating: 'C', totalPoints: 750 },
  { id: 30, name: 'Venkatesh Iyer', team: 'KKR', role: 'Mixed Role', cost: 9, rating: 'D', totalPoints: 710 },
]

export const fixtures = [
  { id: 1, team1: 'MI', team2: 'CSK', date: '2025-10-20', time: '19:30', venue: 'Wankhede Stadium', status: 'Upcoming' },
  { id: 2, team1: 'RCB', team2: 'KKR', date: '2025-10-21', time: '19:30', venue: 'M. Chinnaswamy Stadium', status: 'Upcoming' },
  { id: 3, team1: 'DC', team2: 'RR', date: '2025-10-22', time: '15:30', venue: 'Arun Jaitley Stadium', status: 'Upcoming' },
  { id: 4, team1: 'GT', team2: 'LSG', date: '2025-10-22', time: '19:30', venue: 'Narendra Modi Stadium', status: 'Upcoming' },
  { id: 5, team1: 'SRH', team2: 'PBKS', date: '2025-10-23', time: '19:30', venue: 'Rajiv Gandhi Intl. Stadium', status: 'Upcoming' },
  { id: 6, team1: 'MI', team2: 'RCB', date: '2025-10-10', time: '19:30', venue: 'Wankhede Stadium', status: 'Completed' },
  { id: 7, team1: 'CSK', team2: 'KKR', date: '2025-10-11', time: '19:30', venue: 'M. A. Chidambaram Stadium', status: 'Completed' },
]

export const gameweekPoints = [
  { playerId: 1, playerName: 'Virat Kohli', team: 'RCB', role: 'Batsman', points: 85 },
  { playerId: 14, playerName: 'Jasprit Bumrah', team: 'MI', role: 'Bowler', points: 72 },
  { playerId: 21, playerName: 'Hardik Pandya', team: 'GT', role: 'Mixed Role', points: 68 },
  { playerId: 9, playerName: 'MS Dhoni', team: 'CSK', role: 'Wicket Keeper', points: 45 },
  { playerId: 2, playerName: 'Rohit Sharma', team: 'MI', role: 'Batsman', points: 52 },
  { playerId: 15, playerName: 'Rashid Khan', team: 'GT', role: 'Bowler', points: 61 },
  { playerId: 23, playerName: 'Ravindra Jadeja', team: 'CSK', role: 'Mixed Role', points: 58 },
  { playerId: 3, playerName: 'KL Rahul', team: 'LSG', role: 'Batsman', points: 42 },
  { playerId: 16, playerName: 'Yuzvendra Chahal', team: 'RR', role: 'Bowler', points: 55 },
  { playerId: 22, playerName: 'Andre Russell', team: 'KKR', role: 'Mixed Role', points: 73 },
  { playerId: 10, playerName: 'Rishabh Pant', team: 'DC', role: 'Wicket Keeper', points: 48 },
]