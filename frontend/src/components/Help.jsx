import { useState } from 'react'
import './Help.css'

function Help() {
  const [activeTab, setActiveTab] = useState('faqs')
  const [expandedFaq, setExpandedFaq] = useState(null)

  const faqs = [
    {
      category: 'Your Fantasy Cricket account',
      questions: [
        {
          id: 1,
          question: 'I cannot sign in. What do I need to do?',
          answer: 'Please ensure you are using your registered e-mail address and correct password. Note that the password is case sensitive. If you\'ve recently registered and you haven\'t received an email to confirm your account, please check your spam or junk mail folders. If you can\'t log in to your account, try resetting your password. An email will be sent to your mailbox with instructions on how to reset your password. If you do not receive the email, please check your Junk folder in your email inbox and add noreply@email.account.fantasycricket.com to your address book.'
        },
        {
          id: 2,
          question: 'I have set up a team, but I can\'t see my History or renew my leagues from previous seasons. Can you link my new account to my old one?',
          answer: 'Unfortunately, we cannot link your history from an old account to a new one. If you have set up a team for this season using a different email address, you will not be able to view your History from previous seasons on that account. In order to see previous seasons\' scores, you will need to sign in on the homepage using the registered email address and password combination from the previous seasons and set up a team using that account.'
        },
        {
          id: 3,
          question: 'How do I change my email address or password?',
          answer: 'To change your email address or password, go to your Profile page and click on "Account Settings". From there you can update your email address and password. Make sure to use a strong password for security purposes.'
        },
        {
          id: 4,
          question: 'Can I delete my account?',
          answer: 'Yes, you can delete your account by contacting our support team. Please note that once your account is deleted, all your data including team history, points, and league information will be permanently removed and cannot be recovered.'
        }
      ]
    },
    {
      category: 'Choosing your initial squad',
      questions: [
        {
          id: 5,
          question: 'Can I have more than one team?',
          answer: 'In the interest of fair play each person may only enter one team. You may enter this team in multiple leagues and compete against different groups of friends.'
        },
        {
          id: 6,
          question: 'Can I make changes to my squad after entering the game?',
          answer: 'Yes, unlimited free transfers can be made before the next deadline. After the season starts, you can make one transfer per gameweek on the Modify Team page.'
        },
        {
          id: 7,
          question: 'How many players can I select from one team?',
          answer: 'You can select a maximum of 3 players from any one team. This rule ensures diversity in your squad and makes the game more balanced and competitive.'
        },
        {
          id: 8,
          question: 'What is the budget limit?',
          answer: 'You have a total budget of 125 points to build your team of 11 players. Players are rated from A (15 points) to G (3 points) based on their performance and popularity. You must select your team within this budget constraint.'
        },
        {
          id: 9,
          question: 'How are players rated?',
          answer: 'Players are rated from A to G based on their recent performance, consistency, and match impact. A-rated players cost 15 points, while G-rated players cost 3 points. The ratings are updated regularly to reflect current form.'
        }
      ]
    },
    {
      category: 'Managing Your Squad',
      questions: [
        {
          id: 10,
          question: 'How do I select my starting 11?',
          answer: 'Your starting 11 consists of all the players you select during team creation. You must choose: 3 Batsmen, 1 Wicket Keeper, 3 Bowlers, and 4 Mixed Role players. All 11 players will participate in scoring points for your team.'
        },
        {
          id: 11,
          question: 'What happens if my captain doesn\'t play?',
          answer: 'If your captain doesn\'t play in a match, your vice-captain will automatically take over the captaincy duties for that match and will earn double points instead. This ensures you don\'t lose out on the captain bonus.'
        },
        {
          id: 12,
          question: 'Can I change my captain during the gameweek?',
          answer: 'Yes, you can change your captain and vice-captain at any time before the match deadline. Go to the Modify Team page and update your captain and vice-captain selections as needed.'
        },
        {
          id: 13,
          question: 'What are Mixed Role players?',
          answer: 'Mixed Role players are all-rounders who can contribute with both bat and ball. In the Mixed Role positions, you can select any player from any category (Batsmen, Bowlers, Wicket Keepers, or All-rounders) giving you more flexibility in team selection.'
        }
      ]
    },
    {
      category: 'Transfers',
      questions: [
        {
          id: 14,
          question: 'How many transfers can I make?',
          answer: 'Before the season starts, you can make unlimited transfers. Once the season begins, you are allowed to make ONE transfer per gameweek. You can also change your captain and vice-captain at any time without it counting as a transfer.'
        },
        {
          id: 15,
          question: 'When is the transfer deadline?',
          answer: 'The transfer deadline is typically 1 hour before the first match of the gameweek starts. Make sure to complete your transfers before the deadline, as you won\'t be able to make changes after that.'
        },
        {
          id: 16,
          question: 'What are the transfer rules?',
          answer: 'You can only transfer one player per gameweek after the season starts. The new player must fit within your budget constraints and team composition rules (max 3 from same team, position requirements). Captain and vice-captain changes don\'t count as transfers.'
        },
        {
          id: 17,
          question: 'Do unused transfers carry over?',
          answer: 'No, unused transfers do not carry over to the next gameweek. Each gameweek you get one fresh transfer opportunity. It\'s a "use it or lose it" system.'
        }
      ]
    },
    {
      category: 'Scoring',
      questions: [
        {
          id: 18,
          question: 'How are points calculated?',
          answer: 'Points are awarded based on player performance: Runs scored (1 point per run), Wickets taken (25 points per wicket), Catches (8 points per catch), Run-outs (10 points), Boundaries (1 extra point for 4s, 2 extra for 6s), and various bonuses for exceptional performances. Your captain earns double points!'
        },
        {
          id: 19,
          question: 'Do captains earn double points?',
          answer: 'Yes! Your captain earns DOUBLE points for all their contributions. However, they also lose double points for poor performances. Choose your captain wisely based on form, opposition, and playing conditions.'
        },
        {
          id: 20,
          question: 'Are there bonus points?',
          answer: 'Yes, bonus points are awarded for outstanding performances such as centuries (50+ runs), five-wicket hauls, hat-tricks, and match-winning performances. These bonuses can significantly boost your team\'s score.'
        },
        {
          id: 21,
          question: 'What if a player doesn\'t play?',
          answer: 'If a player in your team doesn\'t play in a match, they score 0 points for that gameweek. This is why it\'s important to stay updated on team news and player availability.'
        }
      ]
    },
    {
      category: 'Leagues',
      questions: [
        {
          id: 22,
          question: 'How do I join a league?',
          answer: 'You can join public leagues directly by clicking the "Join League" button on the Leagues page. For private leagues, you need a join key provided by the league creator. Enter the join key when prompted to join the private league.'
        },
        {
          id: 23,
          question: 'What\'s the difference between public and private leagues?',
          answer: 'Public leagues are visible to all users and anyone can join them. Private leagues require a unique join key to join and are typically used for playing with friends, family, or specific groups. Only the league creator can see and share the join key for private leagues.'
        },
        {
          id: 24,
          question: 'How do I create a private league?',
          answer: 'Click "Create a League" on the Leagues page, enter a league name, select "Private" as the league type, and click Create. A unique join key will be generated that you can share with others to let them join your league.'
        },
        {
          id: 25,
          question: 'Can I join multiple leagues?',
          answer: 'Yes! You can join as many leagues as you want with the same team. Your team\'s performance will be tracked across all leagues you join, allowing you to compete with different groups simultaneously.'
        },
        {
          id: 26,
          question: 'How are league rankings calculated?',
          answer: 'League rankings are based on total points accumulated throughout the season. The user with the highest points tops the league. Rankings are updated after each gameweek based on your team\'s performance.'
        }
      ]
    }
  ]

  const rules = {
    'Selecting Your Initial Squad': {
      icon: '🏏',
      sections: [
        {
          title: 'Squad Size',
          content: 'Your squad must consist of exactly 11 players. You cannot have more or fewer players in your team.'
        },
        {
          title: 'Budget',
          content: 'You have a budget of 125 points to select your entire squad. Players are rated from A (15 points) to G (3 points). The combined cost of all your players must not exceed 125 points.'
        },
        {
          title: 'Players Per Team',
          content: 'You can select a maximum of 3 players from any single team. This ensures diversity and makes team selection more strategic and balanced.'
        },
        {
          title: 'Position Requirements',
          content: 'Your 11 players must include: 3 Batsmen, 1 Wicket Keeper, 3 Bowlers, and 4 Mixed Role players (who can be from any category).'
        }
      ]
    },
    'Managing your squad': {
      icon: '⚙️',
      sections: [
        {
          title: 'Choosing Your Starting 11',
          content: 'All 11 players you select will be your starting lineup. There is no bench system - all your players participate in scoring points based on their real-world performance.'
        },
        {
          title: 'Selecting a Captain',
          content: 'You must select one player as your captain. Your captain earns DOUBLE points for all their contributions (runs, wickets, catches, etc.). However, they also lose double points for poor performances like ducks or expensive bowling. Choose wisely!'
        },
        {
          title: 'Vice Captain',
          content: 'You must also select a vice-captain. If your captain doesn\'t play in a match, your vice-captain automatically becomes the captain for that match and earns double points. This acts as insurance for your captain choice.'
        }
      ]
    },
    'Transfers': {
      icon: '🔄',
      sections: [
        {
          title: 'Transfer Rules',
          content: 'Before the season starts, you can make unlimited free transfers to set up your squad perfectly. Once the season begins, you can make ONE player transfer per gameweek. Captain and vice-captain changes can be made at any time and do not count as transfers.'
        },
        {
          title: 'Transfer Constraints',
          content: 'All normal team rules apply to transfers: your team must remain within the 125-point budget, maintain position requirements (3 batsmen, 1 WK, 3 bowlers, 4 mixed), and have no more than 3 players from the same team.'
        },
        {
          title: 'Transfer Deadline',
          content: 'The transfer deadline is typically 1 hour before the first match of the gameweek. Ensure you complete your transfers before this deadline. Late transfers will not be accepted.'
        }
      ]
    },
    'Scoring': {
      icon: '📊',
      sections: [
        {
          title: 'Batting Points',
          content: 'Runs: 1 point per run scored. Boundaries: +1 point for each four, +2 points for each six. Half-Century: +25 bonus points. Century: +50 bonus points. Strike Rate bonus: +10 points for SR > 150 (min 20 balls).'
        },
        {
          title: 'Bowling Points',
          content: 'Wickets: 25 points per wicket. 4-wicket haul: +25 bonus points. 5-wicket haul: +50 bonus points. Maiden over: +10 points. Economy rate bonus: +15 points for ER < 5 (min 2 overs bowled).'
        },
        {
          title: 'Fielding Points',
          content: 'Catch: 8 points. Stumping: 12 points. Run-out (direct hit): 12 points. Run-out (assister): 6 points. Three or more catches: +5 bonus points.'
        },
        {
          title: 'Captain Bonus',
          content: 'Your captain earns DOUBLE points for all scoring categories. This applies to both positive and negative points. If captain doesn\'t play, vice-captain automatically gets the double points bonus.'
        },
        {
          title: 'Negative Points',
          content: 'Duck (batsman out for 0): -5 points. Expensive bowling: -1 point for every 2 runs conceded over 30 (in 4 overs). These negative points are also doubled for captains.'
        }
      ]
    },
    'Leagues': {
      icon: '🏆',
      sections: [
        {
          title: 'Joining a League',
          content: 'Public leagues can be joined directly from the Leagues page by clicking "Join League". Private leagues require a join key that must be provided by the league creator. You can join as many leagues as you want with the same team.'
        },
        {
          title: 'League Types',
          content: 'Public Leagues: Visible to all users, anyone can join without restrictions. Great for competing globally. Private Leagues: Require a unique join key to join. Perfect for competing with friends, family, or colleagues. League creator can share the key selectively.'
        },
        {
          title: 'Creating a League',
          content: 'Anyone can create a league. Choose a unique league name and select whether it should be public or private. For private leagues, a unique 8-character join key is automatically generated. Share this key with people you want to invite.'
        },
        {
          title: 'League Scoring',
          content: 'Your total points from all gameweeks determine your league rank. Rankings update after each gameweek. The user with the highest points leads the league. All members compete with the same gameweek schedule and rules.'
        }
      ]
    }
  }

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id)
  }

  return (
    <div className="help-container">
      <div className="help-header">
        <h1>❓ Help & Support</h1>
        <p>Find answers to your questions and learn the rules</p>
      </div>

      <div className="help-tabs">
        <button 
          className={`tab-btn ${activeTab === 'faqs' ? 'active' : ''}`}
          onClick={() => setActiveTab('faqs')}
        >
          📋 FAQs
        </button>
        <button 
          className={`tab-btn ${activeTab === 'rules' ? 'active' : ''}`}
          onClick={() => setActiveTab('rules')}
        >
          📖 Rules
        </button>
      </div>

      <div className="help-content">
        {activeTab === 'faqs' && (
          <div className="faqs-section">
            {faqs.map((category, catIndex) => (
              <div key={catIndex} className="faq-category">
                <h2 className="category-title">{category.category}</h2>
                <div className="faq-list">
                  {category.questions.map((faq) => (
                    <div key={faq.id} className="faq-item">
                      <div 
                        className="faq-question"
                        onClick={() => toggleFaq(faq.id)}
                      >
                        <h3>{faq.question}</h3>
                        <span className={`arrow ${expandedFaq === faq.id ? 'expanded' : ''}`}>
                          ▼
                        </span>
                      </div>
                      {expandedFaq === faq.id && (
                        <div className="faq-answer">
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="rules-section">
            {Object.entries(rules).map(([title, data], index) => (
              <div key={index} className="rule-category">
                <div className="rule-header">
                  <span className="rule-icon">{data.icon}</span>
                  <h2>{title}</h2>
                </div>
                <div className="rule-content">
                  {data.sections.map((section, sIndex) => (
                    <div key={sIndex} className="rule-section">
                      <h3>{section.title}</h3>
                      <p>{section.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="contact-support">
        <h3>Still need help?</h3>
        <p>Contact our support team at <a href="mailto:support@fantasycricket.com">support@fantasycricket.com</a></p>
      </div>
    </div>
  )
}

export default Help