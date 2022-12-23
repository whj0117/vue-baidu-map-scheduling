/*
 * @Description: 
 * @Author: wanghongjian
 * @github: https://github.com/whj0117
 * @Date: 2022-12-07 11:16:11
 * @LastEditTime: 2022-12-23 17:02:17
 * @LastEditors: wanghongjian
 */
export const TRAINNOLIST = () => [{
    etdoNo: 'T202212071400',
    children: [{
        etdoNo: 'T202212071400',
        ettaNo: 'Y202212071400',
        ettaFromEbrgAddress: '东直门地铁站',//发货地址
        ettaEtorToEbrgAddress: '东直门地铁站',//收货地址
        p: { lng: 116.44, lat: 39.94 },
        s: { lng: 116.43, lat: 39.94 },
        ettaType: 'TRUNK'
    }, {
        etdoNo: 'T202212071400',
        ettaNo: 'Y202212071500',
        ettaFromEbrgAddress: '西直门地铁站',//发货地址
        ettaEtorToEbrgAddress: '西直门地铁站',//收货地址
        p: { lng: 116.36, lat: 39.94 },
        s: { lng: 116.36, lat: 39.94 },
    }]
}, {
    etdoNo: 'T202212071500',
    children: [{
        etdoNo: 'T202212071500',
        ettaNo: 'Y202212071600',
        ettaFromEbrgAddress: '北京西站地铁站',//发货地址
        ettaEtorToEbrgAddress: '北京西站地铁站',//收货地址
        p: { lng: 116.32, lat: 39.89 },
        s: { lng: 116.32, lat: 39.89 },
    }]
}]

export const MARKERPOINT = () => [{
    etdoNo: 'T202212071400',
    ettaNo: 'Y202212071400',
    ettaFromEbrgAddress: '东直门地铁站',//发货地址
    ettaEtorToEbrgAddress: '东直门地铁站',//收货地址
    p: { lng: 116.44, lat: 39.94 },
    s: { lng: 116.43, lat: 39.94 },
    ettaType: 'TRUNK',
    icon:'red',
    bool:true
}, {
    etdoNo: 'T202212071400',
    ettaNo: 'Y202212071500',
    ettaFromEbrgAddress: '西直门地铁站',//发货地址
    ettaEtorToEbrgAddress: '西直门地铁站',//收货地址
    p: { lng: 116.36, lat: 39.94 },
    s: { lng: 116.36, lat: 39.94 },
    icon:'red',
    bool:true
}, {
    etdoNo: 'T202212071500',
    ettaNo: 'Y202212071600',
    ettaFromEbrgAddress: '北京西站地铁站',//发货地址
    ettaEtorToEbrgAddress: '北京西站地铁站',//收货地址
    p: { lng: 116.32, lat: 39.89 },
    s: { lng: 116.32, lat: 39.89 },
    icon:'red',
    bool:true
}, {
    etdoNo: '',
    ettaNo: 'Y202212071700',
    ettaFromEbrgAddress: '北京南站地铁站',//发货地址
    ettaEtorToEbrgAddress: '北京南站地铁站',//收货地址
    p: { lng: 116.38, lat: 39.87 },
    s: { lng: 116.38, lat: 39.87 },
    icon:'red',
    bool:true
}, {
    etdoNo: '',
    ettaNo: 'Y202212071800',
    ettaFromEbrgAddress: '四惠地铁站',//发货地址
    ettaEtorToEbrgAddress: '四惠地铁站',//收货地址
    p: { lng: 116.50, lat: 39.91 },
    s: { lng: 116.50, lat: 39.91 },
    icon:'red',
    bool:true
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