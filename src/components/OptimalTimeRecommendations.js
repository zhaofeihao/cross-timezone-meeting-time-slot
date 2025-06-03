import React from 'react';
import { formatTime } from '../utils/timezoneUtils';

const OptimalTimeRecommendations = ({ recommendations, onSelectTime, onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '15px',
        padding: '30px',
        maxWidth: '900px',
        maxHeight: '80vh',
        overflow: 'auto',
        width: '100%'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>💡 智能时间推荐</h2>
          <button 
            onClick={onClose}
            style={{
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              fontSize: '18px'
            }}
          >
            ✕
          </button>
        </div>

        <p style={{ color: '#666', marginBottom: '20px' }}>
          基于所有参与者的时区，为您推荐最适合的会议时间（按适合度排序）
        </p>

        <div style={{ display: 'grid', gap: '15px' }}>
          {recommendations.map((option, index) => (
            <div key={index} style={{
              border: '2px solid #e9ecef',
              borderRadius: '10px',
              padding: '20px',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              ':hover': { borderColor: '#667eea' }
            }}
            onMouseEnter={(e) => e.target.style.borderColor = '#667eea'}
            onMouseLeave={(e) => e.target.style.borderColor = '#e9ecef'}
            onClick={() => onSelectTime(option)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>
                    选项 {index + 1}
                  </h3>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#667eea' }}>
                    {formatTime(option.startTime)} - {formatTime(option.endTime)}
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    background: option.suitabilityScore >= 80 ? '#00b894' :
                             option.suitabilityScore >= 60 ? '#fdcb6e' : '#e74c3c',
                    color: option.suitabilityScore >= 60 ? 'white' : 'white',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '5px'
                  }}>
                    适合度: {option.suitabilityScore.toFixed(0)}%
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {option.workingHoursCount}/{option.participantTimes.length} 人在工作时间
                  </div>
                </div>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '10px' 
              }}>
                {option.participantTimes.map(participant => (
                  <div key={participant.id} style={{
                    background: participant.isWorkingHours ? '#d1f2eb' : '#fadbd8',
                    padding: '10px',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                      {participant.name}
                    </div>
                    <div style={{ color: '#666' }}>
                      {formatTime(participant.startTime)}
                    </div>
                    <div style={{ 
                      color: participant.isWorkingHours ? '#00b894' : '#e74c3c',
                      fontWeight: '600',
                      marginTop: '4px'
                    }}>
                      {participant.isWorkingHours ? '✅ 工作时间' : '⏰ 非工作时间'}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ 
                marginTop: '15px', 
                textAlign: 'center',
                color: '#667eea',
                fontWeight: '600'
              }}>
                点击选择此时间
              </div>
            </div>
          ))}
        </div>

        {recommendations.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            color: '#666', 
            padding: '40px',
            background: '#f8f9fa',
            borderRadius: '10px'
          }}>
            <p>暂无推荐时间，请检查参与者设置</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OptimalTimeRecommendations; 