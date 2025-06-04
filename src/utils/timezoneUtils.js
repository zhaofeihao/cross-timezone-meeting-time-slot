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

// 将时间转换到指定时区（正确处理夏令时）
export const convertToTimezone = (date, fromTimezone, toTimezone) => {
  const inputDate = new Date(date);
  
  // 使用更简单的方法：将输入时间解释为源时区的本地时间
  // 然后转换为目标时区
  
  // 1. 获取输入时间的年月日时分秒
  const year = inputDate.getFullYear();
  const month = inputDate.getMonth();
  const day = inputDate.getDate();
  const hours = inputDate.getHours();
  const minutes = inputDate.getMinutes();
  const seconds = inputDate.getSeconds();
  
  // 2. 创建一个时间字符串，然后使用时区信息解析
  const timeString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
  // 3. 将这个时间字符串解释为源时区的本地时间，并转换为UTC
  const sourceDate = new Date(timeString);
  const utcTime = convertLocalTimeToUTC(sourceDate, fromTimezone);
  
  // 4. 将UTC时间转换为目标时区
  const targetTime = convertUTCToLocalTime(utcTime, toTimezone);
  
  return targetTime;
};

// 将本地时间转换为UTC（考虑指定时区）
const convertLocalTimeToUTC = (localTime, timezone) => {
  // 获取该时区在指定时间的偏移量
  const offset = getTimezoneOffsetMinutes(timezone, localTime);
  return new Date(localTime.getTime() - offset * 60 * 1000);
};

// 将UTC时间转换为本地时间（考虑指定时区）
const convertUTCToLocalTime = (utcTime, timezone) => {
  // 获取该时区在指定时间的偏移量
  const offset = getTimezoneOffsetMinutes(timezone, utcTime);
  return new Date(utcTime.getTime() + offset * 60 * 1000);
};

// 获取指定时区相对于UTC的偏移量（分钟）
const getTimezoneOffsetMinutes = (timezone, date) => {
  try {
    // 使用Intl.DateTimeFormat获取时区偏移
    const dtf = new Intl.DateTimeFormat('en', {
      timeZone: timezone,
      timeZoneName: 'longOffset'
    });
    
    const parts = dtf.formatToParts(date);
    const offsetPart = parts.find(part => part.type === 'timeZoneName');
    
    if (offsetPart && offsetPart.value) {
      const offsetString = offsetPart.value; // 格式如 "GMT+08:00" 或 "GMT-07:00"
      const match = offsetString.match(/GMT([+-])(\d{2}):(\d{2})/);
      
      if (match) {
        const sign = match[1] === '+' ? 1 : -1;
        const hours = parseInt(match[2], 10);
        const minutes = parseInt(match[3], 10);
        return sign * (hours * 60 + minutes);
      }
    }
    
    // 备用方法：比较该时区的时间和UTC时间
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    
    return (tzDate.getTime() - utcDate.getTime()) / (60 * 1000);
  } catch (error) {
    console.warn(`无法获取时区 ${timezone} 的偏移量，使用默认值`, error);
    // 回退到静态偏移量
    const tz = COMMON_TIMEZONES.find(t => t.value === timezone);
    return tz ? tz.offset * 60 : 0;
  }
};

// 获取时区偏移量（以分钟为单位）- 保留此函数用于向后兼容
export const getTimezoneOffset = (timezone) => {
  const tz = COMMON_TIMEZONES.find(t => t.value === timezone);
  if (tz) {
    return tz.offset * 60; // 转换为分钟
  }
  return 0; // 默认返回UTC
};

// 获取实际的时区偏移量（考虑夏令时）
export const getActualTimezoneOffset = (timezone, date = new Date()) => {
  return getTimezoneOffsetMinutes(timezone, date);
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