let vm = new Vue({
    el: '#vue',
    data: {
        weekList: [],
        projectList: [],
        chartData: [],
    },
    methods: {
        init () {
            vm.initWeekList()
            vm.initLocalStorage()
        },
        initWeekList () {
            let start = '2019-12-30'
            let week = 0
            let tmp = []
            while (week < 52) {
                tmp.push({
                    week_no: week,
                    start_date: vm.toDate(vm.toTime(start) + week * 7 * 24 * 3600),
                    end_date:  vm.toDate(vm.toTime(start) + (week + 1) * 7 * 24 * 3600 - 3 * 24 * 3600),
                })
                week ++
            }
            vm.weekList = tmp
        },
        initLocalStorage () {
            let key = '_wtc_p'
            let data = localStorage.getItem(key)
            if (data) {
                data = JSON.parse(data)
                vm.projectList = data
            }
        },
        addProject () {
            let tmp = {
                project_name: '',
                data_list: []
            }

            vm.weekList.forEach(item => {
                tmp.data_list.push({
                    v: ''
                })
            })

            vm.projectList.push(tmp)
        },
        getColor (level, index) {

            level = level - 1
            let color = [
                ['#d9f6f6','#b9eeef','#99e7e8','#69dbdd','#39d0d2',],
                ['#d9f0f9','#b7e2f4','#95d4ef','#61bfe8','#2eaae1',],
                ['#e6f7dc','#cfefbd','#b9e79d','#97dc6e','#75d03f',],
                ['#fcf7ce','#faf2a8','#f8ec83','#f5e44c','#f2db14',],
                ['#ffe4ce','#ffcfa7','#ffb980','#ff9945','#ff780a',],
                ['#fbd5e3','#f8b1ca','#f58db2','#f0578d','#ec2169',],
                ['#e3dcf3','#cdbfe8','#b6a2de','#9477cf','#724bbf',],
            ]
            return color[index][level]
        },
        getLevel (num) {
            num = Number(num)
            if (!num) num = 0
            if (num >= 4) return 5
            else if (num >= 3) return 4
            else if (num >= 2) return 3
            else if (num >= 1) return 2
            else if (num > 0) return 1
            return 0
        },
        createChart () {
            let key = '_wtc_p'
            localStorage.setItem(key, JSON.stringify(vm.projectList))

            vm.chartData = []
            vm.projectList.forEach((item, i) => {
                let data_list = item.data_list
                let project_name = item.project_name
                let tmp = []
                let sum = 0
                data_list.forEach(data => {
                    let v = data.v
                    v = Number(v)
                    if (!v) v = 0

                    sum = sum + v
                    let level = vm.getLevel(v)
                    let bg_color = ''
                    if (level === 0) {
                        bg_color = ''
                    } else {
                        bg_color = vm.getColor(level, i)
                    }

                    tmp.push({
                        level: level,
                        bg_color: bg_color,
                    })
                })
                console.log(project_name + ':' + sum)
                vm.chartData.push({
                    data_list: tmp
                })
            })
        },
        toDate (timestamp, datetime) {
            var d = new Date;
            d.setTime(timestamp * 1000);

            var ymd, hour, minute,
                year = d.getFullYear(),
                month = d.getMonth() + 1,
                date = d.getDate();

            if (month < 10) month = '0' + month;
            if (date < 10) date = '0' + date;

            ymd = year + '-' + month + '-' + date;

            if (!datetime) return ymd;

            hour = d.getHours();
            minute = d.getMinutes();

            if (hour < 10) hour = '0' + hour;
            if (minute < 10) minute = '0' + minute;

            return ymd + ' ' + hour + ':' + minute;
        },
        toTime (date) {
            var d = new Date, list = date.split(/\D+/);

            if (list[0]) d.setYear(list[0]);
            if (list[1]) d.setMonth(list[1] - 1);
            if (list[2]) d.setDate(list[2]);

            d.setHours(list[3] || 0);
            d.setMinutes(list[4] || 0);
            d.setSeconds(list[5] || 0);
            d.setMilliseconds(0);

            return d.getTime() / 1000;
        },
    }
})

vm.init()