import React from 'react';
import { formatTime } from '../utils/timezoneUtils';

const TimeSlotResults = ({ results }) => {
  if (!results) return null;

  const { participantTimes, workingHoursCount, workingHoursPercentage, isOptimal } = results;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>🕒 时区转换结果</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ color: '#666' }}>
            工作时间内: {workingHoursCount}/{participantTimes.length}人 ({workingHoursPercentage.toFixed(1)}%)
          </span>
          {isOptimal ? (
            <span style={{ 
              background: '#00b894', 
              color: 'white', 
              padding: '6px 12px', 
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              ✅ 最优时间
            </span>
          ) : (
            <span style={{ 
              background: '#fdcb6e', 
              color: '#2d3436', 
              padding: '6px 12px', 
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              ⚠️ 需要优化
            </span>
          )}
        </div>
      </div>

      <div className="participant-list">
        {participantTimes.map(participant => (
          <div key={participant.id} className="participant-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#333' }}>
                  {participant.name}
                </h4>
                <p style={{ margin: '0 0 4px 0', color: '#666', fontSize: '14px' }}>
                  {participant.timezone.replace('_', ' ')}
                </p>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div className="time-slot" style={{ 
                  marginBottom: '8px',
                  background: participant.isWorkingHours 
                    ? 'linear-gradient(135deg, #00b894 0%, #00a085 100%)'
                    : 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)'
                }}>
                  <div style={{ fontSize: '16px', fontWeight: '600' }}>
                    {formatTime(participant.startTime)} - {formatTime(participant.endTime)}
                  </div>
                </div>
                
                <div style={{ 
                  fontSize: '12px', 
                  color: participant.isWorkingHours ? '#00b894' : '#e74c3c',
                  fontWeight: '600'
                }}>
                  {participant.isWorkingHours ? '✅ 工作时间' : '⏰ 非工作时间'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!isOptimal && (
        <div style={{ 
          background: '#fff3cd', 
          border: '1px solid #ffeaa7',
          borderRadius: '8px',
          padding: '15px',
          marginTop: '20px',
          color: '#856404'
        }}>
          <h4 style={{ margin: '0 0 8px 0' }}>💡 优化建议</h4>
          <p style={{ margin: 0 }}>
            当前会议时间只有 {workingHoursPercentage.toFixed(1)}% 的参与者在工作时间内。
            建议使用"生成最优时间建议"功能来找到更合适的会议时间。
          </p>
        </div>
      )}
    </div>
  );
};

export default TimeSlotResults; 