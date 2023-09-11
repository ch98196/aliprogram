App({
  onLaunch() {
    my.hideShareMenu()

    const updateManager = my.getUpdateManager();

    updateManager.onCheckForUpdate((res) => {
      if (res.hasUpdate) {
        console.log('检测到新版本')
      }
    });

    updateManager.onUpdateReady(() => {
      my.alert({
        content: '小程序需要重启以使用最新功能',
        buttonText: '知道了'
      }).then(() => {
        updateManager.applyUpdate()
      })
    });

    updateManager.onUpdateFailed(() => {
      console.log('新版本下载失败')
    });

  },
});