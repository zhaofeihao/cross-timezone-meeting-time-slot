// 常用时区列表
export const COMMON_TIMEZONES = [
  { value: 'Asia/Shanghai', label: '北京时间 (GMT+8)', offset: 8 },
  { value: 'America/New_York', label: '纽约时间(美东) (GMT-5/-4)', offset: -5 },
  { value: 'America/Los_Angeles', label: '洛杉矶时间(美西) (GMT-8/-7)', offset: -8 },
  { value: 'Europe/Rome', label: '米兰时间 (GMT+1/+2)', offset: 1 },
  { value: 'Europe/London', label: '伦敦时间 (GMT+0/+1)', offset: 0 },
  { value: 'Europe/Paris', label: '巴黎时间 (GMT+1/+2)', offset: 1 },
  { value: 'Asia/Tokyo', label: '东京时间 (GMT+9)', offset: 9 },
  { value: 'Asia/Seoul', label: '首尔时间 (GMT+9)', offset: 9 },
  { value: 'Asia/Singapore', label: '新加坡时间 (GMT+8)', offset: 8 },
  { value: 'Australia/Sydney', label: '悉尼时间 (GMT+10/+11)', offset: 10 },
  { value: 'Asia/Dubai', label: '迪拜时间 (GMT+4)', offset: 4 },
  { value: 'Asia/Kolkata', label: '新德里时间 (GMT+5:30)', offset: 5.5 },
  { value: 'Europe/Berlin', label: '柏林时间 (GMT+1/+2)', offset: 1 },
  { value: 'America/Chicago', label: '芝加哥时间 (GMT-6/-5)', offset: -6 },
  { value: 'America/Denver', label: '丹佛时间 (GMT-7/-6)', offset: -7 },
  { value: 'Pacific/Honolulu', label: '夏威夷时间 (GMT-10)', offset: -10 },
  { value: 'UTC', label: 'UTC 协调世界时', offset: 0 }
];

// 将时间转换到指定时区
export const convertToTimezone = (date, fromTimezone, toTimezone) => {
  // 创建一个Date对象，假设输入是本地时间
  const inputDate = new Date(date);
  
  // 获取源时区的偏移量（分钟）
  const fromOffset = getTimezoneOffset(fromTimezone);
  const toOffset = getTimezoneOffset(toTimezone);
  
  // 计算时间差（毫秒）
  const offsetDiff = (toOffset - fromOffset) * 60 * 1000;
  
  // 应用时区转换
  const convertedDate = new Date(inputDate.getTime() + offsetDiff);
  
  return convertedDate;
};

// 获取时区偏移量（以分钟为单位）
export const getTimezoneOffset = (timezone) => {
  const tz = COMMON_TIMEZONES.find(t => t.value === timezone);
  if (tz) {
    return tz.offset * 60; // 转换为分钟
  }
  return 0; // 默认返回UTC
};

// 格式化时间显示
export const formatTime = (date) => {
  if (!date) return '';
  
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };
  
  return new Intl.DateTimeFormat('zh-CN', options).format(date);
};

// 检查时间是否在工作时间内 (9:00-22:00)
export const isWorkingHours = (date) => {
  const hour = date.getHours();
  return hour >= 9 && hour <= 22;
};

// 计算最优会议时间
export const findOptimalMeetingTime = (startTime, endTime, timezone, participants) => {
  const meetingStart = new Date(startTime);
  const meetingEnd = new Date(endTime);
  
  // 为每个参与者计算会议时间
  const participantTimes = participants.map(participant => {
    const convertedStart = convertToTimezone(meetingStart, timezone, participant.timezone);
    const convertedEnd = convertToTimezone(meetingEnd, timezone, participant.timezone);
    
    return {
      ...participant,
      startTime: convertedStart,
      endTime: convertedEnd,
      isWorkingHours: isWorkingHours(convertedStart) && isWorkingHours(convertedEnd)
    };
  });
  
  // 计算在工作时间内的参与者数量
  const workingHoursCount = participantTimes.filter(p => p.isWorkingHours).length;
  const workingHoursPercentage = (workingHoursCount / participantTimes.length) * 100;
  
  return {
    participantTimes,
    workingHoursCount,
    workingHoursPercentage,
    isOptimal: workingHoursPercentage >= 70 // 70%以上的人在工作时间内认为是最优的
  };
};

// 生成建议的会议时间选项
export const generateMeetingTimeOptions = (duration, participants) => {
  const options = [];
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + 1); // 从明天开始
  baseDate.setHours(0, 0, 0, 0);
  
  // 生成接下来7天的时间选项
  for (let day = 0; day < 7; day++) {
    const currentDate = new Date(baseDate);
    currentDate.setDate(baseDate.getDate() + day);
    
    // 每天从8:00到20:00，每小时一个选项
    for (let hour = 8; hour <= 20; hour++) {
      currentDate.setHours(hour, 0, 0, 0);
      const endTime = new Date(currentDate.getTime() + duration * 60 * 1000);
      
      // 检查这个时间对所有参与者的适合程度
      let workingHoursCount = 0;
      const participantTimes = participants.map(participant => {
        const convertedStart = convertToTimezone(currentDate, 'Asia/Shanghai', participant.timezone);
        const convertedEnd = convertToTimezone(endTime, 'Asia/Shanghai', participant.timezone);
        const isWorking = isWorkingHours(convertedStart) && isWorkingHours(convertedEnd);
        
        if (isWorking) workingHoursCount++;
        
        return {
          ...participant,
          startTime: convertedStart,
          endTime: convertedEnd,
          isWorkingHours: isWorking
        };
      });
      
      const suitabilityScore = (workingHoursCount / participants.length) * 100;
      
      options.push({
        startTime: new Date(currentDate),
        endTime: new Date(endTime),
        participantTimes,
        suitabilityScore,
        workingHoursCount
      });
    }
  }
  
  // 按适合度排序
  return options.sort((a, b) => b.suitabilityScore - a.suitabilityScore).slice(0, 10);
}; 