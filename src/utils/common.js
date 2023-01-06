/*
 * @Description: 
 * @Author: wanghongjian
 * @github: https://github.com/whj0117
 * @Date: 2022-12-07 11:16:11
 * @LastEditTime: 2022-12-28 15:21:29
 * @LastEditors: wanghongjian
 */
export const TRAINNOLIST = () => [{
    etdoNo: 'T202212071400',
    children: [{
        etdoNo: 'T202212071400',
        ettaNo: 'Y202212071400',
        ettaFromEbrgAddress: '东直门地铁站',//发货地址
        ettaEtorToEbrgAddress: '东直门地铁站',//收货地址
        p: { lng: 116.439622, lat: 39.947922 },
        s: { lng: 116.43, lat: 39.94 },
        ettaType: 'TRUNK'
    }, {
        etdoNo: 'T202212071400',
        ettaNo: 'Y202212071500',
        ettaFromEbrgAddress: '西直门地铁站',//发货地址
        ettaEtorToEbrgAddress: '西直门地铁站',//收货地址
        p: { lng: 116.360778, lat: 39.94668 },
        s: { lng: 116.36, lat: 39.94 },
    }]
}, {
    etdoNo: 'T202212071500',
    children: [{
        etdoNo: 'T202212071500',
        ettaNo: 'Y202212071600',
        ettaFromEbrgAddress: '北京西站地铁站',//发货地址
        ettaEtorToEbrgAddress: '北京西站地铁站',//收货地址
        p: { lng: 116.327811, lat: 39.900678 },
        s: { lng: 116.32, lat: 39.89 },
    }]
}]

export const MARKERPOINT = () => [{
    etdoNo: 'T202212071400',
    ettaNo: 'Y202212071400',
    ettaFromEbrgAddress: '东直门地铁站',//发货地址
    ettaEtorToEbrgAddress: '东直门地铁站',//收货地址
    p: { lng: 116.439622, lat: 39.947922 },
    s: { lng: 116.43, lat: 39.94 },
    ettaType: '',
    icon:'red',
    bool:true,
    isAn:false,
}, {
    etdoNo: 'T202212071400',
    ettaNo: 'Y202212071500',
    ettaFromEbrgAddress: '西直门地铁站',//发货地址
    ettaEtorToEbrgAddress: '西直门地铁站',//收货地址
    p: { lng: 116.360778, lat: 39.94668 },
    s: { lng: 116.36, lat: 39.94 },
    icon:'red',
    bool:true,
    isAn:false,
}, {
    etdoNo: 'T202212071500',
    ettaNo: 'Y202212071600',
    ettaFromEbrgAddress: '北京西站地铁站',//发货地址
    ettaEtorToEbrgAddress: '北京西站地铁站',//收货地址
    p: { lng: 116.327811, lat: 39.900678 },
    s: { lng: 116.32, lat: 39.89 },
    icon:'red',
    bool:true,
    isAn:false,
}, {
    etdoNo: '',
    ettaNo: 'Y202212071700',
    ettaFromEbrgAddress: '北京南站地铁站',//发货地址
    ettaEtorToEbrgAddress: '北京南站地铁站',//收货地址
    p: { lng: 116.385671, lat: 39.871141 },
    s: { lng: 116.38, lat: 39.87 },
    icon:'red',
    bool:true,
    isAn:false,
}, {
    etdoNo: '',
    ettaNo: 'Y202212071800',
    ettaFromEbrgAddress: '四惠地铁站',//发货地址
    ettaEtorToEbrgAddress: '四惠地铁站',//收货地址
    p: { lng: 116.501987, lat: 39.914886 },
    s: { lng: 116.50, lat: 39.91 },
    icon:'red',
    bool:true,
    isAn:false,
},{
    etdoNo: '',
    ettaNo: 'Y202212071900',
    ettaFromEbrgAddress: '北京大兴国际机场',//发货地址
    ettaEtorToEbrgAddress: '北京大兴国际机场',//收货地址
    p: { lng: 116.42396, lat: 39.511576 },
    s: { lng: 116.42396, lat: 39.511576 },
    icon:'red',
    bool:true,
    isAn:false,
},{
    etdoNo: '',
    ettaNo: 'Y202212072000',
    ettaFromEbrgAddress: '天津滨海国际机场',//发货地址
    ettaEtorToEbrgAddress: '天津滨海国际机场',//收货地址
    p: { lng: 117.368273, lat: 39.1366 },
    s: { lng: 117.368273, lat: 39.1366 },
    icon:'red',
    bool:true,
    isAn:false,
},{
    etdoNo: '',
    ettaNo: 'Y202212073000',
    ettaFromEbrgAddress: '北京欢乐谷',//发货地址
    ettaEtorToEbrgAddress: '北京欢乐谷',//收货地址
    p: { lng: 116.500997, lat: 39.873927 },
    s: { lng: 116.500997, lat: 39.873927 },
    icon:'red',
    bool:true,
    isAn:false,
}]

export const CARICON = () => [{ icon: 'orange' }, { icon: 'black' }, { icon: 'green' }, { icon: 'purple' }, { icon: 'yellow' }, { icon: 'blue' }, { icon: 'red' }]

export const RESETPATHS = () => {
	return {
        timeStamp: Date.now(),
		path: [],//点坐标
		tableData: [],//点数据
		strokeWeight: 6,//线宽度
		strokeColor: '#243AE0',//线颜色
		strokeStyle: 'solid',//线类型
		bool: true,//是否显示
		name: '我是一条线',//路线名称
		isAn: false,//动画
		driveBool: false,//驾驶路线
		editing: false,//是否编辑
		waypoints: false,
		driveInfo: {},//距离和时间
	}
}

export const LINEWIDTHOPTIONS = [{
    value: 1,
    label: '1px'
}, {
    value: 2,
    label: '2px'
}, {
    value: 3,
    label: '3px'
}, {
    value: 4,
    label: '4px'
}, {
    value: 5,
    label: '5px'
}, {
    value: 6,
    label: '6px'
}, {
    value: 7,
    label: '7px'
}, {
    value: 8,
    label: '8px'
}, {
    value: 9,
    label: '9px'
}, {
    value: 10,
    label: '10px'
}]

export const RESETGUIDELINE = () => {
	return {
		path: [],
		strokeWeight: 6,
		strokeColor: '#000',
		strokeStyle: 'solid',
		bool: true,//是否显示
		name: '我是辅助线',//路线名称
		driveBool: false,
		editing: false,//是否编辑
		waypoints: false,
		driveInfo: {},//距离和时间
        timeStamp: Date.now(),
	}
}