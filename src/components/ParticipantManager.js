import React, { useState } from 'react';
import { COMMON_TIMEZONES } from '../utils/timezoneUtils';

const ParticipantManager = ({ participants, setParticipants }) => {
  const [newParticipant, setNewParticipant] = useState({
    name: '',
    timezone: 'Asia/Shanghai'
  });

  const addParticipant = () => {
    if (!newParticipant.name.trim()) {
      alert('请输入参与者姓名');
      return;
    }

    const participant = {
      id: Date.now(),
      name: newParticipant.name.trim(),
      timezone: newParticipant.timezone
    };

    setParticipants(prev => [...prev, participant]);
    setNewParticipant({ name: '', timezone: 'Asia/Shanghai' });
  };

  const removeParticipant = (id) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  };

  const updateParticipant = (id, field, value) => {
    setParticipants(prev => 
      prev.map(p => 
        p.id === id ? { ...p, [field]: value } : p
      )
    );
  };

  return (
    <div className="card">
      <h2>👥 会议参与者管理</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>添加新参与者</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '15px', alignItems: 'end' }}>
          <div className="form-group">
            <label>姓名</label>
            <input
              type="text"
              value={newParticipant.name}
              onChange={(e) => setNewParticipant(prev => ({ ...prev, name: e.target.value }))}
              placeholder="输入参与者姓名"
              onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
            />
          </div>
          
          <div className="form-group">
            <label>时区</label>
            <select
              value={newParticipant.timezone}
              onChange={(e) => setNewParticipant(prev => ({ ...prev, timezone: e.target.value }))}
            >
              {COMMON_TIMEZONES.map(tz => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
          
          <button className="btn" onClick={addParticipant}>
            ➕ 添加
          </button>
        </div>
      </div>

      <div>
        <h3>当前参与者 ({participants.length}人)</h3>
        {participants.length === 0 ? (
          <div className="warning">
            还没有添加任何参与者。请至少添加一个参与者来计算时区。
          </div>
        ) : (
          <div className="participant-list">
            {participants.map(participant => (
              <div key={participant.id} className="participant-card">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '10px', alignItems: 'end' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#666' }}>姓名</label>
                    <input
                      type="text"
                      value={participant.name}
                      onChange={(e) => updateParticipant(participant.id, 'name', e.target.value)}
                      style={{ marginTop: '4px' }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ fontSize: '12px', color: '#666' }}>时区</label>
                    <select
                      value={participant.timezone}
                      onChange={(e) => updateParticipant(participant.id, 'timezone', e.target.value)}
                      style={{ marginTop: '4px' }}
                    >
                      {COMMON_TIMEZONES.map(tz => (
                        <option key={tz.value} value={tz.value}>
                          {tz.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <button
                    onClick={() => removeParticipant(participant.id)}
                    style={{
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantManager; 