import React, { useState } from 'react';
import { 
  COMMON_TIMEZONES, 
  findOptimalMeetingTime, 
  formatTime,
  generateMeetingTimeOptions 
} from '../utils/timezoneUtils';
import ParticipantManager from './ParticipantManager';
import TimeSlotResults from './TimeSlotResults';
import OptimalTimeRecommendations from './OptimalTimeRecommendations';

const MeetingTimeCalculator = () => {
  const [meetingData, setMeetingData] = useState({
    startTime: '',
    endTime: '',
    timezone: 'Asia/Shanghai',
    duration: 60 // 默认60分钟
  });
  
  const [participants, setParticipants] = useState([
    { id: 1, name: '张三', timezone: 'Asia/Shanghai' },
    { id: 2, name: 'John', timezone: 'America/New_York' }
  ]);
  
  const [results, setResults] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const handleInputChange = (field, value) => {
    setMeetingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateTimezones = () => {
    if (!meetingData.startTime || !meetingData.endTime) {
      alert('请输入会议开始和结束时间');
      return;
    }

    const result = findOptimalMeetingTime(
      meetingData.startTime,
      meetingData.endTime,
      meetingData.timezone,
      participants
    );

    setResults(result);
  };

  const generateRecommendations = () => {
    if (participants.length === 0) {
      alert('请添加至少一个参与者');
      return;
    }

    const options = generateMeetingTimeOptions(meetingData.duration, participants);
    setRecommendations(options);
    setShowRecommendations(true);
  };

  const selectRecommendedTime = (option) => {
    const startTimeString = option.startTime.toISOString().slice(0, 16);
    const endTimeString = option.endTime.toISOString().slice(0, 16);
    
    setMeetingData(prev => ({
      ...prev,
      startTime: startTimeString,
      endTime: endTimeString
    }));
    
    setShowRecommendations(false);
    
    // 自动计算时区
    setTimeout(() => {
      calculateTimezones();
    }, 100);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🌍 跨时区会议时间槽计算工具</h1>
        <p>智能计算不同时区的会议时间，找到最适合所有人的时间段</p>
      </div>

      <div className="card">
        <h2>会议信息设置</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div className="form-group">
            <label>会议开始时间</label>
            <input
              type="datetime-local"
              value={meetingData.startTime}
              onChange={(e) => handleInputChange('startTime', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>会议结束时间</label>
            <input
              type="datetime-local"
              value={meetingData.endTime}
              onChange={(e) => handleInputChange('endTime', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>会议时区</label>
            <select
              value={meetingData.timezone}
              onChange={(e) => handleInputChange('timezone', e.target.value)}
            >
              {COMMON_TIMEZONES.map(tz => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>会议时长（分钟）</label>
            <input
              type="number"
              value={meetingData.duration}
              onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
              min="15"
              max="480"
              step="15"
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px', marginTop: '20px', flexWrap: 'wrap' }}>
          <button className="btn" onClick={calculateTimezones}>
            🔄 计算时区转换
          </button>
          <button className="btn" onClick={generateRecommendations}>
            💡 生成最优时间建议
          </button>
        </div>
      </div>

      <ParticipantManager
        participants={participants}
        setParticipants={setParticipants}
      />

      {results && (
        <TimeSlotResults results={results} />
      )}

      {showRecommendations && recommendations.length > 0 && (
        <OptimalTimeRecommendations
          recommendations={recommendations}
          onSelectTime={selectRecommendedTime}
          onClose={() => setShowRecommendations(false)}
        />
      )}
    </div>
  );
};

export default MeetingTimeCalculator; 