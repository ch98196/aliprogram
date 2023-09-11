Page({
  data: {
    condition: '-1',
    systemTime: '',
    activityName: '',
    list: [],
    count: '',
    setTime: 3,
    isMotto: false,
    isEdit: false,
    inputValue: '',

    //单选框
    options: [{
        label: '3秒',
        value: 3
      },
      {
        label: '5秒',
        value: 5
      },
      {
        label: '10秒',
        value: 10
      },
    ],
  },


  onLoad() {
    const config = my.getStorageSync({
      key: 'config'
    })
    if (config.success) {
      this.setData({
        list: config.data.list,
        setTime: this.data.setTime,
        activityName: config.data.activityName,
      })

    } else {
      this.edit()
    }
    if (this.data.list.length < 2 || this.data.activityName.length < 2) {
      this.edit()
    }
  },


  add(value) {
    let list = this.data.list
    if (value.length < 1) {
      console.log('用户提交空值')
    } else if (list.some((item) => item.toLowerCase() == value.toLowerCase())) {
      my.showToast({
        type: 'exception',
        content: '名称重复'
      })
    } else {
      list.push(value)
      this.setData({
        list,
        inputValue: '',
      })
    }
  },
  change(value) {
    this.setData({
      inputValue: value
    })
  },
  clear() {
    this.setData({
      inputValue: '',
    })
  },
  delete(e) {
    const item = e.currentTarget.dataset.item
    my.confirm({
      title: '提示',
      content: `确认删除「${item}」`,
      confirmButtonText: '删除',
      confirmColor: '#fa5151',
      cancelColor: '#000000'
    }).then(res => {
      if (res.confirm) {
        let list = this.data.list
        const index = list.indexOf(item)
        list.splice(index, 1)
        this.setData({
          list,
        })
      }
    })
  },
  bindInput(value) {
    this.setData({
      activityName: value
    })
  },

  bindPickerChange(value) {
    this.setData({
      setTime: value
    });
  },

  /**
   * 编辑开关
   */
  edit() {
    if (this.data.condition >= 0) {
      this.setData({
        condition: -1
      })
    }
    this.setData({
      isEdit: true,
    })
  },
  /**
   * 保存配置
   */
  save() {
    if (this.data.list.length < 2) {
      my.showToast({
        content: '可抽选数量不足，请配置后保存',
        type: 'none'
      });
    } else if (this.data.activityName.length < 2) {
      my.showToast({
        content: '活动名称不得为空',
        type: 'none'
      });
    } else {
      this.setData({
        isEdit: false,
        activityName: this.data.activityName,
      })
      const config = {
        list: this.data.list,
        setTime: this.data.setTime,
        activityName: this.data.activityName,
      }
      my.setStorage({
        key: 'config',
        data: config
      }).then(() => {
        my.showToast({
          content: '配置已保存',
          type: 'none'
        });
      })
    }
  },


  startMotto() {
    if (this.data.list.length < 2) {
      my.showToast({
        content: '可抽选数量不足，无法开始',
        type: 'none'
      });
    } else if (this.data.activityName.length < 2) {
      my.showToast({
        content: '活动名称为空，无法开始',
        type: 'none'
      });
    } else {
      this.setData({
        isMotto: true,
        count: this.data.setTime,
      })
      var that = this;
      this.interval = setInterval(function () {
        that.setData({
          condition: Math.floor(Math.random() * that.data.list.length + 1)
        })
      }, 10) //代表0.01秒钟发送一次请求

      let count = this.data.setTime;
      this.count = setInterval(function () {
        count--;
        that.setData({
          count,
        })
        if (count <= 0) {
          clearInterval(that.interval);
          clearInterval(that.count);
          const time = Date.parse(new Date()) / 1000;
          const formatTime = that.formatTime(time);
          that.setData({
            isMotto: false,
            systemTime: formatTime
          })
          my.clearStorage()
        }
      }, 1000)
    }
  },

  formatTime(timestamp) {
    var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
  }

});