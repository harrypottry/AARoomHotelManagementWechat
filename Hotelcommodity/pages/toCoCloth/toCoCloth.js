const app = getApp();
var transParams = {};
Page({
    data: {
        toCoSelect: null,
        clothTypeIds: [],
        itemDataDesc: {},
        itemData: {},
        lastedTime: ["最近5分钟", "最近10分钟", "最近半小时", "最近1天", "最近3天", "最近5天", "最近1个月"],
        timeStampArr: [300000, 600000, 1800000, 43200000, 129600000, 259200000, 6480000000],
        timeParam: null
    },
    onLoad: function (options) {
        var type = parseInt(options.type);
        app.getload('/wx/console/api/clothTypes', {}, this);
        if (type) {
            this.setData({
                toCoSelect: false
            });
        } else {
            this.setData({
                toCoSelect: true
            });
        }
    },
    // 选择布草所属的各个属性
    select: function (e) {
        var type = null;
        var value = e.detail.value;
        var num = parseInt(e.currentTarget.dataset.num);
        switch (num) {
            case 0:
                type = "Brand";
                this.dealIdParams(type, value);
                this.setData({
                    positionIndex: value,
                });
                break;
            case 1:
                type = "Type";
                this.dealIdParams(type, value);
                this.setData({
                    nameIndex: value
                });
                break;
            case 2:
                type = "Size";
                this.dealIdParams(type, value);
                this.setData({
                    sizeIndex: e.detail.value
                });
                break;
            case 3:
                type = "Craft";
                this.dealIdParams(type, value);
                this.setData({
                    craftIndex: e.detail.value
                });
                break;
            case 4:
                type = "Material";
                this.dealIdParams(type, value);
                this.setData({
                    materialIndex: e.detail.value
                });
                break;
            case 5:
                type = "Density";
                this.dealIdParams(type, value);
                this.setData({
                    pIndex: e.detail.value
                });
                break;
            case 6:
                type = "Woven";
                this.dealIdParams(type, value);
                this.setData({
                    clothIndex: e.detail.value
                });
                break;
            case 100:
                type = "TimeStamp";
                this.dealIdParams(type, value);
                this.setData({
                    timeStampIndex: e.detail.value
                });
                break;
            default:
                return false;
        }
    },
    // 开始批量关联
    toCoCloth: function () {
        var queryA = JSON.stringify(transParams);
        wx.navigateTo({
            url: '../toCoClothList/toCoClothList?transParams=' + queryA + "&type=0"
        });
    },
    // 关联布草查询
    hasCoQuery: function () {
        var that = this;
        var queryArrA = JSON.stringify(transParams);
        var queryTimeA = this.data.timeParam;
        wx.navigateTo({
            url: '../toCoClothList/toCoClothList?transParams=' + queryArrA + "&time=" + queryTimeA + "&type=1"
        });
    },
    // 请求结果
    load_win: function (urls, datas) {
        if (urls == "/wx/console/api/clothTypes") {
            var attrArr = datas.data;
            var keys = ["Brand", "Craft", "Density", "Material", "Size", "Type", "Woven"]
            this.dealData(attrArr, keys);
        }
    },
    // 处理数据
    dealData: function (attrArr, keys) {
        var itemData = {};
        var itemDataDesc = {};
        keys.map((key, index) => {
            var itemArr = [];
            var itemDesc = [];
            attrArr[key].map(item => {
                var itemTwoAttr = {};
                itemTwoAttr.id = item.id;
                itemTwoAttr.desc = item.desc;
                itemDesc.push(itemTwoAttr.desc);
                itemArr.push(itemTwoAttr);
            });
            itemDataDesc[key] = itemDesc;
            itemData[key] = itemArr;
        });
        console.log("itemDataDesc", itemDataDesc);
        console.log("itemData", itemData);
        this.setData({
            itemData: itemData,
            itemDataDesc: itemDataDesc
        });
    },
    // 处理页面传入参数
    dealIdParams: function (type, value) {
        transParams[type] = {};
        var timeParam = null;
        if (type == "TimeStamp") {
            timeParam = this.data.timeStampArr[value];
            this.setData({
                timeParam: timeParam
            });
            console.log(timeParam);
        } else {
            transParams[type].id = this.data.itemData[type][value].id;
            transParams[type].desc = this.data.itemData[type][value].desc;
        }
        console.log("trans:", transParams);
    }
});