# 深入理解asyncio(一)

## 核心概念

### 1.Eventloop

eventloop是中央总控，Eventloop的实例提供了注册、取消和执行任务和回调的方法

把一些异步函数（任务、task）注册到这个事件循环，事件循环回**循环**执行这些函数，当执行到某个函数（任务）时，如果它等待I/O返回，eventloop回暂停它然后执行其他函数，当I/O来时候，eventloop循环到它时候，再次继续执行，这些异步函数可以协同完成（Cooperative）

### 2.Coroutine

协程（coroutine）本质上是一个函数，特点是在代码块中可以把执行权交给其他协程（coroutine）

```python
❯ cat coro1.py
import asyncio


async def a():
    print('Suspending a')
    await asyncio.sleep(0)
    print('Resuming a')


async def b():
    print('In b')


async def main():
    await asyncio.gather(a(), b())


if __name__ == '__main__':
    asyncio.run(main())
```

这里面有4个重要关键点：

-   协程要用**`async def`**来修饰
-   `**asyncio.gather**`用来并发运行的任务，在这里表示协同地执行a()和b()
-   在协程a中，有一句`await asyncio.sleep(0)`，await表示调用协程，sleep 0并不会真的sleep（因为时间为0），但是却可以把控制权交出去了
-   asyncio.run(协程函数)这是新接口，不然你要这样写：

```python
loop = asyncio.get_event_loop()
loop.run_until_complete(main()) #运行main协程，main协程又并发运行a（）和b（）
loop.close()
```

### 3.Future

接着说Future，它代表了一个「未来」对象，异步操作结束后会把最终结果设置到这个Future对象上。Future是对协程的封装，不过日常开发基本是不需要直接用这个底层Future类的。我在这里只是演示一下：

```python
In : def c():
...:     print('Inner C')
...:     return 12
...:

In : future = loop.run_in_executor(None, c)  # 这里没用await，None 表示默认的 executor
Inner C

In : future  # 虽然c已经执行了，但是状态还是 pending。
Out: <Future pending cb=[_chain_future.<locals>._call_check_cancel() at /usr/local/lib/python3.7/asyncio/futures.py:348]>

In : future.done()  # 还没有完成
Out: False

In : for a in dir(future):
...:     if not a.startswith('_'):
...:         print(a)
...:
add_done_callback
cancel
cancelled
done
exception
get_loop
remove_done_callback
result
set_exception
set_result
```

可以对这个Future实例添加完成后的回调(add_done_callback)、取消任务(cancel)、设置最终结果(set_result)、设置异常(如果有的话，set_exception)等。现在我们让Future完成：

```python
In : await future
Out: 12

In : future
Out: <Future finished result=12>

In : future.done()
Out: True

In : future.result()
Out: 12
```

看到了吧，await之后状态成了finished。这里顺便说一下，一个对象怎么样就可以被await（或者说怎么样就成了一个awaitable对象）呢？给类实现一个__await__方法，Python版本的Future的实现大概如下

```python
def __await__(self): #future类中
    if not self.done():
        self._asyncio_future_blocking = True
        yield self
    if not self.done():
        raise RuntimeError("await wasn't used with future")
    return self.result()
```

### 4.Task

Eventloop除了支持协程，还支持注册Future和Task2种类型的对象，那为什么要存在Future和Task这2种类型呢？

先回忆前面的例子，Future是协程的封装，Future对象提供了很多任务方法（如完成后的回调、取消、设置任务结果等），而开发者不需要**直接操作future而是用Future子类Task协同的调度协程以实现并发**

Task非常容易创建和使用：

```python
in:task = asyncio.ensure_future(a())  #创建一个任务用asyncio.ensure_future()函数,task是a（）协程下的等待任务
in:task
out:<Task pending coro=<a() running at /Users/dongwm/mp/2019-05-22/coro1.py:4>>

in:task.done() #查看任务是否完成
out:False

in:await task
Suspending a
Resuming a

in：task
out：<Task finished coro=<a() done, defined at /Users/dongwm/mp/2019-05-22/coro1.py:4> result=None>

in：task.done()
out:True
```

## @asyncio并发的正确/错误姿势

在代码中使用async/await是不是就能发挥并发优势呢，答案是否定的

我们先看个例子：

```python
async def a():
    print('挂着a')
    await asyncio.sleep(3)
    pritn('恢复继续a')

async def b():
    print('挂着B')
    await asyncio.sleep(1)
    print('恢复继续B')

async def s1():
    await a()
    await b()
```

协程a和b，分别sleep1秒和3秒，如果协程可以并发执行，那么执行时间应该是sleep最大的那个值（3秒），现在它们都在s1协程里面被调用，s1会运行几秒

写一个小程序验证下：

```python
def show_perf(func):
	print('*'*20)
	start = time.perf_counter()
	asyncio.run(func())
	print(f'{func.__name__} Cost:{time.perf_counter() - start}')
```

现在推荐的时间技术使用time.perf_counter()

运行以下程序：

```python
show_perf(s1)
Suspending a
Resuming a
Suspending b
Resuming b
s1 Cost: 4.009796932999961
```

### 正确方法1-asyncio.gather(a(),b())放到并发里

答案是4秒，相当于串行执行了，这是错误用法，应该用**asyncio.gather(a(),b())**

```python
async def c1():
    await asyncio.gather(a(), b())

In : show_perf(c1)
********************
Suspending a
Suspending b
Resuming b
Resuming a
c1 Cost: 3.002452698999832
```

### 正确方法2-asyncio.wait（[]）放到wait里面

看到了吧，3秒！另外一个是asyncio.wait：

```python
async def c2():
    await asyncio.wait([a(), b()])

In : show_perf(c2)
...
c2 Cost: 3.0066957049998564
```

### 正确方法3-asyncio.create_task-在loop中的并发协程必须要任务！，task和协程不一样

```python
async def c3():
    task1 = asyncio.create_task(a())
    task2 = asyncio.create_task(b())
    await task1
    await task2
    
async def c4():
    task = asyncio.create_task(b())
    await a()
    await task
```

asyncio.create_task,相当于把协程封装成Task。不过大家要注意一个错误的用法：

```python
async def s2():
    await asyncio.create_task(a())
    await asyncio.create_task(b())
```

### 正确方法4-asyncio.ensure_future(协程)

**直接await task不会对并发有帮助**。asyncio.create_task是Python 3.7新增的高阶API，\**是推荐的用法**，其实你还可以用asyncio.ensure_future和loop.create_task：

```python
async def c5():
    task = asyncio.ensure_future(b())
    await a()
    await task


async def c6():
    loop = asyncio.get_event_loop()
    task = loop.create_task(b())
    await a()
    await task
```

**写法源于原理, 内嵌的Future当然跟阻塞一模一样, 只有把内嵌的Future变成同级的Future才会出异步效果**

6中正确写法知道了吗，讲讲理解：

`asyncio.create_task`方法是将一个协程包装成一个任务对象，**并且将该任务任务绑定到事件循环上** 是绑定，然后看时机等待被事件循环调度，返回任务对象本身，如果你对任何一个可等待对象直接进行了await操作，那么一定得等到该可等待对象的状态确定之后才能返回，否则一定会被阻塞在此处，所以你不要再所有的地方都进行await操作，你只需在需要等待的地方进行await操作，以避免阻塞，并且你的每一个协程任务应该尽可能的小，让他们只做好一件事，如果是cpu密集型的任务，尽量与你的异步代码分离，因为你每个时刻只能干一件事，如果cpu密集型的任务占用了太多的cpu，你就没办法处理更多的IO了，异步IO是为了用更少的资源更方便处理更多的多的IO，在python中，协程不能对cpu密集型的任务进行加速



# 深入理解asyncio（二）-

### Asyncio.gather vs asyncio.wait

在上面，我们多次用到asyncio.gather了，还有个用法是asyncio.wait，他们2个都可以让多个协程并发执行，那为什么提供2个方法呢，他们有什么区别，适用场景是怎么样的，适用场景是如何的，直接读asyncio源码，看2个例子：

```python
async def a():
    print('Suspending a')
    await asyncio.sleep(3)
    print('Resuming a')
    return 'A'

async def b():
    print('Suspending b')
    await asyncio.sleep(1)
    print('Resuming b')
    return 'B'
```

```python
In : return_value_a, return_value_b = await asyncio.gather(a(), b())
Suspending a
Suspending b
Resuming b
Resuming a

In : return_value_a, return_value_b
Out: ('A', 'B')
```

Ok，`asyncio.gather`方法的名字说明了它的用途，gather的意思是「搜集」，也就是能够收集协程的结果，而且要注意，**它会按输入协程的顺序保存的对应协程的执行结果。**

```python
In : done, pending = await asyncio.wait([a(), b()])
Suspending b
Suspending a
Resuming b
Resuming a

In : done
Out:
{<Task finished coro=<a() done, defined at <ipython-input-5-5ee142734d16>:1> result='A'>,
 <Task finished coro=<b() done, defined at <ipython-input-5-5ee142734d16>:8> result='B'>}

In : pending
Out: set()

In : task = list(done)[0]

In : task
Out: <Task finished coro=<b() done, defined at <ipython-input-5-5ee142734d16>:8> result='B'>

In : task.result()
Out: 'B'
```

`asyncio.wait`的返回值有2项，第一项表示完成的任务列表(done)，第二项表示等待(Future)完成的任务列表(pending)，每个任务都是一个Task实例，由于这2个任务都已经完成，所以可以执行`task.result()`获得协程返回值。

Ok, 说到这里，我总结下它俩的区别的第一层区别:

1.  `asyncio.gather`封装的Task全程黑盒，只告诉你协程结果。
2.  `asyncio.wait`会返回封装的Task(包含已完成和挂起的任务)，如果你关注协程执行结果你需要从对应Task实例里面用result方法自己拿

`asyncio.wait`支持一个接收参数`return_when`，在默认情况下，`asyncio.wait`会等待全部任务完成(return_when='ALL_COMPLETED')，它还支持FIRST_COMPLETED（第一个协程完成就返回）和FIRST_EXCEPTION（出现第一个异常就返回）：

```python
In : done, pending = await asyncio.wait([a(), b()], return_when=asyncio.tasks.FIRST_COMPLETED)
Suspending a
Suspending b
Resuming b

In : done
Out: {<Task finished coro=<b() done, defined at <ipython-input-5-5ee142734d16>:8> result='B'>}

In : pending
Out: {<Task pending coro=<a() running at <ipython-input-5-5ee142734d16>:3> wait_for=<Future pending cb=[<TaskWakeupMethWrapper object at 0x108065e58>()]>>}
```

看到了吧，这次只有协程b完成了，协程a还是pending状态。

在大部分情况下，用asyncio.gather是足够的，如果你有特殊需求，可以选择asyncio.wait，举2个例子：

1.  需要拿到封装好的Task，以便取消或者添加成功回调等
2.  业务上需要FIRST_COMPLETED/FIRST_EXCEPTION即返回的



### asyncio.create_task vs loop.create_task vs asyncio.ensure_future

创建一个Task一共有3种方法，如这小节的标题。在上篇文章我说过，从Python 3.7开始可以统一的使用更高阶的`asyncio.create_task`。其实`asyncio.create_task`就是用的`loop.create_task`：

```python
def create_task(coro):
    loop = events.get_running_loop()
    return loop.create_task(coro)
```

`loop.create_task`接受的参数需要是一个协程，但是`asyncio.ensure_future`除了接受协程，还可以是Future对象或者awaitable对象:

1.  如果参数是协程，其实底层还是用的`loop.create_task`，返回Task对象
2.  如果是Future对象会直接返回
3.  如果是一个awaitable对象会await这个对象的__await__方法，再执行一次`ensure_future`，最后返回Task或者Future

所以就像`ensure_future`名字说的，确保这个是一个Future对象：Task是Future 子类，前面说过一般情况下开发者不需要自己创建Future

其实前面说的`asyncio.wait`和`asyncio.gather`里面都用了`asyncio.ensure_future`。对于绝大多数场景要并发执行的是协程，所以直接用`asyncio.create_task`就足够了~

### shield

接着说`asyncio.shield`，用它可以屏蔽取消操作。一直到这里，我们还没有见识过Task的取消。看一个例子:

```python
In : loop = asyncio.get_event_loop()

In : task1 = loop.create_task(a())

In : task2 = loop.create_task(b())

In : task1.cancel()
Out: True

In : await asyncio.gather(task1, task2)
Suspending a
Suspending b
---------------------------------------------------------------------------
CancelledError                            Traceback (most recent call last)
cell_name in async-def-wrapper()

CancelledError:
```

在上面的例子中，task1被取消了后再用`asyncio.gather`收集结果，直接抛CancelledError错误了。这里有个细节，gather支持`return_exceptions`参数：

```python
In : await asyncio.gather(task1, task2, return_exceptions=True)
Out: [concurrent.futures._base.CancelledError(), 'B']
```

可以看到，task2依然会执行完成，但是task1的返回值是一个CancelledError错误，也就是任务被取消了。如果一个创建后就不希望被任何情况取消，可以使用`asyncio.shield`保护任务能顺利完成。不过要注意一个陷阱，先看错误的写法：

```python
In : task1 = asyncio.shield(a())

In : task2 = loop.create_task(b())

In : task1.cancel()
Out: True

In : await asyncio.gather(task1, task2, return_exceptions=True)
Suspending a
Suspending b
Resuming b
Out: [concurrent.futures._base.CancelledError(), 'B']
```

可以看到依然是CancelledError错误，且协程a未执行完成，正确的用法是这样的：

```python
In : task1 = asyncio.shield(a())

In : task2 = loop.create_task(b())

In : ts = asyncio.gather(task1, task2, return_exceptions=True)

In : task1.cancel()
Out: True

In : await ts
Suspending a
Suspending b
Resuming a
Resuming b
Out: [concurrent.futures._base.CancelledError(), 'B']
```

可以看到虽然结果是一个CancelledError错误，但是看输出能确认协程实际上是执行了的。所以正确步骤是：

1.  先创建 GatheringFuture 对象 ts
2.  取消任务
3.  await ts

### asynccontextmanager

如果你了解Python，之前可能听过或者用过contextmanager ，一个上下文管理器。通过一个计时的例子就理解它的作用:

```python
from contextlib import contextmanager


async def a():
    await asyncio.sleep(3)
    return 'A'


async def b():
    await asyncio.sleep(1)
    return 'B'


async def s1():
    return await asyncio.gather(a(), b())


@contextmanager
def timed(func):
    start = time.perf_counter()
    yield asyncio.run(func())
    print(f'Cost: {time.perf_counter() - start}')
```

timed函数用了contextmanager装饰器，把协程的运行结果yield出来，执行结束后还计算了耗时：

```python
In : from contextmanager import *

In : with timed(s1) as rv:
...:     print(f'Result: {rv}')
...:
Result: ['A', 'B']
Cost: 3.0052654459999992
```

大家先体会一下。在Python 3.7添加了asynccontextmanager，也就是异步版本的contextmanager，适合异步函数的执行，上例可以这么改：

```python
@asynccontextmanager
async def async_timed(func):
    start = time.perf_counter()
    yield await func()
    print(f'Cost: {time.perf_counter() - start}')


async def main():
    async with async_timed(s1) as rv:
        print(f'Result: {rv}')

In : asyncio.run(main())
Result: ['A', 'B']
Cost: 3.00414147500004
```

async版本的with要用`async with`，另外要注意`yield await func()`这句，相当于yield + `await func()`

PS: contextmanager 和 asynccontextmanager 最好的理解方法是去看源码注释，可以看延伸阅读链接2，另外延伸阅读链接3包含的PR中相关的测试代码部分也能帮助你理解

# 深入理解asyncio总结写法

## 1.写法总结

```
import asyncio


async def a():
    print('Suspending a')
    await asyncio.sleep(0)
    print('Resuming a')


async def b():
    print('In b')


async def main():
    await asyncio.gather(a(), b())


if __name__ == '__main__':
    asyncio.run(main())
```

步骤1：写一个协程函数为：**async def a()**其中包含交出控制权的**await**关键字

步骤2：写一个总loop协程函数：**async def main()**其中包含await，**await**后面接在loop中的**task**（await总是接task，不能接可等待对象协程）

步骤3：使用gather和wait让2个协程封装为任务，在loop上

```
async def main():
    await asyncio.gather(a(), b())
    
或者
async def main():
    await asyncio.wait([a(), b()])
或者
async def main():
    await asyncio.create_task(a())
    await b()
```

步骤4：主loop启动

```
if __name__ == '__main__':
    asyncio.run(main())
```

步骤5：pyqt改写：

```
loop = asyncio.get_event_loop()
loop.run_until_complete(main()) #运行main协程，main协程又并发运行a（）和b（）
loop.close()
```

这里理解，协程是可等待函数，任务才是绑定loop的，main()协程就是loop本体

# 深入理解asyncio（三）-包含回调，多线程和在asyncio中执行同步代码

## 成功回调

可以给Task（Future）添加回调函数，等Task完成后就会自动调用这些回调：

```python
async def a():
	await asyncio.sleep(1)
	return 'A'

loop = asyncio.get_event_loop()
task = loop.create_task(a())

def callback(future): #继承future才有task完成后的回调
    print（f'Result:{future.result()}'）  #打印task完成调用回调函数的结果
task.add_done_callback(callback) #任务添加callback函数
    
await task
打印结果：
Result:A
```

看得出任务完成后执行了callback函数，这里有个问题，前面一致推荐大家使用asyncio.create_task，但很多例子缺用了loop.create_task?这是因为IPython支持方便使用await执行协程，如果直接用asyncio.create_task会提示[no running event loop]

Eventloop是在单进程里面的单线程中，反正IPython已经把外部await注册到了Eventloop

好说会来，add_done_callback方法也支持参数的，但是要用到functool.partial:

```python
def callback2(future,n):
	print(f'Result:{future.result()}')
    
task = loop.create_task(a()) #注意正规写法不是这样的
task.add_done_callback(patial(callback2,n=1))

await task
Result: A, N: 1
Out: 'A'
```

## 调度回调

asyncio提供了3个按需回调的方法，都在Eventloop对象上，而且也支持参数：

#### call_soon

在下一次事件循环中被回调，回调是按其注册顺序被调用的:

```python
def mark_done(future, result):
    print(f'Set to: {result}')
    future.set_result(result)

async def b1():
    loop = asyncio.get_event_loop()
    fut = asyncio.Future()
    loop.call_soon(mark_done, fut, 'the result')
    loop.call_soon(partial(print, 'Hello', flush=True))
    loop.call_soon(partial(print, 'Greeting', flush=True))
    print(f'Done: {fut.done()}')
    await asyncio.sleep(0)
    print(f'Done: {fut.done()}, Result: {fut.result()}')

In : await b1()
Done: False
Set to: the result
Hello
Greeting
Done: True, Result: the result
1234567891011121314151617181920
```

这个例子输出的比较复杂，我挨个分析：

call_soon 可以用来设置任务的结果: 用 mark_done
通过2个print可以感受到 call_soon 支持参数。
最重要的就是输出部分了我，首先fut.done()的结果是False，因为还没到下个事件循环，sleep(0)就可以切刀下次循环，这样就会调用三个 call_soon 回调，最后再看fut.done()的结果就是True，而且 fut.result() 可以拿到之前在 mark_done 设置的值了

#### call_later

安排回调在给定的时间(单位秒)后执行：

```python
async def b2():
    loop = asyncio.get_event_loop()
    fut = asyncio.Future()
    loop.call_later(2, mark_done, fut, 'the result')
    loop.call_later(1, partial(print, 'Hello'))
    loop.call_later(1, partial(print, 'Greeting'))
    print(f'Done: {fut.done()}')
    await asyncio.sleep(2)
    print(f'Done: {fut.done()}, Result: {fut.result()}')

In : await b2()
Done: False
Hello
Greeting
Set to: the result
Done: True, Result: the result
12345678910111213141516
```

这次要注意3个回调的延迟时间时间要<=sleep的，要不然还没来的回调程序就结束了

#### call_at

安排回调在给定的时间执行，注意这个时间要基于 loop.time() 获取当前时间：

```python
async def b3():
    loop = asyncio.get_event_loop()
    now = loop.time()
    fut = asyncio.Future()
    loop.call_at(now + 2, mark_done, fut, 'the result')
    loop.call_at(now + 1, partial(print, 'Hello', flush=True))
    loop.call_at(now + 1, partial(print, 'Greeting', flush=True))
    print(f'Done: {fut.done()}')
    await asyncio.sleep(2)
    print(f'Done: {fut.done()}, Result: {fut.result()}')

In : await b3()
Done: False
Hello
Greeting
Set to: the result
Done: True, Result: the result
```

## 同步代码

前面的代码都是异步的，就如sleep，需要用asyncio.sleep而不是阻塞的time.sleep，如果有同步逻辑，如何利用asyncio实现并发呢，答案是用**run_in_executor**，在一开始就说过开发者用Future很少，**主要就是用run_in_executor就是让同步函数在一个执行器( executor)里面运行**

```python
def a(): #非协程对象函数
    time.sleep(1)  
    return 'A'


async def b(): #协程对象，包含一个给别人执行await
    await asyncio.sleep(1)
    return 'B'


def show_perf(func):  #普通函数，
    print('*' * 20)
    start = time.perf_counter()
    asyncio.run(func())  #loop函数？
    print(f'{func.__name__} Cost: {time.perf_counter() - start}')


async def c1():  #协程对象
    loop = asyncio.get_running_loop() #创建loop
    await asyncio.gather(
        loop.run_in_executor(None, a), #这里很关键，意思
        b()
    )

In : show_perf(c1)
********************
c1 Cost: 1.0027242230000866
123456789101112131415161718192021222324252627
```

注意a（）是普通函数，因为a（）没有异步代码（await），需要用loop.run_in_executor(None,a)封装到协程

大家理解了吧？
loop.run_in_executor(None, a) 这里面第一个参数是要传递 concurrent.futures.Executor 实例的，传递None会选择默认的executor：

当然我们还可以用进程池，这次换个常用的文件读写例子，并且用:

```python
async def c3():
    loop = asyncio.get_running_loop()
    with concurrent.futures.ProcessPoolExecutor() as e:
        print(await asyncio.gather(
            loop.run_in_executor(e, a),
            b()
        ))

In : show_perf(c3)
********************
['A', 'B']
c3 Cost: 1.0218078890000015
```

### 多线程

上一个小节用的 **run_in_executor** 就如它方法的名字所示，把协程放到了一个执行器里面，可以在一个线程池，也可以在一个进程池。另外还可以使用 **run_coroutine_threadsafe** 在其他线程执行协程（这是线程安全的）:

```python
def start_loop(loop):
    asyncio.set_event_loop(loop)
    loop.run_forever()


def shutdown(loop):
    loop.stop()


async def b1():
    new_loop = asyncio.new_event_loop()
    t = Thread(target=start_loop, args=(new_loop,))
    t.start()

    future = asyncio.run_coroutine_threadsafe(a(), new_loop)
    print(future)
    print(f'Result: {future.result(timeout=2)}')
    new_loop.call_soon_threadsafe(partial(shutdown, new_loop))


In : await b1()
<Future at 0x107edf4e0 state=pending>
Result: A
1234567891011121314151617181920212223
```

这里面有几个细节要注意:

协程应该从另一个线程调用，而非时间循环运行所在线程，所以用asyncio.new_event_loop()新建一个事件循环

在执行协程前要确保新创建的事件循环是运行着的，所以需要用 start_loop 之类的方式启动循环

接着就可以用 asyncio.run_coroutine_threadsafe 执行协程a了，它返回了一个Future对象

用 future.result(timeout=2) 就可以获得结果，设置timeout的值要大于a协程执行时间，要不然会抛出TimeoutError
一开始我们创建的新的事件循环跑在一个线程里面，由于 loop.run_forever 会阻塞程序关闭，所以需要结束时杀掉线程，所以用 call_soon_threadsafe 回调函数 shutdown 去停止事件循环
这里再说一下 call_soon_threadsafe ，看名字就知道它是线程安全版本的 call_soon ，其实就是在另外一个线程里面调度回调。BTW， 其实 asyncio.run_coroutine_threadsafe 底层也是用的它。

# quamsh用法

```python
import sys
import asyncio
import time

from PyQt5.QtWidgets import QApplication, QProgressBar
from quamash import QEventLoop, QThreadExecutor

app = QApplication(sys.argv)  #创建一个pyqt App
loop = QEventLoop(app)		  #创建一个loop，这个loop就是pyqt主线程本体
asyncio.set_event_loop(loop)  #用携程库把这个loop导入

progress = QProgressBar()
progress.setRange(0, 99)
progress.show()

async def master():
    await first_50()
    with QThreadExecutor(1) as exec:
        await loop.run_in_executor(exec, last_50)
    # 这是loop本体协程

async def first_50():
    for i in range(50):
        progress.setValue(i)
        await asyncio.sleep(.1)

def last_50():
    for i in range(50,100):
        loop.call_soon_threadsafe(progress.setValue, i)
        time.sleep(.1)

with loop: ## 当循环执行完成关闭loop
    loop.run_until_complete(master())
```

# 总结需要用到的命令

```python
1.asyncio.set_event_loop(loop)  #设置为当前的loop
2.loop = asyncio.get_event_loop
3.loop.run_forever()
4.asyncio.new_event_loop()
5.loop.call_soon_threadsafe(progress.setValue, i)
6.future = asyncio.run_coroutine_threadsafe(a(), new_loop)
7.asyncio.get_running_loop()
8.loop.run_in_executor(None, a()) #a是普通函数哦
9.asyncio.create_task(a())
10.asyncio.run(main()) #main(是协程函数)
11.await就是告诉Eventloop,这个协程在停在这里，你去运行其他协程吧，这时候Eventloop回去运行其他协程，通过 await 离开当前协程，await 的协程完成后又回到之前的协程对应的地方继续执行
```

