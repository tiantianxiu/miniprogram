//数据缓存

// 异步获取当前storage的相关信息
wx.getStorageInfo(Object object)
// success
// fail
// complete
    //object.success 回调函数
    //  keys	Array.<string>	当前 storage 中所有的 key
    //  currentSize	number	当前占用的空间大小, 单位 KB
    //  limitSize	number	限制的空间大小，单位 KB

wx.getStorageInfoSync();

wx.getStorageInfo({
    success(res){
        console.log(res.keys)
        console.log(res.currentSize)
        console.log(res.limitSize)
    }
});

try{
    const res = wx.getStorageInfoSync()
    console.log(res.keys)
    console.log(res.currentSize)
    console.log(res.limitSize)
}catch(err){
    console.log(err.message)
}


4

