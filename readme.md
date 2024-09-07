The minimum conditions required to reproduce the issue that I was able to find involve making multiple sequential calls to worker threads that each import the `ssh2` library from the main thread, where `ssh2` is also imported.

The problem also occurs in more real and complex scenarios where `ssh2` is used in both the main thread and worker threads. Additionally, the issue extends to scenarios where other packages that import `ssh2`, such as `dockerode` and similar libraries, are used.

# Test

```sh
npm i
npm run test.issue
npm run test.fix
```

# Examples

```shell
$ npm run test.issue

> test.issue
> node src/issue/main.js

worker
zsh: segmentation fault  npm run test.issue

$ echo $?
139
```

```shell
$ npm run test.issue

> test.issue
> node src/issue/main.js

worker
zsh: bus error  npm run test.issue

$ echo $?
138
```

```shell
$ npm run test.issue

> test.issue
> node src/issue/main.js

worker


#
# Fatal error in , line 0
# Check failed: node->IsInUse().
#
#
#
#FailureMessage Object: 0x16e2073a8
----- Native stack trace -----

 1: 0x1049fab88 node::NodePlatform::GetStackTracePrinter()::$_3::__invoke() [...]
 2: 0x105ab2274 V8_Fatal(char const*, ...) [...]
 3: 0x104c950fc v8::internal::GlobalHandles::NodeSpace<v8::internal::GlobalHandles::Node>::Release(v8::internal::GlobalHandles::Node*) [...]
 4: 0x10a38bb3c ChaChaPolyCipher::Init(v8::Local<v8::Object>) [/home/user/code/ssh2-1393-repro/node_modules/ssh2/lib/protocol/crypto/build/Release/sshcrypto.node]
 5: 0x10a38b9f4 init(v8::Local<v8::Object>) [/home/user/code/ssh2-1393-repro/node_modules/ssh2/lib/protocol/crypto/build/Release/sshcrypto.node]
 6: 0x104966c34 std::__1::__function::__func<node::binding::DLOpen(v8::FunctionCallbackInfo<v8::Value> const&)::$_0, std::__1::allocator<node::binding::DLOpen(v8::FunctionCallbackInfo<v8::Value> const&)::$_0>, bool (node::binding::DLib*)>::operator()(node::binding::DLib*&&) [...]
 7: 0x104934914 node::Environment::TryLoadAddon(char const*, int, std::__1::function<bool (node::binding::DLib*)> const&) [...]
 8: 0x104965970 node::binding::DLOpen(v8::FunctionCallbackInfo<v8::Value> const&) [...]
 9: 0x104b8dbc8 v8::internal::MaybeHandle<v8::internal::Object> v8::internal::(anonymous namespace)::HandleApiCallHelper<false>(v8::internal::Isolate*, v8::internal::Handle<v8::internal::HeapObject>, v8::internal::Handle<v8::internal::FunctionTemplateInfo>, v8::internal::Handle<v8::internal::Object>, unsigned long*, int) [...]
10: 0x104b8d2c0 v8::internal::Builtin_HandleApiCall(int, unsigned long*, v8::internal::Isolate*) [...]
11: 0x105414b24 Builtins_CEntry_Return1_ArgvOnStack_BuiltinExit [...]
12: 0x10538c3e4 Builtins_InterpreterEntryTrampoline [...]
...
53: 0x10538c3e4 Builtins_InterpreterEntryTrampoline [...]
54: 0x10538a50c Builtins_JSEntryTrampoline [...]
55: 0x10538a1f4 Builtins_JSEntry [...]
56: 0x104c61bc8 v8::internal::(anonymous namespace)::Invoke(v8::internal::Isolate*, v8::internal::(anonymous namespace)::InvokeParams const&) [...]
57: 0x104c61014 v8::internal::Execution::Call(v8::internal::Isolate*, v8::internal::Handle<v8::internal::Object>, v8::internal::Handle<v8::internal::Object>, int, v8::internal::Handle<v8::internal::Object>*) [...]
58: 0x104b3b904 v8::Function::Call(v8::Local<v8::Context>, v8::Local<v8::Value>, int, v8::Local<v8::Value>*) [...]
59: 0x1048c0fa0 node::InternalMakeCallback(node::Environment*, v8::Local<v8::Object>, v8::Local<v8::Object>, v8::Local<v8::Function>, int, v8::Local<v8::Value>*, node::async_context) [...]
60: 0x1048d7068 node::AsyncWrap::MakeCallback(v8::Local<v8::Function>, int, v8::Local<v8::Value>*) [...]
61: 0x1049da6fc node::worker::MessagePort::OnMessage(node::worker::MessagePort::MessageProcessingMode) [...]
62: 0x10536b550 uv__async_io [...]
63: 0x10537d628 uv__io_poll [...]
64: 0x10536bb14 uv_run [...]
65: 0x1048c16f0 node::SpinEventLoopInternal(node::Environment*) [...]
66: 0x104a4e278 node::worker::Worker::Run() [...]
67: 0x104a51838 node::worker::Worker::StartThread(v8::FunctionCallbackInfo<v8::Value> const&)::$_3::__invoke(void*) [...]
68: 0x183c01f94 _pthread_start [/usr/lib/system/libsystem_pthread.dylib]
69: 0x183bfcd34 thread_start [/usr/lib/system/libsystem_pthread.dylib]
zsh: trace trap  npm run test.issue

$ echo $?
133
```
