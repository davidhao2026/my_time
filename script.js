// 中国假期数据
const holidays = {
    '2026-01-01': { name: '元旦', type: 'national' },
    '2026-02-17': { name: '春节', type: 'national' },
    '2026-02-18': { name: '春节', type: 'national' },
    '2026-02-19': { name: '春节', type: 'national' },
    '2026-02-20': { name: '春节', type: 'national' },
    '2026-02-21': { name: '春节', type: 'national' },
    '2026-02-22': { name: '春节', type: 'national' },
    '2026-02-23': { name: '春节', type: 'national' },
    '2026-02-24': { name: '春节', type: 'national' },
    '2026-04-04': { name: '清明节', type: 'national' },
    '2026-04-05': { name: '清明节', type: 'national' },
    '2026-04-06': { name: '清明节', type: 'national' },
    '2026-05-01': { name: '劳动节', type: 'national' },
    '2026-05-02': { name: '劳动节', type: 'national' },
    '2026-05-03': { name: '劳动节', type: 'national' },
    '2026-05-04': { name: '劳动节', type: 'national' },
    '2026-05-05': { name: '劳动节', type: 'national' },
    '2026-06-09': { name: '端午节', type: 'national' },
    '2026-06-10': { name: '端午节', type: 'national' },
    '2026-09-15': { name: '中秋节', type: 'national' },
    '2026-09-16': { name: '中秋节', type: 'national' },
    '2026-09-17': { name: '中秋节', type: 'national' },
    '2026-10-01': { name: '国庆节', type: 'national' },
    '2026-10-02': { name: '国庆节', type: 'national' },
    '2026-10-03': { name: '国庆节', type: 'national' },
    '2026-10-04': { name: '国庆节', type: 'national' },
    '2026-10-05': { name: '国庆节', type: 'national' },
    '2026-10-06': { name: '国庆节', type: 'national' },
    '2026-10-07': { name: '国庆节', type: 'national' },
};

class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.selectedDateDisplay = document.getElementById('selectedDateDisplay');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderCalendar();
        this.updateHolidayList();
    }

    setupEventListeners() {
        document.getElementById('prevBtn').addEventListener('click', () => this.previousMonth());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextMonth());
        document.getElementById('todayBtn').addEventListener('click', () => this.goToToday());
        document.getElementById('monthPicker').addEventListener('change', (e) => this.jumpToMonth(e));
    }

    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.renderCalendar();
        this.updateHolidayList();
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.renderCalendar();
        this.updateHolidayList();
    }

    goToToday() {
        this.currentDate = new Date();
        this.renderCalendar();
        this.updateHolidayList();
        this.updateMonthPicker();
    }

    jumpToMonth(e) {
        const [year, month] = e.target.value.split('-');
        this.currentDate = new Date(year, month - 1, 1);
        this.renderCalendar();
        this.updateHolidayList();
    }

    updateMonthPicker() {
        const year = this.currentDate.getFullYear();
        const month = String(this.currentDate.getMonth() + 1).padStart(2, '0');
        document.getElementById('monthPicker').value = `${year}-${month}`;
    }

    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        // 更新标题
        const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
        document.getElementById('monthYear').textContent = `${year}年 ${monthNames[month]}`;
        this.updateMonthPicker();

        // 获取该月的第一天和最后一天
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const prevLastDay = new Date(year, month, 0);

        const firstDayOfWeek = firstDay.getDay();
        const daysInMonth = lastDay.getDate();
        const daysInPrevMonth = prevLastDay.getDate();

        const calendarGrid = document.getElementById('calendarGrid');
        calendarGrid.innerHTML = '';

        // 添加上个月的日期
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            const dayElement = this.createDayElement(day, 'other-month');
            calendarGrid.appendChild(dayElement);
        }

        // 添加当月的日期
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = this.createDayElement(day, 'current-month');
            
            // 标记今天
            if (year === today.getFullYear() && 
                month === today.getMonth() && 
                day === today.getDate()) {
                dayElement.classList.add('today');
            }

            // 标记假日
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            if (holidays[dateStr]) {
                dayElement.classList.add('holiday');
                dayElement.title = holidays[dateStr].name;
            }

            // 添加点击事件
            dayElement.addEventListener('click', () => {
                document.querySelectorAll('.day.selected').forEach(d => d.classList.remove('selected'));
                dayElement.classList.add('selected');
                this.selectedDate = new Date(year, month, day);
                this.updateSelectedDateDisplay();
            });

            calendarGrid.appendChild(dayElement);
        }

        // 添加下个月的日期
        const remainingCells = 42 - calendarGrid.children.length; // 6行7列
        for (let day = 1; day <= remainingCells; day++) {
            const dayElement = this.createDayElement(day, 'other-month');
            calendarGrid.appendChild(dayElement);
        }
    }

    createDayElement(day, className) {
        const dayElement = document.createElement('div');
        dayElement.className = `day ${className}`;
        dayElement.textContent = day;
        return dayElement;
    }

    updateHolidayList() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        const monthHolidays = Object.entries(holidays).filter(([dateStr]) => {
            const [y, m] = dateStr.split('-');
            return parseInt(y) === year && parseInt(m) === month + 1;
        });

        const holidayList = document.getElementById('holidayList');
        
        if (monthHolidays.length === 0) {
            holidayList.innerHTML = '<li style="color: #999;">本月没有假期</li>';
            return;
        }

        const uniqueHolidays = {};
        monthHolidays.forEach(([dateStr, holiday]) => {
            if (!uniqueHolidays[holiday.name]) {
                uniqueHolidays[holiday.name] = [];
            }
            uniqueHolidays[holiday.name].push(dateStr.split('-')[2]);
        });

        holidayList.innerHTML = Object.entries(uniqueHolidays).map(([name, dates]) => {
            const dateRange = dates.length === 1 
                ? `${dates[0]}日` 
                : `${dates[0]}-${dates[dates.length - 1]}日`;
            return `<li><span>${name}</span>：${dateRange}</li>`;
        }).join('');
    }

    updateSelectedDateDisplay() {
        if (!this.selectedDate) {
            this.selectedDateDisplay.textContent = '请点击日期查看详情';
            return;
        }

        const year = this.selectedDate.getFullYear();
        const month = this.selectedDate.getMonth() + 1;
        const day = this.selectedDate.getDate();
        const weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][this.selectedDate.getDay()];

        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const holiday = holidays[dateStr];

        let displayText = `${year}年${month}月${day}日 ${weekday}`;
        if (holiday) {
            displayText += `\n🎉 ${holiday.name}`;
        }

        this.selectedDateDisplay.textContent = displayText;
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new Calendar();
});