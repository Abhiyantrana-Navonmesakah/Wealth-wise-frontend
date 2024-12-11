import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';
import 'font-awesome/css/font-awesome.min.css';
import Navbar from './navbar.js'
import { useNavigate } from 'react-router-dom';



function extractVideoId(url) {
  const regex = /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|(?:https?:\/\/(?:www\.)?youtu\.be\/))([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  if (match && match[1]) {
    return match[1];
  } else {
    console.error('No match found for URL:', url);
    return null;
  }
}

function formatDuration(duration) {
  const regex = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
  const match = duration.match(regex);
  
  if (!match) return 'Invalid duration format';
  
  const minutes = match[2] ? match[2] : '0';
  const seconds = match[3] ? match[3] : '0';
  
  return `${minutes}:${seconds.padStart(2, '0')}`;
}

function formatViews(views) {
  if (typeof views !== 'number') {
    return 'Invalid view count';
  }

  if (views >= 1e6) {
    return (views / 1e6).toFixed(1) + 'M views';
  } else if (views >= 1e3) {
    return (views / 1e3).toFixed(1) + 'K views';
  } else {
    return views + ' views';
  }
}
async function fetchYouTubeVideoDetails(link) {
  const API_KEY = 'AIzaSyC-y_81kkguQwtMrMBTYs-hDFmx3C_my0w';
  const videoId = extractVideoId(link);
  if (!videoId) {
    console.log('Invalid YouTube link!');
    return;
  }

  const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${API_KEY}&part=snippet,contentDetails,statistics`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.items.length > 0) {
      const video = data.items[0];

      const videoDetails = {
        name: video.snippet.title,
        thumbnail: video.snippet.thumbnails.high.url,
        duration: formatDuration(video.contentDetails.duration),
        views: formatViews(video.statistics.viewCount),
        videoUrl: `https://youtu.be/${videoId}`,
      };
      return videoDetails;
    } else {
      console.log('Video not found!');
    }
  } catch (error) {
    console.error('Error fetching video details:', error);
  }
}

const items = [
  'https://youtu.be/fiLVHI8CUZE?si=5fsPZh713j1OsKhP',
    'https://youtu.be/7c4ZJ-ljRMw?si=RfoeTdPrI1xqrSTA',
    'https://youtu.be/-FP7IVNN4bI?si=tF6yy1r7ZsyAxd5b'
];

async function fetchAllVideos() {
  const videoDetails = await Promise.all(
    items.map(async (link) => {
      
      return await fetchYouTubeVideoDetails(link);
    })
  );
  console.log(videoDetails);
  return videoDetails;

}



const Home = ({ mail = 'User' }) => {


   const [videoDetails, setVideoDetails] = useState([]);

  const videoLinks = [
    'https://youtu.be/fiLVHI8CUZE?si=5fsPZh713j1OsKhP',
    'https://youtu.be/7c4ZJ-ljRMw?si=RfoeTdPrI1xqrSTA',
    'https://youtu.be/-FP7IVNN4bI?si=tF6yy1r7ZsyAxd5b'
  ];

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const details = await Promise.all(
          videoLinks.map(link => fetchYouTubeVideoDetails(link))
        );
        setVideoDetails(details.filter(detail => detail !== null));
      } catch (error) {
        console.error('Failed to fetch video details', error);
      }
    };

    fetchVideos();
  }, []);


  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! How can I assist you today?' },
  ]);
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (input.trim() === '') return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);

    const assistantMessage = {
      role: 'assistant',
      content: `You said: "${input.trim()}"`,
    };
    setTimeout(() => {
      setMessages((prev) => [...prev, assistantMessage]);
    }, 500);

    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSendMessage();
  };



    const StocksData = () => {  
        const [activeButton, setActiveButton] = useState(null);

        const navigate = useNavigate();

        useEffect(() => {
          if (activeButton === "Chat with Niveshak") {
            navigate('/chatbot');
          }
          else if ( activeButton === "Personalized Mutual Funds"){
            navigate('/personal-MF');
          }
          else if ( activeButton === "Personalized FD"){
            navigate('/fd-recommendations');
          }

        }, [activeButton, navigate]);

        const personalizeButtons = [
            { 
              name: 'Personalized Stocks', 
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1116.5 16h-11z" />
                </svg>
              )
            },
            { 
              name: 'Personalized FD', 
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm4-1a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              )
            },
            { 
              name: 'Personalized Mutual Funds', 
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              )
            },
            { 
              name: 'Chat with Niveshak', 
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                </svg>
              )
            }
          ];
        const investments = [
        {
            type: 'Stocks',
            items: [
              { name: 'Reliance Industries', code: 'RELIANCE', return: 12.5, icon: '₹' },
              { name: 'HDFC Bank', code: 'HDFCBANK', return: 15.3, icon: '₹' },
              { name: 'TCS', code: 'TCS', return: 10.2, icon: '₹' },
              { name: 'Infosys', code: 'INFY', return: 11.8, icon: '₹' },
              { name: 'ICICI Bank', code: 'ICICIBANK', return: 13.6, icon: '₹' },
              { name: 'TCS', code: 'TCS', return: 10.2, icon: '₹' },
              { name: 'Infosys', code: 'INFY', return: 11.8, icon: '₹' },
              { name: 'ICICI Bank', code: 'ICICIBANK', return: 13.6, icon: '₹' }
              
            ]
          },
          {
            type: 'Fixed Deposits',
            items: [
              { name: 'SBI FD', code: 'SBIFD', return: 7.5, icon: '₹' },
              { name: 'HDFC FD', code: 'HDFCFD', return: 7.2, icon: '₹' },
              { name: 'ICICI FD', code: 'ICICFD', return: 7.8, icon: '₹' }
            ]
          },
          {
            type: 'Mutual Funds',
            items: [
              { name: 'HDFC Bluechip', code: 'HDFCBLUE', return: 16.5, icon: '₹' },
              { name: 'Axis Midcap', code: 'AXISMID', return: 18.3, icon: '₹' },
              { name: 'SBI Largecap', code: 'SBILARGE', return: 15.2, icon: '₹' },
              { name: 'ICICI Prudential', code: 'ICICIPRu', return: 17.1, icon: '₹' }
            ]
          },
          {
            type: 'Investment Videos',
            items: [
              { 
                id : 0,
                details : ('https://youtu.be/fiLVHI8CUZE?si=5fsPZh713j1OsKhP')
              },
              { 
                id : 1,
                details : ('https://youtu.be/7c4ZJ-ljRMw?si=RfoeTdPrI1xqrSTA')
              },
              {
                id : 2,
                details : ('https://youtu.be/-FP7IVNN4bI?si=tF6yy1r7ZsyAxd5b')
              }
            ]
          }
      ];
      
    return  (
        <div 
        className="inset-0 bg-gradient-to-br from-blue-1500/90 to-purple-1500/90 text-white p-4 overflow-hidden w-full " 
        style={{ justifyContent: 'center', alignItems: 'center', margin: 'auto' }}
        >
          
          <div 
            className="grid grid-cols-2 gap-4 mb-6 pb-2 overflow-hidden" style={{marginTop:'20px',marginBottom:'40px'}}
            >
            {personalizeButtons.map((button) => (
                <button 
                key={button.name}
                onClick={() => setActiveButton(button.name)}
                className={`
                    flex items-center space-x-2 px-4 py-2 
                    transform transition-all duration-300
                    
                    ${activeButton === button.name 
                    ? 'bg-gradient-to-br from-blue-900/50 to-purple-900/90  text-white scale-105 shadow-lg' 
                    : 'bg-gradient-to-br from-blue-900/90 to-purple-900/50 text-gray-300 hover:bg-gray-700'}
                `}

                style={{margin:'10px',height:'90px',borderRadius:'15px'}}
                >
                
                <span 
                    className="flex items-center justify-center text-sm font-medium mx-auto"
                    >
                    {button.icon}&nbsp;&nbsp;{button.name}
                </span>
                </button>
            ))}
            </div>
    
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Top Investments & Learning
          </h2>
    
          {investments.map((category, categoryIndex) => (
            <div key={category.type} className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-bg-gradient-to-br from-blue-900/90 to-purple-900/50">{category.type}</h3>
              
              <div 
                className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide whitespace-nowrap scroll-smooth overflow-hidden"
                style={{
                  scrollSnapType: 'x mandatory',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {category.items.map((investment, index) => {

                  const bgIntensity = Math.max(700 - (index * 50), 800);
                  
                  return category.type === 'Investment Videos' && videoDetails && videoDetails[investment.id] ? (
                      <div
                        key={videoDetails[investment.id].name}
                        className={`flex-shrink-0 w-64 bg-gradient-to-br from-blue-900/90 to-purple-900/90-${bgIntensity} rounded-lg p-4 
                          transform transition-all duration-300 
                          hover:scale-105 hover:shadow-lg
                          scroll-snap-align: start;`}
                      >
                        <div className="relative mb-3">
                          <img
                            src={videoDetails[investment.id].thumbnail}
                            alt={videoDetails[investment.id].name}
                            onClick={() => window.open(videoDetails[investment.id].videoUrl, '_blank')}
                            className="w-full h-40 object-cover rounded-md"
                          />
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 rounded">
                            {videoDetails[investment.id].duration}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-lg line-clamp-2">{videoDetails[investment.id].name}</h4>
                          <p className="text-sm text-gray-300">{videoDetails[investment.id].views} views</p>
                        </div>
                      </div>
                    ) : (
                    <div 
                      key={investment.code || investment.name} 
                      className={`flex-shrink-0 w-64 bg-gradient-to-br from-blue-1500/90 to-purple-1500/90${bgIntensity} rounded-lg p-4 
                        transform transition-all duration-300 
                        hover:scale-105 hover:shadow-lg
                        scroll-snap-align: start;`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <h4 className="font-bold text-lg">{investment.name}</h4>
                          <p className="text-sm text-gray-400">{investment.code}</p>
                        </div>
                        <span className="text-green-500 font-bold text-xl">₹</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="bg-green-900 text-green-400 px-2 py-1 rounded-full text-sm">
                          +{investment.return}%
                        </div>
                        <span className="text-sm text-white-500">Annual Return</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      );
      };
      

      

  const [isLoading, setIsLoading] = useState(false);
  const [isChatbotVisible, setIsChatbotVisible] = useState(false); 
  const messagesEndRef = useRef(null);

  const generateFinancialResponse = (userInput) => {
    const lowercaseInput = userInput.toLowerCase();

    if (lowercaseInput.includes('invest')) {
      return "Great question! Consider diversifying your portfolio across different asset classes. Index funds and ETFs can be good starting points for most investors.";
    } else if (lowercaseInput.includes('savings')) {
      return "For savings, aim to build an emergency fund covering 3-6 months of expenses. Look into high-yield savings accounts to earn better interest.";
    } else if (lowercaseInput.includes('retirement')) {
      return "For retirement planning, maximize contributions to tax-advantaged accounts like 401(k) and IRAs. The earlier you start, the more you can benefit from compound interest.";
    } else if (lowercaseInput.includes('debt')) {
      return "When managing debt, prioritize high-interest debt first. Consider the debt avalanche method: pay minimums on all debts, then put extra money towards the highest interest debt.";
    } else {
      return "I can help with investment, savings, retirement, and debt questions. What specific financial advice are you looking for?";
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length,
      text: input,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);


    setTimeout(() => {
      const botResponse = {
        id: messages.length + 1,
        text: generateFinancialResponse(input),
        sender: 'bot',
      };

      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const toggleChatbot = () => {
    setIsChatbotVisible((prev) => !prev);
  };

  

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 1 }} 
      animate={{ opacity: 1, y: 0, scale: 1 }} 
      transition={{ duration: 0.3, ease: "easeIn" }}
    >
      <div className=' bg-gradient-to-br from-blue-900/50 to-purple-900/50 ' >
        <Navbar/>

      <StocksData/>

      </div>
    </motion.div>

  );
};

export default Home;
