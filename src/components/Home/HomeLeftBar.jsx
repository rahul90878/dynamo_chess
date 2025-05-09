import React, { useEffect, useState } from 'react';
import { AiFillThunderbolt } from 'react-icons/ai';
import { FaPlusCircle } from 'react-icons/fa';
import { IoIosRocket } from 'react-icons/io';
import { MdOutlineTimer } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { minutesToSeconds } from '../../utils/getuserdata';
import { getApi } from '../../utils/api';

function HomeLeftBar() {
  const [customClick, setCustomClicked] = useState(false);
  const [rangeClick, setRangeClicked] = useState(10);
  const [time, setTime] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [customTime, setCustomTime] = useState(null);
  const navigate = useNavigate();

  // Toggle custom time selection
  const customeHandler = () => {
    setCustomClicked(!customClick);
    setSelectedTime(null); // Reset time when switching
    setSelectedTitle('');
  };

  // Handle range slider for custom time
  const rangeFunc = (value) => {
    setRangeClicked(value);
    setCustomTime(value);
    setSelectedTime(null); // Reset time selection
    setSelectedTitle('');
  };

  // Handle time selection
  const handleTimeClick = async (time, title) => {
    setSelectedTime(time);
    setSelectedTitle(title);
    const timeInSeconds = await minutesToSeconds(time);
    navigate(`/multiplayer/randomMultiplayer/${timeInSeconds}`);
    setCustomTime(null);
  };

  // Handle play button for custom time
  const handlePlayClick = async () => {
    const finalSelectedTime = selectedTime || customTime;

    if (finalSelectedTime) {
      const timeInSeconds = await minutesToSeconds(finalSelectedTime);
      navigate(`/multiplayer/randomMultiplayer/${timeInSeconds}`);
    } else {
      alert('Please select a time.');
    }
  };

  // Fetching available time options
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${import.meta.env.VITE_URL}${import.meta.env.VITE_GET_TIME}`;
        const response = await axios.get(url);
        if (response) {
          setTime(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Fetch banner API
  const Url = `https://chess.dynamochess.in/getBanner?type=Home leftside banner`;

  const queryBanner = useQuery(
    ['banner', Url],
    () => getApi(Url),
    {
      // staleTime: 300000, 
      
    }
  );

  const bannerData = queryBanner?.data?.data?.data || [];

  return (
    <div>
      <div className="mx-2">
        <div className="px-2">
          {[...time]
            .sort((a, b) => {
              const order = ['Bullet', 'Blitz', 'Rapid'];
              return order.indexOf(a.title) - order.indexOf(b.title);
            })
            .map((currentTime, index) => (
              <div key={index} className="my-2">
                {/* Title Section */}
                <div
                  className={`py-1 flex justify-between cursor-pointer rounded-md bg-gray-600 bg-opacity-80 ${
                    selectedTitle === currentTime.title ? 'bg-gray-800' : ''
                  }`}
                  onClick={() => handleTimeClick(currentTime.time1, currentTime.title)}
                >
                  <div className="flex gap-1 px-2">
                    <div className="flex items-center text-yellow-400 text-xl">
                      {currentTime.title === 'Blitz' ? (
                        <AiFillThunderbolt />
                      ) : currentTime.title === 'Rapid' ? (
                        <MdOutlineTimer />
                      ) : (
                        <IoIosRocket />
                      )}
                    </div>
                    <h1 className="text-yellow-300 text-xl">{currentTime.title}</h1>
                  </div>
                </div>

                {/* Times Section */}
                <div className="grid grid-cols-3 gap-2 my-2 text-green-400">
                  {[currentTime.time1, currentTime.time2, currentTime.time3].map((timeValue, idx) => (
                    <p
                      key={idx}
                      className={`bg-gray-600 text-center rounded-md py-3 cursor-pointer ${
                        selectedTime === timeValue && selectedTitle === currentTime.title ? 'bg-gray-800' : ''
                      }`}
                      onClick={() => handleTimeClick(timeValue, currentTime.title)}
                    >
                      {timeValue} min
                    </p>
                  ))}
                </div>
              </div>
            ))}

          {/* Custom Time Section */}
          <div className="my-2">
            <div
              onClick={customeHandler}
              className="py-1 flex justify-between cursor-pointer rounded-md bg-gray-600"
            >
              <div className="flex gap-1 px-2">
                <div className="flex items-center text-xl text-[#FFD700]">
                  <FaPlusCircle />
                </div>
                <h1 className="text-yellow-300 text-xl">Custom</h1>
              </div>
            </div>

            {customClick && (
              <div className="relative mb-6">
                <label htmlFor="labels-range-input" className="sr-only">
                  Labels range
                </label>
                <input
                  onChange={(e) => rangeFunc(e.target.value)}
                  id="labels-range-input"
                  type="range"
                  value={rangeClick}
                  min={10}
                  step={20}
                  max={120}
                  className="w-full accent-green-600 h-2 bg-gray-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {['10min', '30min', '50min', '70min', '90min', '110min'].map((label, i) => (
                    <span key={i}>{label}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Play Button */}
          <div className="mt-3 text-center">
            <button
              onClick={handlePlayClick}
              className="bg-green-600 text-white font-bold text-2xl p-2 rounded-md w-full h-14"
            >
              Play
            </button>
          </div>
        </div>
      </div>

      {/* Banner Section */}
      <h2 className="text-center font-bold mt-8 text-xl">Add Banner</h2>
      {queryBanner.isLoading ? (
        <p className="text-center text-lg font-semibold">Loading banners...</p>
      ) : queryBanner.isError ? (
        <p className="text-center text-red-500">
          Error fetching banners: {queryBanner.error.message}
        </p>
      ) : (
        <div className="flex justify-center gap-4 mt-4 h-[40vh]">
          {bannerData.map((banner, index) => (
            <img
              key={index}
              src={banner.images[0]}
              alt={`Banner ${index + 1}`}
              className="w-[100%] h-[100%] rounded-md shadow-lg"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomeLeftBar;
