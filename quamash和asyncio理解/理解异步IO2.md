# 理解异步IO（2）

异步IO的好处就是并发，单如何实现：协程执行返回协程函数，入口协程以及子协程

我们先来看下不是并发的例子：

```python
import asyncio
import time

async def hi(msg,sec):
    print('1111111111')
    await asyncio.sleep(sec)
    print('22222222')
    return sec

async def main():
    print('入口函数开始')
    for i in range(1,5):
        b = await hi(i,i)
        print('b is:',b)
    print('入口协程函数结束')
    
if __name__ == '__main__':
    asyncio.run(main())
    print('done')
```

以上就不是并发！！！用了1+2+3+4秒钟，没有并发，只是异步

接下来就是异步执行，通过asyncio.create_task()即可

```python
import time
import asyncio

async def hi(msg,sec):
    print('普通协程函数入口')
    await asyncio.sleep(sec)
    print('普通协程函数出口')
    
async def main():
    print('入口函数开始')
    tasks = []
    for i in range(1,5)
    	t = asyncio.create_task(hi(i,i))
        tasks.append(t)
    
    for t in tasks:
        b = await t
        print('b is:',b)
    print('入口函数结束')
```

main()的for循环只是生成了4个task协程，然后就退出了。event_loop 收到main退出的事件就空出来去执行了那4个协程，进去了但都碰到了sleep。然后event_loop就空闲了。这时候run() 就收到了main() 执行完毕的事件，run() 就执行完了，最后执行print，整个程序就退出了。从main退出到整个程序退出就是一瞬间的事情，那4个协程还在傻傻的睡着，不，是在睡梦中死去了。



## **如何判断是否要把函数定义为协程函数？**

定义一个协程函数很简单，在def前面加async即可。那么如何判断一个函数该不该定义为协程函数呢？
记住这一个原则：如果该函数是要进行IO操作（读写网络、读写文件、读写数据库等），就把它定义为协程函数，否则就是普通函数。

以上就是如何理解asyncio的方法，也就是如何使用async和await这两个关键字。如果你还不明白，那就把上面的代码都跑一遍，如果还不行，那就跑两遍，哈哈哈，你一定行的。



# 理解异步IO（3）-异步绘图pyqt+echarts




    import sys
    
    from PyQt5 import uic
    from PyQt5.QtWidgets import QApplication, QMainWindow
    from PyQt5.QtCore import pyqtSlot
    from pyqtechart.chartWidget import EChartsWidget
    from faker import Faker
    import random
    from quamash import QEventLoop
    import asyncio
    
    __version__ = 't'
    
    fake = Faker()
    
    
    class MainUI(QMainWindow):
    def __repr__(self):  # 用于print的魔法方法
        return '<%s(%s)>' % (type(self).__name__, __version__)
    
    def __init__(self, parent=None):
        super(QMainWindow, self).__init__(parent)
        uic.loadUi('te_gui.ui', self)
        self.chart_ui = EChartsWidget(self)
        self.verticalLayout.addWidget(self.chart_ui)
        self.pushButton_2.clicked.connect(lambda: asyncio.ensure_future(self._on_pushButton_2_clicked(), loop=loop))  # 使用asyncio
    
    @pyqtSlot()
    def on_pushButton_clicked(self):
        self.chart_ui.chartResize()
    
    # @pyqtSlot()
    async def _on_pushButton_2_clicked(self):  # 异步
        for i in range(50):
            option = {
                "legend": {
                    "data": ['By_Link'],
                    "left": 10
                },
                "tooltip": {
                    "trigger": 'axis',
                },
                "title": {
                    "text": "测试",
                    "left": 'center'
                },
                "grid": {
                    "left": 50,
                    "right": 50,
                    "bottom": 40,
                },
                "xAxis": {
                    "gridIndex": 0,
                    "type": 'category',
                    "axisTick": {
                        "alignWithLabel": True
                    },
                    "data": [fake.word() for _ in range(1, i)]
                },
                "yAxis": {
                    "name": 'Yield',
                    "type": 'value',
                    "scale": True,
                },
                "series": [
                    {
                        "name": 'By_Link',
                        "type": 'line',
                        "symbolSize": 5,
                        "symbol": 'circle',
                        "hoverAnimation": False,
                        "color": '#419b13',
                        "smooth": True,
                        "data": [random.randint(0, 70) for _ in range(1, i)],
                    },
                ],
                "animation": False,  # 关闭满天飞的Echarts动画
            }
            self.chart_ui.setChartOption(option)
            await asyncio.sleep(.2)  # 异步等待
            
    if __name__ == '__main__':
        app = QApplication(sys.argv)
        loop = QEventLoop(app)  # 使用 quamash
        myWin = MainUI()
        myWin.show()
        asyncio.set_event_loop(loop=loop)
        with loop:
            loop.run_forever()



